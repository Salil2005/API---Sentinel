import { Monitor } from "../../../server/src/modules/monitors/monitor.model.js";
import {
  scheduleMonitor,
  removeMonitorSchedule,
} from "./monitor-scheduler.service.js";

export const synchronizeMonitorSchedules = async () => {
  const monitors = await Monitor.find({});

  const activeMonitors = monitors.filter(
    (monitor) => monitor.active
  );

  console.log(
    `Synchronizing ${monitors.length} monitors`
  );

  // Schedule or update active monitors
  for (const monitor of activeMonitors) {
    await scheduleMonitor(monitor);
  }

  // Remove schedules for paused/inactive monitors
  for (const monitor of monitors) {
    if (!monitor.active) {
      await removeMonitorSchedule(monitor._id);
    }
  }

  console.log("Monitor schedules synchronized");
};