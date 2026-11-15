
const notFound = (req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.originalUrl}`
    });
};

const errorHandler = (err, req, res, next) => {

    if (err.code === "LIMIT_FILE_SIZE") {
        statusCode = 400;
        message = "Poster size must not exceed 5 MB";
    }

    if (err.name === "MulterError") {
        statusCode = 400;
        message = err.message;
    }

    if (
        err.message ===
        "Only JPG, PNG and WEBP images are allowed"
    ) {
        statusCode = 400;
        message = err.message;
    }

    console.error(err);

    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    // Invalid MongoDB ObjectId
    if (err.name === "CastError") {
        statusCode = 400;
        message = "Invalid event ID";
    }

    // Mongoose validation errors
    if (err.name === "ValidationError") {
        statusCode = 400;
        message = Object.values(err.errors)
            .map((item) => item.message)
            .join(", ");
    }

    res.status(statusCode).json({
        success: false,
        message: message
    });
};

module.exports = {
    notFound,
    errorHandler
};
