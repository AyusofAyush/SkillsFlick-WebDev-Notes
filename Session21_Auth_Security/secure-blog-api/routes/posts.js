const express = require('express');
const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const Post = require('../models/Post');
const logger = require('../utils/logger');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const { authorizeRoles, checkPermission } = require('../middleware/authorize');
const { postValidation, commentValidation } = require('../utils/validator');
const mongoSanitize = require('express-mongo-sanitize');

const router = express.Router();

/**
 * @route   GET /api/posts
 * @desc    Get all published posts (with pagination)
 * @access  Public
 */
router.get('/', optionalAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const category = req.query.category;
    const tag = req.query.tag;
    const search = req.query.search;

    // Build query
    let query = { isDeleted: false };

    // Only show published posts to non-authenticated users
    if (!req.user || req.user.role === 'user') {
      query.status = 'published';
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by tag
    if (tag) {
      query.tags = tag;
    }

    // Search in title and content
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    // Get posts with author information
    const posts = await Post.find(query)
      .populate('author', 'username email profilePicture')
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-comments'); // Exclude comments for performance

    // Get total count for pagination
    const total = await Post.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        posts,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    logger.error('Get posts error', {
      error: error.message,
      stack: error.stack
    });

    res.status(500).json({
      success: false,
      message: 'Error fetching posts'
    });
  }
});

/**
 * @route   GET /api/posts/:id
 * @desc    Get single post by ID
 * @access  Public
 */
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const post = await Post.findById(req.params.id)
      .populate('author', 'username email profilePicture bio')
      .populate('comments.user', 'username profilePicture');

    if (!post || post.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check if user can view unpublished posts
    if (post.status !== 'published') {
      if (!req.user) {
        return res.status(403).json({
          success: false,
          message: 'This post is not published yet'
        });
      }

      // Only author, moderators, and admins can view unpublished posts
      const canView = 
        post.author._id.toString() === req.user._id.toString() ||
        req.user.role === 'moderator' ||
        req.user.role === 'admin';

      if (!canView) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to view this post'
        });
      }
    }

    // Increment views (don't count author's views)
    if (!req.user || post.author._id.toString() !== req.user._id.toString()) {
      post.views += 1;
      await post.save();
    }

    res.status(200).json({
      success: true,
      data: {
        post
      }
    });

  } catch (error) {
    logger.error('Get post error', {
      error: error.message,
      stack: error.stack
    });

    res.status(500).json({
      success: false,
      message: 'Error fetching post'
    });
  }
});

/**
 * @route   POST /api/posts
 * @desc    Create a new post
 * @access  Private (authenticated users)
 */
router.post('/', authenticateToken, postValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { title, content, excerpt, category, tags, featuredImage, status } = req.body;

    // Allow all authenticated users to create posts with any status
    const postStatus = status || 'draft';

    const post = new Post({
      title,
      content,
      excerpt,
      category,
      tags,
      featuredImage,
      status: postStatus,
      author: req.user._id
    });

    await post.save();

    // Populate author information
    await post.populate('author', 'username email profilePicture');

    logger.info('Post created', {
      postId: post._id,
      userId: req.user._id,
      status: post.status
    });

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: {
        post
      }
    });

  } catch (error) {
    logger.error('Create post error', {
      error: error.message,
      stack: error.stack
    });

    res.status(500).json({
      success: false,
      message: 'Error creating post'
    });
  }
});

/**
 * @route   PUT /api/posts/:id
 * @desc    Update a post
 * @access  Private (author, moderator, admin)
 */
router.put('/:id', authenticateToken, postValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const post = await Post.findById(req.params.id);

    if (!post || post.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check permissions: author can edit own post, moderator and admin can edit any
    const canEdit = 
      post.author.toString() === req.user._id.toString() ||
      req.user.role === 'moderator' ||
      req.user.role === 'admin';

    if (!canEdit) {
      logger.warn('Unauthorized post edit attempt', {
        userId: req.user._id,
        postId: post._id,
        postAuthor: post.author
      });
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to edit this post'
      });
    }

    const { title, content, excerpt, category, tags, featuredImage, status } = req.body;

    // Update fields
    if (title) post.title = title;
    if (content) post.content = content;
    if (excerpt !== undefined) post.excerpt = excerpt;
    if (category) post.category = category;
    if (tags) post.tags = tags;
    if (featuredImage !== undefined) post.featuredImage = featuredImage;
    
    // Allow all users to update status
    if (status) {
      post.status = status;
    }

    await post.save();
    await post.populate('author', 'username email profilePicture');

    logger.info('Post updated', {
      postId: post._id,
      userId: req.user._id
    });

    res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      data: {
        post
      }
    });

  } catch (error) {
    logger.error('Update post error', {
      error: error.message,
      stack: error.stack
    });

    res.status(500).json({
      success: false,
      message: 'Error updating post'
    });
  }
});

/**
 * @route   DELETE /api/posts/:id
 * @desc    Delete a post (soft delete)
 * @access  Private (author, moderator, admin)
 */
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const post = await Post.findById(req.params.id);

    if (!post || post.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check permissions
    const canDelete = 
      post.author.toString() === req.user._id.toString() ||
      req.user.role === 'moderator' ||
      req.user.role === 'admin';

    if (!canDelete) {
      logger.warn('Unauthorized post delete attempt', {
        userId: req.user._id,
        postId: post._id
      });
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this post'
      });
    }

    // Soft delete
    post.isDeleted = true;
    post.status = 'archived';
    await post.save();

    logger.info('Post deleted', {
      postId: post._id,
      userId: req.user._id
    });

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully'
    });

  } catch (error) {
    logger.error('Delete post error', {
      error: error.message,
      stack: error.stack
    });

    res.status(500).json({
      success: false,
      message: 'Error deleting post'
    });
  }
});

/**
 * @route   POST /api/posts/:id/like
 * @desc    Like/unlike a post
 * @access  Private
 */
router.post('/:id/like', authenticateToken, async (req, res) => {
  try {
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const post = await Post.findById(req.params.id);

    if (!post || post.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const userIndex = post.likes.indexOf(req.user._id);

    if (userIndex > -1) {
      // Unlike: remove user from likes
      post.likes.splice(userIndex, 1);
      await post.save();

      res.status(200).json({
        success: true,
        message: 'Post unliked',
        data: {
          liked: false,
          likeCount: post.likes.length
        }
      });
    } else {
      // Like: add user to likes
      post.likes.push(req.user._id);
      await post.save();

      res.status(200).json({
        success: true,
        message: 'Post liked',
        data: {
          liked: true,
          likeCount: post.likes.length
        }
      });
    }

  } catch (error) {
    logger.error('Like post error', {
      error: error.message,
      stack: error.stack
    });

    res.status(500).json({
      success: false,
      message: 'Error liking post'
    });
  }
});

/**
 * @route   POST /api/posts/:id/comments
 * @desc    Add a comment to a post
 * @access  Private
 */
router.post('/:id/comments', authenticateToken, commentValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({
        success: false,
        message: 'Post not found or not published'
      });
    }

    const post = await Post.findById(req.params.id);

    if (!post || post.isDeleted || post.status !== 'published') {
      return res.status(404).json({
        success: false,
        message: 'Post not found or not published'
      });
    }

    const { text } = req.body;

    post.comments.push({
      user: req.user._id,
      text
    });

    await post.save();
    await post.populate('comments.user', 'username profilePicture');

    logger.info('Comment added', {
      postId: post._id,
      userId: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: {
        comment: post.comments[post.comments.length - 1]
      }
    });

  } catch (error) {
    logger.error('Add comment error', {
      error: error.message,
      stack: error.stack
    });

    res.status(500).json({
      success: false,
      message: 'Error adding comment'
    });
  }
});

/**
 * @route   DELETE /api/posts/:id/comments/:commentId
 * @desc    Delete a comment
 * @access  Private (comment author, post author, moderator, admin)
 */
router.delete('/:id/comments/:commentId', authenticateToken, async (req, res) => {
  try {
    // Validate ObjectId formats
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.commentId)) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    const post = await Post.findById(req.params.id);

    if (!post || post.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const comment = post.comments.id(req.params.commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check permissions
    const canDelete = 
      comment.user.toString() === req.user._id.toString() ||
      post.author.toString() === req.user._id.toString() ||
      req.user.role === 'moderator' ||
      req.user.role === 'admin';

    if (!canDelete) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this comment'
      });
    }

    // Use pull() instead of deprecated remove()
    post.comments.pull(req.params.commentId);
    await post.save();

    logger.info('Comment deleted', {
      postId: post._id,
      commentId: req.params.commentId,
      userId: req.user._id
    });

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully'
    });

  } catch (error) {
    logger.error('Delete comment error', {
      error: error.message,
      stack: error.stack
    });

    res.status(500).json({
      success: false,
      message: 'Error deleting comment'
    });
  }
});

/**
 * @route   GET /api/posts/my/posts
 * @desc    Get current user's posts
 * @access  Private
 */
router.get('/my/posts', authenticateToken, async (req, res) => {
  try {
    const posts = await Post.find({
      author: req.user._id,
      isDeleted: false
    })
      .sort({ createdAt: -1 });
      // Don't exclude comments so commentCount virtual works properly

    res.status(200).json({
      success: true,
      data: {
        posts,
        count: posts.length
      }
    });

  } catch (error) {
    logger.error('Get my posts error', {
      error: error.message,
      stack: error.stack
    });

    res.status(500).json({
      success: false,
      message: 'Error fetching your posts'
    });
  }
});

module.exports = router;
