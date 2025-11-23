// API Routes for Testing
const express = require('express');
const router = express.Router();
const Workspace = require('../models/Workspace');
const Page = require('../models/Page');
const Template = require('../models/Template');
const User = require('../models/User');
const { isAuthenticated } = require('../middleware/auth');

// All API routes return JSON
router.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});

// GET /api/workspaces - Get all workspaces for current user
router.get('/workspaces', isAuthenticated, async (req, res) => {
  try {
    const userId = req.session.userId;
    const workspaces = await Workspace.find({
      $or: [
        { owner: userId },
        { 'members.user': userId }
      ]
    }).lean();
    
    res.json({
      success: true,
      count: workspaces.length,
      data: workspaces
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch workspaces',
      error: error.message
    });
  }
});

// GET /api/workspaces/:id - Get single workspace
router.get('/workspaces/:id', isAuthenticated, async (req, res) => {
  try {
    const workspaceId = req.params.id;
    const workspace = await Workspace.findById(workspaceId).lean();
    
    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: 'Workspace not found'
      });
    }
    
    res.json({
      success: true,
      data: workspace
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch workspace',
      error: error.message
    });
  }
});

// GET /api/workspaces/:workspaceId/pages - Get all pages in workspace
router.get('/workspaces/:workspaceId/pages', isAuthenticated, async (req, res) => {
  try {
    const workspaceId = req.params.workspaceId;
    const pages = await Page.find({ workspace: workspaceId }).lean();
    
    res.json({
      success: true,
      count: pages.length,
      data: pages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pages',
      error: error.message
    });
  }
});

// GET /api/pages/:id - Get single page
router.get('/pages/:id', isAuthenticated, async (req, res) => {
  try {
    const pageId = req.params.id;
    const page = await Page.findById(pageId).lean();
    
    if (!page) {
      return res.status(404).json({
        success: false,
        message: 'Page not found'
      });
    }
    
    res.json({
      success: true,
      data: page
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch page',
      error: error.message
    });
  }
});

// POST /api/workspaces - Create new workspace
router.post('/workspaces', isAuthenticated, async (req, res) => {
  try {
    const { name, description, icon, isPublic } = req.body;
    const userId = req.session.userId;
    
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Workspace name is required'
      });
    }
    
    const newWorkspace = await Workspace.create({
      name,
      description,
      icon: icon || '📁',
      owner: userId,
      members: [
        {
          user: userId,
          role: 'owner'
        }
      ],
      isPublic: isPublic || false
    });
    
    res.status(201).json({
      success: true,
      message: 'Workspace created successfully',
      data: newWorkspace
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create workspace',
      error: error.message
    });
  }
});

// POST /api/workspaces/:workspaceId/pages - Create new page
router.post('/workspaces/:workspaceId/pages', isAuthenticated, async (req, res) => {
  try {
    const workspaceId = req.params.workspaceId;
    const { title, icon, content, parentPageId } = req.body;
    const userId = req.session.userId;
    
    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Page title is required'
      });
    }
    
    const newPage = await Page.create({
      workspace: workspaceId,
      title,
      icon: icon || '📄',
      parentPage: parentPageId || null,
      content: content || '',
      author: userId,
      lastEditedBy: userId,
      isFavorite: false
    });
    
    res.status(201).json({
      success: true,
      message: 'Page created successfully',
      data: newPage
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create page',
      error: error.message
    });
  }
});

// PUT /api/pages/:id - Update page
router.put('/pages/:id', isAuthenticated, async (req, res) => {
  try {
    const pageId = req.params.id;
    const { title, icon, content, tags } = req.body;
    
    const updatedPage = await Page.findByIdAndUpdate(
      pageId,
      {
        title,
        icon,
        content,
        tags: tags || [],
        lastEditedBy: req.session.userId
      },
      { new: true }
    );
    
    if (!updatedPage) {
      return res.status(404).json({
        success: false,
        message: 'Page not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Page updated successfully',
      data: updatedPage
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update page',
      error: error.message
    });
  }
});

// DELETE /api/pages/:id - Delete page
router.delete('/pages/:id', isAuthenticated, async (req, res) => {
  try {
    const pageId = req.params.id;
    
    const page = await Page.findById(pageId);
    
    if (!page) {
      return res.status(404).json({
        success: false,
        message: 'Page not found'
      });
    }
    
    // Delete child pages recursively
    const deleteChildren = async (parentId) => {
      const children = await Page.find({ parentPage: parentId });
      for (const child of children) {
        await deleteChildren(child._id);
        await Page.findByIdAndDelete(child._id);
      }
    };
    
    await deleteChildren(pageId);
    await Page.findByIdAndDelete(pageId);
    
    res.json({
      success: true,
      message: 'Page deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete page',
      error: error.message
    });
  }
});

// GET /api/templates - Get all templates
router.get('/templates', isAuthenticated, async (req, res) => {
  try {
    const category = req.query.category;
    const query = category ? { category, isPublic: true } : { isPublic: true };
    const templates = await Template.find(query).lean();
    
    res.json({
      success: true,
      count: templates.length,
      data: templates
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch templates',
      error: error.message
    });
  }
});

// GET /api/templates/:id - Get single template
router.get('/templates/:id', isAuthenticated, async (req, res) => {
  try {
    const template = await Template.findById(req.params.id).lean();
    
    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }
    
    res.json({
      success: true,
      data: template
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch template',
      error: error.message
    });
  }
});

// GET /api/search - Search across all pages
router.get('/search', isAuthenticated, async (req, res) => {
  try {
    const query = req.query.q;
    const workspaceId = req.query.workspace;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }
    
    if (!workspaceId) {
      return res.status(400).json({
        success: false,
        message: 'Workspace ID is required'
      });
    }
    
    const results = await Page.find({
      workspace: workspaceId,
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } }
      ]
    }).lean();
    
    res.json({
      success: true,
      query,
      count: results.length,
      data: results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to search',
      error: error.message
    });
  }
});

// GET /api/stats - Get statistics
router.get('/stats', isAuthenticated, async (req, res) => {
  try {
    const userId = req.session.userId;
    
    const userWorkspaces = await Workspace.find({
      $or: [
        { owner: userId },
        { 'members.user': userId }
      ]
    });
    
    const workspaceIds = userWorkspaces.map(w => w._id);
    const allPages = await Page.find({ workspace: { $in: workspaceIds } });
    const favoritePages = allPages.filter(p => p.isFavorite);
    
    const totalUsers = await User.countDocuments();
    const totalTemplates = await Template.countDocuments({ isPublic: true });
    
    res.json({
      success: true,
      data: {
        totalWorkspaces: userWorkspaces.length,
        totalPages: allPages.length,
        favoritePages: favoritePages.length,
        totalUsers,
        totalTemplates
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stats',
      error: error.message
    });
  }
});

module.exports = router;
