/**
 * ERROR HANDLER MIDDLEWARE
 * 
 * Centralized error handling for the entire application
 * Catches errors from routes and controllers
 * Formats error responses consistently
 */

import config from '../config/config.js';

/**
 * Custom Error Class
 * Extends native Error with additional properties
 */
export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';
    this.isOperational = true;

    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Async Handler Wrapper
 * Wraps async route handlers to catch errors automatically
 * 
 * Usage:
 * router.get('/route', asyncHandler(async (req, res) => {
 *   // async code here
 * }));
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * 404 Not Found Handler
 * Catches requests to undefined routes
 */
export const notFoundHandler = (req, res, next) => {
  const error = new AppError(
    `Cannot ${req.method} ${req.originalUrl} - Route not found`,
    404
  );
  next(error);
};

/**
 * Global Error Handler
 * Catches all errors and sends formatted response
 */
export const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log error details in development
  if (config.isDevelopment) {
    console.error('\n🔥 ERROR DETAILS:');
    console.error('Message:', err.message);
    console.error('Status:', err.statusCode);
    console.error('Stack:', err.stack);
    console.error('━'.repeat(80) + '\n');
  }

  // Send error response
  const errorResponse = {
    status: err.status,
    message: err.message,
    ...(config.isDevelopment && { stack: err.stack }) // Include stack trace in development
  };

  res.status(err.statusCode).json(errorResponse);
};

/**
 * Validation Error Handler
 * Specifically for handling validation errors
 */
export const validationErrorHandler = (errors) => {
  const message = errors.join(', ');
  return new AppError(message, 400);
};
