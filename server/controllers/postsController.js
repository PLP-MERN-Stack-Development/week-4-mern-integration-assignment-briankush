// server/controllers/postsController.js - Controller functions for blog posts

const Post = require('../models/Post');

// Get all posts with pagination and optional category filter
exports.getAllPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category;

    const query = {};
    if (category) {
      query.category = category;
    }

    const posts = await Post.find(query)
      .populate('author', 'username')
      .populate('category', 'name')
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Post.countDocuments(query);

    res.json({
      success: true,
      data: posts,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get a single post by ID
exports.getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username')
      .populate('category', 'name')
      .populate('comments.user', 'username');

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    // Increment view count
    post.viewCount += 1;
    await post.save();

    res.json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};

// Create a new post
exports.createPost = async (req, res, next) => {
  try {
    const { title, content, category, tags, excerpt, isPublished } = req.body;
    const author = req.user._id;

    const post = new Post({
      title,
      content,
      category,
      tags,
      excerpt,
      isPublished,
      author,
    });

    await post.save();

    res.status(201).json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};

// Update an existing post
exports.updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    // Only author can update
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const { title, content, category, tags, excerpt, isPublished } = req.body;

    post.title = title || post.title;
    post.content = content || post.content;
    post.category = category || post.category;
    post.tags = tags || post.tags;
    post.excerpt = excerpt || post.excerpt;
    post.isPublished = isPublished !== undefined ? isPublished : post.isPublished;

    await post.save();

    res.json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};

// Delete a post
exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    // Only author can delete
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    await post.remove();

    res.json({ success: true, message: 'Post deleted' });
  } catch (error) {
    next(error);
  }
};

// Add a comment to a post
exports.addComment = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const { content } = req.body;
    const userId = req.user._id;

    post.comments.push({ user: userId, content });
    await post.save();

    res.status(201).json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};
