const Recording = require("../models/Recording");
const User = require("../models/User");
const { cloudinary } = require("../config/cloudinary");

exports.getAllRecordings = async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { clientName: { $regex: search, $options: "i" } },
                { consultantName: { $regex: search, $options: "i" } },
            ];
        }

        if (req.user?.role === "astrologer") {
            query.uploadedBy = req.user._id;
        } else if (req.user?.role === "member") {
            query.clientEmail = req.user.email;
        }

        const recordings = await Recording.find(query)
            .populate("uploadedBy", "name email")
            .sort({
                createdAt: -1,
            });

        res.status(200).json(recordings);
    } catch (error) {
        console.error("Error fetching recordings:", error);
        res.status(500).json({
            message: "Failed to fetch recordings",
            error: error.message,
        });
    }
};

exports.getRecordingById = async (req, res) => {
    try {
        const recording = await Recording.findById(req.params.id);

        if (!recording) {
            return res.status(404).json({
                message: "Recording not found",
            });
        }

        res.status(200).json(recording);
    } catch (error) {
        console.error("Error fetching recording details:", error);
        res.status(500).json({
            message: "Failed to fetch recording details",
            error: error.message,
        });
    }
};

exports.createRecording = async (req, res) => {
    try {
        console.log("--- Create Recording Debug ---");
        console.log("req.body:", req.body);
        console.log("req.file:", req.file ? {
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            path: req.file.path,
            size: req.file.size
        } : "MISSING");

        if (!req.file) {
            return res.status(400).json({ message: "Please upload a file" });
        }

        const recording = new Recording({
            title: req.body.title,
            consultantName: req.body.consultantName,
            clientName: req.body.clientName,
            notes: req.body.notes,
            consultationDate: req.body.consultationDate,
            fileUrl: req.file.path,
            fileType: req.file.mimetype,
            publicId: req.file.filename, 
            uploadedBy: req.user._id,
            clientEmail: req.body.clientEmail,
        });

        const savedRecording = await recording.save();
        res.status(201).json(savedRecording);
    } catch (error) {
        console.error("DEBUG - Error creating recording:", error);
        res.status(500).json({
            message: "Failed to create recording",
            error: error.message,
        });
    }
};

exports.deleteRecording = async (req, res) => {
    try {
        const recording = await Recording.findById(req.params.id);

        if (!recording) {
            return res.status(404).json({ message: "Recording not found" });
        }

        if (recording.publicId) {
            await cloudinary.uploader.destroy(recording.publicId, {
                resource_type: recording.fileType.startsWith('video') ? 'video' : 'raw'
            });
        }

        await Recording.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Recording deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting recording:", error);
        res.status(500).json({
            message: "Failed to delete recording",
            error: error.message,
        });
    }
};


exports.getStats = async (req, res) => {
    try {
        const totalRecordings = await Recording.countDocuments();
        const totalUsers = await User.countDocuments();

        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const thisMonthRecordings = await Recording.countDocuments({
            createdAt: { $gte: startOfMonth }
        });

        const uniqueClients = await Recording.distinct("clientName");

        res.status(200).json({
            totalRecordings,
            totalUsers,
            thisMonthRecordings,
            totalClients: uniqueClients.length
        });
    } catch (error) {
        console.error("Error fetching stats:", error);
        res.status(500).json({
            message: "Failed to fetch stats",
            error: error.message,
        });
    }
};
