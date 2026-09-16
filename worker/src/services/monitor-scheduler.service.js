import { monitorQueue } from "../queues/monitor.queue.js";

export const getMonitorSchedulerId = (monitorId) =>
  `monitor:${monitorId}`;

export const scheduleMonitor = async (monitor) => {
  const schedulerId = getMonitorSchedulerId(
    monitor._id.toString()
  );

  const scheduler = await monitorQueue.upsertJobScheduler(
    schedulerId,
    {
      every: monitor.intervalSeconds * 1000,
    },
    {
      name: "monitor-check",
      data: {
        monitorId: monitor._id.toString(),
      },
      opts: {
        removeOnComplete: 100,
        removeOnFail: 1000,
      },
    }
  );

  console.log(
    `Monitor scheduled: ${monitor.name} every ${monitor.intervalSeconds}s`
  );

  return scheduler;
};

export const removeMonitorSchedule = async (monitorId) => {
  const schedulerId = getMonitorSchedulerId(
    monitorId.toString()
  );

  const removed =
    await monitorQueue.removeJobScheduler(schedulerId);

  if (removed) {
    console.log(
      `Monitor schedule removed: ${schedulerId}`
    );
  }

  return removed;
};