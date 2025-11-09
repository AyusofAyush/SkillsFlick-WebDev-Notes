const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Simple CORS middleware
const setCorsHeaders = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
};

// Store users in memory (in real app, use database)
let users = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Developer' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'Designer' },
  { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', role: 'Manager' }
];

let nextId = 4;

// Helper function to parse request body
const getRequestBody = (req) => {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
  });
};

// Create HTTP server
const server = http.createServer(async (req, res) => {
  // Add CORS headers
  setCorsHeaders(res);

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  console.log(`📨 ${req.method} ${req.url}`);

  // Parse URL
  const urlParts = req.url.split('?');
  const pathname = urlParts[0];
  const queryString = urlParts[1] || '';

  try {
    // Route: Home
    if (pathname === '/' && req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        message: '🚀 Welcome to Session 16 Backend API!',
        version: '1.0.0',
        endpoints: {
          '/': 'API information',
          '/api/users': 'GET all users, POST new user',
          '/api/users/:id': 'GET, PUT, DELETE specific user',
          '/api/server-info': 'Get server system information',
          '/api/file-operations': 'File system operations demo',
          '/api/time': 'Current server time'
        }
      }));
    }

    // Route: Get all users
    else if (pathname === '/api/users' && req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        count: users.length,
        data: users
      }));
    }

    // Route: Create new user
    else if (pathname === '/api/users' && req.method === 'POST') {
      const body = await getRequestBody(req);
      
      if (!body.name || !body.email) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          error: 'Name and email are required'
        }));
        return;
      }

      const newUser = {
        id: nextId++,
        name: body.name,
        email: body.email,
        role: body.role || 'User'
      };

      users.push(newUser);

      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        message: 'User created successfully',
        data: newUser
      }));
    }

    // Route: Get single user
    else if (pathname.match(/^\/api\/users\/\d+$/) && req.method === 'GET') {
      const id = parseInt(pathname.split('/')[3]);
      const user = users.find(u => u.id === id);

      if (user) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          data: user
        }));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          error: 'User not found'
        }));
      }
    }

    // Route: Update user
    else if (pathname.match(/^\/api\/users\/\d+$/) && req.method === 'PUT') {
      const id = parseInt(pathname.split('/')[3]);
      const body = await getRequestBody(req);
      const userIndex = users.findIndex(u => u.id === id);

      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...body, id };
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          message: 'User updated successfully',
          data: users[userIndex]
        }));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          error: 'User not found'
        }));
      }
    }

    // Route: Delete user
    else if (pathname.match(/^\/api\/users\/\d+$/) && req.method === 'DELETE') {
      const id = parseInt(pathname.split('/')[3]);
      const userIndex = users.findIndex(u => u.id === id);

      if (userIndex !== -1) {
        const deletedUser = users.splice(userIndex, 1)[0];
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          message: 'User deleted successfully',
          data: deletedUser
        }));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          error: 'User not found'
        }));
      }
    }

    // Route: Server information (demonstrates OS module)
    else if (pathname === '/api/server-info' && req.method === 'GET') {
      const serverInfo = {
        platform: os.platform(),
        architecture: os.arch(),
        cpuCores: os.cpus().length,
        totalMemory: `${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB`,
        freeMemory: `${(os.freemem() / 1024 / 1024 / 1024).toFixed(2)} GB`,
        uptime: `${(os.uptime() / 60 / 60).toFixed(2)} hours`,
        nodeVersion: process.version,
        hostname: os.hostname()
      };

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        data: serverInfo
      }));
    }

    // Route: File operations demo
    else if (pathname === '/api/file-operations' && req.method === 'GET') {
      const dataDir = path.join(__dirname, 'data');
      const logFile = path.join(dataDir, 'server.log');

      // Ensure data directory exists
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      // Write log entry
      const logEntry = `[${new Date().toISOString()}] API called: /api/file-operations\n`;
      fs.appendFileSync(logFile, logEntry);

      // Read log file
      const logs = fs.existsSync(logFile) 
        ? fs.readFileSync(logFile, 'utf8').split('\n').filter(line => line).slice(-10)
        : [];

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        message: 'File operations completed',
        data: {
          logFile: logFile,
          recentLogs: logs,
          filesInDataDir: fs.readdirSync(dataDir)
        }
      }));
    }

    // Route: Current time
    else if (pathname === '/api/time' && req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        data: {
          timestamp: Date.now(),
          datetime: new Date().toISOString(),
          formatted: new Date().toLocaleString()
        }
      }));
    }

    // 404 Not Found
    else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: false,
        error: 'Route not found',
        message: `Cannot ${req.method} ${pathname}`
      }));
    }

  } catch (error) {
    console.error('❌ Server error:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: false,
      error: 'Internal server error',
      message: error.message
    }));
  }
});

// Server configuration
const PORT = 3001;
const HOSTNAME = 'localhost';

// Start server
server.listen(PORT, HOSTNAME, () => {
  console.log('\n🚀 ================================');
  console.log('   Session 16 Backend Server');
  console.log('   ================================');
  console.log(`   ✅ Server running at http://${HOSTNAME}:${PORT}`);
  console.log(`   📝 Platform: ${os.platform()}`);
  console.log(`   💻 Node.js: ${process.version}`);
  console.log(`   🔧 CPU Cores: ${os.cpus().length}`);
  console.log('   ================================\n');
  console.log('   📌 Available Endpoints:');
  console.log(`      GET    http://${HOSTNAME}:${PORT}/`);
  console.log(`      GET    http://${HOSTNAME}:${PORT}/api/users`);
  console.log(`      POST   http://${HOSTNAME}:${PORT}/api/users`);
  console.log(`      GET    http://${HOSTNAME}:${PORT}/api/users/:id`);
  console.log(`      PUT    http://${HOSTNAME}:${PORT}/api/users/:id`);
  console.log(`      DELETE http://${HOSTNAME}:${PORT}/api/users/:id`);
  console.log(`      GET    http://${HOSTNAME}:${PORT}/api/server-info`);
  console.log(`      GET    http://${HOSTNAME}:${PORT}/api/file-operations`);
  console.log(`      GET    http://${HOSTNAME}:${PORT}/api/time`);
  console.log('   ================================\n');
});

// Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Please close other applications or use a different port.`);
  } else {
    console.error('❌ Server error:', error);
  }
  process.exit(1);
});
