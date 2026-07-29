const CampaignPerks = require("../model/campaignPerks.model")
const CampaignProducts = require("../model/campaignProducts.model")



async function createCampaignPerks(perkIds, campaignId, session) {
    const campaignPerksData = {
        campaignId,
        perks: perkIds
    }
    const [campaignPerks] = await CampaignPerks.create([campaignPerksData], { session })
    return campaignPerks
}

async function createCampaignProduct(productId, campaignId, session) {

    // check if product already exist, do not re-add - skip to variant addition
    const isProductAlreadyInCampaign = await CampaignProducts.findOne({ _id: campaignId, product: productId }).session(session)
    if (!sProductAlreadyInCampaign) {
        const [campaignProduct] = await CampaignProducts.create([campaignProductsData], { session })
        return campaignProduct
    }
}




module.exports = { createCampaignPerks, createCampaignProduct }