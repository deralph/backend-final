const mongoose = require("mongoose")
const Tags = require("../tags/tag.model")
const Fans = require("../fan/fan.model")
const Campaigns = require("../campaign/model/campaign.model.js")
const CampaignPerks = require("../campaign/model/campaignPerks.model.js")
const { createFan } = require("../fan/fan.service")
const { activateTag } = require("../tags/tag.services")
const asyncHandler = require("express-async-handler")
const validateObjectId = require("../../utils/objectIdValidators")
const { tapTag } = require("../tap/tap.service")
const generateJWT = require("../../shared/utils/JWT")



const tap = asyncHandler(async (req, res) => {

    const { tagId } = req.params
    const { owner } = req

    const tag = await validateObjectId(tagId, Tags, "tag")
    owner && await validateObjectId(owner.id, Fans, "owner")

    // validate NFC
    const NFCTag = await Tags.findById(tagId)  //_id, tagId
    const isNFCActivated = NFCTag.status == "activated"

    // is user owner of NFC tag in action 
    const isOwnerValid = owner && (NFCTag.ownerId == owner.id)  //ownerToken - _id from Fan's model or owner from tag model

    // if NFC is activated and owner's token is valid, subsequent tap - grant access to campaign page
    if (isNFCActivated && isOwnerValid) {  //synonymous to Login
        const tapToken = await generateJWT({ tagId }, "tapToken")


        await tapTag(tagId, owner?.id, true, req.body.deviceType, "subsequent", req.body.location)
        await Tags.findByIdAndUpdate(tagId, { $inc: { tapCount: 1 }, lastTappedAt: new Date() })
        await Campaigns.findByIdAndUpdate(
            tag.campaignId,
            {
                $inc: { tapCount: 1 },
                $inc: { scanCount: 1 }
            }
        )

        return res.status(200).json({
            success: true,
            message: "Tap successful, welcome back!",
            tapToken
        })
    }

    // if NFC is not activated and no owner's token, fresh tap - initiate tag activation process
    if (!isNFCActivated && !isOwnerValid) {  //synonymous to signup
        // update 
        // tagModel - tapCount, lastTappedAt
        // campaignModel - tapCount, tagCount, scanCount, claims, conversionRate

        await tapTag(tagId, owner?.id, true, req.body.deviceType, "fresh", req.body.location)
        await Tags.findByIdAndUpdate(tagId, { $inc: { tapCount: 1 }, lastTappedAt: new Date() })
        await Campaigns.findByIdAndUpdate(
            tag.campaignId,
            {
                $inc: { tapCount: 1 },
                $inc: { scanCount: 1 },
            }
        )

        const tapToken = generateJWT({ tagId }, "tapToken")

        return res.status(200).json({
            success: true,
            message: "Fresh tap detected. Proceed to activate",
            tapToken
        })
    }

    // if NFC is activated and owner's token is not valid, reject - strange access
    if (isNFCActivated && !isOwnerValid) {
        await tapTag(tagId, owner?.id, true, req.body.deviceType, "illegal", req.body.location)
        await Tags.findByIdAndUpdate(tagId, { $inc: { tapCount: 1 }, lastTappedAt: new Date() })
        await Campaigns.findByIdAndUpdate(
            tag.campaignId,
            {
                $inc: { tapCount: 1 },
                $inc: { scanCount: 1 }
            }
        )

        const error = new Error("Access denied! Merch claimed by another fan")
        error.statusCode = 403
        throw error
    }

})


const activateMerch = asyncHandler(async (req, res) => {

    const session = await mongoose.startSession()

    session.startTransaction()

    // validate that tag hasn't been activated
    const tagId = req.tag.id
    const tag = await Tags.findById(tagId).session(session)
    const hasTagBeenActivated = tag.status === "activated"

    // register owner
    const { owner } = req
    owner && await validateObjectId(owner.id, Fans, "owner")

    try {

        if (!hasTagBeenActivated) {

            const { firstName, lastName, email, phone, deviceType, location, consentGiven } = req.body;

            // if not owner, register fan
            let fan
            if (!owner) {
                fan = await createFan(firstName, lastName, email, phone, consentGiven, session)
            }
            else if (owner) {
                fan = await Fans.findById(owner.id)
            }

            // activate tag
            const activatedTag = await activateTag(tagId, fan._id, location, deviceType, session)

            // track tap
            await tapTag(tagId, fan._id, true, deviceType, location, session)

            // update campaign
            await Campaigns.findByIdAndUpdate(
                tag.campaignId,
                {
                    $inc: { tagCount: 1 },
                    $inc: { claims: 1 },
                },
                { afterDocument: true, runValidators: true }
            )


            const tapToken = await generateJWT({ tagId }, "tapToken")

            await session.commitTransaction()

            return res.status(201).json({
                success: true,
                message: "Tag activation successful",
                data: {
                    activatedTag,
                    tapToken
                }
            })
        }

        const error = new Error("Action denied on activated tag.")
        error.statusCode = 400
        throw error
    }
    catch (error) {
        await session.abortTransaction()
        throw error
    }
    finally {
        session.endSession()
        await Tags.findByIdAndUpdate(tagId, { $inc: { tapCount: 1 }, lastTappedAt: new Date() })
    }
})


const getCampaignPageResources = asyncHandler(async (req, res) => {

    const tagId = req.tag.id
    const { owner } = req
    await validateObjectId(owner.id, Fans, "owner")

    const tag = await Tags.findOne({ _id: tagId, ownerId: owner.id })
    if (!tag) {
        const error = new Error("Tag not found")
        error.statusCode = 401
        throw error
    }

    const campaignId = tag.campaignId
    const campaignPageResources = await CampaignPerks.find({ campaignId }).populate("perkId")

    return res.status(200).json({
        success: true,
        message: "Campaign resources retrieved",
        data: campaignPageResources
    })

})


const getCampaignPageResource = asyncHandler(async (req, res) => {

    const { resourceId } = req.params  //resourceId = campaignPerk _id
    await validateObjectId(resourceId, CampaignPerks, "resource")

    const campaignPageResource = await CampaignPerks.findById(resourceId).populate("perkId")

    return res.status(200).json({
        success: true,
        message: "Campaign resource retrieved",
        data: campaignPageResource
    })

})




module.exports = {
    tap,
    activateMerch,
    getCampaignPageResources,
    getCampaignPageResource
}