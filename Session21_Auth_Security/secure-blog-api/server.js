require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const logger = require('./utils/logger');

// Import routes
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');

// Initialize Express app
const app = express();

// ============================================
// 1. SECURITY MIDDLEWARE
// ============================================

// Helmet - Set security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// CORS - Configure allowed origins
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:3000', 'http://localhost:4000'];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  optionsSuccessStatus: 200
}));

// Rate limiting - Prevent brute force attacks
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/api', limiter);

// Data sanitization against NoSQL injection
app.use(mongoSanitize({
  replaceWith: '_',
  onSanitize: ({ req, key }) => {
    logger.warn('Potential NoSQL injection attempt detected', {
      ip: req.ip,
      key: key,
      path: req.path
    });
  }
}));

// ============================================
// 2. BODY PARSING MIDDLEWARE
// ============================================

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser(process.env.COOKIE_SECRET));

// ============================================
// 3. COMPRESSION
// ============================================

app.use(compression());

// ============================================
// 4. REQUEST LOGGING
// ============================================

app.use((req, res, next) => {
  logger.http(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent')
  });
  next();
});

// ============================================
// 5. DATABASE CONNECTION
// ============================================

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // These options are now default in Mongoose 6+
      // but included for clarity
    });

    logger.info('MongoDB Connected Successfully', {
      host: conn.connection.host,
      database: conn.connection.name
    });

  } catch (error) {
    logger.error('MongoDB Connection Error', {
      error: error.message,
      stack: error.stack
    });
    process.exit(1);
  }
};

// Connect to database
connectDB();

// Handle MongoDB connection events
mongoose.connection.on('error', (err) => {
  logger.error('MongoDB connection error', { error: err.message });
});

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected');
});

// ============================================
// 6. ROUTES
// ============================================

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Secure Blog API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        logout: 'POST /api/auth/logout',
        profile: 'GET /api/auth/profile',
        updateProfile: 'PUT /api/auth/profile',
        changePassword: 'PUT /api/auth/change-password',
        refresh: 'POST /api/auth/refresh'
      },
      posts: {
        getAll: 'GET /api/posts',
        getById: 'GET /api/posts/:id',
        create: 'POST /api/posts',
        update: 'PUT /api/posts/:id',
        delete: 'DELETE /api/posts/:id',
        like: 'POST /api/posts/:id/like',
        addComment: 'POST /api/posts/:id/comments',
        deleteComment: 'DELETE /api/posts/:id/comments/:commentId',
        myPosts: 'GET /api/posts/my/posts'
      }
    },
    documentation: 'See PROJECT_SETUP.md for detailed documentation'
  });
});

// ============================================
// 7. ERROR HANDLING
// ============================================

// 404 Handler
app.use((req, res, next) => {
  logger.warn('404 Not Found', {
    path: req.path,
    method: req.method,
    ip: req.ip
  });

  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path
  });
});

// Global error handler
app.use((err, req, res, next) => {
  logger.error('Global error handler', {
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method
  });

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({
      success: false,
      message: `${field} already exists`
    });
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format'
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired'
    });
  }

  // Default error
  res.status(err.statusCode || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ============================================
// 8. SERVER STARTUP
// ============================================

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
  logger.info(`Server started successfully`, {
    port: PORT,
    environment: process.env.NODE_ENV,
    nodeVersion: process.version
  });
  
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║          🔐 SECURE BLOG API - SERVER RUNNING 🔐            ║
║                                                            ║
║  Port:        ${PORT}                                         ║
║  Environment: ${process.env.NODE_ENV || 'development'}                                  ║
║  Health:      http://localhost:${PORT}/health                 ║
║  API Docs:    http://localhost:${PORT}/                       ║
║                                                            ║
║  Security Features Enabled:                                ║
║  ✓ Helmet (Security Headers)                               ║
║  ✓ CORS Protection                                         ║
║  ✓ Rate Limiting                                           ║
║  ✓ NoSQL Injection Protection                              ║
║  ✓ JWT Authentication                                      ║
║  ✓ Password Hashing (Bcrypt)                               ║
║  ✓ Input Validation                                        ║
║  ✓ Request Logging                                         ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);
});

// ============================================
// 9. GRACEFUL SHUTDOWN
// ============================================

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection', {
    error: err.message,
    stack: err.stack
  });
  
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception', {
    error: err.message,
    stack: err.stack
  });
  
  process.exit(1);
});

// Handle SIGTERM
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
    mongoose.connection.close();
  });
});

module.exports = app;
