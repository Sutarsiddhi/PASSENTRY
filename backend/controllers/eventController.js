
const Event = require("../models/Event");

const fs = require("fs/promises");
const path = require("path");


// Helper: Remove a locally stored poster
const removePoster = async (posterUrl) => {

    if (!posterUrl || !posterUrl.startsWith("/uploads/")) {
        return;
    }

    const filename = path.basename(posterUrl);

    const filePath = path.join(
        __dirname,
        "..",
        "uploads",
        filename
    );

    try {
        await fs.unlink(filePath);
    } catch (error) {
        if (error.code !== "ENOENT") {
            console.error("Poster cleanup failed:", error.message);
        }
    }
};


// 1. Get all events
const getAllEvents = async (req, res, next) => {

    try {

        const events = await Event.find().sort({
            createdAt: -1
        });

        res.status(200).json({
            success: true,
            count: events.length,
            events
        });

    } catch (error) {
        next(error);
    }
};


// 2. Get event by ID
const getEventById = async (req, res, next) => {

    try {

        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        res.status(200).json({
            success: true,
            event
        });

    } catch (error) {
        next(error);
    }
};


// 3. Get admin dashboard statistics
const getEventStats = async (req, res, next) => {

    try {

        const currentDate = new Date();

        const [
            totalEvents,
            upcomingEvents,
            capacityResult,
            seatsResult
        ] = await Promise.all([

            Event.countDocuments(),

            Event.countDocuments({
                status: "upcoming",
                date: { $gte: currentDate }
            }),

            Event.aggregate([
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$capacity" }
                    }
                }
            ]),

            Event.aggregate([
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$availableSeats" }
                    }
                }
            ])

        ]);

        const totalCapacity =
            capacityResult[0]?.total || 0;

        const availableSeats =
            seatsResult[0]?.total || 0;

        res.status(200).json({

            success: true,

            stats: {
                totalEvents,
                upcomingEvents,
                totalCapacity,
                availableSeats,
                bookedSeats: totalCapacity - availableSeats
            }

        });

    } catch (error) {
        next(error);
    }
};


// 4. Create a new event
const createEvent = async (req, res, next) => {

    try {

        const {
            title,
            description,
            date,
            venue,
            price,
            capacity,
            category
        } = req.body;


        // Required field validation
        if (
            !title?.trim() ||
            !description?.trim() ||
            !date ||
            !venue?.trim() ||
            !category ||
            price === undefined ||
            capacity === undefined
        ) {

            return res.status(400).json({
                success: false,
                message: "Please provide all required event details"
            });
        }


        // Price validation
        if (
            !Number.isFinite(Number(price)) ||
            Number(price) < 0
        ) {

            return res.status(400).json({
                success: false,
                message: "Please enter a valid non-negative price"
            });
        }


        // Capacity validation
        if (
            !Number.isInteger(Number(capacity)) ||
            Number(capacity) <= 0
        ) {

            return res.status(400).json({
                success: false,
                message: "Capacity must be a positive whole number"
            });
        }


        // Date validation
        const eventDate = new Date(date);

        if (Number.isNaN(eventDate.getTime())) {

            return res.status(400).json({
                success: false,
                message: "Please enter a valid event date"
            });
        }


        // Do not allow events in the past
        if (eventDate < new Date()) {

            return res.status(400).json({
                success: false,
                message: "Event date cannot be in the past"
            });
        }


        // Create event
        const event = await Event.create({

            title: title.trim(),

            description: description.trim(),

            date: eventDate,

            venue: venue.trim(),

            price: Number(price),

            capacity: Number(capacity),

            availableSeats: Number(capacity),

            category,

            poster: req.file
                ? `/uploads/${req.file.filename}`
                : ""

        });


        res.status(201).json({

            success: true,

            message: "Event created successfully",

            event

        });

    } catch (error) {

        // Remove uploaded image if event creation fails
        if (req.file) {
            await removePoster(`/uploads/${req.file.filename}`);
        }

        next(error);
    }
};


// 5. Update event

const updateEvent = async (req, res, next) => {

    let uploadedPoster = "";

    try {

        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        const oldPoster = event.poster;

        const {
            title,
            description,
            date,
            venue,
            price,
            capacity,
            category,
            status
        } = req.body;


        if (price !== undefined) {
            if (
                !Number.isFinite(Number(price)) ||
                Number(price) < 0
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Enter a valid non-negative price"
                });
            }

            event.price = Number(price);
        }


        if (capacity !== undefined) {

            const newCapacity = Number(capacity);

            if (
                !Number.isInteger(newCapacity) ||
                newCapacity <= 0
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Capacity must be a positive whole number"
                });
            }

            const bookedSeats =
                event.capacity - event.availableSeats;

            if (newCapacity < bookedSeats) {
                return res.status(400).json({
                    success: false,
                    message: "Capacity cannot be less than already booked seats"
                });
            }

            event.capacity = newCapacity;
            event.availableSeats = newCapacity - bookedSeats;
        }


        if (date !== undefined) {

            const eventDate = new Date(date);

            if (
                Number.isNaN(eventDate.getTime()) ||
                eventDate < new Date()
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Please enter a valid future event date"
                });
            }

            event.date = eventDate;
        }


        if (title !== undefined) {
            event.title = title.trim();
        }

        if (description !== undefined) {
            event.description = description.trim();
        }

        if (venue !== undefined) {
            event.venue = venue.trim();
        }

        if (category !== undefined) {
            event.category = category;
        }

        if (status !== undefined) {
            event.status = status;
        }


        if (req.file) {
            uploadedPoster = `/uploads/${req.file.filename}`;
            event.poster = uploadedPoster;
        }


        const updatedEvent = await event.save();

        // Remove old poster only after successful database save
        if (req.file) {
            await removePoster(oldPoster);
        }

        res.status(200).json({
            success: true,
            message: "Event updated successfully",
            event: updatedEvent
        });

    } catch (error) {

        if (uploadedPoster) {
            await removePoster(uploadedPoster);
        }

        next(error);
    }
};


// 6. Delete event
const deleteEvent = async (req, res, next) => {

    try {

        const event = await Event.findById(req.params.id);

        if (!event) {

            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        const oldPoster = event.poster;

        await event.deleteOne();

        await removePoster(oldPoster);

        res.status(200).json({

            success: true,

            message: "Event deleted successfully"

        });

    } catch (error) {
        next(error);
    }
};


module.exports = {

    getAllEvents,

    getEventById,

    getEventStats,

    createEvent,

    updateEvent,

    deleteEvent

};
