const express = require("express")
const router = express.Router()
// import routes
const authRoutes = require("../modules/auth/routes/auth.routes")
const adminRoutes = require("../modules/internalTeam/routes/admin.routes")
const artistRoutes = require("../modules/artist/artist.routes")
const productRoutes = require("../modules/product/product.routes")
const perkRoutes = require("../modules/perks/routes/perk.routes")

// setup routes
router.use("/auth", authRoutes)
router.use("/admin", adminRoutes)
router.use("/artist", artistRoutes)
router.use("/products", productRoutes)
router.use("/perks", perkRoutes)


module.exports = router