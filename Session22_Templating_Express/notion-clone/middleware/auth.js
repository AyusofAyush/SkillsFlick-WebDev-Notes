// Authentication Middleware for NoteMaster
const User = require('../models/User');
const Workspace = require('../models/Workspace');

// Check if user is authenticated
function isAuthenticated(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  }
  
  // Save the original URL to redirect after login
  req.session.returnTo = req.originalUrl;
  
  // For API requests, send JSON error
  if (req.path.startsWith('/api/')) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }
  
  // For web requests, redirect to login
  res.redirect('/login?error=auth_required');
}

// Check if user is admin
function isAdmin(req, res, next) {
  if (req.session && req.session.userRole === 'admin') {
    return next();
  }
  
  if (req.path.startsWith('/api/')) {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
  
  res.status(403).render('error', {
    pageTitle: 'Access Denied',
    errorCode: 403,
    errorMessage: 'Admin access required',
    user: req.session.user || null
  });
}

// Check if user owns or has access to workspace
async function canAccessWorkspace(req, res, next) {
  try {
    const workspaceId = req.params.workspaceId || req.params.id;
    const userId = req.session.userId;
    
    console.log(`[canAccessWorkspace] Checking access to workspace: ${workspaceId} for user: ${userId}`);
    
    const workspace = await Workspace.findById(workspaceId).lean();
    
    if (!workspace) {
      console.log(`[canAccessWorkspace] Workspace not found: ${workspaceId}`);
      if (req.path.startsWith('/api/')) {
        return res.status(404).json({
          success: false,
          message: 'Workspace not found'
        });
      }
      return res.status(404).render('404', {
        title: 'Workspace Not Found',
        user: req.session.user || null,
        requestedUrl: req.url
      });
    }
    
    // Check if user is owner or member or if workspace is public
    const isOwner = workspace.owner.toString() === userId;
    const isMember = workspace.members.some(m => m.user.toString() === userId);
    
    if (isOwner || isMember || workspace.isPublic) {
      console.log(`[canAccessWorkspace] Access granted to workspace: ${workspaceId}`);
      req.workspace = workspace;
      return next();
    }
    
    console.log(`[canAccessWorkspace] Access denied to workspace: ${workspaceId}`);
    if (req.path.startsWith('/api/')) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this workspace'
      });
    }
    
    res.status(403).render('error', {
      title: 'Access Denied',
      errorCode: 403,
      errorMessage: 'You don\'t have access to this workspace',
      user: req.session.user || null
    });
  } catch (error) {
    console.error('canAccessWorkspace error:', error);
    if (req.path.startsWith('/api/')) {
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
    res.status(500).render('error', {
      title: 'Error',
      errorCode: 500,
      errorMessage: 'Failed to verify workspace access',
      user: req.session.user || null
    });
  }
}

// Check if user can modify workspace (owner only)
async function canModifyWorkspace(req, res, next) {
  try {
    const workspaceId = req.params.workspaceId || req.params.id;
    const userId = req.session.userId;
    
    const workspace = await Workspace.findById(workspaceId).lean();
    
    if (!workspace) {
      if (req.path.startsWith('/api/')) {
        return res.status(404).json({
          success: false,
          message: 'Workspace not found'
        });
      }
      return res.status(404).render('404', {
        pageTitle: 'Workspace Not Found',
        user: req.session.user || null
      });
    }
    
    if (workspace.owner.toString() === userId) {
      req.workspace = workspace;
      return next();
    }
    
    if (req.path.startsWith('/api/')) {
      return res.status(403).json({
        success: false,
        message: 'Only workspace owner can perform this action'
      });
    }
    
    res.status(403).render('error', {
      pageTitle: 'Access Denied',
      errorCode: 403,
      errorMessage: 'Only workspace owner can perform this action',
      user: req.session.user || null
    });
  } catch (error) {
    console.error('canModifyWorkspace error:', error);
    if (req.path.startsWith('/api/')) {
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
    res.status(500).render('error', {
      pageTitle: 'Error',
      errorCode: 500,
      errorMessage: 'Failed to verify workspace ownership',
      user: req.session.user || null
    });
  }
}

// Attach user object to request if logged in
async function attachUser(req, res, next) {
  try {
    if (req.session && req.session.userId) {
      const user = await User.findById(req.session.userId).lean();
      
      if (user) {
        // Get user's workspaces
        const workspaces = await Workspace.find({
          $or: [
            { owner: user._id },
            { 'members.user': user._id }
          ]
        }).select('_id name').lean();
        
        req.user = {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          avatar: user.avatar,
          role: user.role,
          workspaces: workspaces.map(w => w._id.toString())
        };
        
        // Update session user with workspaces
        req.session.user = req.user;
        res.locals.user = req.user;
      }
    }
    next();
  } catch (error) {
    console.error('attachUser error:', error);
    next(); // Continue even if there's an error
  }
}

module.exports = {
  isAuthenticated,
  isAdmin,
  canAccessWorkspace,
  canModifyWorkspace,
  attachUser
};
