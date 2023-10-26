const asyncHandler = require('express-async-handler');

const Category = require('../models/category.model');
const { validateMongoDbId } = require('../utils/validateMongoDbId');

const getCategories = asyncHandler(async (req, res) => {
  try {
    const categories = await Category.find();

    res.json(categories);
  } catch (err) {
    throw new Error(err);
  }
});

const getCategoryById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  validateMongoDbId(id);
  try {
    const category = await Category.findById(id);

    res.json(category);
  } catch (err) {
    throw new Error(err);
  }
});

const createCategory = asyncHandler(async (req, res) => {
  try {
    const newCategory = await Category.create(req.body);

    res.json(newCategory);
  } catch (err) {
    throw new Error(err);
  }
});

const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  validateMongoDbId(id);
  try {
    const updatedCategory = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.json(updatedCategory);
  } catch (err) {
    throw new Error(err);
  }
});

const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  validateMongoDbId(id);
  try {
    const deletedCategory = await Category.findByIdAndDelete(id);

    res.json(deletedCategory);
  } catch (err) {
    throw new Error(err);
  }
});

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
