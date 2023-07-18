const Order = require('../models/orderModel');
const Product = require('../models/productModel');

const ErrorHandler = require('../utils/errorHandler');

// @desc    Create a new order
// @route   POST /api/v1/order/create
// @access  Private
const createOrder = async (req, res, next) => {
  const {
    orderItems,
    shippingInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentInfo,
  } = req.body;

  try {
    const order = await Order.create({
      orderItems,
      shippingInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      paymentInfo,
      paidAt: Date.now(),
      user: req.user.id,
    });

    if (!order) {
      return next(new ErrorHandler('Order not created.', 401));
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
};

module.exports = {
  createOrder,
};
