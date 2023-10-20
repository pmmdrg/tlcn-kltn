const asyncHandler = require('express-async-handler');

const User = require('../models/user.model');
const { validateMongoDbId } = require('../utils/validateMongoDbId');

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

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
