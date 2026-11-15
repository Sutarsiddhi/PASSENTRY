
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

// Create uploads directory if it doesn't exist
const uploadDirectory = path.join(
    __dirname,
    "..",
    "uploads"
);

if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, {
        recursive: true
    });
}


// Configure file storage
const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, uploadDirectory);
    },

    filename: (req, file, cb) => {

        const extension = path.extname(
            file.originalname
        ).toLowerCase();

        const uniqueName =
            Date.now() +
            "-" +
            crypto.randomBytes(8).toString("hex") +
            extension;

        cb(null, uniqueName);
    }
});


// Allow only selected image formats
const fileFilter = (req, file, cb) => {

    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(
            new Error(
                "Only JPG, PNG and WEBP images are allowed"
            )
        );
    }
};


// Configure Multer
const upload = multer({

    storage: storage,

    fileFilter: fileFilter,

    limits: {
        fileSize: 5 * 1024 * 1024
    }

});

module.exports = upload;
