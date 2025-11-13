/**
 * EXPRESS APPLICATION SETUP
 * 
 * This file configures the Express application:
 * - Loads middleware
 * - Sets up routes
 * - Configures error handling
 * 
 * Separating this from server.js allows for better testing
 */

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import config from './config/config.js';
import logger from './middlewares/logger.js';
import { sanitizeInput } from './middlewares/validator.js';
import { notFoundHandler, globalErrorHandler } from './middlewares/errorHandler.js';
import postRoutes from './routes/postRoutes.js';

// Create Express application
const app = express();

// ========================================
// SECURITY MIDDLEWARE
// ========================================

// Helmet - Sets various HTTP headers for security
app.use(helmet());

// CORS - Enable Cross-Origin Resource Sharing
app.use(cors({
  origin: config.allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate Limiting - Prevent abuse
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: {
    status: 'error',
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/', limiter);

// ========================================
// BODY PARSING MIDDLEWARE
// ========================================

// Parse JSON bodies
app.use(express.json({ limit: '10mb' }));

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ========================================
// CUSTOM MIDDLEWARE
// ========================================

// Request logger (development only)
app.use(logger);

// Input sanitization
app.use(sanitizeInput);

// ========================================
// ROUTES
// ========================================

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: '🚀 Blog API is running!',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
    uptime: process.uptime()
  });
});

// API Info endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to the Blog API! 📝',
    version: '1.0.0',
    description: 'A RESTful Blog API built with Express.js following MVC architecture',
    documentation: {
      postman: '/Blog-API.postman_collection.json',
      readme: '/README.md'
    },
    endpoints: {
      posts: `${config.apiPrefix}/posts`,
      health: '/health'
    },
    features: [
      'MVC Architecture',
      'CRUD Operations',
      'Search & Filtering',
      'Pagination',
      'Input Validation',
      'Error Handling',
      'Security (Helmet, CORS, Rate Limiting)',
      'Request Logging'
    ]
  });
});

// Mount API routes
app.use(`${config.apiPrefix}/posts`, postRoutes);

// ========================================
// ERROR HANDLING
// ========================================

// 404 handler - catch undefined routes
app.use(notFoundHandler);

// Global error handler - catch all errors
app.use(globalErrorHandler);

// ========================================
// EXPORT APP
// ========================================

export default app;
