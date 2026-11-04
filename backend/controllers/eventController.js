
const events = require("../data/events");

// 1. Get all events
const getAllEvents = (req, res) => {
    res.status(200).json({
        success: true,
        count: events.length,
        events: events
    });
};

// 2. Get event by ID
const getEventById = (req, res) => {
    const id = Number(req.params.id);

    const event = events.find((item) => item.id === id);

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
};

// 3. Create a new event
const createEvent = (req, res) => {
    const {
        title,
        description,
        date,
        venue,
        price,
        capacity,
        category
    } = req.body;

    // Validate required fields
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

    // Validate price and capacity
    if (
        !Number.isFinite(Number(price)) ||
        !Number.isFinite(Number(capacity)) ||
        Number(price) < 0 ||
        Number(capacity) <= 0
    ) {
        return res.status(400).json({
            success: false,
            message: "Price must be non-negative and capacity must be positive"
        });
    }

    const newEvent = {
        id: Date.now(),
        title,
        description,
        date,
        venue,
        price: Number(price),
        capacity: Number(capacity),
        availableSeats: Number(capacity),
        category
    };

    events.push(newEvent);

    res.status(201).json({
        success: true,
        message: "Event created successfully",
        event: newEvent
    });
};

// 4. Update an existing event
const updateEvent = (req, res) => {
    const id = Number(req.params.id);

    const eventIndex = events.findIndex(
        (item) => item.id === id
    );

    if (eventIndex === -1) {
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
        category
    } = req.body;

    if (
        (price !== undefined &&
            (!Number.isFinite(Number(price)) || Number(price) < 0)) ||
        (capacity !== undefined &&
            (!Number.isInteger(Number(capacity)) || Number(capacity) <= 0))
    ) {
        return res.status(400).json({
            success: false,
            message: "Invalid price or capacity"
        });
    }

    const event = events[eventIndex];

    const updatedCapacity =
        capacity === undefined ? event.capacity : Number(capacity);

    const bookedSeats = event.capacity - event.availableSeats;

    if (updatedCapacity < bookedSeats) {
        return res.status(400).json({
            success: false,
            message: "Capacity cannot be less than already booked seats"
        });
    }

    const updatedEvent = {
        ...event,
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(date !== undefined && { date }),
        ...(venue !== undefined && { venue }),
        ...(price !== undefined && { price: Number(price) }),
        ...(category !== undefined && { category }),
        capacity: updatedCapacity,
        availableSeats: updatedCapacity - bookedSeats
    };

    events[eventIndex] = updatedEvent;

    res.status(200).json({
        success: true,
        message: "Event updated successfully",
        event: updatedEvent
    });
};

// 5. Delete an event
const deleteEvent = (req, res) => {
    const id = Number(req.params.id);

    const eventIndex = events.findIndex(
        (item) => item.id === id
    );

    if (eventIndex === -1) {
        return res.status(404).json({
            success: false,
            message: "Event not found"
        });
    }

    events.splice(eventIndex, 1);

    res.status(200).json({
        success: true,
        message: "Event deleted successfully"
    });
};

// Export all controller functions
module.exports = {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent
};
