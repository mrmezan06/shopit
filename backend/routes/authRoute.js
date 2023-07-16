const express = require('express');
const router = express.Router();

const { createUser } = require('../controllers/authController');

router.post('/admin/create', createUser);

module.exports = router;
