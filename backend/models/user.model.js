const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    role: {
      type: String,
      default: 'user',
    },
    refreshToken: {
      type: String,
    },
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

module.exports = mongoose.model('User', userSchema);
