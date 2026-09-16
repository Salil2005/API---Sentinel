import dns from "node:dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

import { monitorQueue } from "./queues/monitor.queue.js";

const checkSchedulers = async () => {
  try {
    const schedulers = await monitorQueue.getJobSchedulers(
      0,
      100,
      true
    );

    console.log("Registered monitor schedulers:");
    console.dir(schedulers, { depth: null });

    await monitorQueue.close();
    process.exit(0);
  } catch (error) {
    console.error("Failed to read schedulers:", error);

    await monitorQueue.close();
    process.exit(1);
  }
};

checkSchedulers();