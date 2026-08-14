const express = require("express")
const router = express.Router()
const {
    createRole,
    getRoles,
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
} = require("./admin.controller")


// internal operations
router.post("/admin/roles/", auth, createRole)
router.get("/admin/roles", auth, getRoles)
router.post("/admin/register-staff", auth, registerStaff)
router.get("/admin/staffs", auth, registerStaff)
router.get("/admin/dashboard", auth, dashboard)
router.post("/admin/creators", auth, createCreator)
router.get("/admin/creators", auth, creatorsList)
router.post("/admin/fans", auth, fansList)
router.post("/admin/create-perk-category", auth, createPerkCategory)


// on artist account
router.post("/admin/:artistId/create-campaign", auth, createCampaign)
router.post("/admin/:artistId/create-product", auth, createProduct)
router.post("/admin/:artistId/create-perk", auth, createPerk)
router.post("/admin/:artistId/assign-product-to-campaign", auth, assignProductToCampaign)
router.post("/admin/:artistId/assign-perk-to-campaign", auth, assignPerkToCampaign)



module.exports = router