// Workspace Controller
const Workspace = require('../models/Workspace');
const Page = require('../models/Page');

// Helper function to build page tree
const buildPageTree = async (workspaceId) => {
  try {
    const pages = await Page.find({ workspace: workspaceId }).sort({ title: 1 }).lean();
    
    const pageMap = new Map();
    const rootPages = [];
    
    // Create page map
    pages.forEach(page => {
      pageMap.set(page._id.toString(), { 
        ...page, 
        id: page._id.toString(),
        children: [] 
      });
    });
    
    // Build tree structure
    pages.forEach(page => {
      const pageNode = pageMap.get(page._id.toString());
      if (page.parentPage) {
        const parent = pageMap.get(page.parentPage.toString());
        if (parent) {
          parent.children.push(pageNode);
        } else {
          rootPages.push(pageNode);
        }
      } else {
        rootPages.push(pageNode);
      }
    });
    
    return rootPages;
  } catch (error) {
    console.error('Build page tree error:', error);
    return [];
  }
};

// Show all workspaces for current user
exports.getAllWorkspaces = async (req, res) => {
  try {
    const userId = req.session.userId;
    
    // Find workspaces where user is owner or member
    const workspaces = await Workspace.find({
      $or: [
        { owner: userId },
        { 'members.user': userId }
      ]
    })
    .populate('owner', 'fullName avatar')
    .sort({ updatedAt: -1 })
    .lean();
    
    // Add id field and page count for template compatibility
    const workspacesWithData = await Promise.all(
      workspaces.map(async (w) => {
        const pageCount = await Page.countDocuments({ workspace: w._id });
        return {
          ...w,
          id: w._id.toString(),
          pageCount
        };
      })
    );
    
    res.render('workspaces/index', {
      title: 'My Workspaces',
      workspaces: workspacesWithData,
      user: req.session.user
    });
  } catch (error) {
    console.error('Get workspaces error:', error);
    res.status(500).render('error', {
      title: 'Error',
      errorMessage: 'Failed to load workspaces',
      errorCode: 500,
      user: req.session.user
    });
  }
};

// Show single workspace (home page with pages)
exports.getWorkspace = async (req, res) => {
  try {
    const workspaceId = req.params.id;
    const userId = req.session.userId;
    
    const workspace = await Workspace.findById(workspaceId)
      .populate('owner', 'fullName avatar')
      .populate('members.user', 'fullName avatar')
      .lean();
    
    if (!workspace) {
      return res.status(404).render('404', {
        title: 'Workspace Not Found',
        user: req.session.user
      });
    }
    
    // Add id field for template compatibility
    workspace.id = workspace._id.toString();
    
    // Check if user has access
    const hasAccess = workspace.owner._id.toString() === userId || 
                      workspace.members.some(m => m.user._id.toString() === userId) ||
                      workspace.isPublic;
    
    if (!hasAccess) {
      return res.status(403).render('error', {
        title: 'Access Denied',
        errorMessage: 'You do not have access to this workspace',
        errorCode: 403,
        user: req.session.user
      });
    }
    
    // Get all root pages in this workspace
    const rootPages = await Page.find({
      workspace: workspaceId,
      parentPage: null
    })
    .sort({ updatedAt: -1 })
    .limit(10)
    .lean();
    
    // Get favorite pages
    const favoritePages = await Page.find({
      workspace: workspaceId,
      isFavorite: true
    })
    .sort({ title: 1 })
    .lean();
    
    // Add id field to pages
    const rootPagesWithId = rootPages.map(p => ({ ...p, id: p._id.toString() }));
    const favoritePagesWithId = favoritePages.map(p => ({ ...p, id: p._id.toString() }));
    
    // Get page tree (for sidebar navigation)
    const pageTree = await buildPageTree(workspaceId);
    
    // Mock recent activity
    const recentActivity = [];
    
    res.render('workspaces/show', {
      title: workspace.name,
      workspace,
      rootPages: rootPagesWithId,
      favoritePages: favoritePagesWithId,
      pageTree,
      recentActivity,
      user: req.session.user
    });
  } catch (error) {
    console.error('Get workspace error:', error);
    res.status(500).render('error', {
      title: 'Error',
      errorMessage: error.message || 'Failed to load workspace',
      errorCode: 500,
      errorStack: process.env.NODE_ENV === 'development' ? error.stack : null,
      user: req.session.user
    });
  }
};

// Show create workspace form
exports.showCreateForm = (req, res) => {
  res.render('workspaces/new', {
    title: 'Create Workspace',
    user: req.session.user
  });
};

// Create new workspace
exports.createWorkspace = async (req, res) => {
  try {
    const { name, description, icon, isPublic } = req.body;
    const userId = req.session.userId;
    
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
      isPublic: isPublic === 'on' || isPublic === 'true' || isPublic === true
    });
    
    res.redirect(`/workspaces/${newWorkspace._id}`);
  } catch (error) {
    console.error('Create workspace error:', error);
    res.status(500).render('error', {
      title: 'Error',
      errorMessage: 'Failed to create workspace',
      errorCode: 500,
      user: req.session.user
    });
  }
};

// Show edit workspace form
exports.showEditForm = async (req, res) => {
  try {
    const workspaceId = req.params.id;
    const workspace = await Workspace.findById(workspaceId).lean();
    
    if (!workspace) {
      return res.status(404).render('404', {
        title: 'Workspace Not Found',
        user: req.session.user
      });
    }
    
    // Add id field for template compatibility
    workspace.id = workspace._id.toString();
    
    // Check if user is owner
    if (workspace.owner.toString() !== req.session.userId) {
      return res.status(403).render('error', {
        title: 'Access Denied',
        errorMessage: 'Only the workspace owner can edit settings',
        errorCode: 403,
        user: req.session.user
      });
    }
    
    res.render('workspaces/edit', {
      title: `Edit ${workspace.name}`,
      workspace,
      user: req.session.user
    });
  } catch (error) {
    console.error('Show edit form error:', error);
    res.status(500).render('error', {
      title: 'Error',
      errorMessage: 'Failed to load workspace',
      errorCode: 500,
      user: req.session.user
    });
  }
};

// Update workspace
exports.updateWorkspace = async (req, res) => {
  try {
    const workspaceId = req.params.id;
    const { name, description, icon, isPublic } = req.body;
    
    const workspace = await Workspace.findById(workspaceId);
    
    if (!workspace) {
      return res.status(404).render('404', {
        title: 'Workspace Not Found',
        user: req.session.user
      });
    }
    
    // Check if user is owner
    if (workspace.owner.toString() !== req.session.userId) {
      return res.status(403).render('error', {
        title: 'Access Denied',
        errorMessage: 'Only the workspace owner can edit settings',
        errorCode: 403,
        user: req.session.user
      });
    }
    
    workspace.name = name;
    workspace.description = description || '';
    workspace.icon = icon || '📁';
    workspace.isPublic = isPublic === 'on' || isPublic === 'true' || isPublic === true;
    
    await workspace.save();
    
    res.redirect(`/workspaces/${workspaceId}`);
  } catch (error) {
    console.error('Update workspace error:', error);
    res.status(500).render('error', {
      title: 'Error',
      errorMessage: 'Failed to update workspace',
      errorCode: 500,
      user: req.session.user
    });
  }
};

// Delete workspace
exports.deleteWorkspace = async (req, res) => {
  try {
    const workspaceId = req.params.id;
    
    const workspace = await Workspace.findById(workspaceId);
    
    if (!workspace) {
      return res.status(404).json({ error: 'Workspace not found' });
    }
    
    // Check if user is owner
    if (workspace.owner.toString() !== req.session.userId) {
      return res.status(403).json({ error: 'Only the workspace owner can delete' });
    }
    
    // Delete all pages in workspace
    await Page.deleteMany({ workspace: workspaceId });
    
    // Delete workspace
    await Workspace.findByIdAndDelete(workspaceId);
    
    res.redirect('/workspaces');
  } catch (error) {
    console.error('Delete workspace error:', error);
    res.status(500).json({ error: 'Failed to delete workspace' });
  }
};

// Helper function for building page tree (for other files)
function buildPageTreeSync(workspaceId) {
  // This is for backward compatibility with mock database
  // Not used in MongoDB version
  return [];
}

module.exports = exports;
