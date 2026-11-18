
const mongoose = require("mongoose");
const crypto = require("crypto");

const Booking = require("../models/Booking");
const Event = require("../models/Event");

// Book tickets
const createBooking = async (req, res, next) => {
    const session = await mongoose.startSession();

    try {
        const { eventId, quantity } = req.body;

        // Validate event ID
        if (!mongoose.Types.ObjectId.isValid(eventId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid event ID"
            });
        }

        // Validate ticket quantity
        const ticketQuantity = Number(quantity);

        if (
            !Number.isInteger(ticketQuantity) ||
            ticketQuantity < 1 ||
            ticketQuantity > 10
        ) {
            return res.status(400).json({
                success: false,
                message: "You can book between 1 and 10 tickets"
            });
        }

        // Get logged-in student ID
        const studentId = req.user._id || req.user.id;

        if (!studentId) {
            return res.status(401).json({
                success: false,
                message: "User authentication information is missing"
            });
        }

        let createdBooking;

        // Use MongoDB transaction
        await session.withTransaction(async () => {

            // Atomically reserve seats
            const event = await Event.findOneAndUpdate(
                {
                    _id: eventId,
                    status: "upcoming",
                    date: { $gt: new Date() },
                    availableSeats: { $gte: ticketQuantity }
                },
                {
                    $inc: {
                        availableSeats: -ticketQuantity
                    }
                },
                {
                    new: true,
                    session
                }
            );

            if (!event) {
                throw new Error(
                    "Event is unavailable or insufficient seats are available"
                );
            }

            const bookingReference =
                "PASS-" +
                crypto.randomBytes(5).toString("hex").toUpperCase();

            const booking = new Booking({
                bookingReference,
                student: studentId,
                event: event._id,
                quantity: ticketQuantity,
                totalAmount: event.price * ticketQuantity,
                status: "reserved",
                paymentStatus: "pending"
            });

            const savedBookings = await Booking.create(
                [booking],
                { session }
            );

            createdBooking = savedBookings[0];
        });

        res.status(201).json({
            success: true,
            message: "Tickets reserved successfully",
            booking: createdBooking
        });

    } catch (error) {

        if (
            error.message ===
            "Event is unavailable or insufficient seats are available"
        ) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        next(error);

    } finally {
        await session.endSession();
    }
};


// Get logged-in student's bookings
const getMyBookings = async (req, res, next) => {
    try {
        const studentId = req.user._id || req.user.id;

        const bookings = await Booking.find({
            student: studentId
        })
            .populate(
                "event",
                "title description date venue price poster category status"
            )
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: bookings.length,
            bookings
        });

    } catch (error) {
        next(error);
    }
};


// Get a single booking
const getBookingById = async (req, res, next) => {
    try {
        const studentId = req.user._id || req.user.id;

        const booking = await Booking.findOne({
            _id: req.params.id,
            student: studentId
        }).populate(
            "event",
            "title description date venue price poster category"
        );

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        res.status(200).json({
            success: true,
            booking
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    createBooking,
    getMyBookings,
    getBookingById
};
