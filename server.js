const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ✅ MUST be BEFORE routes
app.use(cors({
    origin: "https://technoskysolution.com",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
}));

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

// routes
app.use("/api", require("./routes/mailRoutes"));

// Add error handling middleware
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        success: false,
        error: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
});

app.listen(5002, () => {
    console.log("Server running on port 5002");
});
