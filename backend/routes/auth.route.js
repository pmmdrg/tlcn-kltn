const express = require('express');

const {
  loginUser,
  handleRefreshToken,
  logoutUser,
} = require('../controllers/auth.controller');

const router = express.Router();

// GET methods
router.get('/refresh', handleRefreshToken);
router.get('/logout', logoutUser);

// POST methods
router.post('/login', loginUser);

module.exports = router;
