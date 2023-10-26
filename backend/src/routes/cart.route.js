const express = require('express');

const {
  getUserCart,
  addToCart,
  emptyCart,
} = require('../controllers/cart.controller');
const { authMiddleware } = require('../middlewares/authCheck');

const router = express.Router();

// GET methods
router.get('/cart', authMiddleware, getUserCart);

// POST methods
router.post('/cart', authMiddleware, addToCart);

// DELETE methods
router.delete('/empty', authMiddleware, emptyCart);

module.exports = router;
