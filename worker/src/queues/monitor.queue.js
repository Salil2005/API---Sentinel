import {Queue} from "bullmq";
import { redisConnection } from "../config/redis.js";

export const MONITOR_QUEUE_NAME = "monitor-checks";

export const monitorQueue = new Queue(MONITOR_QUEUE_NAME, {
    connection: redisConnection,

    defaultJobOption: {
        attempts: 3,
        backoff: {
            type: "exponential",
            delay: 5000,
        },
        removeOnComplete: 100,
        removeOnFail: 1000,
    },
});

monitorQueue.on("error", (error) => {
    console.error("Monitor queue error: ", error);
});