/**
 * Request Logger Middleware
 * 
 * Logs incoming HTTP requests with colored output for development.
 * Tracks request method, URL, query params, body, status, and response time.
 */

import dotenv from 'dotenv';

dotenv.config();

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  
  // Foreground colors
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  
  // Background colors
  bgBlack: '\x1b[40m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m'
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
  switch (method) {
    case 'GET': return colors.blue;
    case 'POST': return colors.green;
    case 'PUT': return colors.yellow;
    case 'PATCH': return colors.magenta;
    case 'DELETE': return colors.red;
    default: return colors.white;
  }
};

/**
 * Request logger middleware
 */
const logger = (req, res, next) => {
  // Only log in development mode
  if (process.env.NODE_ENV !== 'development') {
    return next();
  }

  const startTime = Date.now();
  
  // Log request
  console.log('\n' + colors.bright + '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' + colors.reset);
  console.log(
    `${colors.cyan}📨 ${new Date().toISOString()}${colors.reset} ` +
    `${getMethodColor(req.method)}${req.method}${colors.reset} ` +
    `${colors.bright}${req.originalUrl}${colors.reset}`
  );
  
  // Log query parameters if present
  if (Object.keys(req.query).length > 0) {
    console.log(`${colors.dim}   Query:${colors.reset}`, req.query);
  }
  
  // Log request body for POST/PUT/PATCH
  if (['POST', 'PUT', 'PATCH'].includes(req.method) && Object.keys(req.body).length > 0) {
    console.log(`${colors.dim}   Body:${colors.reset}`, req.body);
  }
  
  // Log IP address
  console.log(`${colors.dim}   IP:${colors.reset} ${req.ip || req.connection.remoteAddress}`);

  // Intercept response to log status and timing
  const originalSend = res.send;
  res.send = function(data) {
    res.send = originalSend;
    
    const duration = Date.now() - startTime;
    const statusColor = getStatusColor(res.statusCode);
    
    console.log(
      `${statusColor}📤 ${res.statusCode}${colors.reset} ` +
      `${colors.dim}| ${duration}ms${colors.reset}`
    );
    
    // Log response status emoji
    if (res.statusCode >= 500) {
      console.log('   ❌ Server Error');
    } else if (res.statusCode >= 400) {
      console.log('   ⚠️  Client Error');
    } else if (res.statusCode >= 200) {
      console.log('   ✅ Success');
    }
    
    console.log(colors.bright + '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' + colors.reset);
    
    return originalSend.call(this, data);
  };

  next();
};

export default logger;
