import express from "express";

const app = express();

const PORT = process.env.PORT || 6000;

app.use(express.json()); 

// 1. Always healthy
app.get("/healthy", (req,res) => {
    res.json({
        status: "healthy",
        message: "Test API is running",
    });
});

// 2. Slow Response
app.get("/slow", async(req,res) => {
    const delay = Number(req.query.delay) || 3000;

    await new Promise((resolve) => setTimeout(resolve, delay));

    res.status(200).json({
        status: "slow",
        delay: delay,
        message: "Response intentionally delayed",        
    });
});

// 3. Server error
app.get("/error", (req, res) => {
  res.status(500).json({
    status: "error",
    message: "Internal server error simulated",
  });
});

// 4. Timeout simulation
app.get("/timeout", async (req, res) => {
  const delay = Number(req.query.delay) || 30000;

  await new Promise((resolve) => setTimeout(resolve, delay));

  res.status(200).json({
    status: "timeout",
    message: "Response completed after long delay",
  });
});

// 5. Random success/failure
app.get("/random", (req, res) => {
  const shouldFail = Math.random() < 0.5;

  if (shouldFail) {
    return res.status(500).json({
      status: "error",
      message: "Random failure occurred",
    });
  }

  return res.status(200).json({
    status: "healthy",
    message: "Random request succeeded",
  });
});

// Test API health
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    service: "api-sentinel-test-api",
  });
});

app.listen(PORT, () => {
  console.log(`API Sentinel test API running on port ${PORT}`);
});