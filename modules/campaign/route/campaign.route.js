const express = require('express');
const router = express.Router();
const { createCampaign, createCampaignProducts, createCampaignPerks, generateCampaignProductTags } = require('../controller/campaign.controller');


// create campaign
router.post("/", createCampaign)

// create campaign product
router.post("/:campaignId/products", createCampaignProducts)

// create campaign perks
router.post("/:campaignId/perks", createCampaignPerks)  

// generate tags for a particular campaign-product
router.post("/:campaignId/products/:productId/generate-tags", generateCampaignProductTags)



module.exports = router