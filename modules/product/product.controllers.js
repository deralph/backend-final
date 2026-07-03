const asyncHandler = require("express-async-handler")
const Products = require("./product.model")

const createProduct = asyncHandler(async (req, res) => {
    const artistId = req.user.accountId
    const {
        productName,
        productType,
        color,
        size,
        sku,
        batchNumber,
        productId,
        tagId,
        campaignId,
    } = req.body;

    // Required field validation
    if (
        !productName ||
        !productType ||
        !color ||
        !size ||
        !sku ||
        !batchNumber ||
        !productId ||
        !tagId
    ) {
        const error = new Error("Required fields missing");
        error.statusCode = 400;
        throw error;
    }

    // Check SKU uniqueness
    const existingSku = await Products.findOne({ sku });
    if (existingSku) {
        const error = new Error("SKU already exists");
        error.statusCode = 409;
        throw error;
    }

    // Check Product ID uniqueness
    const existingProductId = await Products.findOne({ productId });
    if (existingProductId) {
        const error = new Error("Product ID already exists");
        error.statusCode = 409;
        throw error;
    }

    // Check Tag ID uniqueness
    const existingTagId = await Products.findOne({ tagId });
    if (existingTagId) {
        const error = new Error("Tag ID already exists");
        error.statusCode = 409;
        throw error;
    }

    const product = await Products.create({
        artistId,
        productName,
        productType,
        color,
        size,
        sku,
        batchNumber,
        productId,
        tagId,
        campaignId,
    });

    res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: product,
    });
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

    console.log("Artist ID:", artistId);
    console.log("Product ID:", productId);

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
        "campaignId",
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