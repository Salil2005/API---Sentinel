import mongoose from "mongoose";
import {env} from "./env.js";

export const connectDatabase =  async () => {
    try{
        await mongoose.connect(env.MONGODB_URI);
        console.log("Worker connected to MONGODB");
    }
    catch(error){
        console.error("Worker MongoDB connection failed:", error);
        process.exit(1);
    }
};