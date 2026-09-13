import dns from "node:dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

import { monitorQueue } from "./queues/monitor.queue.js";

const testQueue = async () => {
  try {
    const job = await monitorQueue.add("test-monitor-job", {
      message: "API Sentinel BullMQ test",
    });

    console.log("BullMQ job added successfully");
    console.log("Job ID:", job.id);

    await monitorQueue.close();

    process.exit(0);
  } catch (error) {
    console.error("BullMQ queue test failed:", error);

    await monitorQueue.close();

    process.exit(1);
  }
};

testQueue();