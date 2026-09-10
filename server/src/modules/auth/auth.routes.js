import { Router } from "express";

import { register , login , logout , getCurrentUser } from "./auth.controller.js";
import { validate } from "../../middleware/validate.middleware.js";
import { registerSchema , loginSchema } from "./auth.validation.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";


const router = Router();

router.post("/register", validate(registerSchema), register);

router.post("/login", validate(loginSchema), login);

router.post("/logout", logout);

router.get("/me", authMiddleware, getCurrentUser);

export default router;