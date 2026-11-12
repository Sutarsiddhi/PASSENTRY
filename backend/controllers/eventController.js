
const Event = require("../models/Event");

// 1. Get all events
const getAllEvents = async (req, res, next) => {
    try {
        const events = await Event.find().sort({
            createdAt: -1
        });

        res.status(200).json({
            success: true,
            count: events.length,
            events: events
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
            event: event
        });

    } catch (error) {
        next(error);
    }
};


// 3. Create a new event
const createEvent = async (req, res, next) => {
    try {
        const {
            title,
            description,
            date,
            venue,
            price,
            capacity,
            category,
            poster
        } = req.body;

        // Check required fields
        if (
            !title ||
            !description ||
            !date ||
            !venue ||
            !category ||
            price === undefined ||
            capacity === undefined
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required event details"
            });
        }

        // Validate numeric values
        if (
            !Number.isFinite(Number(price)) ||
            !Number.isInteger(Number(capacity)) ||
            Number(price) < 0 ||
            Number(capacity) <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Enter a valid price and positive whole-number capacity"
            });
        }

        // Validate date
        if (Number.isNaN(Date.parse(date))) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid event date"
            });
        }

        // Create event in MongoDB
        const event = await Event.create({
            title,
            description,
            date,
            venue,
            price: Number(price),
            capacity: Number(capacity),
            availableSeats: Number(capacity),
            category,
            poster
        });

        res.status(201).json({
            success: true,
            message: "Event created successfully",
            event: event
        });

    } catch (error) {
        next(error);
    }
};


// 4. Update an existing event
const updateEvent = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        const {
            title,
            description,
            date,
            venue,
            price,
            capacity,
            category,
            poster,
            status
        } = req.body;

        if (
            price !== undefined &&
            (!Number.isFinite(Number(price)) || Number(price) < 0)
        ) {
            return res.status(400).json({
                success: false,
                message: "Price cannot be negative"
            });
        }

        if (
            capacity !== undefined &&
            (!Number.isInteger(Number(capacity)) || Number(capacity) <= 0)
        ) {
            return res.status(400).json({
                success: false,
                message: "Capacity must be a positive whole number"
            });
        }

        if (date !== undefined && Number.isNaN(Date.parse(date))) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid event date"
            });
        }

        // Update only supplied fields
        if (title !== undefined) event.title = title;
        if (description !== undefined) event.description = description;
        if (date !== undefined) event.date = date;
        if (venue !== undefined) event.venue = venue;
        if (price !== undefined) event.price = Number(price);
        if (category !== undefined) event.category = category;
        if (poster !== undefined) event.poster = poster;
        if (status !== undefined) event.status = status;

        // Preserve already booked seats
        if (capacity !== undefined) {
            const bookedSeats = event.capacity - event.availableSeats;

            if (Number(capacity) < bookedSeats) {
                return res.status(400).json({
                    success: false,
                    message: "Capacity cannot be less than already booked seats"
                });
            }

            event.capacity = Number(capacity);
            event.availableSeats = Number(capacity) - bookedSeats;
        }

        const updatedEvent = await event.save();

        res.status(200).json({
            success: true,
            message: "Event updated successfully",
            event: updatedEvent
        });

    } catch (error) {
        next(error);
    }
};


// 5. Delete an event
const deleteEvent = async (req, res, next) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Event deleted successfully"
        });

    } catch (error) {
        next(error);
    }
};


// Export controller functions
module.exports = {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent
};
