import {env} from "../config/env.js";

export const errorMiddleware = (err, req, res, _next) => {
    console.error(err);

    const statusCode = err.statusCode || 500;

    const message = env.NODE_ENV === "production" ? "Internal server error" : err.message || "Internal server error";

    res.status(statusCode).json({
        success: false,
        error: message,
        code: statusCode,
    });
};
    