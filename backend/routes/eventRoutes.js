
const express = require("express");

const router = express.Router();

const {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent
} = require("../controllers/eventController");

const {
    protect,
    authorize
} = require("../middleware/authMiddleware");


// Public routes: anyone can view events
router.get("/", getAllEvents);
router.get("/:id", getEventById);


// Admin-only routes
router.post(
    "/",
    protect,
    authorize("admin"),
    createEvent
);

router.put(
    "/:id",
    protect,
    authorize("admin"),
    updateEvent
);

router.delete(
    "/:id",
    protect,
    authorize("admin"),
    deleteEvent
);


module.exports = router;
