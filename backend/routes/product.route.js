const express = require('express');

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/product.controller');
const { authMiddleware, isAdmin } = require('../middlewares/authCheck');

const router = express.Router();

//GET method
router.get('/', getProducts);
router.get('/:id', getProductById);

// POST method
router.post('/create', authMiddleware, isAdmin, createProduct);

// PUT method
router.put('/:id', authMiddleware, isAdmin, updateProduct);

// DELETE method
router.delete('/:id', authMiddleware, isAdmin, deleteProduct);

module.exports = router;
