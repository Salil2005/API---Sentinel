import mongoose from "mongoose";
import { env } from "./env.js";

export const connectDatabase = async() => {
    try {
        const connection = await mongoose.connect(env.MONGODB_URI);

        console.log(`MongoDB connected: ${connection.connection.host}/${connection.connection.name}`);
    }
    catch (error) {
        console.error("MongoDB connection error:", error.message);
        process.exit(1);
    }
};