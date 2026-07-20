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
            required: true,
            trim: true,
        },

        socialLinks: [
            {
                platform: { type: String, required: true },
                url: { type: String, required: true }
            }
        ],

        startDate: {
            type: Date,
            required: true,
        },

        endDate: {
            type: Date,
            required: true,
        },

        pageStructure: {
            type: mongoose.Schema.Types.Mixed,
            required: true,
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