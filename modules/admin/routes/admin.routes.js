const express = require("express")
const router = express.Router()
const {
    registerStaff,
    dashboard,
    createCreator,
    creatorsList,
    fansList,
    createPerkCategory,

    createCampaign,
    createProduct,
    createPerk,
    assignProductToCampaign,
    assignPerkToCampaign
} = require("../controller/admin.controller")
const auth = require("../../../middleware/auth.middleware")
const { registerStaffSchema } = require("../../../validators/internalTeamValidator")
const { registerArtistSchema } = require("../../../validators/artistValidator")
const validate = require("../../../middleware/validate")

// internal operations
router.post("/register-staff", auth, validate(registerStaffSchema), registerStaff)
router.get("/staffs", auth, registerStaff)
router.get("/dashboard", auth, dashboard)
router.post("/register-creator", auth, validate(registerArtistSchema), createCreator)
/**
 * @swagger
 * /admin/creators:
 *   get:
 *     summary: Retrieve creators
 *     description: Retrieves all creators with their campaign, tag, and scan statistics.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Creators retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *
 *                 message:
 *                   type: string
 *                   example: Creators retrieved successfully.
 *
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalCreators:
 *                       type: integer
 *                       example: 15
 *
 *                     currentlyActive:
 *                       type: integer
 *                       example: 12
 *
 *                     creators:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: Luna Torres
 *
 *                           totalCampaign:
 *                             type: integer
 *                             example: 4
 *
 *                           totalTags:
 *                             type: integer
 *                             example: 25
 *
 *                           totalScans:
 *                             type: integer
 *                             example: 14220
 *
 *                           email:
 *                             type: string
 *                             format: email
 *                             example: luna@example.com
 *
 *       401:
 *         description: Unauthorized. Authentication is required.
 *
 *       500:
 *         description: Internal server error.
 */
router.get("/creators", auth, creatorsList)

/**
 * @swagger
 * /admin/fans/{artistid}:
 *   get:
 *     summary: Retrieve creator's fans
 *     description: Retrieves all creators fans.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 * 
 *     parameters:
 *       - in: path
 *         name: artistId
 *         required: true
 *         schema:
 *           type: string
 *         description: Artist ObjectId
 * 
 *     responses:
 *       200:
 *         description: Creator's fans retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *
 *                 message:
 *                   type: string
 *                   example: Fans retrieved successfully.
 *
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalCreators:
 *                       type: integer
 *                       example: 15
 *
 *                     currentlyActive:
 *                       type: integer
 *                       example: 12
 *
 *                     fans:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           firstName:
 *                             type: string
 *                             example: Luna
 *
 *                           lastName:
 *                             type: string
 *                             example: Torres
 *
 *                           email:
 *                             type: strinf
 *                             example: luna@gmail.com
 *
 *                           phone:
 *                             type: integer
 *                             example: 08112345678
 *
 *                           status:
 *                             type: string
 *                             example: active
 *                           consetGiven:
 *                             type: boolean
 *                             example: true
 *
 *       401:
 *         description: Unauthorized. Authentication is required.
 *
 *       500:
 *         description: Internal server error.
 */
router.get("/fans/:artistId", auth, fansList)


router.post("/create-perk-category", auth, createPerkCategory)


// on artist account
router.post("/:artistId/create-campaign", auth, createCampaign)
router.post("/:artistId/create-product", auth, createProduct)
router.post("/:artistId/create-perk", auth, createPerk)
router.post("/:artistId/assign-product-to-campaign", auth, assignProductToCampaign)
router.post("/:artistId/assign-perk-to-campaign", auth, assignPerkToCampaign)



module.exports = router