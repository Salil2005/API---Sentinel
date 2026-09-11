import {z} from"zod";
import mongoose from "mongoose";

const monitorFields ={
    name: z.string().min(1).max(100),

    url: z.url(),

    method: z.enum(["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD"]).default("GET"),

    headers: z.record(z.string(), z.string()).optional(), 

    body: z.unknown().optional(),

    intervalSeconds: z.number().int().min(300, "Minimum monitoring interval is 5 minutes"),

    timeoutMs: z.number().int().min(1000, "Minimum timeout is 1 second").max(30000, "Maximum timeout is 30 seconds"),

    expectedStatus: z.number().int().min(100).max(599).default(200),

    expectedBodyRule: z.string().max(500).optional(),

    latencyThresholdMs: z.number().int().positive().optional(),

    failureThreshold: z.number().int().min(1).default(3),
};


export const createMonitorSchema = z.object({
  body: z.object(monitorFields),
  query: z.object({}),
  params: z.object({}),
});

export const updateMonitorSchema = z.object({
  body: z.object(monitorFields).partial(),
  query: z.object({}),
  params: z.object({
    id: z.string().min(1),
  }),
});

export const monitorIdSchema = z.object({
  body: z.object({}).default({}),
  query: z.object({}),
  params: z.object({
    id: z.string().refine(
      (value) => mongoose.isValidObjectId(value),
      "Invalid monitor ID"
    ),
  }),
});