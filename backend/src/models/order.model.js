const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },
        count: Number,
        color: String,
        price: Number,
      },
    ],
    payment: {
      id: String,
      method: String,
      amount: Number,
    },
    status: {
      type: String,
      default: 'Not Processed',
      enum: [
        'Not processed',
        'Cash on delivery',
        'Processing',
        'Dispatched',
        'Cancelled',
        'Delivered',
      ],
    },
    orderBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
