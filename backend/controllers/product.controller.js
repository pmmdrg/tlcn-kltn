const asyncHandler = require('express-async-handler');
const slugify = require('slugify');

const Product = require('../models/product.model');
const { validateMongoDbId } = require('../utils/validateMongoDbId');

const getProducts = asyncHandler(async (req, res) => {
  const query = { ...req.query };
  const excludeFields = ['page', 'limit', 'sort'];
  const { page, limit } = req.query;
  const skip = (page - 1) * limit;

  excludeFields.forEach((field) => delete query[field]);
  try {
    let products;

    if (req.query.sort) {
      const sortBy = req.query.sort;

      products = await Product.find(query).sort(sortBy);
    } else {
      products = await Product.find(query).sort('createdAt');
    }
    if (req.query.page) {
      const productCounts = await Product.countDocuments();

      if (skip >= productCounts) throw new Error('This page does not exist');
    }

    products = await Product.find(query).skip(skip).limit(limit);
    res.json(products);
  } catch (err) {
    throw new Error(err);
  }
});

const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  validateMongoDbId(id);
  try {
    const product = await Product.findById(id);

    res.json(product);
  } catch (err) {
    throw new Error(err);
  }
});

const createProduct = asyncHandler(async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const newProduct = await Product.create(req.body);
    res.json(newProduct);
  } catch (err) {
    throw new Error(err);
  }
});

const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  validateMongoDbId(id);
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.json(updatedProduct);
  } catch (err) {
    throw new Error(err);
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  validateMongoDbId(id);
  try {
    const deletedProduct = await Product.findByIdAndDelete(id);

    res.json(deletedProduct);
  } catch (err) {
    throw new Error(err);
  }
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
