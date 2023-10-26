const express = require('express');

const {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
} = require('../controllers/user.controller');
const { authMiddleware, isAdmin } = require('../middlewares/authCheck');

const router = express.Router();

// GET methods
router.get('/', authMiddleware, getUsers);
router.get('/:id', authMiddleware, getUserById);

//POST methods
router.post('/register', createUser);

// PUT methods
router.put('/:id', authMiddleware, updateUser);

// DELETE methods
router.delete('/:id', authMiddleware, isAdmin, deleteUser);

module.exports = router;
