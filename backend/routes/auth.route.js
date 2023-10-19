const express = require('express');

const {
  loginUser,
  handleRefreshToken,
  logoutUser,
} = require('../controllers/auth.controller');

const router = express.Router();

router.get('/refresh', handleRefreshToken);
router.get('/logout', logoutUser);
router.post('/login', loginUser);

module.exports = router;
