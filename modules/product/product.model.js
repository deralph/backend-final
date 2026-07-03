const mongoose = require("mongoose")

const productSchema = new mongoose.Schema(
    {
        artistId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            required: true
        },

        productName: {
            type: String,
            required: true,
            trim: true,
        },

        productType: {
            type: String,
            required: true,
        },

        color: {
            type: String,
            required: true,
            trim: true,
        },

        size: {
            type: String,
            required: true,
            trim: true,
        },

        sku: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            uppercase: true,
        },

        batchNumber: {
            type: String,
            required: true,
            trim: true,
        },

        productId: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        tagId: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        campaignId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "campaigns",
        }
    },
    {
        timestamps: true,
    }
);

const Products = mongoose.model("products", productSchema);

module.exports = Products;