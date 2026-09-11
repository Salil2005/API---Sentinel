import dns from "node:dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

import { connectDatabase } from "./config/database.js";
import { Monitor } from "../../server/src/modules/monitors/monitor.model.js";
import { executeMonitorCheck } from "./services/monitor.service.js";
import { saveCheckResult } from "./services/check-result.service.js";

const run = async () => {
  await connectDatabase();

  const monitor = await Monitor.findOne({
   url: "http://localhost:4000/timeout",
   active: true,
 });

  if (!monitor) {
    console.log("No active monitor found.");
    process.exit(0);
  }

  console.log("Checking:", monitor.url);

  const result = await executeMonitorCheck(monitor);

  console.log("Check result:");
  console.dir(result, { depth: null });

  const savedResult = await saveCheckResult(result);

  console.log("Check result saved to MongoDB:");
  console.dir(savedResult, { depth: null });

  process.exit(0);
};

run();