// Validation Middleware for NoteMaster

const { body, param, query, validationResult } = require('express-validator');

// Helper function to handle validation errors
function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    // For API requests, return JSON
    if (req.path.startsWith('/api/')) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    
    // For web requests, redirect back with errors
    req.session.errors = errors.array();
    
    // Save old input (exclude password fields for security)
    const oldInput = { ...req.body };
    delete oldInput.password;
    delete oldInput.confirmPassword;
    req.session.oldInput = oldInput;
    
    return res.redirect('back');
  }
  
  next();
}

// Workspace validation
const validateWorkspace = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Workspace name is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Workspace name must be between 3 and 100 characters'),
  body('icon')
    .optional()
    .trim()
    .isLength({ max: 10 })
    .withMessage('Icon must be 10 characters or less'),
  body('isPublic')
    .optional()
    .isBoolean()
    .withMessage('isPublic must be a boolean'),
  handleValidationErrors
];

// Page validation
const validatePage = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Page title is required')
    .isLength({ min: 1, max: 200 })
    .withMessage('Page title must be between 1 and 200 characters'),
  body('icon')
    .optional()
    .trim()
    .isLength({ max: 10 })
    .withMessage('Icon must be 10 characters or less'),
  body('content')
    .optional()
    .trim()
    .isLength({ max: 50000 })
    .withMessage('Content must be 50000 characters or less'),
  body('parentPageId')
    .optional()
    .isInt()
    .withMessage('Parent page ID must be an integer'),
  handleValidationErrors
];

// Block validation
const validateBlock = [
  body('type')
    .notEmpty()
    .withMessage('Block type is required')
    .isIn(['paragraph', 'heading1', 'heading2', 'heading3', 'list', 'code', 'callout', 'quote'])
    .withMessage('Invalid block type'),
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Block content is required')
    .isLength({ max: 10000 })
    .withMessage('Block content must be 10000 characters or less'),
  body('order')
    .isInt({ min: 1 })
    .withMessage('Order must be a positive integer'),
  handleValidationErrors
];

// User registration validation
const validateRegister = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),
  body('fullName')
    .trim()
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('confirmPassword')
    .notEmpty()
    .withMessage('Please confirm your password')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Passwords do not match'),
  handleValidationErrors
];

// User login validation
const validateLogin = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

// ID parameter validation
const validateId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID must be a positive integer'),
  handleValidationErrors
];

// Search query validation
const validateSearch = [
  query('q')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Search query must be between 1 and 200 characters'),
  handleValidationErrors
];

// Template validation
const validateTemplate = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Template name is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Template name must be between 3 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must be 500 characters or less'),
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isIn(['productivity', 'projects', 'personal', 'development', 'other'])
    .withMessage('Invalid category'),
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Template content is required')
    .isLength({ max: 50000 })
    .withMessage('Content must be 50000 characters or less'),
  handleValidationErrors
];

module.exports = {
  validateWorkspace,
  validatePage,
  validateBlock,
  validateRegister,
  validateLogin,
  validateId,
  validateSearch,
  validateTemplate,
  handleValidationErrors
};
