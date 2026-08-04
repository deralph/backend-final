
const express = require("express")
const router = express.Router()
const auth = require("../../../middleware/auth.middleware")
const { createProduct, assignProductToCampaign, getProducts, updateProduct, deleteProduct } = require("../controllers/product.controllers")
const { createProductSchema } = require("../../../validators/product.validator")
const validate = require("../../../middleware/validate")


/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productName
 *               - productType
 *               - color
 *               - size
 *               - sku
 *             properties:
 *               productName:
 *                 type: string
 *               productType:
 *                 type: string
 *               description:
 *                 type: string
 *               color:
 *                 type: string
 *               size:
 *                 type: string
 *               campainId:
 *                 type: string
 *               productTier:
 *                 type: string
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: |
 *           Possible errors:
 *           - Required fields missing
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: |
 *           Possible errors:
 *           - SKU already exists
 *           - Product ID already exists
 *           - Tag ID already exists
 *       500:
 *         description: Internal server error occurred creating product
 */

// create product
router.post("/", auth, validate(createProductSchema), createProduct)

router.post("/:productId/assign-to-campaign", auth, assignProductToCampaign)

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Retrieve all products
 *     description: Fetch all available products with optional pagination and filtering.
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: false
 *         description: Current page number
 * 
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *         description: Number of products per page
 * 
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter products by category
 * 
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         required: false
 *         description: Search products by name
 * 
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 * 
 *       400:
 *         description: Invalid query parameters
 * 
 *       500:
 *         description: Internal server error
 */
// get products
router.get("/", auth, getProducts)


/**
 * @swagger
 * /products/{productId}:
 *   patch:
 *     summary: Update product
 *     description: Update an existing product by its ID.
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 * 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productName:
 *                 type: string
 * 
 *               productPrice:
 *                 type: number
 * 
 *               productDescription:
 *                 type: string
 * 
 *               productCategory:
 *                 type: string
 * 
 *               productImage:
 *                 type: string
 * 
 *     responses:
 *       200:
 *         description: Product updated successfully
 * 
 *       400:
 *         description: Invalid request data
 * 
 *       404:
 *         description: Product not found
 * 
 *       500:
 *         description: Internal server error
 */
// update product
router.patch("/:productId", auth, updateProduct)


/**
 * @swagger
 * /products/{productId}:
 *   delete:
 *     summary: Delete product
 *     description: Delete an existing product by its ID.
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 * 
 *     responses:
 *       200:
 *         description: Product deleted successfully
 * 
 *       404:
 *         description: Product not found
 * 
 *       500:
 *         description: Internal server error
 */
// delete product
router.delete("/:productId", auth, deleteProduct)



module.exports = router