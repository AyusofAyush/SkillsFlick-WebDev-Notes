/**
 * VALIDATION MIDDLEWARE
 * 
 * Validates request data before passing to controllers
 * Provides reusable validation functions
 */

import { AppError } from './errorHandler.js';

/**
 * Validate Post Data
 * Ensures all required fields are present and valid
 */
export const validatePostData = (req, res, next) => {
  const { title, content, author } = req.body;
  const errors = [];

  // Check required fields
  if (!title || title.trim().length === 0) {
    errors.push('Title is required');
  }

  if (!content || content.trim().length === 0) {
    errors.push('Content is required');
  }

  if (!author || author.trim().length === 0) {
    errors.push('Author is required');
  }

  // If errors found, send error response
  if (errors.length > 0) {
    return res.status(400).json({
      status: 'fail',
      message: 'Validation failed',
      errors
    });
  }

  // Validation passed, continue
  next();
};

/**
 * Validate ID Parameter
 * Ensures ID is a valid positive integer
 */
export const validateId = (req, res, next) => {
  const { id } = req.params;
  const numId = parseInt(id);

  if (isNaN(numId) || numId < 1) {
    return res.status(400).json({
      status: 'fail',
      message: 'Invalid ID parameter. Must be a positive integer.'
    });
  }

  next();
};

/**
 * Validate Query Parameters
 * Ensures query parameters are valid
 */
export const validateQueryParams = (req, res, next) => {
  const { sortBy, page, limit } = req.query;

  // Validate sortBy
  if (sortBy && !['newest', 'oldest', 'popular', 'likes'].includes(sortBy)) {
    return res.status(400).json({
      status: 'fail',
      message: 'Invalid sortBy parameter. Must be: newest, oldest, popular, or likes'
    });
  }

  // Validate page
  if (page && (isNaN(page) || parseInt(page) < 1)) {
    return res.status(400).json({
      status: 'fail',
      message: 'Invalid page parameter. Must be a positive integer.'
    });
  }

  // Validate limit
  if (limit && (isNaN(limit) || parseInt(limit) < 1 || parseInt(limit) > 100)) {
    return res.status(400).json({
      status: 'fail',
      message: 'Invalid limit parameter. Must be between 1 and 100.'
    });
  }

  next();
};

/**
 * Sanitize Input
 * Remove potentially dangerous characters
 */
export const sanitizeInput = (req, res, next) => {
  // Sanitize body fields
  if (req.body) {
    for (let key in req.body) {
      if (typeof req.body[key] === 'string') {
        // Trim whitespace
        req.body[key] = req.body[key].trim();
        
        // Remove script tags (basic XSS protection)
        req.body[key] = req.body[key].replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
      }
    }
  }

  next();
};
