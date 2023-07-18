const express = require('express');

const {
  isAuthenticated,
  authorizeRoles,
} = require('../middlewares/authMiddleware');

const { createOrder } = require('../controllers/orderController');

const router = express.Router();

router.post('/create', isAuthenticated, createOrder);

module.exports = router;
