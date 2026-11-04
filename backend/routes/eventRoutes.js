
const express = require("express");

const router = express.Router();

const {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent
} = require("../controllers/eventController");

// GET all events
router.get("/", getAllEvents);

// GET event by ID
router.get("/:id", getEventById);

// POST create event
router.post("/", createEvent);

// PUT update event
router.put("/:id", updateEvent);

// DELETE event
router.delete("/:id", deleteEvent);

module.exports = router;
