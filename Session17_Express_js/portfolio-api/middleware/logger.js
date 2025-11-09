import config from '../config/config.js';

/**
 * Request Logger Middleware
 * Logs all incoming requests with timestamp, method, URL, and response time
 */
const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const startTime = Date.now();

  // Log request
  console.log(`\n📥 [${timestamp}] ${req.method} ${req.url}`);
  
  if (Object.keys(req.query).length > 0) {
    console.log(`   Query Params:`, req.query);
  }
  
  if (req.body && Object.keys(req.body).length > 0) {
    console.log(`   Body:`, req.body);
  }

  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const statusColor = res.statusCode >= 400 ? '🔴' : '🟢';
    console.log(`${statusColor} [${timestamp}] ${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`);
  });

  next();
};

export default logger;
