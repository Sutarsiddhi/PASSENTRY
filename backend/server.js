
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const eventRoutes = require("./routes/eventRoutes");

const {
    notFound,
    errorHandler
} = require("./middleware/errorMiddleware");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Home API
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to PASSENTRY API!"
    });
});

// Status API
app.get("/api/status", (req, res) => {
    res.status(200).json({
        success: true,
        project: "PASSENTRY",
        status: "Running",
        database: "Connected"
    });
});

// Event routes
app.use("/api/events", eventRoutes);

// Handle invalid routes
app.use(notFound);

// Error handler
app.use(errorHandler);

// Start server after database connection
const startServer = async () => {
    try {
        await connectDB();

        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {
            console.log(
                `PASSENTRY server running on port ${PORT}`
            );
        });

    } catch (error) {
        console.error("Server startup failed:", error.message);
        process.exit(1);
    }
};

startServer();
