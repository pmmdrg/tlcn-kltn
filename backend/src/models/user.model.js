const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const speakeasy = require('speakeasy');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: String,
    address: String,
    role: {
      type: String,
      default: 'user',
    },
    refreshToken: String,
    otpCode: String,
    passwordResetExpires: Date,
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre('save', async function () {
  const rounds = 10;
  const hash = await bcrypt.hash(this.password, rounds);

  this.password = hash;
});

userSchema.methods.isPasswordMatch = async function (hash) {
  return await bcrypt.compare(this.password, hash);
};

userSchema.methods.generateOtpCode = async function () {
  const rounds = 10;
  const secretKey = process.env.SECRET_KEY;
  const otpCode = speakeasy.totp({
    secret: secretKey.base32,
    encoding: 'base32',
  });
  const hashedOtp = await bcrypt.hash(otpCode, rounds);

  this.otpCode = hashedOtp;
  this.passwordResetExpires = Date.now() + 2 * 60 * 1000;

  return otpCode;
};

userSchema.methods.isOtpMatch = async function (otp) {
  return await bcrypt.compare(this.otpCode, otp);
};

module.exports = mongoose.model('User', userSchema);
