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
const { createCampaignPerks, createCampaignProducts } = require("../services/campaign.services");


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
            }
        }

        // validate product existence ; Requirement changed: products are not added to campaign during campaign creation
        // for (let count = 0; count < products.length; count++) {   // perks = ["perkId1", "perkId2", ...,"perkIdn"]
        //     const isProductExist = await Products.findOne({ _id: products[count].productId, artistId: accountId }).session(session)
        //     if (!isProductExist) {
        //         const error = new Error(`Product of Id ${products[count]} does not exist`)
        //         error.statusCode = 400
        //         throw error
        //     }
        //     else if (!(await Tiers.findById(products[count].tierId))) {
        //         const error = new Error(`Invalid tierId assign to Product of Id ${products[count].productId}`)
        //         error.statusCode = 400
        //         throw error
        //     }
        // }

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

        //   create campaign products - Requirement changed: products are not added to campaign during campaign creation
        // await createCampaignProducts(products, newCampaign._id, session)

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

/*
const createCampaignProducts = asyncHandler(async (req, res) => {
    const { campaignId } = req.params;
    const accountId = req.user.accountId

    // collect data - campaignId and ProductIds
    // validate data
    // create campaign product

    const { products } = req.body;  //product = [{productId, tierId},...]

    // check if campaign exists
    const isCampaignExist = await Campaigns.findOne({ _id: campaignId })
    if (!isCampaignExist) {
        throwError("Campaign not found", 404)
    }
    // check if campaign hasn't exceeded endDate
    const today = new Date()
    const campaignEndDate = (new Date(isCampaignExist.endDate))
    if (today > campaignEndDate) {
        throwError("Action not applicable! Campaign already expired", 400)
    }

    // check for empty fields
    if (!products || product.length < 1) {
        throwError("Required fields missing", 400)
    }
    // verify each product existence
    for (let count = 0; count < products.length; count++) { //make code better
        const isProductExist = await Products.findById(products[count].productId)
        if (!isProductExist) {
            throwError(`Product does not exist. ProductId: ${products[count]}`, 404)
        }
    }


    // create campaign product,
    const campaignProducts = await Campaigns.create({
        campaignId,
        products,
    })
    if (!campaignProducts) {
        throwError("Internal error occured creating campaign products.", 500)
    }

    return res.status(201).json({ message: "Campaign products created successfully", campaignProducts })
})

const createCampaignPerks = asyncHandler(async (req, res) => {

    // collect data
    const { campaignId } = req.params;
    const accountId = req.user.accountId
    const { perks } = req.body

    // validate data
    // check if campaign exists
    const isCampaignExist = await Campaigns.findOne({ _id: campaignId })
    if (!isCampaignExist) {
        throwError("Campaign not found", 404)
    }
    // check if campaign hasn't exceeded endDate
    const today = new Date()
    const campaignEndDate = (new Date(isCampaignExist.endDate))
    if (today > campaignEndDate) {
        throwError("Action not applicable! Campaign already expired", 400)
    }

    // create perks
    const campaignPerks = await campaignPerks.create({ campaignId, campaignPerks: perks })
    if (!campaignPerks) {
        throwError("Internal error occured creating campaign perks.", 500)
    }

    return res.status(201).json({ message: "Campaign perks created successfully", campaignPerks })

})
*/




module.exports = {
    createCampaign,
    createCampaignPage,
    createCampaignPerks,
}