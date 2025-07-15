// server/routes/auth.js - Routes for user authentication

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Public routes
router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);

module.exports = router;
