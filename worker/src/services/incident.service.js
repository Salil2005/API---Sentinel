import { Incident } from "../../../server/src/modules/incidents/incident.model.js";

const calculateDowntime = (startedAt, resolvedAt) => {
    return resolvedAt.getTime() - startedAt.getTime();
};

const getIncidentReason = (result) => {
    if (result.errorType === "SSRF_BLOCKED") {
        return "SSRF protection blocked the request";
    }

    if (result.errorType === "TIMEOUT") {
        return "Monitor request timed out";
    }

    if (result.errorType === "DNS_ERROR") {
        return "DNS resolution failed";
    }

    if (result.errorType === "CONNECTION_REFUSED") {
        return "Connection was refused";
    }

    if (result.errorType === "HTTP_ERROR") {
        return (
            result.errorMessage ||
            "Unexpected HTTP response"
        );
    }

    return (
        result.errorMessage ||
        result.errorType ||
        "Monitor check failed"
    );
};

export const handleMonitorResult = async (monitor, result) => {
    if (result.success) {
        const openIncident = await Incident.findOne({
            monitorId: monitor._id,
            status: "OPEN",
        });

        monitor.consecutiveFailures = 0;

        await monitor.save();

        if (!openIncident) {
            return null;
        }

        const resolvedAt = result.checkedAt;

        openIncident.status = "RESOLVED";
        openIncident.resolvedAt = resolvedAt;
        openIncident.durationMs = calculateDowntime(
            openIncident.startedAt,
            resolvedAt
        );

        await openIncident.save();

        console.log(
            `[Incident] resolved | monitorId=${monitor._id} | incidentId=${openIncident._id} | durationMs=${openIncident.durationMs}`
        );

        return openIncident;
    }

    monitor.consecutiveFailures += 1;

    await monitor.save();

    if (monitor.consecutiveFailures < monitor.failureThreshold) {
        return null;
    }

    const existingIncident = await Incident.findOne({
        monitorId: monitor._id,
        status: "OPEN",
    });

    if (existingIncident) {
        existingIncident.failureCount =
            monitor.consecutiveFailures;

        await existingIncident.save();

        console.log(
            `[Incident] updated | monitorId=${monitor._id} | failureCount=${existingIncident.failureCount}`
        );

        return existingIncident;
    }

    const incident = await Incident.create({
        monitorId: monitor._id,
        status: "OPEN",
        reason: getIncidentReason(result),
        failureCount: monitor.consecutiveFailures,
        startedAt: result.checkedAt,
    });

    console.log(
        `[Incident] opened | monitorId=${monitor._id} | failureCount=${monitor.consecutiveFailures} | reason=${incident.reason}`
    );

    return incident;
};