import "dotenv/config";

import {z} from "zod";

const envSchema = z.object({
    MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"), 
});

const result = envSchema.safeParse(process.env);

if(!result.success){
    console.error("Invalid worker environment variables:");
    console.error(result.error.issues);
    process.exit(1);
}

export const env = result.data;