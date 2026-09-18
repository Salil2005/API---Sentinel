import { Monitor } from "../../../server/src/modules/monitors/monitor.model.js";
import { executeMonitorCheck } from "../services/monitor.service.js";
import { saveCheckResult } from "../services/check-result.service.js";
import { handleMonitorResult } from "../services/incident.service.js";

export const processMonitorJob = async (job) => {
  const { monitorId } = job.data;

  if (!monitorId) {
    throw new Error("monitorId is required");
  }

  const monitor = await Monitor.findOne({
    _id: monitorId,
    active: true,
  });

  if (!monitor) {
    console.log(
      `[MonitorJob] skipped | jobId=${job.id} | monitorId=${monitorId} | reason=inactive-or-not-found`
    );

    return;
  }

  console.log(
    `[MonitorJob] started | jobId=${job.id} | monitorId=${monitor._id} | monitor=${monitor.name}`
  );

  const result = await executeMonitorCheck(monitor);

  const savedResult = await saveCheckResult(result);

  await handleMonitorResult(monitor, savedResult);

  console.log(
    `[MonitorJob] check-result | jobId=${job.id} | monitorId=${monitor._id} | status=${
      savedResult.success ? "UP" : "DOWN"
    } | responseTimeMs=${savedResult.responseTimeMs ?? "N/A"}`
  );

  return {
    checkResultId: savedResult._id.toString(),
    success: savedResult.success,
  };
};