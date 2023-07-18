const express = require('express');

const {
  isAuthenticated,
  authorizeRoles,
} = require('../middlewares/authMiddleware');

const {
  createOrder,
  myOrders,
  getSingleOrder,
  allOrders,
  updateOrder,
  deleteOrder,
} = require('../controllers/orderController');

const router = express.Router();

router.post('/create', isAuthenticated, createOrder);
router.get('/:id', isAuthenticated, getSingleOrder);
router.get('/orders/me', isAuthenticated, myOrders);
router.get(
  '/admin/orders',
  isAuthenticated,
  authorizeRoles('admin'),
  allOrders
);
router.put(
  '/admin/order/:id',
  isAuthenticated,
  authorizeRoles('admin'),
  updateOrder
);
router.delete(
  '/admin/order/:id',
  isAuthenticated,
  authorizeRoles('admin'),
  deleteOrder
);


module.exports = router;
