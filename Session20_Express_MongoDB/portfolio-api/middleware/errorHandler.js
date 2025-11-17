/**
 * Global Error Handler Middleware
 * 
 * Centralized error handling for the entire application.
 * Handles different types of errors:
 * - Mongoose validation errors
 * - Mongoose cast errors (invalid ObjectId)
 * - Mongoose duplicate key errors
 * - General application errors
 * 
 * Must be placed after all routes in server.js
 */

/**
 * Custom Error class for operational errors
 */
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;

  // Log error for developers (only in development)
  if (process.env.NODE_ENV === 'development') {
    console.error('\n❌ Error Details:');
    console.error('   • Name:', err.name);
    console.error('   • Message:', err.message);
    console.error('   • Stack:', err.stack);
    console.error('');
  }

  // Mongoose bad ObjectId (CastError)
  if (err.name === 'CastError') {
    const message = `Resource not found with id: ${err.value}`;
    error = new AppError(message, 404);
  }

  // Mongoose duplicate key error (code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    const message = `Duplicate field value: ${field} = "${value}". Please use another value.`;
    error = new AppError(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    const message = errors.join(', ');
    error = new AppError(message, 400);
  }

  // JWT errors (for future authentication)
  if (err.name === 'JsonWebTokenError') {
    error = new AppError('Invalid token. Please log in again.', 401);
  }

  if (err.name === 'TokenExpiredError') {
    error = new AppError('Your token has expired. Please log in again.', 401);
  }

  // Build error response
  const errorResponse = {
    success: false,
    error: error.message || 'Server Error',
    statusCode: error.statusCode
  };

  // Include stack trace in development
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
  }

  // Send response
  res.status(error.statusCode).json(errorResponse);
};

/**
 * Handle 404 - Route not found
 */
export const notFound = (req, res, next) => {
  const error = new AppError(
    `Route not found: ${req.method} ${req.originalUrl}`,
    404
  );
  next(error);
};

export default errorHandler;
