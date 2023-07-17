const express = require('express');
const router = express.Router();

const {
  createUser,
  loginUser,
  logoutUser,
  forgotPassword,
} = require('../controllers/authController');

router.post('/admin/create', createUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);
router.post('/password/forgot', forgotPassword);

module.exports = router;
