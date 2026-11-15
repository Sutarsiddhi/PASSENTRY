const path = require("path");
const express = require("express");
const cors = require("cors");

require("dotenv").config();

const connectDB = require("./config/db");

const eventRoutes = require("./routes/eventRoutes");
const authRoutes = require("./routes/authRoutes");

const {
    notFound,
    errorHandler
} = require("./middleware/errorMiddleware");

const app = express();


// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded event posters
app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"))
);


// Home route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to PASSENTRY API!"
    });
});


// Status route
app.get("/api/status", (req, res) => {
    res.status(200).json({
        success: true,
        project: "PASSENTRY",
        status: "Running",
        database: "Connected"
    });
});


// API routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);


// Error handling
app.use(notFound);
app.use(errorHandler);


// Start server after connecting to MongoDB
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
        console.error(
            "Server startup failed:",
            error.message
        );

        process.exit(1);
    }
};

startServer();
