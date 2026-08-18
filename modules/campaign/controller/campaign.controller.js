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
const { createCampaignService, createCampaignPageService, createCampaignPerks } = require("../services/campaign.services");


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

        const [campaign, campaignPerks] = await createCampaignService(accountId, campaignName, startDate, endDate, mediaType, status, session)

        // commit transaction
        await session.commitTransaction()

        // return response
        res.status(201).json({
            message: "Campaign created successfully",
            campaign
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

    const campaignPage = await createCampaignPageService(accountId, campaignId, pageStructure)

    return res.status(201).json({
        success: true,
        message: "Campaign page created",
        data: {
            campaignPage
        }
    })
})


const getCampaigns = asyncHandler(async (req, res) => {
    const artistId = req.user.accountId;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const { search, status } = req.query;

    const filter = {
        artistId
    };

    if (search) {
        filter.campaignName = {
            $regex: search,
            $options: "i"
        };
    }

    if (status) {
        filter.status = status;
    }

    const [campaigns, total] = await Promise.all([
        Campaigns.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),

        Campaigns.countDocuments(filter)
    ]);

    return res.status(200).json({
        success: true,
        message: "Campaigns retrieved successfully.",
        data: campaigns,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            hasNextPage: page < Math.ceil(total / limit),
            hasPreviousPage: page > 1
        }
    });
});





module.exports = {
    createCampaign,
    createCampaignPage,
    getCampaigns
}