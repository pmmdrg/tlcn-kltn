const express = require('express');

const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/category.controller');
const { authMiddleware, isAdmin } = require('../middlewares/authCheck');

const router = express.Router();

// GET methods
router.get('/', getCategories);
router.get('/:id', getCategoryById);

// POST methods
router.post('/create', authMiddleware, isAdmin, createCategory);

// PUT methods
router.put('/:id', authMiddleware, isAdmin, updateCategory);

// DELETE methods
router.delete('/:id', authMiddleware, isAdmin, deleteCategory);

module.exports = router;
