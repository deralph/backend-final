
const express = require("express");
const router = express.Router();
const { createCategory, getPerkCategories } = require("../controller/admin.controllers");
const auth = require("../../../middleware/auth.middleware")


// dashboard

// add creator

// get creators

// create session -> admin/artist/

// delete session -> admin/artist/

// delete creator

/**
 * @swagger
 * /admin/perks/categories:
 *   post:
 *     summary: Create perk category
 *     description: Create a new perk category.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - avatar
 * 
 *             properties:
 *               name:
 *                 type: string
 *                 example: Premium Access
 * 
 *               description:
 *                 type: string
 *                 example: Access to exclusive premium features and rewards
 * 
 *               avatar:
 *                 type: string
 *                 example: https://example.com/images/premium-access.png
 * 
 *     responses:
 *       201:
 *         description: Category created successfully
 * 
 *       400:
 *         description: Required fields missing
 * 
 *       500:
 *         description: Internal server error
 */
router.post("/perks/categories", auth, createCategory);


/**
 * @swagger
 * /admin/perks/categories:
 *   get:
 *     summary: Get all perk categories
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perk categories retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error occurred retrieving perk categories
 */
router.get("/perks/categories", auth, getPerkCategories)




module.exports = router;

