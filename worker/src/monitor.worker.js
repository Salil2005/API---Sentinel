import dns from "node:dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

import { Worker } from "bullmq";
import { connectDatabase } from "./config/database.js";
import { redisConnection } from "./config/redis.js";
import { MONITOR_QUEUE_NAME } from "./queues/monitor.queue.js";
import { processMonitorJob } from "./processors/monitor.processor.js";
import {synchronizeMonitorSchedules}  from "./services/monitor-scheduler.bootstrap.js";

const startWorker = async () => {
  await connectDatabase();

  await synchronizeMonitorSchedules();

  setInterval(async () => {
    try{
      await synchronizeMonitorSchedules();
    }
    catch(error){
      console.error("Monitor schedule synchronization failed: ", error);
    }
  }, 30000);

  const monitorWorker = new Worker(
    MONITOR_QUEUE_NAME,
    processMonitorJob,
    {
      connection: redisConnection,
      concurrency: 5,
    }
  );

  monitorWorker.on("ready", () => {
    console.log("BullMQ monitoring worker is ready");
  });

  monitorWorker.on("completed", (job, result) => {
    console.log(
      `[MonitorJob] completed | jobId=${job.id} | monitorId=${job.data.monitorId} | success=${result?.success ?? "unknown"}`
    );
  });

  monitorWorker.on("failed", (job, error) => {
    console.error(
      `[MonitorJob] failed | jobId=${job?.id ?? "unknown"} | monitorId=${job?.data?.monitorId ?? "unknown"} | error=${error.message}`
    );
  });

  monitorWorker.on("error", (error) => {
    console.error("BullMQ worker error:", error);
  });

  console.log("API Sentinel monitoring worker started");
};

startWorker();