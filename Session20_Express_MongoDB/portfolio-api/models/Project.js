/**
 * Project Model - Mongoose Schema
 * 
 * Represents a portfolio project with comprehensive validation,
 * indexes, virtual properties, hooks, and custom methods.
 * 
 * Features demonstrated:
 * - Schema validation (required, min/max, enum, regex)
 * - Custom validators
 * - Indexes for performance
 * - Virtual properties
 * - Pre/Post hooks (middleware)
 * - Static methods (model-level)
 * - Instance methods (document-level)
 */

import mongoose from 'mongoose';

// Define the Project Schema
const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a project title'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters'],
    maxlength: [100, 'Title cannot be more than 100 characters'],
    index: true // Single field index for faster queries
  },
  
  description: {
    type: String,
    required: [true, 'Please add a description'],
    minlength: [10, 'Description must be at least 10 characters'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  
  technologies: {
    type: [String],
    required: [true, 'Please add at least one technology'],
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'At least one technology is required'
    }
  },
  
  githubUrl: {
    type: String,
    match: [
      /^https?:\/\/(www\.)?github\.com\/.+/,
      'Please provide a valid GitHub URL'
    ]
  },
  
  liveUrl: {
    type: String,
    match: [
      /^https?:\/\/.+/,
      'Please provide a valid URL starting with http:// or https://'
    ]
  },
  
  imageUrl: {
    type: String,
    default: 'default-project.jpg'
  },
  
  featured: {
    type: Boolean,
    default: false,
    index: true // Index for filtering featured projects
  },
  
  status: {
    type: String,
    enum: {
      values: ['planning', 'in-progress', 'completed', 'archived'],
      message: '{VALUE} is not a valid status'
    },
    default: 'in-progress',
    index: true // Index for status filtering
  },
  
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  
  startDate: {
    type: Date,
    default: null
  },
  
  endDate: {
    type: Date,
    default: null,
    validate: {
      validator: function(v) {
        // End date must be after start date
        if (this.startDate && v) {
          return v >= this.startDate;
        }
        return true;
      },
      message: 'End date must be after start date'
    }
  },
  
  views: {
    type: Number,
    default: 0,
    min: [0, 'Views cannot be negative']
  },
  
  likes: {
    type: Number,
    default: 0,
    min: [0, 'Likes cannot be negative']
  },
  
  tags: {
    type: [String],
    default: []
  },
  
  // Automatically managed fields
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  // Schema options
  timestamps: true, // Adds createdAt and updatedAt automatically
  toJSON: { virtuals: true }, // Include virtuals when converting to JSON
  toObject: { virtuals: true }
});

// ============================================
// INDEXES FOR PERFORMANCE OPTIMIZATION
// ============================================

// Text index for full-text search across title and description
ProjectSchema.index({ title: 'text', description: 'text' });

// Compound index for common queries (featured + newest first)
ProjectSchema.index({ featured: -1, createdAt: -1 });

// Index for status filtering with creation date
ProjectSchema.index({ status: 1, createdAt: -1 });

// Index for technology search (array field)
ProjectSchema.index({ technologies: 1 });

// ============================================
// VIRTUAL PROPERTIES
// ============================================

/**
 * Virtual: Generate URL-friendly slug from title
 * @returns {string} Slug
 */
ProjectSchema.virtual('slug').get(function() {
  return this.title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/--+/g, '-')     // Replace multiple hyphens with single
    .trim();
});

/**
 * Virtual: Calculate project duration in days
 * @returns {number|null} Duration in days
 */
ProjectSchema.virtual('durationDays').get(function() {
  if (this.startDate && this.endDate) {
    const diffTime = Math.abs(this.endDate - this.startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }
  return null;
});

/**
 * Virtual: Check if project is active
 * @returns {boolean} True if project is active
 */
ProjectSchema.virtual('isActive').get(function() {
  return this.status === 'in-progress' || this.status === 'planning';
});

/**
 * Virtual: Calculate engagement score
 * @returns {number} Engagement score (views + likes * 5)
 */
ProjectSchema.virtual('engagementScore').get(function() {
  return this.views + (this.likes * 5);
});

// ============================================
// MIDDLEWARE (HOOKS)
// ============================================

/**
 * Pre-save hook: Convert title to Title Case
 * Runs before saving a document
 */
ProjectSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.title = this.title
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
  next();
});

/**
 * Pre-save hook: Trim and lowercase technologies
 */
ProjectSchema.pre('save', function(next) {
  if (this.isModified('technologies')) {
    this.technologies = this.technologies.map(tech => 
      tech.trim().charAt(0).toUpperCase() + tech.slice(1).toLowerCase()
    );
  }
  next();
});

/**
 * Post-save hook: Log when project is saved
 * Runs after saving a document
 */
ProjectSchema.post('save', function(doc) {
  console.log(`✅ Project "${doc.title}" was saved to database`);
});

/**
 * Post-remove hook: Log when project is deleted
 */
ProjectSchema.post('findOneAndDelete', function(doc) {
  if (doc) {
    console.log(`🗑️  Project "${doc.title}" was deleted from database`);
  }
});

// ============================================
// STATIC METHODS (Model-level)
// ============================================

/**
 * Find projects by technology
 * @param {string} tech - Technology name
 * @returns {Promise<Array>} Projects using that technology
 */
ProjectSchema.statics.findByTechnology = function(tech) {
  return this.find({ 
    technologies: { 
      $in: [new RegExp(tech, 'i')] // Case-insensitive search
    } 
  });
};

/**
 * Get featured projects
 * @param {number} limit - Number of projects to return
 * @returns {Promise<Array>} Featured projects
 */
ProjectSchema.statics.getFeatured = function(limit = 5) {
  return this.find({ featured: true })
    .sort('-createdAt')
    .limit(limit);
};

/**
 * Get projects by status with statistics
 * @param {string} status - Project status
 * @returns {Promise<Object>} Projects and count
 */
ProjectSchema.statics.getByStatus = async function(status) {
  const projects = await this.find({ status });
  const count = await this.countDocuments({ status });
  
  return {
    status,
    count,
    projects
  };
};

/**
 * Get comprehensive statistics
 * @returns {Promise<Object>} Statistics object
 */
ProjectSchema.statics.getStats = async function() {
  const totalProjects = await this.countDocuments();
  const featured = await this.countDocuments({ featured: true });
  const byStatus = await this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
  
  const totalViews = await this.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: '$views' }
      }
    }
  ]);
  
  const totalLikes = await this.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: '$likes' }
      }
    }
  ]);
  
  // Top technologies
  const techCount = await this.aggregate([
    { $unwind: '$technologies' },
    {
      $group: {
        _id: '$technologies',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ]);
  
  return {
    totalProjects,
    featuredProjects: featured,
    projectsByStatus: byStatus,
    totalViews: totalViews[0]?.total || 0,
    totalLikes: totalLikes[0]?.total || 0,
    topTechnologies: techCount
  };
};

/**
 * Search projects by keyword
 * @param {string} keyword - Search keyword
 * @returns {Promise<Array>} Matching projects
 */
ProjectSchema.statics.searchProjects = function(keyword) {
  return this.find(
    { $text: { $search: keyword } },
    { score: { $meta: 'textScore' } }
  ).sort({ score: { $meta: 'textScore' } });
};

// ============================================
// INSTANCE METHODS (Document-level)
// ============================================

/**
 * Toggle featured status
 * @returns {Promise<Object>} Updated project
 */
ProjectSchema.methods.toggleFeatured = function() {
  this.featured = !this.featured;
  return this.save();
};

/**
 * Increment view count
 * @returns {Promise<Object>} Updated project
 */
ProjectSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

/**
 * Increment like count
 * @returns {Promise<Object>} Updated project
 */
ProjectSchema.methods.incrementLikes = function() {
  this.likes += 1;
  return this.save();
};

/**
 * Update project status
 * @param {string} newStatus - New status value
 * @returns {Promise<Object>} Updated project
 */
ProjectSchema.methods.updateStatus = function(newStatus) {
  const validStatuses = ['planning', 'in-progress', 'completed', 'archived'];
  
  if (!validStatuses.includes(newStatus)) {
    throw new Error(`Invalid status: ${newStatus}`);
  }
  
  this.status = newStatus;
  
  // Auto-set end date when completed
  if (newStatus === 'completed' && !this.endDate) {
    this.endDate = new Date();
  }
  
  return this.save();
};

/**
 * Add a technology to the project
 * @param {string} tech - Technology name
 * @returns {Promise<Object>} Updated project
 */
ProjectSchema.methods.addTechnology = function(tech) {
  if (!this.technologies.includes(tech)) {
    this.technologies.push(tech);
    return this.save();
  }
  return this;
};

/**
 * Remove a technology from the project
 * @param {string} tech - Technology name
 * @returns {Promise<Object>} Updated project
 */
ProjectSchema.methods.removeTechnology = function(tech) {
  this.technologies = this.technologies.filter(t => t !== tech);
  return this.save();
};

/**
 * Get formatted project summary
 * @returns {Object} Project summary
 */
ProjectSchema.methods.getSummary = function() {
  return {
    id: this._id,
    title: this.title,
    slug: this.slug,
    status: this.status,
    featured: this.featured,
    technologies: this.technologies,
    views: this.views,
    likes: this.likes,
    engagementScore: this.engagementScore,
    isActive: this.isActive
  };
};

// Create and export the model
const Project = mongoose.model('Project', ProjectSchema);

export default Project;
