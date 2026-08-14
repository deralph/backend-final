const express = require("express")
const router = express.Router()
const {getTags, getCampaignTags} = require("./tags.controller")


router.get("/", getTags)


router.get("/:campaignId", getCampaignTags)


