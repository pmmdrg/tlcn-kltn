const asyncHandler = require('express-async-handler');
const uniqid = require('uniqid');

const Order = require('../models/order.model');
const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const { validateMongoDbId } = require('../utils/validateMongoDbId');

const getOrders = asyncHandler(async (req, res) => {
  const { _id } = req.user;

  validateMongoDbId(_id);
  try {
    const userOrder = await Order.findOne({ orderBy: _id }).populate(
      'products.product'
    );

    res.json(userOrder);
  } catch (err) {
    throw new Error(err);
  }
});

const createOrder = asyncHandler(async (req, res) => {
  const { COD } = req.body;
  const { _id } = req.user;

  validateMongoDbId(_id);
  if (!COD) {
    throw new Error('Cannot create order');
  }
  try {
    const cart = await Cart.findOne({ orderBy: _id });

    await Order.create({
      products: cart.products,
      payment: {
        id: uniqid(),
        method: 'COD',
        amount: cart.cartTotalPrice,
      },
      status: 'Cash on delivery',
      orderBy: _id,
    });

    const update = cart.products.map((product) => {
      return {
        updateOne: {
          filter: {
            _id: product._id,
          },
          update: {
            $inc: {
              quantity: -product.count,
              sold: product.count,
            },
          },
        },
      };
    });

    await Product.bulkWrite(update, 0);
    res.json({ msg: 'Successfully ordered' });
  } catch (err) {
    throw new Error(err);
  }
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  validateMongoDbId(id);
  try {
    const order = await Order.findByIdAndUpdate(
      id,
      { status: status },
      { new: true }
    );

    res.json(order);
  } catch (err) {
    throw new Error(err);
  }
});

module.exports = {
  getOrders,
  createOrder,
  updateOrderStatus,
};
