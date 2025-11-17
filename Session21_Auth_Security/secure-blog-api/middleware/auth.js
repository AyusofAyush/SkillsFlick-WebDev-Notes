const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

/**
 * Middleware to authenticate JWT tokens
 * Verifies the token and attaches user to request object
 */
const authenticateToken = async (req, res, next) => {
  try {
    // 1. Get token from Authorization header only (not from cookies)
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      // Bearer token in header
      token = req.headers.authorization.split(' ')[1];
    }
    
    // 2. Check if token exists
    if (!token) {
      logger.warn('Access attempt without token', {
        ip: req.ip,
        path: req.path
      });
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided in Authorization header.'
      });
    }
    
    // 3. Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      logger.warn('Invalid token attempt', {
        ip: req.ip,
        error: error.message
      });
      
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token has expired. Please login again.',
          code: 'TOKEN_EXPIRED'
        });
      }
      
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Access denied.',
        code: 'INVALID_TOKEN'
      });
    }
    
    // 4. Get user from token
    const user = await User.findById(decoded.userId).select('-password -refreshTokens');
    
    if (!user) {
      logger.warn('Token valid but user not found', {
        userId: decoded.userId,
        ip: req.ip
      });
      return res.status(401).json({
        success: false,
        message: 'User not found. Token invalid.'
      });
    }
    
    // 5. Check if user is active
    if (!user.isActive) {
      logger.warn('Inactive user access attempt', {
        userId: user._id,
        username: user.username
      });
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact support.'
      });
    }
    
    // 6. Check if user changed password after token was issued
    if (user.changedPasswordAfter(decoded.iat)) {
      logger.warn('Token used after password change', {
        userId: user._id,
        tokenIat: decoded.iat
      });
      return res.status(401).json({
        success: false,
        message: 'Password was recently changed. Please login again.',
        code: 'PASSWORD_CHANGED'
      });
    }
    
    // 7. Attach user to request object
    req.user = user;
    req.token = token;
    
    logger.info('User authenticated successfully', {
      userId: user._id,
      username: user.username,
      role: user.role
    });
    
    next();
    
  } catch (error) {
    logger.error('Authentication error', {
      error: error.message,
      stack: error.stack
    });
    
    return res.status(500).json({
      success: false,
      message: 'Authentication error occurred.'
    });
  }
};

/**
 * Optional authentication - doesn't fail if no token
 * Useful for endpoints that work differently for authenticated users
 */
const optionalAuth = async (req, res, next) => {
  try {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    
    if (!token) {
      // No token provided, continue without user
      return next();
    }
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password -refreshTokens');
      
      if (user && user.isActive && !user.changedPasswordAfter(decoded.iat)) {
        req.user = user;
      }
    } catch (error) {
      // Invalid token, but don't fail - just continue without user
      logger.debug('Optional auth - invalid token ignored', {
        error: error.message
      });
    }
    
    next();
    
  } catch (error) {
    logger.error('Optional auth error', {
      error: error.message
    });
    next();
  }
};

module.exports = { authenticateToken, optionalAuth };
