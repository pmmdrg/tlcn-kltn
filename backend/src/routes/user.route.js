const express = require('express');

const {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  updatePassword,
  forgotPasswordToken,
  otpCheck,
} = require('../controllers/user.controller');
const { authMiddleware, isAdmin } = require('../middlewares/authCheck');

const router = express.Router();

// GET methods
router.get('/', authMiddleware, getUsers);
router.get('/:id', authMiddleware, getUserById);

//POST methods
router.post('/register', createUser);
router.post('/forgot', forgotPasswordToken);
router.post('/check-otp', authMiddleware, otpCheck);

// PUT methods
router.put('/:id', authMiddleware, updateUser);
router.put('/password', authMiddleware, updatePassword);

// DELETE methods
router.delete('/:id', authMiddleware, isAdmin, deleteUser);

module.exports = router;
