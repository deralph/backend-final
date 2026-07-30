const CampaignPerks = require("../model/campaignPerks.model")
const CampaignProducts = require("../model/campaignProducts.model")



async function createCampaignPerks(perkIds, campaignId, session) {

    // validate if perks already exist in campaign
   const existingPerk = await CampaignPerks.findOne({
    campaignId,
    perkId: { $in: perkIds }
}).session(session);
if (existingPerk) {
    const error = new Error("Duplicate perk error. One or more perks already exist in campaign");
    error.statusCode = 400
    throw error
}

let campaignPerksData = []
for(let count = 0; count < perkIds.length ; count++){
    const data = {
        campaignId: campaignId,
        perkId: perkIds[count]
    }
    campaignPerksData.push(data)
}

    const campaignPerks = await CampaignPerks.insertMany(campaignPerksData, { session })
    return campaignPerks
}





module.exports = { createCampaignPerks }