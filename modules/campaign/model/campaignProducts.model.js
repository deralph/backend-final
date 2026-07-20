const mongoose = require("mongoose");


const campaignProductsSchema = new mongoose.Schema({

    campaignId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "campaigns",
        required: true,
    },

    products: {
        type: [{
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "products", required: true },
            tierId: { type: mongoose.Schema.Types.ObjectId, ref: "tiers", required: true }
        }],
        required: true
    }
},
    {
        timestamps: true,
    }
)


const campaignProducts = mongoose.model("campaign-products", campaignProductsSchema)
module.exports = campaignProducts


/*

campaignId,
products: [{productId, tierId}],


*/