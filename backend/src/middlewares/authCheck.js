const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const User = require('../models/user.model');

const authMiddleware = asyncHandler(async (req, res, next) => {
  let accessToken;

  if (req?.headers?.authorization?.startsWith('Bearer')) {
    accessToken = req.headers.authorization.split(' ')[1];

    try {
      if (accessToken) {
        const decode = jwt.verify(accessToken, process.env.SECRET_KEY);
        const user = await User.findById(decode?.id);

        req.user = user;
        next();
      }
    } catch (err) {
      throw new Error('Authorize expired, please login again');
    }
  } else {
    throw new Error('There is no token in the headers');
  }
});

const isAdmin = asyncHandler(async (req, res, next) => {
  const { email } = req.user;
  const adminUser = await User.findOne({ email: email });

  if (adminUser.role !== 'admin') {
    throw new Error('You are not allowed to access this page');
  } else {
    next();
  }
});

module.exports = { authMiddleware, isAdmin };
