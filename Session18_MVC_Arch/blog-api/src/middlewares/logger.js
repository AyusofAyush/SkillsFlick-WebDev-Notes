/**
 * LOGGER MIDDLEWARE
 * 
 * Logs all incoming HTTP requests with details:
 * - Timestamp
 * - HTTP Method
 * - URL
 * - Query parameters
 * - Request body
 * - Response time
 * - Status code
 * 
 * Helps in debugging and monitoring API usage
 */

import config from '../config/config.js';

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  
  // Colors
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  
  // Background colors
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m'
};

/**
 * Get color based on HTTP status code
 */
const getStatusColor = (statusCode) => {
  if (statusCode >= 500) return colors.red;
  if (statusCode >= 400) return colors.yellow;
  if (statusCode >= 300) return colors.cyan;
  if (statusCode >= 200) return colors.green;
  return colors.white;
};

/**
 * Get color based on HTTP method
 */
const getMethodColor = (method) => {
  const methodColors = {
    GET: colors.green,
    POST: colors.blue,
    PUT: colors.yellow,
    DELETE: colors.red,
    PATCH: colors.magenta
  };
  return methodColors[method] || colors.white;
};

/**
 * Logger middleware function
 */
const logger = (req, res, next) => {
  // Only log in development mode
  if (!config.isDevelopment) {
    return next();
  }

  // Record start time
  const startTime = Date.now();

  // Get request details
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl || req.url;
  const ip = req.ip || req.connection.remoteAddress;

  // Log incoming request
  console.log('\n' + colors.bright + '━'.repeat(80) + colors.reset);
  console.log(
    `${colors.cyan}[${timestamp}]${colors.reset} ` +
    `${getMethodColor(method)}${method}${colors.reset} ` +
    `${colors.bright}${url}${colors.reset}`
  );

  // Log query parameters if present
  if (Object.keys(req.query).length > 0) {
    console.log(`${colors.dim}Query:${colors.reset}`, JSON.stringify(req.query, null, 2));
  }

  // Log request body if present (exclude sensitive data)
  if (req.body && Object.keys(req.body).length > 0) {
    const sanitizedBody = { ...req.body };
    // Remove sensitive fields
    delete sanitizedBody.password;
    delete sanitizedBody.token;
    console.log(`${colors.dim}Body:${colors.reset}`, JSON.stringify(sanitizedBody, null, 2));
  }

  // Log IP address
  console.log(`${colors.dim}IP:${colors.reset} ${ip}`);

  // Intercept response to log status and time
  const originalSend = res.send;
  res.send = function (data) {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;
    const statusColor = getStatusColor(statusCode);

    // Log response
    console.log(
      `${statusColor}Status: ${statusCode}${colors.reset} | ` +
      `${colors.yellow}${duration}ms${colors.reset}`
    );

    // Add emoji indicators
    if (statusCode >= 500) {
      console.log(`${colors.red}❌ Server Error${colors.reset}`);
    } else if (statusCode >= 400) {
      console.log(`${colors.yellow}⚠️  Client Error${colors.reset}`);
    } else if (statusCode >= 200) {
      console.log(`${colors.green}✅ Success${colors.reset}`);
    }

    console.log(colors.bright + '━'.repeat(80) + colors.reset);

    // Call original send
    originalSend.call(this, data);
  };

  next();
};

export default logger;
