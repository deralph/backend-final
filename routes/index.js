const express = require("express")
const router = express.Router()
// import routes
const authRoutes = require("../modules/auth/routes/auth.routes")
const artistRoutes = require("../modules/artist/artist.routes")

// setup routes
router.use("/auth", authRoutes)
router.use("/artist", artistRoutes)


module.exports = router