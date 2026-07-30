const express = require('express');
const router = express.Router();
const { createCampaign, createCampaignPage } = require('../controller/campaign.controller');
const auth = require("../../../middleware/auth.middleware")
const validate = require("../../../middleware/validate")
const { createCampaignSchema } = require("../../../validators/campaign.validator")

// create campaign
/**
 * @swagger
 * /campaigns:
 *   post:
 *     summary: Create campaign
 *     tags:
 *       - campaigns
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
 *               - startDate
 *               - endDate
 *               - perks
 *               - mediaType
 *             properties:
 *               campaignName:
 *                 type: string
 *               perks:
 *                 type: array
 *               startDate:
 *                 type: date
 *               format: date-time
 *                 example: "2026-08-01T10:00:00.000Z"
 *               endDate:
 *                 type: date
 *               format: date-time
 *                 example: "2026-08-01T10:00:00.000Z"
 *               mediaType:
 *                 type: string
 *                 enum:
 *                   - image
 *                   - audio
 *                   - video
 *                   - document
 *                   - link
 *               mediaUrl:
 *                 type: string
 *                 description: URL of the uploaded file
 *               status:
 *                 type: string
 *     responses:
 *       201:
 *         description: Campaign created successfully
 *       400:
 *         description: |
 *           Possible errors:
 *           - campaign name is not available
 *           - Media file is missing
 *           - Perk does not exist
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error occurred creating campaign
 */
router.post("/", auth, validate(createCampaignSchema), createCampaign)

// create campaign page
router.post("/:campaignId/pages", auth, createCampaignPage)




module.exports = router