/**
 * Async Handler Middleware
 * 
 * Wraps async route handlers to catch errors and pass them to error middleware.
 * This eliminates the need for try-catch blocks in every route handler.
 * 
 * Usage:
 * router.get('/', asyncHandler(async (req, res) => {
 *   const data = await Model.find();
 *   res.json(data);
 * }));
 */

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
