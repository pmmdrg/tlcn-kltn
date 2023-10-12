const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

const User = require('../models/user.model');
const { validateMongoDbId } = require('../utils/validateMongoDbId');
const { generateToken } = require('../configs/accessToken');
const { generateRefreshToken } = require('../configs/refreshToken');

const getUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    throw new Error(err);
  }
});

const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  validateMongoDbId(id);
  try {
    const user = await User.findById(id);

    res.json(user);
  } catch (err) {
    throw new Error(err);
  }
});

const createUser = asyncHandler(async (req, res) => {
  const { email } = req.body;

  try {
    const findUser = await User.findOne({ email: email });

    if (findUser) {
      res.json({ msg: 'User already exists' });
    } else {
      try {
        const newUser = await User.create(req.body);

        res.json(newUser);
      } catch (err) {
        throw new Error(err);
      }
    }
  } catch (err) {
    throw new Error(err);
  }
});

const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  validateMongoDbId(id);
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        firstName: req?.body?.firstName,
        lastName: req?.body?.lastName,
        phone: req?.body?.phone,
        address: req?.body?.address,
      },
      { new: true }
    );

    res.json(updatedUser);
  } catch (err) {
    throw new Error(err);
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  validateMongoDbId(id);
  try {
    const user = await User.findByIdAndDelete(id);

    res.json(user);
  } catch (err) {
    throw new Error(err);
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const findUser = await User.findOne({ email: email });

  if (!findUser) {
    throw new Error('Cannot find user for this email');
  } else if (findUser.isPasswordMatch(password)) {
    const id = findUser._id;
    const refreshToken = generateRefreshToken(id);

    await User.findOneAndUpdate(
      id,
      { refreshToken: refreshToken },
      { new: true }
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });
    res.json({
      firstName: findUser.firstName,
      lastName: findUser.lastName,
      email: findUser.email,
      accessToken: generateToken(id),
    });
  } else {
    throw new Error('Invalid password');
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  const refreshToken = cookie?.refreshToken;

  if (refreshToken) {
    await User.findOneAndUpdate(
      { refreshToken: refreshToken },
      { refreshToken: '' }
    );
  }
  res.clearCookie('refreshToken', { httpOnly: true, secure: true });
  res.sendStatus(204);
});

const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;

  if (!cookie?.refreshToken) {
    throw new Error('There is no refresh token');
  } else {
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken: refreshToken });

    if (!user) {
      throw new Error('There is no user match with token');
    } else {
      jwt.verify(refreshToken, process.env.SECRET_KEY, (err, decode) => {
        const id = user._id.toString();
        if (err || id !== decode.id) {
          throw new Error('Something went wrong with refresh token');
        } else {
          const accessToken = generateToken(user._id);

          res.json({ accessToken });
        }
      });
    }
  }
});

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  logoutUser,
  handleRefreshToken,
};
