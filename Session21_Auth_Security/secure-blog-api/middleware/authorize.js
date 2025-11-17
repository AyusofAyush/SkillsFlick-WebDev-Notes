const logger = require('../utils/logger');

/**
 * Middleware to check if user has one of the allowed roles
 * @param {...string} allowedRoles - Roles that can access the route
 */
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // User must be authenticated first (use authenticateToken before this)
    if (!req.user) {
      logger.warn('Authorization check without authentication', {
        path: req.path
      });
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }
    
    // Check if user's role is in allowed roles
    if (!allowedRoles.includes(req.user.role)) {
      logger.warn('Unauthorized access attempt', {
        userId: req.user._id,
        username: req.user.username,
        userRole: req.user.role,
        requiredRoles: allowedRoles,
        path: req.path
      });
      
      return res.status(403).json({
        success: false,
        message: `Access denied. This route requires one of these roles: ${allowedRoles.join(', ')}`,
        userRole: req.user.role,
        requiredRoles: allowedRoles
      });
    }
    
    logger.info('User authorized', {
      userId: req.user._id,
      role: req.user.role,
      path: req.path
    });
    
    next();
  };
};

/**
 * Middleware to check if user owns the resource or is admin/moderator
 * @param {string} resourceParam - Name of the parameter containing resource owner ID
 */
const authorizeOwnerOrAdmin = (resourceParam = 'userId') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }
    
    const resourceOwnerId = req.params[resourceParam] || req.body[resourceParam];
    
    // Allow if user is admin or moderator
    if (req.user.role === 'admin' || req.user.role === 'moderator') {
      logger.info('Admin/Moderator access granted', {
        userId: req.user._id,
        role: req.user.role
      });
      return next();
    }
    
    // Allow if user owns the resource
    if (req.user._id.toString() === resourceOwnerId) {
      logger.info('Resource owner access granted', {
        userId: req.user._id
      });
      return next();
    }
    
    // Deny access
    logger.warn('Unauthorized resource access attempt', {
      userId: req.user._id,
      resourceOwnerId: resourceOwnerId,
      path: req.path
    });
    
    return res.status(403).json({
      success: false,
      message: 'Access denied. You can only access your own resources.'
    });
  };
};

/**
 * Check specific permissions for resources
 * @param {string} action - The action being performed (create, read, update, delete)
 */
const checkPermission = (action) => {
  const permissions = {
    admin: ['create', 'read', 'update', 'delete', 'publish', 'unpublish', 'manage-users'],
    moderator: ['create', 'read', 'update', 'delete', 'publish', 'unpublish'],
    user: ['create', 'read', 'update-own', 'delete-own']
  };
  
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }
    
    const userPermissions = permissions[req.user.role] || [];
    
    if (userPermissions.includes(action)) {
      logger.info('Permission granted', {
        userId: req.user._id,
        role: req.user.role,
        action: action
      });
      return next();
    }
    
    logger.warn('Permission denied', {
      userId: req.user._id,
      role: req.user.role,
      action: action,
      path: req.path
    });
    
    return res.status(403).json({
      success: false,
      message: `You don't have permission to ${action}`,
      requiredPermission: action
    });
  };
};

module.exports = {
  authorizeRoles,
  authorizeOwnerOrAdmin,
  checkPermission
};
