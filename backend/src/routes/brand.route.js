const express = require('express');

const {
  getBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand,
} = require('../controllers/brand.controller');
const { authMiddleware, isAdmin } = require('../middlewares/authCheck');

const router = express.Router();

// GET methods
router.get('/', getBrands);
router.get('/:id', getBrandById);

// POST methods
router.post('/create', authMiddleware, isAdmin, createBrand);

// PUT methods
router.put('/:id', authMiddleware, isAdmin, updateBrand);

// DELETE methods
router.delete('/:id', authMiddleware, isAdmin, deleteBrand);

module.exports = router;
