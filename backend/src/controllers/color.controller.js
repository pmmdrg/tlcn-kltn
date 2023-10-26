const asyncHandler = require('express-async-handler');

const Color = require('../models/color.model');
const { validateMongoDbId } = require('../utils/validateMongoDbId');

const getColors = asyncHandler(async (req, res) => {
  try {
    const colors = await Color.find();

    res.json(colors);
  } catch (err) {
    throw new Error(err);
  }
});

const getColorById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  validateMongoDbId(id);
  try {
    const color = await Color.findById(id);

    res.json(color);
  } catch (err) {
    throw new Error(err);
  }
});

const createColor = asyncHandler(async (req, res) => {
  try {
    const newColor = await Color.create(req.body);

    res.json(newColor);
  } catch (err) {
    throw new Error(err);
  }
});

const updateColor = asyncHandler(async (req, res) => {
  const { id } = req.params;

  validateMongoDbId(id);
  try {
    const updatedColor = await Color.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.json(updatedColor);
  } catch (err) {
    throw new Error(err);
  }
});

const deleteColor = asyncHandler(async (req, res) => {
  const { id } = req.params;

  validateMongoDbId(id);
  try {
    const deletedColor = await Color.findByIdAndDelete(id);

    res.json(deletedColor);
  } catch (err) {
    throw new Error(err);
  }
});

module.exports = {
  getColors,
  getColorById,
  createColor,
  updateColor,
  deleteColor,
};
