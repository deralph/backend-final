const mongoose = require("mongoose")
const asyncHandler = require("express-async-handler")
const Accounts = require("../../auth/model/account.model")
const Artists = require("../../artist/artist.model")
const InternalTeam = require("../../internalTeam/model/internalTeam.model")
const Tags = require("../../tags/tag.model")
const Perks = require("../../perks/model/perk.model")
const PerkCategory = require("../../perks/model/perkCategory.model")
const Roles = require("../../internalTeam/model/role.model")
const { createCampaignService } = require("../../campaign/services/campaign.services")
const { createProductService, assignProductToCampaignServiceMain } = require("../../products/services/product.service")

const ACCOUNT = require("../../../shared/constants/account")

const hashPassword = require("../../../shared/utils/hashPassword")

// Done
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

// Done
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
        }], { session })

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

// Done
const creatorsList = asyncHandler(async (req, res) => {

    const creatorsData = await Artists.aggregate([
        // Get the artist's account
        {
            $lookup: {
                from: "accounts",
                localField: "accountId",
                foreignField: "_id",
                as: "account"
            }
        },
        {
            $unwind: "$account"
        },

        // Get campaigns belonging to this artist
        {
            $lookup: {
                from: "campaigns",
                let: { artistId: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$artistId", "$$artistId"]
                            }
                        }
                    },

                    // Get tags belonging to each campaign
                    {
                        $lookup: {
                            from: "tags",
                            localField: "_id",
                            foreignField: "campaignId",
                            as: "tags"
                        }
                    },

                    // Calculate campaign-level analytics
                    {
                        $project: {
                            scanCount: { $ifNull: ["$scanCount", 0] },
                            tagCount: { $size: "$tags" }
                        }
                    }
                ],
                as: "campaigns"
            }
        },

        // Calculate creator-level values
        {
            $project: {
                _id: 0,

                name: {
                    $trim: {
                        input: {
                            $concat: [
                                "$firstName",
                                " ",
                                { $ifNull: ["$middleName", ""] },
                                " ",
                                "$lastName"
                            ]
                        }
                    }
                },

                email: "$account.email",

                totalCampaign: {
                    $size: "$campaigns"
                },

                totalTags: {
                    $sum: "$campaigns.tagCount"
                },

                totalScans: {
                    $sum: "$campaigns.scanCount"
                },

                accountStatus: "$account.accountStatus"
            }
        },

        // Get the summary figures
        {
            $facet: {
                creators: [
                    {
                        $project: {
                            name: 1,
                            totalCampaign: 1,
                            totalTags: 1,
                            totalScans: 1,
                            email: 1
                        }
                    }
                ],

                totalCreators: [
                    {
                        $count: "count"
                    }
                ],

                currentlyActive: [
                    {
                        $match: {
                            accountStatus: "active"
                        }
                    },
                    {
                        $count: "count"
                    }
                ]
            }
        }
    ]);

    const result = creatorsData[0];

    const data = {
        totalCreators: result.totalCreators[0]?.count || 0,

        currentlyActive: result.currentlyActive[0]?.count || 0,

        creators: result.creators
    };

    return res.status(200).json({
        success: true,
        message: "Creators retrieved successfully.",
        data
    });


    // const data = {
    //     totalCreators,
    //     currentlyActive,
    //     creators:[{ 
    //         name,
    //         totalCampaign,
    //         totalTags,
    //         totalScans,
    //         email,
    //     }]
    // }
})

// Done
const fansList = asyncHandler(async (req, res) => {

    const artistId = new mongoose.Types.ObjectId(req.params.artistId);

    const fans = await Tags.aggregate([
        // Get the campaign attached to each tag
        {
            $lookup: {
                from: "campaigns",
                localField: "campaignId",
                foreignField: "_id",
                as: "campaign"
            }
        },

        {
            $unwind: "$campaign"
        },

        // Only tags belonging to this artist's campaigns
        {
            $match: {
                "campaign.artistId": artistId,
                ownerId: { $ne: null }
            }
        },

        // One entry per unique fan
        {
            $group: {
                _id: "$ownerId"
            }
        },

        // Get the fan details
        {
            $lookup: {
                from: "fans",
                localField: "_id",
                foreignField: "_id",
                as: "fan"
            }
        },

        {
            $unwind: "$fan"
        },

        // Shape the response
        {
            $project: {
                _id: 0,
                id: "$fan._id",
                firstName: "$fan.firstName",
                lastName: "$fan.lastName",
                email: "$fan.email",
                phone: "$fan.phone",
                status: "$fan.status",
                consentGiven: "$fan.consentGiven"
            }
        },

        {
            $sort: {
                firstName: 1
            }
        }
    ]);

    return res.status(200).json({
        success: true,
        message: "Fans retrieved successfully.",
        data: fans
    });
});

// Done
const createPerkCategory = asyncHandler(async (req, res) => {

});

// Done . Artist actions by Admin
const createCampaign = asyncHandler(async (req, res) => {

    const session = mongoose.session()

    try {
        await session.startTransaction()
        const { artistId, campaignName, startDate, endDate, mediaType, status } = req.body

        const [campaign, campaignPerks] = await createCampaignService(artistId, campaignName, startDate, endDate, mediaType, status, session)


        // const activity = await logActivityService()

        await session.commitTransaction()

        return res.status(201).json({
            success: true,
            message: "Artist campaign created",
            createdBy: admin,
            data: { campaign }
        })
    }
    catch (error) {
        await session.abortTransaction()
        throw error
    }
    finally {
        await session.endSession()
    }

});

// Done
const createProduct = asyncHandler(async (req, res) => {
    const session = await mongoose.startSession()
    try {
        session.startTransaction()

        const {
            artistId,
            productName,
            productType, //collect name(as in "t-shirt") not Id
            productCode, // optional, not required if product type already exist.
            description,
            color,
            size,
            campaignId,
            productTier
        } = req.body;

        const [product, campaignProduct, tag, tagLink] = await createProductService(artistId, productName, productType, productCode, description, color, size, campaignId, productTier, session)

        // const activity = await logActivityService()

        await session.commitTransaction()

        return res.status(201).json({
            success: true,
            message: "Artist product created",
            createdBy: admin,
            data: { product, campaignProduct, tag, tagLink }
        })

    }
    catch (error) {
        await session.abortTransaction()
        throw error
    }
    finally {
        await session.endSession()
    }

});

// Done
const createPerk = asyncHandler(async (req, res) => {

    const {
        artistId,
        perkName,
        perkCategoryId,
        contentType,
        description,
    } = req.body;

    if (!perkName || !perkCategoryId || !contentType) {
        const error = new Error("Required fields missing");
        error.statusCode = 400;
        throw error;
    }

    // validate perks categoryId
    const isPerkCategoryValid = await PerkCategory.findById(perkCategoryId)
    if (!isPerkCategoryValid) {
        const error = new Error("Perk category does not exist");
        error.statusCode = 400;
        throw error;
    }

    const fileUrl = req.file?.path || req.fileUrl || req.body.fileUrl || null;
    if (!fileUrl) {
        const error = new Error("No file attached, file is required");
        error.statusCode = 400;
        throw error;
    }

    const perk = await Perks.create({
        artistId,
        perkName,
        perkCategoryId,
        contentType,
        fileUrl,
        description,
    });

    res.status(201).json({
        success: true,
        message: "Artist perk created successfully",
        data: perk,
    });
});

// Done
const assignProductToCampaign = asyncHandler(async (req, res) => {
    const session = await mongoose.startSession()
    try {
        session.startTransaction()
        const { artistId, productId, campaignId, tierId, variantId } = req.body;

        const [campaignProduct, tag, tagLink] = await assignProductToCampaignServiceMain(artistId, productId, campaignId, tierId, variantId, session)

        // const activity = await logActivityService()

        await session.commitTransaction()

        return res.status(201).json({
            success: true,
            message: "Artist's product assigned to campaign",  //to ChatGPT: how would you log a message for an action like this for a mission critical software
            // actionBy: admin,
            data: { campaignProduct, tag, tagLink }
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