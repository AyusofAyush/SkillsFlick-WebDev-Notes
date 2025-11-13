/**
 * POST MODEL
 * 
 * Responsibilities:
 * - Define the structure of a blog post
 * - Validate post data (business rules)
 * - Perform CRUD operations (database layer)
 * - Handle business logic (slug generation, statistics, etc.)
 * 
 * This demonstrates the MODEL in MVC architecture
 */

class Post {
  /**
   * Constructor - Initialize a new Post instance
   * @param {Object} data - Post data (title, content, author, etc.)
   */
  constructor(data = {}) {
    this.id = data.id || null;
    this.title = data.title || '';
    this.content = data.content || '';
    this.author = data.author || '';
    this.category = data.category || 'General';
    this.tags = data.tags || [];
    this.published = data.published !== undefined ? data.published : true;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
    this.views = data.views || 0;
    this.likes = data.likes || 0;
  }

  /**
   * BUSINESS LOGIC: Validate post data
   * This is where we enforce business rules
   * @returns {Object} - { isValid: boolean, errors: array }
   */
  validate() {
    const errors = [];

    // Title validation
    if (!this.title || this.title.trim().length === 0) {
      errors.push('Title is required');
    } else if (this.title.length < 5) {
      errors.push('Title must be at least 5 characters long');
    } else if (this.title.length > 100) {
      errors.push('Title must not exceed 100 characters');
    }

    // Content validation
    if (!this.content || this.content.trim().length === 0) {
      errors.push('Content is required');
    } else if (this.content.length < 50) {
      errors.push('Content must be at least 50 characters long');
    } else if (this.content.length > 10000) {
      errors.push('Content must not exceed 10,000 characters');
    }

    // Author validation
    if (!this.author || this.author.trim().length === 0) {
      errors.push('Author name is required');
    } else if (this.author.length < 2) {
      errors.push('Author name must be at least 2 characters long');
    } else if (this.author.length > 50) {
      errors.push('Author name must not exceed 50 characters');
    }

    // Category validation
    const validCategories = ['Technology', 'Lifestyle', 'Business', 'Education', 'Health', 'General'];
    if (!validCategories.includes(this.category)) {
      errors.push(`Category must be one of: ${validCategories.join(', ')}`);
    }

    // Tags validation
    if (this.tags && this.tags.length > 10) {
      errors.push('Maximum 10 tags allowed');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * BUSINESS LOGIC: Generate URL-friendly slug from title
   * @returns {string} - URL-safe slug
   */
  generateSlug() {
    return this.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-')      // Replace spaces with hyphens
      .replace(/-+/g, '-');      // Replace multiple hyphens with single
  }

  /**
   * BUSINESS LOGIC: Get reading time estimate
   * @returns {number} - Estimated reading time in minutes
   */
  getReadingTime() {
    const wordsPerMinute = 200;
    const wordCount = this.content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }

  /**
   * BUSINESS LOGIC: Increment view count
   */
  incrementViews() {
    this.views += 1;
  }

  /**
   * BUSINESS LOGIC: Increment like count
   */
  incrementLikes() {
    this.likes += 1;
  }

  /**
   * BUSINESS LOGIC: Get post summary (first 150 characters)
   * @returns {string} - Post summary
   */
  getSummary() {
    const maxLength = 150;
    if (this.content.length <= maxLength) {
      return this.content;
    }
    return this.content.substring(0, maxLength).trim() + '...';
  }

  // ========================================
  // DATABASE OPERATIONS (In-memory storage for demo)
  // In a real application, these would interact with a database
  // ========================================

  static posts = []; // In-memory storage
  static nextId = 1; // Auto-increment ID

  /**
   * DATABASE: Save post to storage
   * @returns {Promise<Post>} - Saved post instance
   */
  async save() {
    // Validate before saving
    const validation = this.validate();
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }

    // New post - assign ID
    if (!this.id) {
      this.id = Post.nextId++;
      this.createdAt = new Date();
      Post.posts.push(this);
    } else {
      // Update existing post
      const index = Post.posts.findIndex(p => p.id === this.id);
      if (index !== -1) {
        this.updatedAt = new Date();
        Post.posts[index] = this;
      }
    }

    return this;
  }

  /**
   * DATABASE: Find all posts with optional filtering
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Array>} - Array of posts
   */
  static async findAll(filters = {}) {
    let results = [...Post.posts];

    // Filter by category
    if (filters.category) {
      results = results.filter(p => p.category === filters.category);
    }

    // Filter by author
    if (filters.author) {
      results = results.filter(p => 
        p.author.toLowerCase().includes(filters.author.toLowerCase())
      );
    }

    // Filter by published status
    if (filters.published !== undefined) {
      results = results.filter(p => p.published === filters.published);
    }

    // Filter by tag
    if (filters.tag) {
      results = results.filter(p => p.tags.includes(filters.tag));
    }

    // Search by title or content
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      results = results.filter(p => 
        p.title.toLowerCase().includes(searchTerm) ||
        p.content.toLowerCase().includes(searchTerm)
      );
    }

    // Sort results
    if (filters.sortBy) {
      results.sort((a, b) => {
        if (filters.sortBy === 'newest') {
          return new Date(b.createdAt) - new Date(a.createdAt);
        } else if (filters.sortBy === 'oldest') {
          return new Date(a.createdAt) - new Date(b.createdAt);
        } else if (filters.sortBy === 'popular') {
          return b.views - a.views;
        } else if (filters.sortBy === 'likes') {
          return b.likes - a.likes;
        }
        return 0;
      });
    } else {
      // Default: newest first
      results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return results;
  }

  /**
   * DATABASE: Find post by ID
   * @param {number} id - Post ID
   * @returns {Promise<Post|null>} - Found post or null
   */
  static async findById(id) {
    const post = Post.posts.find(p => p.id === parseInt(id));
    return post || null;
  }

  /**
   * DATABASE: Update post by ID
   * @param {number} id - Post ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Post|null>} - Updated post or null
   */
  static async update(id, updateData) {
    const index = Post.posts.findIndex(p => p.id === parseInt(id));
    if (index === -1) return null;

    // Create updated post instance
    const updatedPost = new Post({
      ...Post.posts[index],
      ...updateData,
      id: parseInt(id), // Ensure ID doesn't change
      updatedAt: new Date()
    });

    // Validate updated data
    const validation = updatedPost.validate();
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }

    Post.posts[index] = updatedPost;
    return updatedPost;
  }

  /**
   * DATABASE: Delete post by ID
   * @param {number} id - Post ID
   * @returns {Promise<boolean>} - Success status
   */
  static async delete(id) {
    const index = Post.posts.findIndex(p => p.id === parseInt(id));
    if (index === -1) return false;

    Post.posts.splice(index, 1);
    return true;
  }

  /**
   * DATABASE: Get statistics about all posts
   * @returns {Promise<Object>} - Statistics object
   */
  static async getStats() {
    const totalPosts = Post.posts.length;
    const publishedPosts = Post.posts.filter(p => p.published).length;
    const totalViews = Post.posts.reduce((sum, p) => sum + p.views, 0);
    const totalLikes = Post.posts.reduce((sum, p) => sum + p.likes, 0);

    // Category distribution
    const categoryDistribution = {};
    Post.posts.forEach(post => {
      categoryDistribution[post.category] = (categoryDistribution[post.category] || 0) + 1;
    });

    // Most popular posts (top 5 by views)
    const popularPosts = [...Post.posts]
      .sort((a, b) => b.views - a.views)
      .slice(0, 5)
      .map(p => ({ id: p.id, title: p.title, views: p.views }));

    return {
      totalPosts,
      publishedPosts,
      draftPosts: totalPosts - publishedPosts,
      totalViews,
      totalLikes,
      averageViews: totalPosts > 0 ? Math.round(totalViews / totalPosts) : 0,
      categoryDistribution,
      popularPosts
    };
  }

  /**
   * DATABASE: Search posts by keyword
   * @param {string} keyword - Search keyword
   * @returns {Promise<Array>} - Matching posts
   */
  static async search(keyword) {
    if (!keyword) return [];

    const searchTerm = keyword.toLowerCase();
    return Post.posts.filter(post => 
      post.title.toLowerCase().includes(searchTerm) ||
      post.content.toLowerCase().includes(searchTerm) ||
      post.author.toLowerCase().includes(searchTerm) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }
}

export default Post;
