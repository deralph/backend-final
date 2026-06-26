const express = require("express")
const router = express.Router()
const auth = require("../../../middleware/auth.middleware")
const { loginArtist, registerArtist, artistProfile } = require("../controllers/auth.controller")

/**
 * @swagger
 * /auth/register-artist:
 *   post:
 *     summary: Register artist account
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *               middleName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               userName:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Artist registered successfully
 *       400:
 *         description: |
 *           Possible errors:
 *           - Required fields missing
 *           - Email already exists
 *           - Phone already exists
 *           - Password must be at least 8 characters
 *       500:
 *         descripton: Internal server error occured creating artist
 */

//register
router.post("/register-artist", registerArtist)

/**
 * @swagger
 * /auth/login-artist:
 *   post:
 *     summary: login artist account
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *             oneOf:
 *               - required:
 *                 - email
 *               - required:
 *                 - phone
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Required fields missing
 *       401:
 *         description: Invalid credentials
 */

//login
router.post("/login-artist", loginArtist)

/**
 * @swagger
 * /auth/:
 *   get:
 *     summary:
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account retrieved
 *       404:
 *         description: Account not found
 */
// artistProfile
router.get("/", auth, artistProfile)



module.exports = router