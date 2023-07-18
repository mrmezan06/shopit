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

// @desc    Get single order and user details
// @route   GET /api/v1/order/:id
// @access  Private

const getSingleOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email')
    
        if (!order) {
          return next(new ErrorHandler('Order not found.', 404));
        }
    
        res.status(200).json({ success: true, order });
      } catch (error) {
        return next(new ErrorHandler(error.message, 400));
      }
}

// @desc    Get logged in user orders
// @route   GET /api/v1/order/orders/me
// @access  Private

const myOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ user: req.user.id })

        if(!orders) {
            return next(new ErrorHandler('No order found!', 404));
        }

        res.status(200).json({ success: true, orders })
        } catch (error) {
        return next(new ErrorHandler(error.message, 400));
        }
}

// @desc    Get all orders - ADMIN
// @route   GET /api/v1/order/admin/orders
// @access  Private/Admin

const allOrders = async (req, res, next) => {
    try {
        const orders = await Order.find()

        let totalAmount = 0;

        orders.forEach(order => {
            totalAmount += order.totalPrice
        })

        res.status(200).json({ success: true, totalAmount, orders })
        } catch (error) {
        return next(new ErrorHandler(error.message, 400));
        }
}

// @desc    Update / Process order - ADMIN
// @route   PUT /api/v1/order/admin/order/:id
// @access  Private/Admin

const updateOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id)

        if(!order) {
            return next(new ErrorHandler('No order found!', 404));
        }

        if(order.orderStatus === 'Delivered') {
            return next(new ErrorHandler('You have already delivered this order.', 400));
        }

        order.orderItems.forEach(async item => {
            await updateStock(item.product, item.quantity)
        })

        order.orderStatus = req.body.status,
        order.deliveredAt = Date.now()

        await order.save()

        res.status(200).json({ success: true, order })
        } catch (error) {
        return next(new ErrorHandler(error.message, 400));
        }
}

// @desc    Delete order
// @route   DELETE /api/v1/order/admin/order/:id
// @access  Private/Admin

const deleteOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id)

        if(!order) {
            return next(new ErrorHandler('No order found!', 404));
        }

        await Order.findByIdAndDelete(req.params.id)

        res.status(200).json({ success: true, message: 'Order deleted successfully.' })
        } catch (error) {
        return next(new ErrorHandler(error.message, 400));
        }
}

// Update stock after order is placed

async function updateStock(id, quantity) {
    const product = await Product.findById(id)

    product.stock = product.stock - quantity

    await product.save({ validateBeforeSave: false })
}


module.exports = {
    createOrder,
    getSingleOrder,
    myOrders,
    allOrders,
    updateOrder,
    deleteOrder
};
