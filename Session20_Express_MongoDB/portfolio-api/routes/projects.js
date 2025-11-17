/**
 * Project Routes
 * 
 * Complete CRUD API endpoints for Portfolio Projects.
 * 
 * Endpoints:
 * - GET    /api/projects         - Get all projects (with filtering, sorting, pagination)
 * - GET    /api/projects/stats   - Get project statistics
 * - GET    /api/projects/:id     - Get single project by ID
 * - POST   /api/projects         - Create new project
 * - PUT    /api/projects/:id     - Update project
 * - DELETE /api/projects/:id     - Delete project
 * - POST   /api/projects/:id/view   - Increment view count
 * - POST   /api/projects/:id/like   - Increment like count
 * - PATCH  /api/projects/:id/toggle-featured - Toggle featured status
 */

import express from 'express';
import Project from '../models/Project.js';
import asyncHandler from '../middleware/asyncHandler.js';
import { AppError } from '../middleware/errorHandler.js';
import { 
  validateProjectData, 
  validateObjectId, 
  validateQueryParams 
} from '../middleware/validator.js';
import ApiResponse from '../utils/response.js';

const router = express.Router();

// ============================================
// @route   GET /api/projects/stats
// @desc    Get project statistics
// @access  Public
// ============================================
router.get('/stats', asyncHandler(async (req, res) => {
  const stats = await Project.getStats();
  
  ApiResponse.success(
    res,
    stats,
    'Statistics retrieved successfully'
  );
}));

// ============================================
// @route   GET /api/projects/search
// @desc    Search projects by keyword (full-text search)
// @access  Public
// ============================================
router.get('/search', asyncHandler(async (req, res) => {
  const { q } = req.query;
  
  if (!q || q.trim().length === 0) {
    throw new AppError('Please provide a search keyword', 400);
  }
  
  const projects = await Project.searchProjects(q);
  
  ApiResponse.success(
    res,
    projects,
    `Found ${projects.length} projects matching "${q}"`
  );
}));

// ============================================
// @route   GET /api/projects
// @desc    Get all projects with filtering, sorting, and pagination
// @access  Public
// ============================================
router.get('/', validateQueryParams, asyncHandler(async (req, res) => {
  // Extract query parameters
  const { 
    featured, 
    status, 
    technology,
    tag,
    priority,
    sort = '-createdAt',
    page = 1, 
    limit = 10,
    fields
  } = req.query;
  
  // Build query object
  const query = {};
  
  // Filter by featured
  if (featured !== undefined) {
    query.featured = featured === 'true';
  }
  
  // Filter by status
  if (status) {
    query.status = status;
  }
  
  // Filter by technology (case-insensitive)
  if (technology) {
    query.technologies = { $in: [new RegExp(technology, 'i')] };
  }
  
  // Filter by tag
  if (tag) {
    query.tags = tag;
  }
  
  // Filter by priority
  if (priority) {
    query.priority = priority;
  }
  
  // Calculate pagination
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;
  
  // Build field selection
  let selectFields = fields ? fields.split(',').join(' ') : '-__v';
  
  // Execute query
  const projects = await Project.find(query)
    .select(selectFields)
    .sort(sort)
    .skip(skip)
    .limit(limitNum);
  
  // Get total count for pagination
  const total = await Project.countDocuments(query);
  
  // Send paginated response
  ApiResponse.paginated(
    res,
    projects,
    pageNum,
    limitNum,
    total,
    'Projects retrieved successfully'
  );
}));

// ============================================
// @route   GET /api/projects/:id
// @desc    Get single project by ID
// @access  Public
// ============================================
router.get('/:id', validateObjectId, asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id).select('-__v');
  
  if (!project) {
    throw new AppError(`Project not found with id: ${req.params.id}`, 404);
  }
  
  ApiResponse.success(
    res,
    {
      project,
      // Include virtual properties
      slug: project.slug,
      durationDays: project.durationDays,
      isActive: project.isActive,
      engagementScore: project.engagementScore
    },
    'Project retrieved successfully'
  );
}));

// ============================================
// @route   POST /api/projects
// @desc    Create new project
// @access  Private (would add auth later)
// ============================================
router.post('/', validateProjectData, asyncHandler(async (req, res) => {
  // Create project
  const project = await Project.create(req.body);
  
  ApiResponse.created(
    res,
    {
      project,
      slug: project.slug
    },
    'Project created successfully'
  );
}));

// ============================================
// @route   PUT /api/projects/:id
// @desc    Update project
// @access  Private
// ============================================
router.put('/:id', validateObjectId, asyncHandler(async (req, res) => {
  // Find and update project
  const project = await Project.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true, // Return updated document
      runValidators: true // Run schema validators
    }
  );
  
  if (!project) {
    throw new AppError(`Project not found with id: ${req.params.id}`, 404);
  }
  
  ApiResponse.success(
    res,
    {
      project,
      slug: project.slug
    },
    'Project updated successfully'
  );
}));

// ============================================
// @route   DELETE /api/projects/:id
// @desc    Delete project
// @access  Private
// ============================================
router.delete('/:id', validateObjectId, asyncHandler(async (req, res) => {
  const project = await Project.findByIdAndDelete(req.params.id);
  
  if (!project) {
    throw new AppError(`Project not found with id: ${req.params.id}`, 404);
  }
  
  ApiResponse.success(
    res,
    {
      deletedProject: {
        id: project._id,
        title: project.title
      }
    },
    'Project deleted successfully'
  );
}));

// ============================================
// @route   POST /api/projects/:id/view
// @desc    Increment project view count
// @access  Public
// ============================================
router.post('/:id/view', validateObjectId, asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  
  if (!project) {
    throw new AppError(`Project not found with id: ${req.params.id}`, 404);
  }
  
  // Use instance method to increment views
  await project.incrementViews();
  
  ApiResponse.success(
    res,
    {
      views: project.views
    },
    'View count incremented'
  );
}));

// ============================================
// @route   POST /api/projects/:id/like
// @desc    Increment project like count
// @access  Public
// ============================================
router.post('/:id/like', validateObjectId, asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  
  if (!project) {
    throw new AppError(`Project not found with id: ${req.params.id}`, 404);
  }
  
  // Use instance method to increment likes
  await project.incrementLikes();
  
  ApiResponse.success(
    res,
    {
      likes: project.likes
    },
    'Like count incremented'
  );
}));

// ============================================
// @route   PATCH /api/projects/:id/toggle-featured
// @desc    Toggle project featured status
// @access  Private
// ============================================
router.patch('/:id/toggle-featured', validateObjectId, asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  
  if (!project) {
    throw new AppError(`Project not found with id: ${req.params.id}`, 404);
  }
  
  // Use instance method to toggle featured
  await project.toggleFeatured();
  
  ApiResponse.success(
    res,
    {
      featured: project.featured
    },
    `Project ${project.featured ? 'featured' : 'unfeatured'} successfully`
  );
}));

// ============================================
// @route   PATCH /api/projects/:id/status
// @desc    Update project status
// @access  Private
// ============================================
router.patch('/:id/status', validateObjectId, asyncHandler(async (req, res) => {
  const { status } = req.body;
  
  if (!status) {
    throw new AppError('Status is required', 400);
  }
  
  const project = await Project.findById(req.params.id);
  
  if (!project) {
    throw new AppError(`Project not found with id: ${req.params.id}`, 404);
  }
  
  // Use instance method to update status
  await project.updateStatus(status);
  
  ApiResponse.success(
    res,
    {
      status: project.status,
      endDate: project.endDate
    },
    `Project status updated to "${status}"`
  );
}));

// ============================================
// @route   GET /api/projects/technology/:tech
// @desc    Get projects by technology
// @access  Public
// ============================================
router.get('/technology/:tech', asyncHandler(async (req, res) => {
  const { tech } = req.params;
  
  // Use static method to find by technology
  const projects = await Project.findByTechnology(tech);
  
  ApiResponse.success(
    res,
    projects,
    `Found ${projects.length} projects using ${tech}`
  );
}));

// ============================================
// @route   GET /api/projects/featured/list
// @desc    Get featured projects
// @access  Public
// ============================================
router.get('/featured/list', asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 5;
  
  // Use static method to get featured projects
  const projects = await Project.getFeatured(limit);
  
  ApiResponse.success(
    res,
    projects,
    `Retrieved ${projects.length} featured projects`
  );
}));

export default router;
