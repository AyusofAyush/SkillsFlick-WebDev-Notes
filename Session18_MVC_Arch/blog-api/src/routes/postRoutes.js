/**
 * POST ROUTES
 * 
 * Responsibilities:
 * - Define API endpoints (URL patterns)
 * - Map HTTP methods to controller functions
 * - Apply middleware to specific routes
 * 
 * This demonstrates the ROUTING layer in MVC architecture
 * Routes act as the entry point, directing traffic to controllers
 */

import express from 'express';
import postController from '../controllers/postController.js';

const router = express.Router();

// ========================================
// SPECIAL ROUTES (must come before :id routes)
// ========================================

/**
 * GET /api/posts/stats
 * Get blog statistics
 */
router.get('/stats', postController.getStats);

/**
 * GET /api/posts/search?q=keyword
 * Search posts by keyword
 */
router.get('/search', postController.searchPosts);

/**
 * GET /api/posts/categories
 * Get all available categories
 */
router.get('/categories', postController.getCategories);

// ========================================
// CRUD ROUTES
// ========================================

/**
 * POST /api/posts
 * Create a new blog post
 * 
 * Body:
 * {
 *   "title": "Post title",
 *   "content": "Post content (min 50 chars)",
 *   "author": "Author name",
 *   "category": "Technology",
 *   "tags": ["tag1", "tag2"],
 *   "published": true
 * }
 */
router.post('/', postController.createPost);

/**
 * GET /api/posts
 * Get all posts with optional filtering and sorting
 * 
 * Query params:
 * - category: Filter by category
 * - author: Filter by author
 * - published: Filter by published status (true/false)
 * - tag: Filter by tag
 * - search: Search in title and content
 * - sortBy: newest|oldest|popular|likes
 * - page: Page number (default: 1)
 * - limit: Posts per page (default: 10)
 */
router.get('/', postController.getAllPosts);

/**
 * GET /api/posts/:id
 * Get a single post by ID
 * Also increments view count
 */
router.get('/:id', postController.getPostById);

/**
 * PUT /api/posts/:id
 * Update an existing post
 * 
 * Body: Same as POST (all fields optional)
 */
router.put('/:id', postController.updatePost);

/**
 * DELETE /api/posts/:id
 * Delete a post by ID
 */
router.delete('/:id', postController.deletePost);

/**
 * POST /api/posts/:id/like
 * Increment likes for a post
 */
router.post('/:id/like', postController.likePost);

export default router;
