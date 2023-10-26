const asyncHandler = require('express-async-handler');

const Brand = require('../models/brand.model');
const { validateMongoDbId } = require('../utils/validateMongoDbId');

const getBrands = asyncHandler(async (req, res) => {
  try {
    const brands = await Brand.find();

    res.json(brands);
  } catch (err) {
    throw new Error(err);
  }
});

const getBrandById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  validateMongoDbId(id);
  try {
    const brand = await Brand.findById(id);

    res.json(brand);
  } catch (err) {
    throw new Error(err);
  }
});

const createBrand = asyncHandler(async (req, res) => {
  try {
    const newBrand = await Brand.create(req.body);

    res.json(newBrand);
  } catch (err) {
    throw new Error(err);
  }
});

const updateBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;

  validateMongoDbId(id);
  try {
    const updatedBrand = await Brand.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.json(updatedBrand);
  } catch (err) {
    throw new Error(err);
  }
});

const deleteBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;

  validateMongoDbId(id);
  try {
    const deletedBrand = await Brand.findByIdAndDelete(id);

    res.json(deletedBrand);
  } catch (err) {
    throw new Error(err);
  }
});

module.exports = {
  getBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand,
};
