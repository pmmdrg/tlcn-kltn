const express = require('express');

const {
  getColors,
  getColorById,
  createColor,
  updateColor,
  deleteColor,
} = require('../controllers/color.controller');
const { authMiddleware, isAdmin } = require('../middlewares/authCheck');

const router = express.Router();

// GET methods
router.get('/all-colors', getColors);
router.get('/:id', getColorById);

// POST methods
router.post('/create', authMiddleware, isAdmin, createColor);

// PUT methods
router.put('/:id', authMiddleware, isAdmin, updateColor);

// DELETE methods
router.delete('/:id', authMiddleware, isAdmin, deleteColor);

module.exports = router;
