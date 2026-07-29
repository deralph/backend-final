const express = require('express');
const router = express.Router();
const { createCampaign, createCampaignPage, createCampaignPerks } = require('../controller/campaign.controller');
const auth = require("../../../middleware/auth.middleware")
const validate = require("../../../middleware/validate")
const { createCampaignSchema } = require("../../../validators/campaign.validator")

// create campaign
router.post("/", auth, validate(createCampaignSchema), createCampaign)

// create campaign page
router.post("/:campaignId/pages", auth, createCampaignPage)

// create campaign product
// router.post("/:campaignId/products", createCampaignProducts)

// create campaign perks
router.post("/:campaignId/perks", createCampaignPerks)



module.exports = router