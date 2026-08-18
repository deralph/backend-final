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
router.get("/creators", auth, creatorsList)
router.post("/fans", auth, fansList)
router.post("/create-perk-category", auth, createPerkCategory)


// on artist account
router.post("/:artistId/create-campaign", auth, createCampaign)
router.post("/:artistId/create-product", auth, createProduct)
router.post("/:artistId/create-perk", auth, createPerk)
router.post("/:artistId/assign-product-to-campaign", auth, assignProductToCampaign)
router.post("/:artistId/assign-perk-to-campaign", auth, assignPerkToCampaign)



module.exports = router