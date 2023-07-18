const express = require('express');

const router = express.Router();

const {
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  createProductReview,
  getProductReviews,
  deleteReview,
} = require('../controllers/productController');
const {
  isAuthenticated,
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
  isAuthenticated,
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
  isAuthenticated,
  authorizeRoles('admin'),
  updateProduct
);

// @desc    Delete a product by id
// @route   DELETE /api/v1/product/admin/:id
// @access  Private/Admin
router.delete(
  '/admin/:id',
  isAuthenticated,
  authorizeRoles('admin'),
  deleteProduct
);

// @desc    Get all reviews of a product by Product ID
// @route   GET /api/v1/product/review/reviews?id=productId
// @access  Private
router.get('/review/reviews', isAuthenticated, getProductReviews);

// @desc    Create a new review or Update a review of a product
// @route   PUT /api/v1/product/review/create
// @access  Private
router.put('/review/create', isAuthenticated, createProductReview);
// @desc    Create a new review or Update a review of a product
// @route   PUT /api/v1/product/review?productId=productId&reviewId=reviewId
// @access  Private
router.delete('/review', isAuthenticated, deleteReview);

module.exports = router;
