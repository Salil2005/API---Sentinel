import {Queue} from "bullmq";
import { redisConnection } from "../config/redis.js";

export const MONITOR_QUEUE_NAME = "monitor-check";

export const monitorQueue = new Queue(MONITOR_QUEUE_NAME, {
    connection: redisConnection,

    defaultJobOptions: {
    removeOnComplete: 100,
    removeOnFail: 1000,
  },
});

monitorQueue.on("error", (error) => {
  console.error("Monitor queue error:", error);
});