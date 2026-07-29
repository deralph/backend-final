
const express = require("express")
const router = express.Router()
const { createTier } = require("./tier.controller")

router.post("/", createTier)


module.exports = router