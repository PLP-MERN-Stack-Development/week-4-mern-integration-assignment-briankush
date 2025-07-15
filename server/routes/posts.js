// server/routes/posts.js - Routes for blog posts

const express = require('express');
const router = express.Router();
const postsController = require('../controllers/postsController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', postsController.getAllPosts);
router.get('/:id', postsController.getPostById);

// Protected routes
router.post('/', protect, postsController.createPost);
router.put('/:id', protect, postsController.updatePost);
router.delete('/:id', protect, postsController.deletePost);
router.post('/:id/comments', protect, postsController.addComment);

module.exports = router;
