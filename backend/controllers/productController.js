const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler');
const APIFeatures = require('../utils/apiFeatures');

// @desc    Create new product
// @route   POST /api/v1/product/admin/create
// @access  Private/Admin

const createProduct = async (req, res, next) => {
  try {
    req.body.user = req.user.id;
    const product = await Product.create(req.body);
    // TODO: Image upload code

    res.status(201).json({ success: true, product });
  } catch (error) {
    // res.status(400).json({ success: false, message: error.message });
    return next(new ErrorHandler(error.message, 400));
  }
};

// @desc    Get all products
// @route   GET /api/v1/product
// @access  Public

const getProducts = async (req, res) => {
  try {
    const resPerPage = 4;
    const productCount = await Product.countDocuments();
    const apiFeatures = new APIFeatures(Product.find(), req.query)
      .search()
      .filter()
      .pagination(resPerPage);
    const products = await apiFeatures.query;
    // const products = await Product.find();
    res
      .status(200)
      .json({ success: true, count: products.length, productCount, products });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
};

// @desc    Get single product
// @route   GET /api/v1/product/:id
// @access  Public

const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      // res.status(404).json({ success: false, message: 'Product not found.' });
      return next(new ErrorHandler('Product not found.', 404));
    }
    res.status(200).json({ success: true, product });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
};

// @desc    Update product
// @route   PUT /api/v1/product/admin/:id
// @access  Private/Admin

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      // res.status(404).json({ success: false, message: 'Product not found.' });
      return next(new ErrorHandler('Product not found.', 404));
    }
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    res.status(200).json({ success: true, updatedProduct });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
};

// @desc    Delete product
// @route   DELETE /api/v1/product/admin/:id
// @access  Private/Admin

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      // res.status(404).json({ success: false, message: 'Product not found.' });
      return next(new ErrorHandler('Product not found.', 404));
    }
    await product.remove();
    res.status(200).json({ success: true, message: 'Product deleted.' });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
};

module.exports = {
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
};
