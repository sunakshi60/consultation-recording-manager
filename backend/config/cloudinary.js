const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require("dotenv").config();

console.log("--- Cloudinary Config Debug ---");
console.log("CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME || "MISSING");
console.log("API_KEY:", process.env.CLOUDINARY_API_KEY ? `${process.env.CLOUDINARY_API_KEY.substring(0, 3)}...` : "MISSING");
console.log("API_SECRET:", process.env.CLOUDINARY_API_SECRET ? "PRESENT" : "MISSING");

cloudinary.config({
    cloud_name: (process.env.CLOUDINARY_CLOUD_NAME || "").trim(),
    api_key: (process.env.CLOUDINARY_API_KEY || "").trim(),
    api_secret: (process.env.CLOUDINARY_API_SECRET || "").trim(),
});

const config = cloudinary.config();
console.log("Cloudinary Config Applied:", config.cloud_name);

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "consultation-recordings",
        resource_type: "auto",
        // Temporarily removing allowed_formats to debug
    },
});

module.exports = { cloudinary, storage };
