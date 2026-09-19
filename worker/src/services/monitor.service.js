import axios from "axios";
import { validateMonitorUrl } from "./url-validation.service.js";
import { validateResponseBody } from "./body-validation.service.js";

export const executeMonitorCheck = async (monitor) => {
    const checkedAt = new Date();
    const startTime = Date.now();

    try {
        await validateMonitorUrl(monitor.url);

        const response = await axios({
            method: monitor.method,
            url: monitor.url,
            headers: monitor.headers,
            data: monitor.body,
            timeout: monitor.timeoutMs,
            validateStatus: () => true,
            maxRedirects: 0,
        });

        const responseTimeMs = Date.now() - startTime;

        const bodyValidationPassed = validateResponseBody(
            response.data,
            monitor.expectedBodyRule
        );

        const statusPassed =
            response.status === monitor.expectedStatus;

        const latencyPassed =
            !monitor.latencyThresholdMs ||
            responseTimeMs <= monitor.latencyThresholdMs;

        const bodyPassed =
            bodyValidationPassed !== false;

        const success =
            statusPassed &&
            latencyPassed &&
            bodyPassed;

        let errorType = null;
        let errorMessage = null;

        if (!statusPassed) {
            errorType = "HTTP_ERROR";
            errorMessage =
                `Expected status ${monitor.expectedStatus}, received ${response.status}`;
        } else if (!latencyPassed) {
            errorType = "SLOW_RESPONSE";
            errorMessage =
                `Response time ${responseTimeMs}ms exceeded threshold ${monitor.latencyThresholdMs}ms`;
        } else if (!bodyPassed) {
            errorType = "BODY_VALIDATION_ERROR";
            errorMessage =
                "Response body did not match the expected rule";
        }

        return {
            monitorId: monitor._id,
            checkedAt,
            success,
            statusCode: response.status,
            responseTimeMs,
            errorType,
            errorMessage,
            bodyValidationPassed,
        };
    } catch (error) {
        const responseTimeMs = Date.now() - startTime;

        let errorType = "REQUEST_ERROR";

        if (error.code === "SSRF_BLOCKED") {
            errorType = "SSRF_BLOCKED";
        } else if (
            error.code === "ECONNABORTED" ||
            error.code === "ETIMEDOUT"
        ) {
            errorType = "TIMEOUT";
        } else if (error.code === "ENOTFOUND") {
            errorType = "DNS_ERROR";
        } else if (error.code === "ECONNREFUSED") {
            errorType = "CONNECTION_REFUSED";
        }

        return {
            monitorId: monitor._id,
            checkedAt,
            success: false,
            statusCode: error.response?.status ?? null,
            responseTimeMs,
            errorType,
            errorMessage:
                error.code === "SSRF_BLOCKED"
                    ? error.message
                    : error.message?.slice(0, 500) ?? "Request failed",
            bodyValidationPassed: null,
        };
    }
};