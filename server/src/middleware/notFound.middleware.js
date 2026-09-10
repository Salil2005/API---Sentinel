export const notFoundMiddleware = (req, res) => {
    res.status(404).json({
        success: false,
        status: "error",
        message: `Route not found: ${req.method} ${req.originalUrl}`,
    });
};