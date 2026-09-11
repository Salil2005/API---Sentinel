import express from "express"

const app = express();

app.use(express.json());

app.get("/healthy", (_req, res) => {
    res.status(200).json({
        success: true,
        data: {
            status: "healthy",
            message: "Test API is working",
        },
    });
});

app.get("/slow", async (_req, res) => {
    await new Promise((resolve) => setTimeout(resolve, 3000));

    res.status(200).json({
        success: true,
        data: {
            status: "slow",
            message: "Response delayed by 3 seconds",
        },
    });
});

app.get("/error", (_req, res) => {
    res.status(500).json({
        success: false ,
        error: "Simulated server error",
        code: 500,
    });
});

app.get("/timeout", async (_req, res) => {
    await new Promise((resolve) => setTimeout(resolve, 3000));

    res.status(200).json({
        success: true,
        data: {
            status: "timeout",
            message: "Response finally returned",
        },
    });
});

app.get("/random", (_req, res) => {
    const shouldFail = Math.random() < 0.5;

    if(shouldFail){
        return res.status(500).json({
            success: false,
            error: "Random simulated failure",
            code: 500,
        });
    }

    return res.status(200).json({
        success: true,
        data: {
            status: "healthy",
            meassage: "Random request succeeded",
        },
    });
});

export default app ;