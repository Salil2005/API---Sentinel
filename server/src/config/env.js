import "dotenv/config";
import {z} from "zod";

const envSchema = z.object({
    PORT: z.coerce.number().default(3000),

    NODE_ENV: z.enum(["development", "production", "test"]).default("development"), 

    CLIENT_URL: z.url().default("http://localhost:5173"),

    MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),

    JWT_SECRET: z.string().optional(),

    REDIS_URL: z.string().optional(),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
    console.error("Invalid environment variables:", parsedEnv.error.format());
    process.exit(1);
}   

export const env = parsedEnv.data;
