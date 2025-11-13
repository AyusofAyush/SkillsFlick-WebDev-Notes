/**
 * SERVER ENTRY POINT
 * 
 * This file starts the HTTP server
 * Separating this from app.js allows for:
 * - Better testing (can import app without starting server)
 * - Cleaner separation of concerns
 */

import app from './src/app.js';
import config from './src/config/config.js';

const PORT = config.port;

// Start server
const server = app.listen(PORT, () => {
  console.clear();
  console.log('\n' + '═'.repeat(80));
  console.log('🚀 BLOG API SERVER STARTED SUCCESSFULLY!');
  console.log('═'.repeat(80));
  console.log(`\n📍 Server Details:`);
  console.log(`   • Environment: ${config.nodeEnv}`);
  console.log(`   • Port: ${PORT}`);
  console.log(`   • URL: http://localhost:${PORT}`);
  console.log(`   • API Base: http://localhost:${PORT}${config.apiPrefix}`);
  console.log(`\n📋 Available Endpoints:`);
  console.log(`   • Home: http://localhost:${PORT}/`);
  console.log(`   • Health: http://localhost:${PORT}/health`);
  console.log(`   • Posts: http://localhost:${PORT}${config.apiPrefix}/posts`);
  console.log(`   • Stats: http://localhost:${PORT}${config.apiPrefix}/posts/stats`);
  console.log(`   • Search: http://localhost:${PORT}${config.apiPrefix}/posts/search?q=keyword`);
  console.log(`   • Categories: http://localhost:${PORT}${config.apiPrefix}/posts/categories`);
  console.log(`\n🔒 Security Features:`);
  console.log(`   • Helmet (Security Headers)`);
  console.log(`   • CORS (Cross-Origin)`);
  console.log(`   • Rate Limiting (${config.rateLimit.maxRequests} req/${config.rateLimit.windowMs}ms)`);
  console.log(`\n🎯 MVC Architecture:`);
  console.log(`   • Models: src/models/Post.js`);
  console.log(`   • Controllers: src/controllers/postController.js`);
  console.log(`   • Routes: src/routes/postRoutes.js`);
  console.log(`   • Middleware: src/middlewares/`);
  console.log(`\n📚 Quick Start:`);
  console.log(`   1. Test health: curl http://localhost:${PORT}/health`);
  console.log(`   2. Get all posts: curl http://localhost:${PORT}${config.apiPrefix}/posts`);
  console.log(`   3. Run test script: ./test-api.sh`);
  console.log(`   4. Import Postman collection for complete testing`);
  console.log('\n' + '═'.repeat(80));
  console.log('✨ Ready to accept requests!\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n⚠️  SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n\n⚠️  SIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('💥 UNCAUGHT EXCEPTION! Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('💥 UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
