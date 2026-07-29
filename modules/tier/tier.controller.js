const Tiers = require("./tier.model")

const createTier = async (req, res) => {

    const { name, description } = req.body

    const tier = await Tiers.create({
        name,
        description
    })

    return res.status(201).json({
        message: "Tier created successfully",
        data: tier
    })
}

module.exports = { createTier }