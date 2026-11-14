
require("dotenv").config();

const mongoose = require("mongoose");
const User = require("../models/User");

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const email = process.env.ADMIN_EMAIL;
        const password = process.env.ADMIN_PASSWORD;

        if (!email || !password) {
            throw new Error(
                "Please configure ADMIN_EMAIL and ADMIN_PASSWORD in .env"
            );
        }

        if (password.length < 6) {
            throw new Error(
                "Admin password must contain at least 6 characters"
            );
        }

        const existingAdmin = await User.findOne({
            email: email.toLowerCase().trim()
        });

        if (existingAdmin) {
            console.log("Admin account already exists.");
            return;
        }

        await User.create({
            name: "PASSENTRY Admin",
            email,
            password,
            role: "admin"
        });

        console.log("Admin account created successfully!");

    } catch (error) {
        console.error("Admin creation failed:", error.message);
        process.exitCode = 1;

    } finally {
        await mongoose.disconnect();
    }
};

createAdmin();
