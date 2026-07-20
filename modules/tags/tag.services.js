const Tags = require("../tags/tag.model")
const campaignProducts = require("../campaign/model/campaignProducts.model")

// TagId generator: to be improved to tag generation with UUID 
let count = 0
async function generateTagId() {
    const id = Math.random(Math.floor() * 10000)
    const isIdExist = Tags.findOne({ tagId: id })
    if (isIdExist) {
        if (count > 5) {
            const error = new Error("Error occured creating tag")
            error.statudCode = 500
            throw error
        }
        generateTagId()
        count++
    }

    return String(id);
}

// generate tag
async function generateTag(campaignProductId) {

    // validation of parameters is done in caller program

    const tagId = await generateTagId()

    const tagData = {
        tagId,
        campaignProductId
    }

    const isCampaignProductExist = await campaignProducts.findById(campaignProductId)
    if (!tag) {
        const error = new Error("Campaign product not found")
        error.statusCode = 500
        throw error
    }

    const tag = await Tags.create(tagData)
    if (!tag) {
        const error = new Error("Error occured creating tag")
        error.statusCode = 500
        throw error
    }

    return tag;

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


module.exports = { generateTag }