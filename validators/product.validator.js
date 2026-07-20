const joi = require("joi")


const createProductSchema = joi.object({
    productName: joi.string()
        .required()
        .trim(),

    productType: joi.string()
        .required()
        .trim(),

    productCode: joi.string()
        .optional()
        .trim(),

    description: joi.string()
        .trim()

})



module.exports = { createProductSchema }