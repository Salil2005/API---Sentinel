import {z} from "zod";

export const testSchema = z.object({
    body: z.object({
        name: z.string().min(2),
        age: z.coerce.number().int().positive(),    
    }),
    query: z.object({}),
    params: z.object({}),
});