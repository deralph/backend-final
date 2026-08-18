const express = require("express")
const router = express.Router()
const {getTags, getCampaignTags, getArtistTags} = require("./tags.controller")
const auth = require("../../middleware/auth.middleware.js")


router.get("/", getTags)

router.get("/:campaignId", getCampaignTags)

router.get("/artist-all-tags", auth, getArtistTags)



module.exports = router
