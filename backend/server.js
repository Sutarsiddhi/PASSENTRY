
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Home API
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Welcome to PASSENTRY API!"
    });
});

// Server status API
app.get("/api/status", (req, res) => {
    res.json({
        success: true,
        project: "PASSENTRY",
        status: "Running",
        message: "Backend server is working successfully!"
    });
});

// Test events API
app.get("/api/events", (req, res) => {
    const events = [
        {
            id: 1,
            title: "College Tech Fest 2026",
            description: "A technical festival for students",
            price: 199,
            capacity: 500
        },
        {
            id: 2,
            title: "Cultural Fest 2026",
            description: "Music, dance and cultural performances",
            price: 299,
            capacity: 300
        },
        {
            id: 3,
            title: "Sports Fest 2026",
            description: "Inter-college sports competition",
            price: 149,
            capacity: 200
        }
    ];

    res.json({
        success: true,
        count: events.length,
        events: events
    });
});

// Server configuration
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`PASSENTRY server running on port ${PORT}`);
});
