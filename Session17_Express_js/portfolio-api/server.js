import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import config from './config/config.js';
import logger from './middleware/logger.js';
import { notFoundHandler, globalErrorHandler } from './middleware/errorHandler.js';

// Import routes
import projectsRouter from './routes/projects.js';
import skillsRouter from './routes/skills.js';
import aboutRouter from './routes/about.js';
import contactRouter from './routes/contact.js';

// Create Express application
const app = express();

// ============================================
// SECURITY MIDDLEWARE
// ============================================

// Helmet for security headers
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: config.allowedOrigins,
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(`${config.apiPrefix}/`, limiter);

// ============================================
// BODY PARSING MIDDLEWARE
// ============================================

// Parse JSON bodies
app.use(express.json({ limit: '10mb' }));

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============================================
// CUSTOM MIDDLEWARE
// ============================================

// Request logger
app.use(logger);

// ============================================
// ROUTES
// ============================================

// Home route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Portfolio API! 🚀',
    version: '1.0.0',
    endpoints: {
      projects: `${config.apiPrefix}/projects`,
      skills: `${config.apiPrefix}/skills`,
      about: `${config.apiPrefix}/about`,
      contact: `${config.apiPrefix}/contact`
    },
    documentation: 'See README.md for full API documentation',
    timestamp: new Date().toISOString()
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv
  });
});

// API routes
app.use(`${config.apiPrefix}/projects`, projectsRouter);
app.use(`${config.apiPrefix}/skills`, skillsRouter);
app.use(`${config.apiPrefix}/about`, aboutRouter);
app.use(`${config.apiPrefix}/contact`, contactRouter);

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler - must be after all other routes
app.use(notFoundHandler);

// Global error handler - must be last
app.use(globalErrorHandler);

// ============================================
// START SERVER
// ============================================

app.listen(config.port, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   🚀 PORTFOLIO API SERVER STARTED SUCCESSFULLY 🚀     ║
║                                                       ║
╠═══════════════════════════════════════════════════════╣
║                                                       ║
║   📍 Server URL:  http://localhost:${config.port}              ║
║   🌍 Environment: ${config.nodeEnv.toUpperCase().padEnd(11)}                    ║
║   📡 API Prefix:  ${config.apiPrefix}                          ║
║                                                       ║
╠═══════════════════════════════════════════════════════╣
║                                                       ║
║   📚 Available Endpoints:                             ║
║                                                       ║
║   • GET  /                      - API Info            ║
║   • GET  /health                - Health Check        ║
║                                                       ║
║   • GET  ${config.apiPrefix}/projects         - All Projects      ║
║   • GET  ${config.apiPrefix}/projects/:id     - Single Project    ║
║   • POST ${config.apiPrefix}/projects         - Create Project    ║
║                                                       ║
║   • GET  ${config.apiPrefix}/skills           - All Skills        ║
║   • GET  ${config.apiPrefix}/skills/:category - Skills by Cat     ║
║                                                       ║
║   • GET  ${config.apiPrefix}/about            - About Info        ║
║   • GET  ${config.apiPrefix}/about/experience - Experience        ║
║                                                       ║
║   • POST ${config.apiPrefix}/contact          - Submit Contact    ║
║                                                       ║
╠═══════════════════════════════════════════════════════╣
║                                                       ║
║   💡 Ready to accept requests!                        ║
║   📖 Check README.md for full documentation           ║
║   🧪 Use test-api.sh or Postman collection to test    ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('🔴 UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('🔴 UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

export default app;
