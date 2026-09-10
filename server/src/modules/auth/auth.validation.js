import {z} from'zod';

export const registerSchema = z.object({
    body: z.object({
        email: z.string(),
        password: z.string().min(8, "Password must be at least 8 characters long" ),
    }),
    query: z.object({}),
    params: z.object({}),
});

export const loginSchema = z.object({
    body: z.object({
        email: z.string(),
        password: z.string().min(1, "Password is required" ),
    }),
    query: z.object({}),
    params: z.object({}),
});