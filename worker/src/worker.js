import { connectDatabase } from "./config/database.js";
import dns from "node:dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const startWorker = async () => {
  await connectDatabase();

  console.log("API Sentinel monitoring worker started");
};

startWorker();