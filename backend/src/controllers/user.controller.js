const asyncHandler = require('express-async-handler');

const User = require('../models/user.model');
const { validateMongoDbId } = require('../utils/validateMongoDbId');
const sendEmail = require('../utils/sendEmail');

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

const updatePassword = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { password } = req.body;

  validateMongoDbId(_id);
  if (password) {
    try {
      const updatedPassword = await User.findOneAndUpdate(
        {
          _id: _id,
          passwordResetExpires: {
            $gt: Date.now(),
          },
        },
        {
          password: password,
          otpCode: undefined,
          passwordResetExpires: undefined,
        },
        { new: true }
      );

      res.json(updatedPassword);
    } catch (err) {
      throw new Error(err);
    }
  } else {
    throw new Error('Need new password to update');
  }
});

const otpCheck = asyncHandler(async (req, res) => {
  const { otp } = req.body;
  const { _id } = req.user;

  validateMongoDbId(_id);
  const user = await User.findOne({
    _id: _id,
    passwordResetExpires: {
      $gt: Date.now(),
    },
  });

  if (user) {
    if (await user.isOtpMatch(otp)) {
      res.json({ msg: 'OTP matched' });
    } else {
      throw new Error('Invalid OTP code');
    }
  } else {
    throw new Error('OTP expired');
  }
});

const forgotPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email });

  if (!user) {
    throw new Error('User not found');
  } else {
    try {
      const resetToken = await user.generateOtpCode();

      await user.save();

      const resetHtml = `
        <p>
          Hello, this is your OTP code for resetting your password, please don't let anyone know this code:
        </p>
        <h2>
          ${resetToken}
        </h2>
        <p>
          This code will last for 2 minutes, please verify before it expires.
        </p>
      `;
      const data = {
        to: email,
        subject: 'RESET PASSWORD',
        text: "We're received your request for resetting password, here is your token",
        html: resetHtml,
      };

      sendEmail(data);
      res.json(resetToken);
    } catch (err) {
      throw new Error(err);
    }
  }
});

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  updatePassword,
  otpCheck,
  forgotPasswordToken,
};
