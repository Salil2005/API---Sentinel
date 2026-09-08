import express from "express";


const app = express();

const PORT = process.env.PORT || 3000;

app.get("/api/health", (req,res) => {
    res.json({
        status: "healthy",
        service: "API Sentinel Server",
    });
});

app.listen(PORT, () => {
    console.log(`API Sentinel server running on port ${PORT}`);
});