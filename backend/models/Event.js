
const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Event title is required"],
            trim: true,
            maxlength: 150
        },

        description: {
            type: String,
            required: [true, "Event description is required"],
            trim: true
        },

        date: {
            type: Date,
            required: [true, "Event date is required"]
        },

        venue: {
            type: String,
            required: [true, "Event venue is required"],
            trim: true
        },

        price: {
            type: Number,
            required: true,
            min: [0, "Price cannot be negative"]
        },

        capacity: {
            type: Number,
            required: true,
            min: [1, "Capacity must be at least 1"],
            validate: {
                validator: Number.isInteger,
                message: "Capacity must be a whole number"
            }
        },

        availableSeats: {
            type: Number,
            required: true,
            min: 0
        },

        category: {
            type: String,
            required: true,
            enum: ["Technology", "Cultural", "Sports", "Workshop", "Other"]
        },

        poster: {
            type: String,
            default: ""
        },

        status: {
            type: String,
            enum: ["upcoming", "completed", "cancelled"],
            default: "upcoming"
        }
    },
    {
        timestamps: true
    }
);

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
