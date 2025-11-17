/**
 * Request Validation Middleware
 * 
 * Validates incoming request data before processing.
 * Provides clear error messages for invalid data.
 */

import { AppError } from './errorHandler.js';

/**
 * Validate project data for creation/update
 */
export const validateProjectData = (req, res, next) => {
  const { title, description, technologies } = req.body;
  const errors = [];

  // Validate title
  if (!title || title.trim().length === 0) {
    errors.push('Title is required');
  } else if (title.length < 3) {
    errors.push('Title must be at least 3 characters');
  } else if (title.length > 100) {
    errors.push('Title cannot exceed 100 characters');
  }

  // Validate description
  if (!description || description.trim().length === 0) {
    errors.push('Description is required');
  } else if (description.length < 10) {
    errors.push('Description must be at least 10 characters');
  } else if (description.length > 500) {
    errors.push('Description cannot exceed 500 characters');
  }

  // Validate technologies
  if (!technologies || !Array.isArray(technologies)) {
    errors.push('Technologies must be an array');
  } else if (technologies.length === 0) {
    errors.push('At least one technology is required');
  }

  // If there are errors, throw AppError
  if (errors.length > 0) {
    return next(new AppError(errors.join(', '), 400));
  }

  next();
};

/**
 * Validate MongoDB ObjectId
 */
export const validateObjectId = (req, res, next) => {
  const id = req.params.id;
  
  // MongoDB ObjectId is 24 hex characters
  const objectIdPattern = /^[0-9a-fA-F]{24}$/;
  
  if (!objectIdPattern.test(id)) {
    return next(new AppError('Invalid ID format', 400));
  }
  
  next();
};

/**
 * Validate query parameters
 */
export const validateQueryParams = (req, res, next) => {
  const { status, featured, sort, page, limit } = req.query;

  // Validate status
  if (status) {
    const validStatuses = ['planning', 'in-progress', 'completed', 'archived'];
    if (!validStatuses.includes(status)) {
      return next(
        new AppError(
          `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
          400
        )
      );
    }
  }

  // Validate featured
  if (featured !== undefined && featured !== 'true' && featured !== 'false') {
    return next(new AppError('Featured must be true or false', 400));
  }

  // Validate sort
  if (sort) {
    const validSortFields = [
      'title', '-title',
      'createdAt', '-createdAt',
      'views', '-views',
      'likes', '-likes',
      'status', '-status'
    ];
    
    if (!validSortFields.includes(sort)) {
      return next(
        new AppError(
          `Invalid sort field. Must be one of: ${validSortFields.join(', ')}`,
          400
        )
      );
    }
  }

  // Validate pagination
  if (page && (isNaN(page) || parseInt(page) < 1)) {
    return next(new AppError('Page must be a positive number', 400));
  }

  if (limit && (isNaN(limit) || parseInt(limit) < 1 || parseInt(limit) > 100)) {
    return next(new AppError('Limit must be between 1 and 100', 400));
  }

  next();
};

/**
 * Sanitize input to prevent XSS attacks
 */
export const sanitizeInput = (req, res, next) => {
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        // Remove potential HTML/script tags
        req.body[key] = req.body[key]
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .trim();
      }
    });
  }
  next();
};
