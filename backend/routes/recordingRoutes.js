const express = require("express");
const multer = require("multer");

const {
    getAllRecordings,
    getRecordingById,
    createRecording,
    deleteRecording,
    getStats,
} = require("../controllers/recordingController");
const { protect, authorize } = require("../middleware/authMiddleware");

const { storage } = require("../config/cloudinary");

const router = express.Router();

const upload = multer({ storage });

router.get("/stats", protect, authorize("admin"), getStats);

router.get("/", protect, getAllRecordings);

router.get("/:id", protect, getRecordingById);

router.post("/", protect, authorize("astrologer"), (req, res, next) => {
    upload.single("file")(req, res, (err) => {
        if (err) {
            console.error("MULTER/CLOUDINARY ERROR:", JSON.stringify(err, null, 2) || err);
            return res.status(500).json({
                message: "Cloud upload failed",
                error: err.message || err
            });
        }
        next();
    });
}, createRecording);

router.delete("/:id", protect, authorize("admin"), deleteRecording);

module.exports = router;