const mongoose = require("mongoose")
const asyncHandler = require("express-async-handler");
const Products = require("../../products/models/product.model")
const Perks = require("../../perks/model/perk.model")
const Campaigns = require("../model/campaign.model")
const CampaignPages = require("../model/campaignPage.model")
const campaignPerks = require("../model/campaignPerks.model")
const Tiers = require("../../tier/tier.model")
const generateTag = require("../../tags/tag.model")
const throwError = require("../../../shared/utils/throwError")
const { createCampaignPerks } = require("../services/campaign.services");


// Validators
// isCampaignExist
async function isCampaignExist(campaignId) {
    const isCampaignExist = await Campaigns.findOne({ _id: campaignId })
    if (!isCampaignExist) {
        return false
    }
    return true
}


const createCampaign = asyncHandler(async (req, res) => {
    const session = await mongoose.startSession()
    try {
        session.startTransaction()
        const accountId = req.user.accountId

        // collect data
        const {
            campaignName,
            startDate,
            endDate,
            perks,
            // products, Requirement changed: field eliminated, products are not added to campaign during campaign creation
            media,
            mediaType,
            mediaUrl, // for already uploaded media i.e where mediaType == "Link"
            status,
        } = req.body;

        // campaign Name must be unique
        const isCampaignExist = await Campaigns.findOne({campaignName}).session(session)
        if(isCampaignExist){
            const error = new Error(`"${campaignName}" is not available, name already used.`);
            error.statusCode = 400;
            throw error;
        }

        // validate uploaded file
        if (["audio", "video", "image", "document"].includes(mediaType) && !req.file) {
            const error = new Error("Media file is missing");
            error.statusCode = 400;
            throw error;
        }

        // validate perks existence
        for (let count = 0; count < perks.length; count++) {   // perks = ["perkId1", "perkId2", ...,"perkIdn"]
            const isPerkExist = await Perks.findOne({ _id: perks[count], artistId: accountId }).session(session)
            if (!isPerkExist) {
                const error = new Error(`Perk of Id ${perks[count]} does not exist`)
                error.statusCode = 400
                throw error
            }
        }

        // upload media to cdn
        let fileUrl
        if (mediaType != "link") {
            fileUrl = ""   //upload to cloudinary
        }


        // create campaign
        const [newCampaign] = await Campaigns.create([{
            artistId: accountId,
            campaignName,
            startDate,
            endDate,
            mediaType,
            fileUrl: fileUrl || mediaUrl,
            status
        }], { session });

        // create campaign perks
        await createCampaignPerks(perks, newCampaign._id, session)

        // commit transaction
        await session.commitTransaction()

        // return response
        res.status(201).json({
            message: "Campaign created successfully",
            campaign: newCampaign
        });
    }
    catch (error) {
        await session.abortTransaction()
        throw error
    }
    finally {
        await session.endSession()
    }

})

const createCampaignPage = asyncHandler(async (req, res) => {
    const accountId = req.user.accountId
    const { campaignId } = req.params
    const { pageStructure } = req.body

    if (!(await Campaigns.findOne({ _id: campaignId, artistId: accountId }))) {
        const error = new Error("Campaign not found")
    }

    const campaignPage = await CampaignPages.create({
        campaignId,
        pageStructure
    })

    return res.status(201).json({
        success: true,
        message: "Campaign page created",
        data: {
            campaignPage
        }
    })
})







module.exports = {
    createCampaign,
    createCampaignPage,
}