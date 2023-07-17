const express = require('express');

const router = express.Router();

const {
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const isAuthenticatd = require('../middlewares/authMiddleware');

router.get('/', isAuthenticatd, getProducts);
router.post('/admin/create', createProduct);
router.get('/:id', getProductById);
router.put('/admin/:id', updateProduct);
router.delete('/admin/:id', deleteProduct);

module.exports = router;
