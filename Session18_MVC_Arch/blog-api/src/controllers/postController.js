/**
 * POST CONTROLLER
 * 
 * Responsibilities:
 * - Handle HTTP requests and responses
 * - Extract and validate request data
 * - Call Model methods (business logic)
 * - Format and send responses
 * - Handle errors appropriately
 * 
 * This demonstrates the CONTROLLER in MVC architecture
 * Controllers should be THIN - delegate heavy logic to Models
 */

import Post from '../models/Post.js';

class PostController {
  /**
   * CREATE - Handle new post creation
   * POST /api/posts
   */
  async createPost(req, res) {
    try {
      // 1. Extract data from request body
      const { title, content, author, category, tags, published } = req.body;

      // 2. Create new post instance (Model handles structure)
      const post = new Post({
        title,
        content,
        author,
        category,
        tags,
        published
      });

      // 3. Save via Model (includes validation & business logic)
      const savedPost = await post.save();

      // 4. Send success response (VIEW layer - JSON formatting)
      res.status(201).json({
        status: 'success',
        message: 'Post created successfully',
        data: {
          post: savedPost,
          slug: savedPost.generateSlug(),
          readingTime: savedPost.getReadingTime()
        }
      });

    } catch (error) {
      // Handle validation or other errors
      res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  }

  /**
   * READ - Get all posts with filtering and sorting
   * GET /api/posts?category=Technology&sortBy=newest&search=keyword
   */
  async getAllPosts(req, res) {
    try {
      // 1. Extract query parameters (filters)
      const filters = {
        category: req.query.category,
        author: req.query.author,
        published: req.query.published !== undefined ? req.query.published === 'true' : undefined,
        tag: req.query.tag,
        search: req.query.search,
        sortBy: req.query.sortBy || 'newest'
      };

      // 2. Get posts from Model with filters
      const posts = await Post.findAll(filters);

      // 3. Pagination (optional enhancement)
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const paginatedPosts = posts.slice(startIndex, endIndex);

      // 4. Send success response with metadata
      res.status(200).json({
        status: 'success',
        count: posts.length,
        page,
        totalPages: Math.ceil(posts.length / limit),
        data: paginatedPosts.map(post => ({
          ...post,
          summary: post.getSummary(),
          readingTime: post.getReadingTime()
        }))
      });

    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch posts',
        error: error.message
      });
    }
  }

  /**
   * READ - Get single post by ID
   * GET /api/posts/:id
   */
  async getPostById(req, res) {
    try {
      // 1. Extract ID from route parameters
      const { id } = req.params;

      // 2. Find post via Model
      const post = await Post.findById(id);

      // 3. Handle not found case
      if (!post) {
        return res.status(404).json({
          status: 'error',
          message: `Post with ID ${id} not found`
        });
      }

      // 4. Increment view count (business logic in Model)
      post.incrementViews();
      await post.save();

      // 5. Send success response with enhanced data
      res.status(200).json({
        status: 'success',
        data: {
          post,
          slug: post.generateSlug(),
          readingTime: post.getReadingTime(),
          summary: post.getSummary()
        }
      });

    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch post',
        error: error.message
      });
    }
  }

  /**
   * UPDATE - Update existing post
   * PUT /api/posts/:id
   */
  async updatePost(req, res) {
    try {
      // 1. Extract ID and update data
      const { id } = req.params;
      const { title, content, author, category, tags, published } = req.body;

      // 2. Update via Model (includes validation)
      const updatedPost = await Post.update(id, {
        title,
        content,
        author,
        category,
        tags,
        published
      });

      // 3. Handle not found case
      if (!updatedPost) {
        return res.status(404).json({
          status: 'error',
          message: `Post with ID ${id} not found`
        });
      }

      // 4. Send success response
      res.status(200).json({
        status: 'success',
        message: 'Post updated successfully',
        data: {
          post: updatedPost,
          slug: updatedPost.generateSlug(),
          readingTime: updatedPost.getReadingTime()
        }
      });

    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  }

  /**
   * DELETE - Remove post
   * DELETE /api/posts/:id
   */
  async deletePost(req, res) {
    try {
      // 1. Extract ID from parameters
      const { id } = req.params;

      // 2. Delete via Model
      const deleted = await Post.delete(id);

      // 3. Handle not found case
      if (!deleted) {
        return res.status(404).json({
          status: 'error',
          message: `Post with ID ${id} not found`
        });
      }

      // 4. Send success response
      res.status(200).json({
        status: 'success',
        message: 'Post deleted successfully',
        data: {
          deletedId: parseInt(id)
        }
      });

    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Failed to delete post',
        error: error.message
      });
    }
  }

  /**
   * STATS - Get blog statistics
   * GET /api/posts/stats
   */
  async getStats(req, res) {
    try {
      // Get statistics from Model
      const stats = await Post.getStats();

      res.status(200).json({
        status: 'success',
        data: stats
      });

    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch statistics',
        error: error.message
      });
    }
  }

  /**
   * SEARCH - Search posts by keyword
   * GET /api/posts/search?q=keyword
   */
  async searchPosts(req, res) {
    try {
      // 1. Extract search query
      const { q } = req.query;

      if (!q || q.trim().length === 0) {
        return res.status(400).json({
          status: 'error',
          message: 'Search query (q) is required'
        });
      }

      // 2. Search via Model
      const results = await Post.search(q);

      // 3. Send results
      res.status(200).json({
        status: 'success',
        query: q,
        count: results.length,
        data: results.map(post => ({
          id: post.id,
          title: post.title,
          author: post.author,
          category: post.category,
          summary: post.getSummary(),
          createdAt: post.createdAt
        }))
      });

    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Search failed',
        error: error.message
      });
    }
  }

  /**
   * LIKE - Increment post likes
   * POST /api/posts/:id/like
   */
  async likePost(req, res) {
    try {
      // 1. Extract ID
      const { id } = req.params;

      // 2. Find post
      const post = await Post.findById(id);

      if (!post) {
        return res.status(404).json({
          status: 'error',
          message: `Post with ID ${id} not found`
        });
      }

      // 3. Increment likes (business logic)
      post.incrementLikes();
      await post.save();

      // 4. Send response
      res.status(200).json({
        status: 'success',
        message: 'Post liked successfully',
        data: {
          postId: post.id,
          likes: post.likes
        }
      });

    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Failed to like post',
        error: error.message
      });
    }
  }

  /**
   * CATEGORIES - Get all available categories
   * GET /api/posts/categories
   */
  async getCategories(req, res) {
    try {
      const categories = [
        'Technology',
        'Lifestyle',
        'Business',
        'Education',
        'Health',
        'General'
      ];

      res.status(200).json({
        status: 'success',
        data: categories
      });

    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch categories'
      });
    }
  }
}

// Export a single instance of the controller
export default new PostController();
