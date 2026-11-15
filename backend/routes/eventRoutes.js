
const express = require("express");

const router = express.Router();

const {
    getAllEvents,
    getEventById,
    getEventStats,
    createEvent,
    updateEvent,
    deleteEvent
} = require("../controllers/eventController");

const {
    protect,
    authorize
} = require("../middleware/authMiddleware");

const upload = require("../middleware/uploadMiddleware");


// Admin statistics
// Keep this route above /:id
router.get(
    "/stats",
    protect,
    authorize("admin"),
    getEventStats
);


// Public routes
router.get("/", getAllEvents);

router.get("/:id", getEventById);


// Admin-only create
router.post(
    "/",
    protect,
    authorize("admin"),
    upload.single("poster"),
    createEvent
);


// Admin-only update
router.put(
    "/:id",
    protect,
    authorize("admin"),
    upload.single("poster"),
    updateEvent
);


// Admin-only delete
router.delete(
    "/:id",
    protect,
    authorize("admin"),
    deleteEvent
);


module.exports = router;
