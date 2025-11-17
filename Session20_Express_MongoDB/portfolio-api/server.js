/**
 * Portfolio API Server
 * 
 * Express.js server with MongoDB integration demonstrating:
 * - Database connection with Mongoose
 * - RESTful CRUD operations
 * - Error handling
 * - Request validation
 * - Security best practices
 * - Request logging
 * 
 * Port: 4000
 */

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Load environment variables
dotenv.config();

// Import configurations and middleware
import connectDB from './config/database.js';
import logger from './middleware/logger.js';
import errorHandler, { notFound } from './middleware/errorHandler.js';
import { sanitizeInput } from './middleware/validator.js';

// Import routes
import projectRoutes from './routes/projects.js';

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// ============================================
// SECURITY MIDDLEWARE
// ============================================

// Helmet - Set security headers
app.use(helmet());

// CORS - Enable Cross-Origin Resource Sharing
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Rate Limiting - Prevent abuse
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// ============================================
// BODY PARSING MIDDLEWARE
// ============================================

// Parse JSON bodies (limit: 10mb)
app.use(express.json({ limit: '10mb' }));

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============================================
// CUSTOM MIDDLEWARE
// ============================================

// Request logger (development only)
app.use(logger);

// Input sanitization
app.use(sanitizeInput);

// ============================================
// API ROUTES
// ============================================

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🚀 Portfolio API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    uptime: process.uptime()
  });
});

// API information endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the Portfolio API! 🎨',
    version: '1.0.0',
    description: 'RESTful API for managing portfolio projects with MongoDB integration',
    documentation: {
      postman: '/Portfolio-API.postman_collection.json',
      readme: '/README.md'
    },
    endpoints: {
      projects: '/api/projects',
      health: '/health'
    },
    features: [
      'MongoDB & Mongoose ODM',
      'Complete CRUD Operations',
      'Advanced Filtering & Sorting',
      'Pagination Support',
      'Full-text Search',
      'Input Validation',
      'Error Handling',
      'Security (Helmet, CORS, Rate Limiting)',
      'Request Logging',
      'Schema Validation',
      'Indexes for Performance',
      'Virtual Properties',
      'Hooks & Middleware',
      'Custom Methods'
    ]
  });
});

// Mount project routes
app.use('/api/projects', projectRoutes);

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler - Must be after all routes
app.use(notFound);

// Global error handler - Must be last
app.use(errorHandler);

// ============================================
// START SERVER
// ============================================

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
  console.log('\n' + '═'.repeat(80));
  console.log('🚀 PORTFOLIO API SERVER STARTED SUCCESSFULLY!');
  console.log('═'.repeat(80));
  console.log('');
  console.log('📍 Server Details:');
  console.log(`   • Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   • Port: ${PORT}`);
  console.log(`   • URL: http://localhost:${PORT}`);
  console.log(`   • API Base: http://localhost:${PORT}/api`);
  console.log('');
  console.log('📋 Available Endpoints:');
  console.log(`   • Home: http://localhost:${PORT}/`);
  console.log(`   • Health: http://localhost:${PORT}/health`);
  console.log(`   • Projects: http://localhost:${PORT}/api/projects`);
  console.log(`   • Statistics: http://localhost:${PORT}/api/projects/stats`);
  console.log(`   • Search: http://localhost:${PORT}/api/projects/search?q=keyword`);
  console.log(`   • Featured: http://localhost:${PORT}/api/projects/featured/list`);
  console.log('');
  console.log('🔒 Security Features:');
  console.log('   • Helmet (Security Headers)');
  console.log('   • CORS (Cross-Origin Resource Sharing)');
  console.log(`   • Rate Limiting (${process.env.RATE_LIMIT_MAX_REQUESTS || 100} req/${process.env.RATE_LIMIT_WINDOW_MS || 900000}ms)`);
  console.log('');
  console.log('🗄️  MongoDB:');
  console.log('   • Mongoose ODM configured');
  console.log('   • Schema validation enabled');
  console.log('   • Indexes created for performance');
  console.log('');
  console.log('📚 Quick Start:');
  console.log('   1. Test health: curl http://localhost:4000/health');
  console.log('   2. Get all projects: curl http://localhost:4000/api/projects');
  console.log('   3. Run test script: ./test-api.sh');
  console.log('   4. Import Postman collection for complete testing');
  console.log('');
  console.log('═'.repeat(80));
  console.log('✨ Ready to accept requests!');
  console.log('');
});

// ============================================
// GRACEFUL SHUTDOWN
// ============================================

// Handle SIGTERM
process.on('SIGTERM', () => {
  console.log('\n⚠️  SIGTERM received. Shutting down gracefully...');
  
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

// Handle SIGINT (Ctrl+C)
process.on('SIGINT', () => {
  console.log('\n\n⚠️  SIGINT received. Shutting down gracefully...');
  
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('\n❌ UNCAUGHT EXCEPTION! Shutting down...');
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('\n❌ UNHANDLED REJECTION! Shutting down...');
  console.error('Error:', err.message);
  
  server.close(() => {
    process.exit(1);
  });
});

export default app;
