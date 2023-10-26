const asyncHandler = require('express-async-handler');

const Cart = require('../models/cart.model');
const User = require('../models/user.model');
const Product = require('../models/product.model');
const { validateMongoDbId } = require('../utils/validateMongoDbId');

const getUserCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;

  validateMongoDbId(_id);
  try {
    const cart = await Cart.findOne({ orderBy: _id }).populate(
      'products.product'
    );

    res.json(cart);
  } catch (err) {
    throw new Error(err);
  }
});

const addToCart = asyncHandler(async (req, res) => {
  const { cart } = req.body;
  const { _id } = req.user;

  validateMongoDbId(_id);
  try {
    const user = await User.findById(_id);
    const isExistCart = await Cart.findOne({ orderBy: user._id });

    if (isExistCart) {
      await Cart.findByIdAndDelete(isExistCart._id);
    }

    const products = await Promise.all(
      cart.map(async (cart) => {
        const getPrice = await Product.findById(cart.productId).select('price');

        return {
          product: cart.productId,
          count: cart.count,
          color: cart.color,
          price: getPrice.price,
        };
      })
    );
    const cartTotalPrice = products.reduce((acc, cur) => {
      return acc + cur.price * cur.count;
    }, 0);
    const newCart = await Cart.create({
      products: products,
      cartTotalPrice: cartTotalPrice,
      orderBy: _id,
    });

    res.json(newCart);
  } catch (err) {
    throw new Error(err);
  }
});

const emptyCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;

  validateMongoDbId(_id);
  try {
    const cart = await Cart.findOneAndDelete({ orderBy: _id });

    res.json(cart);
  } catch (err) {
    throw new Error(err);
  }
});

module.exports = { addToCart, getUserCart, emptyCart };
