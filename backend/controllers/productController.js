const Product = require('../models/productModel');

// @desc    Create new product
// @route   POST /api/v1/product/admin/create
// @access  Private/Admin

const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    // TODO: Image upload code

    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get all products
// @route   GET /api/v1/product
// @access  Public

const getProducts = async (req, res) => {
  const products = await Product.find();
  res.status(200).json({ success: true, count: products.length, products });
};

// @desc    Get single product
// @route   GET /api/v1/product/:id
// @access  Public

const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404).json({ success: false, message: 'Product not found.' });
  }
  res.status(200).json({ success: true, product });
};

// @desc    Update product
// @route   PUT /api/v1/product/admin/:id
// @access  Private/Admin

const updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404).json({ success: false, message: 'Product not found.' });
  }
  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );
  res.status(200).json({ success: true, updatedProduct });
};

// @desc    Delete product
// @route   DELETE /api/v1/product/admin/:id
// @access  Private/Admin

const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404).json({ success: false, message: 'Product not found.' });
  }
  await product.remove();
  res.status(200).json({ success: true, message: 'Product deleted.' });
};

module.exports = {
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
};
