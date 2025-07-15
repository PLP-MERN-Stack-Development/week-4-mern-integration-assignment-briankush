// server/controllers/categoriesController.js - Controller functions for categories

const Category = require('../models/Category');

// Get all categories
exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
};

// Create a new category
exports.createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ success: false, message: 'Category already exists' });
    }

    const category = new Category({ name });
    await category.save();

    res.status(201).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};
