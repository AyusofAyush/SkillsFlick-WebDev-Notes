import config from '../config/config.js';

/**
 * Custom Error Class
 * Extends the native Error class with status code
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
 * Async Error Handler Wrapper
 * Wraps async route handlers to catch errors automatically
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Not Found Handler
 * Catches all undefined routes
 */
export const notFoundHandler = (req, res, next) => {
  const error = new AppError(
    `Cannot find ${req.method} ${req.originalUrl} on this server`,
    404
  );
  next(error);
};

/**
 * Global Error Handler
 * Handles all errors and sends appropriate response
 */
export const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log error in development
  if (config.nodeEnv === 'development') {
    console.error('🔴 ERROR:', err);
  }

  // Send error response
  res.status(err.statusCode).json({
    success: false,
    status: err.status,
    message: err.message,
    ...(config.nodeEnv === 'development' && {
      error: err,
      stack: err.stack
    })
  });
};
