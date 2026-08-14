const Tags = require("../tags/tag.model")
const campaignProducts = require("../campaign/model/campaignProducts.model")
const TagCounts = require("./tagCounter.model")

// generate tag
async function generateTag(campaignId, productVariantId, tierId, session) {
    // validation of parameters is done in caller program

    // Tags.createIndexes()

    // create tagId
    let tagCount
    tagCount = await TagCounts.findOne().session(session)
    if (!tagCount) {
        [tagCount] = await TagCounts.create([{}], { session })
    }

    count = tagCount.nextNumber
    const tagId = "NFC" + "-" + String(count).padStart(3, "0")

    // collate tag data
    const tagData = {
        tagId,
        campaignId,
        productVariantId,
        tierId
    }

    // create tag
    const [tag] = await Tags.create([tagData], { session })
    if (!tag) {
        const error = new Error("Error occured creating tag")
        error.statusCode = 500
        throw error
    }

    // update tag counter logic
    await TagCounts.findOneAndUpdate({ _id: tagCount._id }, { $inc: { nextNumber: 1 } }, { session })

    return tag;
}

async function activateTag(tagId, ownerId, location, deviceType, session) {

    const activationData = {
        ownerId,
        lastTappedAt: new Date(),
        status: "activated",
        activatingLocation: { country: location.country, state: location.state, city: location.city },
        activatedAt: new Date(),
        claimedAt: new Date(),
        activatingDevice: deviceType
    }


    const activatedTag = await Tags.findOneAndUpdate(
        { _id: tagId },
        {
            $set: activationData,
            $inc: {
                tapCount: 1
            }
        },
        { returnDocument: "after", runValidators: true, session }
    )

    return activatedTag
}


// retrieve tag
async function retrieveTag(tagId) {
    const tag = await Tag.findById(tagId)
    if (!tag) {
        const error = new Error("Tag not found")
        error.statusCode = 404
        throw error
    }

    return tag
}

// retrieve tags. Write functions to get tags by: campaign, artist, all tags



// disable tag
async function retrieveTag(tagId) {
    // verification done in caller program
    const tag = await Tag.findByIdAndUpdate(tagId, { status: "disable" }, { new: true, runValidators: true })
    if (!tag) {
        const error = new Error("Tag not found")
        error.statusCode = 404
        throw error
    }

    return tag
}


module.exports = { generateTag, activateTag }