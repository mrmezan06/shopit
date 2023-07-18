const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  shippingInfo: {
    address: {
      type: String,
      required: [true, 'Please enter your address.'],
    },
    city: {
      type: String,
      required: [true, 'Please enter your city.'],
    },
    phoneNo: {
      type: String,
      required: [true, 'Please enter your phone number.'],
    },
    postalCode: {
      type: String,
      required: [true, 'Please enter your postal code.'],
    },
    country: {
      type: String,
      required: [true, 'Please enter your country.'],
    },
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  orderItems: [
    {
      name: {
        type: String,
        required: [true, 'Please enter product name.'],
      },
      quantity: {
        type: Number,
        required: [true, 'Please enter product quantity.'],
      },
      image: {
        type: String,
        required: [true, 'Please enter product image.'],
      },
      price: {
        type: Number,
        required: [true, 'Please enter product price.'],
      },
      product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: true,
      },
    },
  ],
  paymentInfo: {
    id: {
      type: String,
    },
    status: {
      type: String,
    },
  },
  paidAt: {
    type: Date,
  },
  itemsPrice: {
    type: Number,
    required: [true, 'Please enter items price.'],
    default: 0.0,
  },
  taxPrice: {
    type: Number,
    required: [true, 'Please enter tax price.'],
    default: 0.0,
  },
  shippingPrice: {
    type: Number,
    required: [true, 'Please enter shipping price.'],
    default: 0.0,
  },
  totalPrice: {
    type: Number,
    required: [true, 'Please enter total price.'],
    default: 0.0,
  },
  orderStatus: {
    type: String,
    required: [true, 'Please enter order status.'],
    default: 'Processing',
  },
  deliveredAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Order', orderSchema);
