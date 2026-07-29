const ProductVariants = require("../models/productVariant.model")
const Campaigns = require("../../campaign/model/campaignProducts.model")

//create product variant
const createProductVariant = async (productId, color, size, sku, session) => {
    const [variant] = await ProductVariants.create([{ productId, colorId: color, sizeId: size, sku }], { session })
    return variant
}


// Assign product to campaign
async function assignProductToCampaign(productId, campaignId, tierId, session) {
    // check if product already exist, do not re-add - skip to variant addition
    const productAlreadyInCampaign = await CampaignProducts.findOne({ _id: campaignId, product: productId }).session(session)
    if (!productAlreadyInCampaign) { //if product already in campaign, do not re-add, create Tag and generate link.
        const [campaignProduct] = await CampaignProducts.create([{ campaignId, productId, tierId }], { session })
        return campaignProduct
    }
}


module.exports = { createProductVariant, assignProductToCampaign }