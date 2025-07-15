// server/routes/categories.js - Routes for categories

const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/categoriesController');
const { protect } = require('../middleware/authMiddleware');

// Public route
router.get('/', categoriesController.getAllCategories);

// Protected route
router.post('/', protect, categoriesController.createCategory);

module.exports = router;
