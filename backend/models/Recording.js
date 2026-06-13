const mongoose = require("mongoose");

const recordingSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },

        consultantName: {
            type: String,
            required: true,
        },

        clientName: {
            type: String,
            required: true,
        },

        notes: {
            type: String,
        },

        consultationDate: {
            type: Date,
            required: true,
        },

        fileUrl: {
            type: String,
            required: true,
        },

        fileType: {
            type: String,
            required: true,
        },
        publicId: {
            type: String,
        },
        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        clientEmail: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Recording", recordingSchema);