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

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },

    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const upload = multer({ storage });

router.get("/stats", protect, authorize("admin"), getStats);

router.get("/", protect, getAllRecordings);

router.get("/:id", protect, getRecordingById);

router.post("/", protect, authorize("astrologer"), upload.single("file"), createRecording);

router.delete("/:id", protect, authorize("admin"), deleteRecording);

module.exports = router;