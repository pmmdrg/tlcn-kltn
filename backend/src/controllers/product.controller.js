const fs = require('fs');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');

const Product = require('../models/product.model');
const {
  cloudinaryUploadImg,
  cloudinaryDeleteImg,
} = require('../configs/cloudinary');
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

      products = await Product.find(query).sort(sortBy).skip(skip).limit(limit);
    } else {
      products = await Product.find(query)
        .sort('createdAt')
        .skip(skip)
        .limit(limit);
    }
    if (req.query.page) {
      const productCounts = await Product.countDocuments();

      if (skip >= productCounts) throw new Error('This page does not exist');
    }
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

const rating = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { star, comment, productId } = req.body;

  try {
    const product = await Product.findById(productId);
    const isRated = product?.ratings.find((rating) => {
      return rating.postedBy.toString() === _id.toString();
    });

    if (isRated) {
      await Product.findOneAndUpdate(
        {
          ratings: { $elemMatch: isRated },
        },
        { 'ratings.$.star': star, 'ratings.$.comment': comment },
        { new: true }
      );
    } else {
      await Product.findByIdAndUpdate(
        productId,
        {
          $push: {
            ratings: {
              star: star,
              comment: comment,
              postedBy: _id,
            },
          },
        },
        { new: true }
      );
    }

    const updatedProduct = await Product.findById(productId);
    let ratingCount = updatedProduct?.ratings.length;
    let ratingSum = updatedProduct?.ratings.reduce((acc, cur) => {
      return acc + cur.star;
    }, 0);
    let avgRating = ratingSum / ratingCount;

    const finalProduct = await Product.findByIdAndUpdate(
      productId,
      { averageRating: parseFloat(avgRating.toFixed(1)) },
      { new: true }
    );

    res.json(finalProduct);
  } catch (err) {
    throw new Error(err);
  }
});

const uploadImages = asyncHandler(async (req, res) => {
  try {
    const uploader = (path) => {
      return cloudinaryUploadImg(path);
    };
    const imageUrls = [];
    const files = req.files;

    for (const file of files) {
      const { path } = file;
      const newPath = await uploader(path);

      imageUrls.push(newPath);
      fs.unlinkSync(path);
    }
    res.json(imageUrls);
  } catch (err) {
    throw new Error(err);
  }
});

const deleteImages = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    await cloudinaryDeleteImg(id);

    res.json({ msg: 'Deleted image' });
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
  rating,
  uploadImages,
  deleteImages,
};
