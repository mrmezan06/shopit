const express = require('express');
const router = express.Router();

const { createUser, loginUser } = require('../controllers/authController');

router.post('/admin/create', createUser);
router.post('/login', loginUser);

module.exports = router;
