const asyncHandler = require("express-async-handler");
const Products = require("../../products/models/product.model")
const Perks = require("../../perks/model/perk.model")
const Campaigns = require("../model/campaign.model")
const campaignPerks = require("../model/campaignPerks.model")
const generateTag = require("../../tags/tag.model")
const throwError = require("../../../shared/utils/throwError")


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

    const accountId = req.user.accountId

    // create campaign
    const {
        campaignName,
        products,
        perks,
        socialLinks,
        startDate,
        endDate,
        pageStructure,
        status,
    } = req.body;

    if (
        !campaignName ||
        !products ||
        products.length === 0 ||
        !perks ||
        perks.length === 0 ||
        !startDate ||
        !endDate ||
        !pageStructure
    ) {
        throwError("Required fields missing", 400)
    }

    // validate if product and perks exist
    const isProductsExist = await Products.find({ _id: { $in: products }, artistId: accountId });
    if (isProductsExist.length !== products.length) {
        const error = new Error("One or more products do not exist");
        error.statusCode = 400;
        throw error;
    }

    const isPerksExist = await Perks.find({ _id: { $in: perks }, artistId: accountId });
    if (isPerksExist.length !== perks.length) {
        const error = new Error("One or more perks do not exist");
        error.statusCode = 400;
        throw error;
    }

    const newCampaign = await Campaigns.create({
        artistId: accountId,
        campaignName,
        products,
        perks,
        socialLinks,
        startDate,
        endDate,
        pageStructure,
        status
    });

    if (!newCampaign) {
        const error = new Error("Error occured whilecreating campaign");
        error.statusCode = 500;
        throw error;
    }

    // generate campaign unique url
    const campaignUrl = `${process.env.WEB_APP_URL}/campaigns/${newCampaign._id}`;

    res.status(201).json({
        message: "Campaign created successfully",
        campaign: newCampaign,
        campaignUrl
    });

})

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

const generateCampaignProductTags = asyncHandler(async (req, res) => {
    /* requirements;
        - campaignProductId
        - Qty(Max 10)
    */

        
})




module.exports = {
    createCampaign,
    createCampaignProducts,
    createCampaignPerks,
    generateCampaignProductTags
}