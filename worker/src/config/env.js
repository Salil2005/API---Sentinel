import dotenv from "dotenv";

import {z} from "zod";

dotenv.config({
  path: new URL("../../.env", import.meta.url),
});

const envSchema = z.object({
    MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
    REDIS_URL: z.string().min(1, "REDIS_URL is required"),
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"), 
});

const result = envSchema.safeParse(process.env);

if(!result.success){
    console.error("Invalid worker environment variables:");
    console.error(result.error.issues);
    process.exit(1);
}

export const env = result.data;