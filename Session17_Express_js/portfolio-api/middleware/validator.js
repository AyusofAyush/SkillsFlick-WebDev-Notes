/**
 * Validation Middleware
 * Contains validation functions for different request types
 */

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validate Project Data
 * Ensures required fields are present and valid
 */
export const validateProject = (req, res, next) => {
  const { name, description, tech, category } = req.body;
  const errors = [];

  // Check required fields
  if (!name || name.trim() === '') {
    errors.push('Project name is required');
  }

  if (!description || description.trim() === '') {
    errors.push('Project description is required');
  }

  if (!tech || !Array.isArray(tech) || tech.length === 0) {
    errors.push('At least one technology is required');
  }

  if (!category || category.trim() === '') {
    errors.push('Project category is required');
  }

  // Validate name length
  if (name && name.length > 100) {
    errors.push('Project name must be less than 100 characters');
  }

  // Validate description length
  if (description && description.length < 10) {
    errors.push('Project description must be at least 10 characters');
  }

  // If validation errors exist, return 400
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

/**
 * Validate Contact Form Data
 * Ensures required contact fields are present and valid
 */
export const validateContact = (req, res, next) => {
  const { name, email, message } = req.body;
  const errors = [];

  // Check required fields
  if (!name || name.trim() === '') {
    errors.push('Name is required');
  }

  if (!email || email.trim() === '') {
    errors.push('Email is required');
  }

  if (!message || message.trim() === '') {
    errors.push('Message is required');
  }

  // Validate email format
  if (email && !emailRegex.test(email)) {
    errors.push('Invalid email format');
  }

  // Validate name length
  if (name && (name.length < 2 || name.length > 50)) {
    errors.push('Name must be between 2 and 50 characters');
  }

  // Validate message length
  if (message && message.length < 10) {
    errors.push('Message must be at least 10 characters');
  }

  if (message && message.length > 1000) {
    errors.push('Message must be less than 1000 characters');
  }

  // If validation errors exist, return 400
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

/**
 * Validate ID Parameter
 * Ensures ID is a valid positive integer
 */
export const validateId = (req, res, next) => {
  const id = parseInt(req.params.id);

  if (isNaN(id) || id < 1) {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID parameter. ID must be a positive integer'
    });
  }

  req.validatedId = id;
  next();
};
