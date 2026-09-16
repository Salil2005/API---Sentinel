import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]) ;

import { monitorQueue } from "./queues/monitor.queue.js";
import { Monitor } from "../../server/src/modules/monitors/monitor.model.js";
import { connectDatabase } from "./config/database.js";

const testMonitorJob = async () => {
    try{
        await connectDatabase();

        const monitor = await Monitor.findOne({
            active: true,
        });

        if(!monitor){
            console.log("No active monitor found");
            process.exit(0);
        }

        const job = await monitorQueue.add("monitor-check", {
            monitorId: monitor._id.toString(),
        });

        console.log("Monitoring job added successfully");
        console.log("Monitor:", monitor.name);
        console.log("URL:", monitor.url);
        console.log("Job ID:", job.id);

        await monitorQueue.close();
        process.exit(0);

    }
    catch(error){
        console.error("Failed to add monitoring job:", error);

        await monitorQueue.close();

        process.exit(1);
    }
};

testMonitorJob();