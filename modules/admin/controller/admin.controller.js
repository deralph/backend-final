const mongoose = require("mongoose")
const asyncHandler = require("express-async-handler")
const Accounts = require("../../auth/model/account.model")
const Artists = require("../../artist/artist.model")
const InternalTeam = require("../../internalTeam/model/internalTeam.model")
const Roles = require("../../internalTeam/model/role.model")

const ACCOUNT = require("../../../shared/constants/account")

const hashPassword = require("../../../shared/utils/hashPassword")


const registerStaff = asyncHandler(async (req, res) => {

    const session = await mongoose.startSession()

    try {
        session.startTransaction()
        // RBAC implementated befor here
        const user = req.user

        // get data
        const { firstName, middleName, lastName, userName, email, phone, password, roleId } = req.body

        const roleExists = await Roles.findById(roleId).session(session)
        if (!roleExists) {
            const error = new Error("Invalid role")
            error.statusCode = 400
            throw error
        }

        const isEmailExist = await Accounts.findOne({ email }).session(session)
        if (isEmailExist) {
            const error = new Error("Email already registered with another account")
            error.statusCode = 400
            throw error
        }

        const isPhoneExist = await Accounts.findOne({ phone }).session(session)
        if (isPhoneExist) {
            const error = new Error("Phone number already registered with another account")
            error.statusCode = 400
            throw error
        }

        // hash password
        const hashedPassword = await hashPassword(password)

        // create staff
        const [newAccount] = await Accounts.create([{
            email,
            phone,
            userName,
            password: hashedPassword,
            accountType: ACCOUNT.TYPE.INTERNAL_TEAM,
        }], { session })
        if (!newAccount) {
            const error = new Error("Something went wrong creating account")
            error.statusCode = 500
            throw error
        }

        const [internalTeamAccount] = await InternalTeam.create([{
            accountId: newAccount._id,
            firstName,
            middleName,
            lastName,
            roleId
        }], { session })
        if (!internalTeamAccount) {
            const error = new Error("Something went wrong creating account")
            error.statusCode = 500
            throw error
        }

        // log action


        await session.commitTransaction()

        return res.status(201).json({
            message: "Internal team account created successfully",
            success: true,
            data: {
                firstName: internalTeamAccount.firstName,
                middleName: internalTeamAccount.middleName,
                lastName: internalTeamAccount.lastName,
                email: newAccount.email,
                isEmailConfirmed: internalTeamAccount.isEmailConfirmed,
                accountType: newAccount.accountType,
                accountStatus: newAccount.accountStatus,
                roleId: internalTeamAccount.roleId
            }
        })
    }
    catch (error) {
        await session.abortTransaction()
        throw error
    }
    finally {
        await session.endSession()
    }

})

const dashboard = asyncHandler(async (req, res) => {

})

const createCreator = asyncHandler(async (req, res) => {
    const session = await mongoose.startSession()
    try {
        session.startTransaction()
        // collect req data
        const { firstName, middleName, lastName, userName, email, phone, password } = req.body

        const isEmailExist = await Accounts.findOne({ email }).session(session)
        if (isEmailExist) {
            const error = new Error("Email already registered with another account")
            error.statusCode = 400
            throw error
        }

        const isPhoneExist = await Accounts.findOne({ phone }).session(session)
        if (isPhoneExist) {
            const error = new Error("Phone number already registered with another account")
            error.statusCode = 400
            throw error
        }

        // hash password
        const hashedPassword = await hashPassword(password)

        // create account
        const [account] = await Accounts.create([{
            userName,
            email,
            phone,
            password: hashedPassword,
            accountType: ACCOUNT.TYPE.ARTIST,
        }], { session })
        if (!account) {
            const error = new Error("Internal server error occured creating artist")
            error.statusCode = 500
            throw error
        }

        // register artist
        const [artist] = await Artists.create([{
            accountId: account._id,
            firstName,
            middleName,
            lastName,
        }], {session})

        if (!artist) {
            const error = new Error("Internal server error occured creating artist")
            error.statusCode = 500
            throw error
        }

        // log action

        await session.commitTransaction()

        return res.status(201).json({
            message: "Artist account created successfully",
            success: true,
            data: {
                firstName: artist.firstName,
                middleName: artist.middleName,
                lastName: artist.lastName,
                userName: account.userName,
                email: account.email,
                isEmailConfirmed: artist.isEmailConfirmed,
                accountType: account.accountType,
                accountStatus: account.accountStatus
            }
        })
    }
    catch (error) {
        await session.abortTransaction()
        throw error
    }
    finally {
        await session.endSession()
    }
})

const creatorsList = asyncHandler(async (req, res) => {

    const data = {
        totalCreators,
        currentlyActive,
        creators:[{ 
            name,
            totalCampaign,
            totalTags,
            email,
        }]
    }
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