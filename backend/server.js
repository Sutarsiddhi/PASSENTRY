
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const eventRoutes = require("./routes/eventRoutes");

const {
    notFound,
    errorHandler
} = require("./middleware/errorMiddleware");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Home route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to PASSENTRY API!"
    });
});

// API status
app.get("/api/status", (req, res) => {
    res.status(200).json({
        success: true,
        project: "PASSENTRY",
        status: "Running"
    });
});

// Event routes
app.use("/api/events", eventRoutes);

// Handle unknown routes
app.use(notFound);

// Error handling
app.use(errorHandler);

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(
        `PASSENTRY server running on port ${PORT}`
    );
});
