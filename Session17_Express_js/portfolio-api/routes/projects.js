import express from 'express';
import { projects } from '../data/mockData.js';
import { validateProject, validateId } from '../middleware/validator.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

/**
 * @route   GET /api/projects
 * @desc    Get all projects with optional filtering, sorting, and pagination
 * @access  Public
 * @query   tech, category, featured, sort, order, page, limit
 */
router.get('/', asyncHandler(async (req, res) => {
  const { tech, category, featured, sort = 'id', order = 'asc', page = 1, limit = 10 } = req.query;
  
  let filteredProjects = [...projects];

  // Filter by technology
  if (tech) {
    const techLower = tech.toLowerCase();
    filteredProjects = filteredProjects.filter(p => 
      p.tech.some(t => t.toLowerCase().includes(techLower))
    );
  }

  // Filter by category
  if (category) {
    const categoryLower = category.toLowerCase();
    filteredProjects = filteredProjects.filter(p => 
      p.category.toLowerCase() === categoryLower
    );
  }

  // Filter by featured status
  if (featured !== undefined) {
    const isFeatured = featured === 'true';
    filteredProjects = filteredProjects.filter(p => p.featured === isFeatured);
  }

  // Sort projects
  const sortField = sort;
  const sortOrder = order.toLowerCase() === 'desc' ? -1 : 1;
  
  filteredProjects.sort((a, b) => {
    if (a[sortField] < b[sortField]) return -1 * sortOrder;
    if (a[sortField] > b[sortField]) return 1 * sortOrder;
    return 0;
  });

  // Pagination
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = startIndex + limitNum;
  const paginatedProjects = filteredProjects.slice(startIndex, endIndex);

  // Response with pagination metadata
  res.status(200).json({
    success: true,
    count: paginatedProjects.length,
    total: filteredProjects.length,
    page: pageNum,
    pages: Math.ceil(filteredProjects.length / limitNum),
    data: paginatedProjects
  });
}));

/**
 * @route   GET /api/projects/stats
 * @desc    Get project statistics
 * @access  Public
 */
router.get('/stats', asyncHandler(async (req, res) => {
  const totalProjects = projects.length;
  const featuredProjects = projects.filter(p => p.featured).length;
  const categories = [...new Set(projects.map(p => p.category))];
  const technologies = [...new Set(projects.flatMap(p => p.tech))];
  
  // Most used technology
  const techCount = {};
  projects.forEach(p => {
    p.tech.forEach(t => {
      techCount[t] = (techCount[t] || 0) + 1;
    });
  });
  
  const mostUsedTech = Object.entries(techCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([tech, count]) => ({ tech, count }));

  res.status(200).json({
    success: true,
    data: {
      totalProjects,
      featuredProjects,
      categories,
      totalTechnologies: technologies.length,
      mostUsedTechnologies: mostUsedTech,
      totalViews: projects.reduce((sum, p) => sum + p.views, 0)
    }
  });
}));

/**
 * @route   GET /api/projects/search
 * @desc    Search projects by name or description
 * @access  Public
 * @query   q (search query)
 */
router.get('/search', asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q || q.trim() === '') {
    throw new AppError('Search query is required', 400);
  }

  const searchTerm = q.toLowerCase();
  const searchResults = projects.filter(p => 
    p.name.toLowerCase().includes(searchTerm) ||
    p.description.toLowerCase().includes(searchTerm) ||
    p.tech.some(t => t.toLowerCase().includes(searchTerm))
  );

  res.status(200).json({
    success: true,
    count: searchResults.length,
    query: q,
    data: searchResults
  });
}));

/**
 * @route   GET /api/projects/:id
 * @desc    Get single project by ID
 * @access  Public
 */
router.get('/:id', validateId, asyncHandler(async (req, res) => {
  const projectId = req.validatedId;
  const project = projects.find(p => p.id === projectId);

  if (!project) {
    throw new AppError(`Project with ID ${projectId} not found`, 404);
  }

  // Increment views
  project.views += 1;

  res.status(200).json({
    success: true,
    data: project
  });
}));

/**
 * @route   GET /api/projects/:id/related
 * @desc    Get related projects based on similar technologies
 * @access  Public
 */
router.get('/:id/related', validateId, asyncHandler(async (req, res) => {
  const projectId = req.validatedId;
  const project = projects.find(p => p.id === projectId);

  if (!project) {
    throw new AppError(`Project with ID ${projectId} not found`, 404);
  }

  // Find projects with similar technologies
  const relatedProjects = projects
    .filter(p => p.id !== projectId)
    .map(p => {
      const commonTech = p.tech.filter(t => project.tech.includes(t));
      return { ...p, matchScore: commonTech.length };
    })
    .filter(p => p.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 3);

  res.status(200).json({
    success: true,
    count: relatedProjects.length,
    data: relatedProjects
  });
}));

/**
 * @route   POST /api/projects
 * @desc    Create a new project
 * @access  Public (should be protected in production)
 */
router.post('/', validateProject, asyncHandler(async (req, res) => {
  const { name, description, tech, category, image, github, live, featured = false } = req.body;

  const newProject = {
    id: projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1,
    name,
    description,
    tech,
    category,
    image: image || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
    github: github || '',
    live: live || '',
    featured,
    views: 0,
    createdAt: new Date().toISOString().split('T')[0]
  };

  projects.push(newProject);

  res.status(201).json({
    success: true,
    message: 'Project created successfully',
    data: newProject
  });
}));

/**
 * @route   PUT /api/projects/:id
 * @desc    Update a project
 * @access  Public (should be protected in production)
 */
router.put('/:id', validateId, validateProject, asyncHandler(async (req, res) => {
  const projectId = req.validatedId;
  const projectIndex = projects.findIndex(p => p.id === projectId);

  if (projectIndex === -1) {
    throw new AppError(`Project with ID ${projectId} not found`, 404);
  }

  const { name, description, tech, category, image, github, live, featured } = req.body;

  projects[projectIndex] = {
    ...projects[projectIndex],
    name,
    description,
    tech,
    category,
    image: image || projects[projectIndex].image,
    github: github || projects[projectIndex].github,
    live: live || projects[projectIndex].live,
    featured: featured !== undefined ? featured : projects[projectIndex].featured
  };

  res.status(200).json({
    success: true,
    message: 'Project updated successfully',
    data: projects[projectIndex]
  });
}));

/**
 * @route   DELETE /api/projects/:id
 * @desc    Delete a project
 * @access  Public (should be protected in production)
 */
router.delete('/:id', validateId, asyncHandler(async (req, res) => {
  const projectId = req.validatedId;
  const projectIndex = projects.findIndex(p => p.id === projectId);

  if (projectIndex === -1) {
    throw new AppError(`Project with ID ${projectId} not found`, 404);
  }

  const deletedProject = projects.splice(projectIndex, 1)[0];

  res.status(200).json({
    success: true,
    message: 'Project deleted successfully',
    data: deletedProject
  });
}));

export default router;
