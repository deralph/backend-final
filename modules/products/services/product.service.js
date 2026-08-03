const ProductVariants = require("../models/productVariant.model")
const Campaigns = require("../../campaign/model/campaign.model")
const campaignProducts = require("../../campaign/model/campaignProducts.model")

//create product variant
const createProductVariant = async (productId, color, size, sku, session) => {
    const [variant] = await ProductVariants.create([{ productId, colorId: color, sizeId: size, sku }], { session })
    return variant
}


// Assign product to campaign
async function assignProductToCampaign(productId, campaignId, tierId, session) {
    // check if product already exist, do not re-add - skip to tag creation
    const productAlreadyInCampaign = await campaignProducts.findOne({ campaignId: campaignId, product: productId }).session(session)

    if (!productAlreadyInCampaign) { //if product already in campaign, do not re-add, create Tag and generate link.
        const campaignProduct = await campaignProducts.create([{ campaignId, product:productId, tierId }], { session })
        return campaignProduct[0]
    }
}


module.exports = { createProductVariant, assignProductToCampaign }