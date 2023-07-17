const express = require('express');

const router = express.Router();

const {
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const {
  isAuthenticatd,
  authorizeRoles,
} = require('../middlewares/authMiddleware');

// @desc    Get all products
// @route   GET /api/v1/product
// @access  Public
router.get('/', getProducts);

// @desc    Create a new product
// @route   POST /api/v1/product/admin/create
// @access  Private/Admin
router.post(
  '/admin/create',
  isAuthenticatd,
  authorizeRoles('admin'),
  createProduct
);

// @desc    Get a product by id
// @route   GET /api/v1/product/:id
// @access  Public
router.get('/:id', getProductById);

// @desc    Update a product by id
// @route   PUT /api/v1/product/admin/:id
// @access  Private/Admin
router.put(
  '/admin/:id',
  isAuthenticatd,
  authorizeRoles('admin'),
  updateProduct
);

// @desc    Delete a product by id
// @route   DELETE /api/v1/product/admin/:id
// @access  Private/Admin
router.delete(
  '/admin/:id',
  isAuthenticatd,
  authorizeRoles('admin'),
  deleteProduct
);

module.exports = router;
