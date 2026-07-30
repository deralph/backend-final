const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema(
    {
        artistId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "artists",
            required: true,
        },

        campaignName: {
            type: String,
            unique: true,
            required: true,
            trim: true,
        },

        startDate: {
            type: Date,
            required: true,
        },

        endDate: {
            type: Date,
            required: true,
        },

        mediaType: {
            type: String,
            required: false,
            enum: ["audio", "video", "image", "link", "document"],
        },

        fileUrl: {
            type: String,
            trim: true,
            required: false
        },

        status: {
            type: String,
            enum: ["draft", "active", "paused"],
            default: "draft",
        }
    },
    {
        timestamps: true,
    }
);

const Campaigns = mongoose.model("campaigns", campaignSchema);

module.exports = Campaigns;