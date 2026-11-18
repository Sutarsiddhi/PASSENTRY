
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
    {
        bookingReference: {
            type: String,
            required: true,
            unique: true
        },

        // Unique secret used inside the QR code
        qrToken: {
            type: String,
            unique: true,
            sparse: true
        },

        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        event: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
            required: true
        },

        quantity: {
            type: Number,
            required: true,
            min: 1
        },

        totalAmount: {
            type: Number,
            required: true,
            min: 0
        },

        status: {
            type: String,
            enum: ["reserved", "cancelled"],
            default: "reserved"
        },

        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "failed"],
            default: "pending"
        }
    },
    {
        timestamps: true
    }
);

bookingSchema.index({ student: 1, createdAt: -1 });
bookingSchema.index({ event: 1 });

module.exports = mongoose.model("Booking", bookingSchema);
