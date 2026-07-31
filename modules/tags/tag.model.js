const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema(
    {
        tagId: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        campaignId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "campaigns",
            required: true
        },


        productVariantId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product-variants",
            required: true
        },

        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "fans",
            default: null
        },

        tapCount: {
            type: Number,
            default: 0,
            min: 0
        },

        lastTappedAt: {
            type: Date,
            default: null
        },

        status: {
            type: String,
            enum: ["unassigned", "assigned", "activated", "disabled"],
            default: "unassigned"
        },

        activatedAt: {
            type: Date,
            default: null
        },

        claimedAt: {
            type: Date,
            default: null
        }
    },
    { timestamps: true }
);

tagSchema.index({ uid: 1 }, { unique: true });
tagSchema.index({ campaignProductVariantId: 1 });
tagSchema.index({ ownerId: 1 });

const Tags = mongoose.model("tags", tagSchema);
module.exports = Tags