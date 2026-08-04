const express = require('express');
const router = express.Router();
const { createCampaign, createCampaignPage, getCampaigns } = require('../controller/campaign.controller');
const auth = require("../../../middleware/auth.middleware")
const validate = require("../../../middleware/validate")
const { createCampaignSchema } = require("../../../validators/campaign.validator")


/**
 * @swagger
 * /campaigns:
 *   post:
 *     summary: Create campaign
 *     tags:
 *       - Campaigns
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - campaignName
 *               - perks
 *               - startDate
 *               - endDate
 *               - mediaType
 *             properties:
 *               campaignName:
 *                 type: string
 *                 example: "Summer Giveaway Campaign"
 *
 *               perks:
 *                 type: array
 *                 description: Array of perk IDs to associate with the campaign.
 *                 items:
 *                   type: string
 *                 example:
 *                   - "6889f6b4d3a8f2c1e5a9b123"
 *                   - "6889f6b4d3a8f2c1e5a9b124"
 *
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-08-01T10:00:00.000Z"
 *
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-08-31T23:59:59.000Z"
 *
 *               mediaType:
 *                 type: string
 *                 enum:
 *                   - image
 *                   - audio
 *                   - video
 *                   - document
 *                   - link
 *                 example: "image"
 *
 *               mediaUrl:
 *                 type: string
 *                 description: URL of the uploaded campaign media.
 *                 example: "https://cdn.intelimerch.com/campaigns/banner.jpg"
 *
 *               status:
 *                 type: string
 *                 enum:
 *                   - active
 *                   - inactive
 *                 example: "active"
 *
 *     responses:
 *       201:
 *         description: Campaign created successfully.
 *
 *       400:
 *         description: |
 *           Possible errors:
 *             - Campaign name already exists.
 *             - One or more perks do not exist.
 *             - One or more perks have already been assigned to the campaign.
 *             - Media file is missing.
 *             - Invalid campaign dates.
 *
 *       401:
 *         description: Unauthorized.
 *
 *       500:
 *         description: Internal server error occurred while creating the campaign.
 */
// create campaign
router.post("/", auth, validate(createCampaignSchema), createCampaign)


/**
 * @swagger
 * /campaigns/{campaignId}/pages:
 *   post:
 *     summary: Create campaign page
 *     tags:
 *       - Campaigns
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: campaignId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the campaign.
 *         example: "6889f6b4d3a8f2c1e5a9b123"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pageStructure
 *             properties:
 *               pageStructure:
 *                 type: object
 *                 description: JSON representation of the campaign page layout.
 *                 example:
 *                   sections:
 *                     - type: hero
 *                       title: "Welcome to the Campaign"
 *                       subtitle: "Unlock exclusive perks"
 *                       backgroundImage: "https://cdn.intelimerch.com/hero.jpg"
 *                     - type: products
 *                       title: "Featured Merchandise"
 *                       items: []
 *                     - type: perks
 *                       title: "Exclusive Perks"
 *                       items: []
 *     responses:
 *       201:
 *         description: Campaign page created successfully.
 *       400:
 *         description: |
 *           Possible errors:
 *             - Campaign does not exist.
 *             - Campaign page already exists.
 *             - Invalid page structure.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error occurred while creating the campaign page.
 */
// create campaign page
router.post("/:campaignId/pages", auth, createCampaignPage)


router.get("/", auth, getCampaigns)






module.exports = router