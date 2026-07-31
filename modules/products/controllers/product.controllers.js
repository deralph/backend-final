const asyncHandler = require("express-async-handler")
const mongoose = require("mongoose")
const Products = require("../models/product.model")
const ProductTypes = require("../models/productType.model")
const ProductCodeCounts = require("../models/productCodeCounts.model")
const ProductVariants = require("../models/productVariant.model")
const ProductColors = require("../models/color.model")
const ProductSizes = require("../models/size.model")
const Tiers = require("../../tier/tier.model")
const { assignProductToCampaign } = require("../services/product.service")
const generateCode = require("../../../utils/generateCode")
const {generateTag} = require("../../tags/tag.services")

const createProduct = asyncHandler(async (req, res) => {
    // collect data
    const artistId = req.user.accountId
    const {
        productName,
        productType, //collect name(as in "t-shirt") not Id
        productCode, // optional, not required if product type already exist.
        description,
        color,
        size,
        campaignId,
        productTier
    } = req.body;

    const session = await mongoose.startSession()

    try {
        session.startTransaction()

        // create product code - TSH-001: productType and productCodeCounter
        // get product type or create one of does not exist
        let productTypeDoc
        productTypeDoc = await ProductTypes.findOne({ type: productType.toLowerCase() }).session(session)
        if (!productTypeDoc) {
            if (!productCode) {
                const error = new Error("product code is required")
                error.statusCode = 400
                throw error
            }
            [productTypeDoc] = await ProductTypes.create([{ type: productType, code: req.body.productCode }], { session })
        }

        // no two products in the same product category should have the same name
        const productAlreadyInProdCategory = await Products.findOne({ productName, productTypeId: productTypeDoc._id })
        if (productAlreadyInProdCategory) {
            const error = new Error(`${productName} already exist in "${productTypeDoc.type}" product category`)
            error.statusCode = 400
            throw error
        }

        // create product code counter
        let productCodeCount
        productCodeCount = await ProductCodeCounts.findOne({ productType: productTypeDoc._id }).session(session)
        // if the a counter table does not already exist, then create a new one
        if (!productCodeCount) {
            [productCodeCount] = await ProductCodeCounts.create([{ productType: productTypeDoc._id }], { session })  //system default the "nextNumber" field to 1 on newly created doc
        }


        const currentCount = productCodeCount.nextNumber

        // create product code
        const formattedProductCount = String(currentCount).padStart(3, "0");
        const fullProductCode = productTypeDoc.code + formattedProductCount  //productType + productCount - TSH001

        // create product
        const [newProduct] = await Products.create(
            [{
                artistId,
                productName,
                description,
                productTypeId: productTypeDoc._id,
                productCode: fullProductCode
            }],
            { session }
        )

        // update productCount doc
        await ProductCodeCounts.findByIdAndUpdate(productCodeCount._id, { $inc: { nextNumber: 1 } }, { returnDocument: "after", runValidators: true, session })


        // create variant - service 
        // get colorId
        let colorDoc
        const colorCode = generateCode(color)
        colorDoc = await ProductColors.findOne({ code: colorCode }).session(session)
        if (!colorDoc) {
            [colorDoc] = await ProductColors.create([{ name: color, code: colorCode }], { session })
        }
        const colorId = colorDoc._id
        

        // get sizeId
        let sizeDoc
        const sizeCode = generateCode(size)
        sizeDoc = await ProductSizes.findOne({ code: sizeCode }).session(session)
        if (!sizeDoc) {
            [sizeDoc] = await ProductSizes.create([{ size: size, code: sizeCode }], { session })
        }
        const sizeId = sizeDoc._id

        const sku = fullProductCode + "-" + colorCode + "-" + sizeCode
        const [variant] = await ProductVariants.create([{ productId: newProduct._id, colorId: colorId, sizeId: sizeId, sku }], { session })

      
        // if campaignId, create campaign product and tag - services
        if (campaignId) {
            const tier = await Tiers.findOne({ name: productTier })
            const tierId = tier._id

            const [campaignProduct] = await assignProductToCampaign(newProduct._id, campaignId, tierId, session)
            // create tag
            const tag = await generateTag(campaignId, variant._id, tierId, session)
            // tag link = {baseUrl/nfc/io/tag._id}
            const tagLink = process.env.FRONTEND_BASE_URL + "/nfc/io/" + tag._id
        }

        await session.commitTransaction()

        return res.status(201).json({
            success: true,
            message: "Product created succssfully",
            data: {
                product: newProduct,
                tag,
                tagLink
            }
        })
    }
    catch (error) {
        await session.abortTransaction()
        throw error
    }
    finally {
        session.endSession()
    }
});


const getProducts = asyncHandler(async (req, res) => {

    const artistId = req.user.accountId
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
        Products.find({ artistId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        Products.countDocuments(),
    ]);

    res.status(200).json({
        success: true,
        data: products,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    });
});

const updateProduct = asyncHandler(async (req, res) => {
    const artistId = req.user.accountId;
    const { productId } = req.params;

    const product = await Products.findOne({
        _id: productId,
        artistId,
    });

    if (!product) {
        const error = new Error("Product not found");
        error.statusCode = 404;
        throw error;
    }

    const allowedFields = [
        "productName",
        "productType",
        "color",
        "size",
        "batchNumber",
    ];

    allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) {
            product[field] = req.body[field];
        }
    });

    await product.save();

    res.status(200).json({
        success: true,
        message: "Product updated successfully",
        data: product,
    });
});


const deleteProduct = asyncHandler(async (req, res) => {
    const artistId = req.user.accountId;
    const { productId } = req.params;

    const product = await Products.findOne({
        _id: productId,
        artistId,
    });

    if (!product) {
        const error = new Error("Product not found");
        error.statusCode = 404;
        throw error;
    }

    await product.deleteOne();

    res.status(200).json({
        success: true,
        message: "Product deleted successfully",
    });
});


module.exports = {
    createProduct,
    getProducts,
    updateProduct,
    deleteProduct
}