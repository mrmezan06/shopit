const express = require('express');
const router = express.Router();

const {
  createUser,
  loginUser,
  logoutUser,
} = require('../controllers/authController');

router.post('/admin/create', createUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);

module.exports = router;
