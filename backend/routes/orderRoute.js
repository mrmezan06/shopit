const express = require('express');

const {
  isAuthenticated,
  authorizeRoles,
} = require('../middlewares/authMiddleware');

const {
  createOrder,
  myOrders,
  getSingleOrder,
} = require('../controllers/orderController');

const router = express.Router();

router.post('/create', isAuthenticated, createOrder);
router.get('/:id', isAuthenticated, getSingleOrder);
router.get('/orders/me', isAuthenticated, myOrders);

module.exports = router;
