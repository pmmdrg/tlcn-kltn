const express = require('express');

const {
  getOrders,
  createOrder,
  updateOrderStatus,
} = require('../controllers/order.controller');
const { authMiddleware, isAdmin } = require('../middlewares/authCheck');

const router = express.Router();

// GET methods
router.get('/all-orders', authMiddleware, getOrders);

//POST methods
router.post('/create-order', authMiddleware, createOrder);

// PUT methods
router.put('/order-status/:id', authMiddleware, isAdmin, updateOrderStatus);

module.exports = router;
