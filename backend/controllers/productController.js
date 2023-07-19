const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler');
const APIFeatures = require('../utils/apiFeatures');
const { set } = require('mongoose');

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
    // return next(new ErrorHandler('Test', 400));

    const resPerPage = 8;
    const productCount = await Product.countDocuments();
    const apiFeatures = new APIFeatures(Product.find(), req.query)
      .search()
      .filter()
      .pagination(resPerPage);
    const products = await apiFeatures.query;
    // const products = await Product.find();

    // setTimeout(() => {
    //   res
    //     .status(200)
    //     .json({
    //       success: true,
    //       count: products.length,
    //       productCount,
    //       products,
    //     });
    // }, 2000);
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

/* Review Section */

// @desc    Create new review
// @route   PUT /api/v1/product/review
// @access  Private

const createProductReview = async (req, res, next) => {
  try {
    const { rating, comment, productId } = req.body;
    const review = {
      user: req.user.id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    const product = await Product.findById(productId);
    const isReviewed = product.reviews.find(
      (review) => review.user.toString() === req.user.id.toString()
    );
    if (isReviewed) {
      product.reviews.forEach((review) => {
        if (review.user.toString() === req.user.id.toString()) {
          review.comment = comment;
          review.rating = rating;
        }
      });
    }else{

      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;

    }

    product.ratings =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;
    await product.save({ validateBeforeSave: false });

    res.status(200).json({ success: true, product, message: 'Review added.' });


  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
};

// @desc    Get product reviews by product id
// @route   GET /api/v1/product/review/reviews?id=productId
// @access  Private

const getProductReviews = async (req, res, next) => {
  try {
    const product = await Product.findById(req.query.id);
    if (!product) {
      // res.status(404).json({ success: false, message: 'Product not found.' });
      return next(new ErrorHandler('Product not found.', 404));
    
  }

    res.status(200).json({ success: true, reviews: product.reviews });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
};

// @desc    Delete product review
// @route   DELETE /api/v1/product/reviews?id=productId&reviewId=reviewId
// @access  Private

const deleteReview = async (req, res, next) => {
  try {
    const product = await Product.findById(req.query.productId);
    if (!product) {
      return next(new ErrorHandler('Product not found.', 404));
    }
    const reviews = product.reviews.filter(
      (review) => review._id.toString() !== req.query.reviewId.toString()
    );
    const numOfReviews = reviews.length;
    const ratings =
      (product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      reviews.length) || 0;

      const ratingFixedInf = ratings === Infinity || ratings === NaN ? 0 : ratings;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.query.productId,
      { reviews, ratings: ratingFixedInf, numOfReviews },
      { new: true, runValidators: true }
    );
    res.status(200).json({ success: true, product: updatedProduct, message: 'Review deleted.' });
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
  createProductReview,
  getProductReviews,
  deleteReview,
};
