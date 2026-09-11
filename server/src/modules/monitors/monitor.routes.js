import { Router } from "express";

import { authMiddleware } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { createMonitorSchema, monitorIdSchema, updateMonitorSchema } from "./monitor.validation.js";
import { createMonitor, getMonitors, getMonitor, updateMonitor, deleteMonitor, resumeMonitor, pauseMonitor } from "./monitor.controller.js";

const router = Router();

router.post("/", authMiddleware, validate(createMonitorSchema), createMonitor);

router.get("/", authMiddleware, getMonitors);

router.get("/:id", authMiddleware, validate(monitorIdSchema), getMonitor);

router.put("/:id", authMiddleware, validate(updateMonitorSchema), updateMonitor);

router.delete("/:id", authMiddleware, validate(monitorIdSchema), deleteMonitor);

router.patch("/:id/pause", authMiddleware, validate(monitorIdSchema), pauseMonitor);

router.patch("/:id/resume", authMiddleware, validate(monitorIdSchema), resumeMonitor);

export default router;