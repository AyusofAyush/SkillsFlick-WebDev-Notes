// Error Handler Middleware

// 404 Not Found Handler
function notFound(req, res, next) {
  res.status(404).render('404', {
    pageTitle: 'Page Not Found',
    user: req.session.user || null,
    requestedUrl: req.url
  });
}

// Global Error Handler
function errorHandler(err, req, res, next) {
  console.error('Error:', err);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  // For API requests, return JSON
  if (req.path.startsWith('/api/')) {
    return res.status(statusCode).json({
      success: false,
      message: message,
      error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
  
  // For web requests, render error page
  res.status(statusCode).render('error', {
    pageTitle: 'Error',
    errorCode: statusCode,
    errorMessage: message,
    errorStack: process.env.NODE_ENV === 'development' ? err.stack : null,
    user: req.session.user || null
  });
}

module.exports = {
  notFound,
  errorHandler
};
