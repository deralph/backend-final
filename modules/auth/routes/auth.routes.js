const express = require("express")
const router = express.Router()
const auth = require("../../../middleware/auth.middleware")
const { registerArtist, login, createRole, registerInternalTeam, profile, logout } = require("../controllers/auth.controller")

/**
 * @swagger
 * /auth/register-artist:
 *   post:
 *     summary: 
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
 *               - userName
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
 * /auth/register-internal-team:
 *   post:
 *     summary: 
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
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
 *               - userName
 *               - roleId
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
 *               roleId:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Internal team account created successfully
 *       400:
 *         description: |
 *           Possible errors:
 *           - Required fields missing
 *           - Email already exists
 *           - Phone already exists
 *           - Password must be at least 8 characters
 *       500:
 *         descripton: Something went wrong creating account
 */

//register
router.post("/register-internal-team", auth, registerInternalTeam)

/**
 * @swagger
 * /auth/create-role:
 *   post:
 *     summary: 
 *     tags:
 *       - Auth
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
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: role created successfully
 *       400:
 *         description: |
 *           Possible errors:
 *           - Required fields missing
 *           - Email already exists
 *           - Phone already exists
 *           - Password must be at least 8 characters
 *       500:
 *         descripton: Internal server error occured creating role
 */

//create role
router.post("/create-role", auth, createRole)


/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary:
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
 *       403:
 *         description: Account is closed
 *       500:
 *         description: something went wrong
 */

//login
router.post("/login", login)  //login for both artist and internal team.

/**
 * @swagger
 * /auth/me/profile:
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
 *       500:
 *         description: Something went wrong
 */
// Profile
router.get("/me/profile", auth, profile)

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: 
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Logged out successfully
 *       400:
 *         description: |
 *           Possible errors:
 *           - Required fields missing
 *           - Invalid token format
 */

// artistProfile
router.post("/logout", logout)



module.exports = router