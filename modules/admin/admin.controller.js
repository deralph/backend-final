const asyncHandler = require("express-async-handler")



const createRole = asyncHandler(async (req, res) => {

})

const getRoles = asyncHandler(async (req, res) => {

})

const registerStaff = asyncHandler(async (req, res) => {

})

const dashboard = asyncHandler(async (req, res) => {

})

const createCreator = asyncHandler(async (req, res) => {

})

const creatorsList = asyncHandler(async (req, res) => {

})

const fansList = asyncHandler(async (req, res) => {

})

const createPerkCategory = asyncHandler(async (req, res) => {

})


// Artist actions by Admin
const createCampaign = asyncHandler(async (req, res) => {

    const campaign = await createCampaignService(artistId, campaignData)

    const activity = await logActivityService()

    return res.status(201).json({
        success: true,
        message: "Artist campaign created",  //to ChatGPT: how would you log a message for an action like this for a mission critical software
        createdBy: admin,
        data: { campaign, activityLog }
    })

})

const createProduct = asyncHandler(async (req, res) => {

    const product = await createProductService(artistId, productData, variantData)

    const activity = await logActivityService()

    return res.status(201).json({
        success: true,
        message: "Artist product created",  //to ChatGPT: how would you log a message for an action like this for a mission critical software
        createdBy: admin,
        data: { product, activityLog }
    })

})

const createPerk = asyncHandler(async (req, res) => {

    const perk = await createPerkService(artistId, perkData)

    const activity = await logActivityService()

    return res.status(201).json({
        success: true,
        message: "Artist perk created",  //to ChatGPT: how would you log a message for an action like this for a mission critical software
        createdBy: admin,
        data: { perk, activityLog }
    })

})

const assignProductToCampaign = asyncHandler(async (req, res) => {

    const campaignProduct = await assignProductToCampaignService(artistId, data)

    const activity = await logActivityService()

    return res.status(201).json({
        success: true,
        message: "Artist product assigned to campaign",  //to ChatGPT: how would you log a message for an action like this for a mission critical software
        actionBy: admin,
        data: { campaignProduct, activityLog }
    })

})

const assignPerkToCampaign = asyncHandler(async (req, res) => {

    const campaignPerk = await assignPerkToCampaignService(artistId, data)

    const activity = await logActivityService()

    return res.status(201).json({
        success: true,
        message: "Artist perk assigned to campaign",  //to ChatGPT: how would you log a message for an action like this for a mission critical software
        actionBy: admin,
        data: { campaignPerk, activityLog }
    })

})






module.exports = {
    createRole,
    getRoles,
    registerStaff,
    dashboard,
    createCreator,
    creatorsList,
    fansList,
    createPerkCategory,

    // Artist actions by Admin
    createCampaign,
    createProduct,
    createPerk,
    assignProductToCampaign,
    assignPerkToCampaign
}