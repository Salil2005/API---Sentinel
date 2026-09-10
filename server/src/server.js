import app from "./app.js";
import "./config/dns.js";

import {env} from "./config/env.js";
import {connectDatabase} from "./config/database.js";

const startServer = async() => {
    await connectDatabase();

    app.listen(env.PORT, () => {
        console.log(`API Sentinel server running on port ${env.PORT}`);
    });
};

startServer();
