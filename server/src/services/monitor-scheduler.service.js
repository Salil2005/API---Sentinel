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

    console.log("Expected scheduler ID:", schedulerId);

    const schedulers = await monitorQueue.getJobSchedulers(
        0,
        100,
        true
    );

    console.log(
        "Number of schedulers visible to SERVER:",
        schedulers.length
    );

    for (const scheduler of schedulers) {
        console.log(
            "SERVER scheduler:",
            scheduler.key,
            "every:",
            scheduler.every
        );
    }

    const scheduler = schedulers.find(
        (item) => item.key === schedulerId
    );

    if (!scheduler) {
        console.log("Scheduler not found by server queue");
        return false;
    }

    const removed = await monitorQueue.removeJobScheduler(
        scheduler.key
    );

    console.log("Scheduler removal result:", removed);

    return removed;
};