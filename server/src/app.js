import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

import {env} from "./config/env.js";
import {errorMiddleware} from "./middleware/error.middleware.js";
import {notFoundMiddleware} from "./middleware/notFound.middleware.js";
import { validate } from "./middleware/validate.middleware.js";
import { testSchema } from "./validation/test.schema.js";

const app = express();

// Security Header
app.use(helmet());

// Allow request from frontend
app.use(cors({
    origin: env.CLIENT_URL, 
    credentials: true,
}));

// Parse JSON request body
app.use(express.json({ limit: "1mb" }));

// Parse cookies 
app.use(cookieParser());

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    status: "error",
    message: "Too many requests. Please try again later.",
  },   
});

app.use("/api", apiLimiter);



app.get("/api/health", (req, res) => {
    res.status(200).json({
      success: true,
      data: {
        status: "healthy",
        service: "API Sentinel Server",
      },
    });
});

app.post("/api/test-validation", validate(testSchema), (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      message: "Validation successful",
      received: req.validate.body,
    },
  });
});

// 404 Handling
app.use(notFoundMiddleware);

// error handling
app.use(errorMiddleware);

export default app;