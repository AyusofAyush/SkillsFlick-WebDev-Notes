# 🎨 Portfolio API - MongoDB Integration with Mongoose

A comprehensive RESTful API for managing portfolio projects, built with Express.js and MongoDB, demonstrating best practices in backend development, database design, and API architecture.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Advanced Features](#advanced-features)
- [Security](#security)
- [Troubleshooting](#troubleshooting)
- [Learning Resources](#learning-resources)

## 🎯 Overview

This Portfolio API demonstrates MongoDB integration with Mongoose ODM, showcasing:

- Complete CRUD operations
- Schema validation and data modeling
- Advanced Mongoose features (virtuals, hooks, statics, methods)
- Performance optimization with indexes
- Full-text search capabilities
- Comprehensive error handling
- Security best practices

## ✨ Features

### Core Features

- ✅ **CRUD Operations** - Create, Read, Update, Delete projects
- ✅ **Advanced Filtering** - Filter by status, technology, tags, priority, featured
- ✅ **Sorting** - Sort by any field (ascending/descending)
- ✅ **Pagination** - Efficient pagination with metadata
- ✅ **Full-text Search** - Search across titles and descriptions
- ✅ **Field Selection** - Request only needed fields
- ✅ **Statistics** - Comprehensive analytics with aggregation

### Mongoose Features

- 📝 **Schema Validation** - Required fields, min/max, enums, regex, custom validators
- 🔍 **Indexes** - Text search, compound indexes for performance
- 🎯 **Virtual Properties** - Computed fields (slug, duration, engagement score)
- 🔄 **Hooks/Middleware** - Pre-save transformations, post-save logging
- 📊 **Static Methods** - Model-level queries (statistics, search)
- 🛠️ **Instance Methods** - Document-level operations (increment views/likes)

### Developer Experience

- 🔒 **Security** - Helmet, CORS, rate limiting, input sanitization
- 📋 **Validation** - Schema validation + middleware validators
- ⚠️ **Error Handling** - Global error handler with detailed messages
- 📝 **Logging** - Colored request/response logging
- 🧪 **Testing** - Bash script + Postman collection
- 📚 **Documentation** - Comprehensive README and inline comments

## 🛠️ Tech Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js v4.18.2
- **Database**: MongoDB (local or Atlas)
- **ODM**: Mongoose v8.0.3
- **Security**: Helmet v7.1.0, CORS v2.8.5, Express Rate Limit v7.1.5
- **Configuration**: dotenv v16.3.1
- **Development**: Nodemon v3.0.2

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)

  ```bash
  node --version  # Should be >= 18.0.0
  ```

- **npm** (comes with Node.js)

  ```bash
  npm --version
  ```

- **MongoDB** (local installation OR MongoDB Atlas account)
  - **Local**: [Download MongoDB Community Server](https://www.mongodb.com/try/download/community)
  - **Cloud**: [Create MongoDB Atlas Account](https://www.mongodb.com/cloud/atlas/register)

- **curl** (for testing) - Usually pre-installed on macOS/Linux

  ```bash
  curl --version
  ```

- **jq** (optional, for pretty JSON in bash script)

  ```bash
  # macOS
  brew install jq
  
  # Linux
  sudo apt-get install jq
  ```

## 🚀 Installation

### 1. Clone or Navigate to Project

```bash
cd /Users/ayushraj/Ayush/Temp-SkillsFlick/Session20/portfolio-api
```

### 2. Install Dependencies

```bash
npm install
```

This will install:

- express (4.18.2)
- mongoose (8.0.3)
- dotenv (16.3.1)
- cors (2.8.5)
- helmet (7.1.0)
- express-rate-limit (7.1.5)
- nodemon (3.0.2, dev dependency)

## ⚙️ Configuration

### Environment Variables

The project uses a `.env` file for configuration. A default `.env` file is already created with sensible defaults.

**Default `.env` contents:**

```env
# Server Configuration
PORT=4000
NODE_ENV=development

# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/portfolioDB
# For MongoDB Atlas, use:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolioDB?retryWrites=true&w=majority

# API Configuration
API_PREFIX=/api

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:4000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### MongoDB Setup

**Option 1: Local MongoDB (Recommended for Development)**

1. Install MongoDB Community Server
2. Start MongoDB service:

   ```bash
   # macOS (with Homebrew)
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   
   # Windows
   net start MongoDB
   ```

3. Verify MongoDB is running:

   ```bash
   mongosh  # Should connect to MongoDB shell
   ```

**Option 2: MongoDB Atlas (Cloud)**

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create a free cluster
3. Create database user
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get connection string and update `.env`:

   ```env
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolioDB?retryWrites=true&w=majority
   ```

For detailed Atlas setup, see [MONGODB_SETUP.md](./docs/MONGODB_SETUP.md) (if available).

## 🏃 Running the Application

### Development Mode (with auto-restart)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

### Expected Output

```
═══════════════════════════════════════════════════════════════════════════════
🚀 PORTFOLIO API SERVER STARTED SUCCESSFULLY!
═══════════════════════════════════════════════════════════════════════════════

📍 Server Details:
   • Environment: development
   • Port: 4000
   • URL: http://localhost:4000
   • API Base: http://localhost:4000/api

📋 Available Endpoints:
   • Home: http://localhost:4000/
   • Health: http://localhost:4000/health
   • Projects: http://localhost:4000/api/projects
   • Statistics: http://localhost:4000/api/projects/stats
   • Search: http://localhost:4000/api/projects/search?q=keyword
   • Featured: http://localhost:4000/api/projects/featured/list

🔒 Security Features:
   • Helmet (Security Headers)
   • CORS (Cross-Origin Resource Sharing)
   • Rate Limiting (100 req/900000ms)

🗄️  MongoDB:
   • Mongoose ODM configured
   • Schema validation enabled
   • Indexes created for performance

📚 Quick Start:
   1. Test health: curl http://localhost:4000/health
   2. Get all projects: curl http://localhost:4000/api/projects
   3. Run test script: ./test-api.sh
   4. Import Postman collection for complete testing

═══════════════════════════════════════════════════════════════════════════════
✨ Ready to accept requests!
```

## 📚 API Documentation

### Base URL

```
http://localhost:4000
```

### Endpoints Overview

#### System Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/` | API information |

#### Project Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | Get all projects (with filtering, sorting, pagination) |
| GET | `/api/projects/:id` | Get single project by ID |
| POST | `/api/projects` | Create new project |
| PUT | `/api/projects/:id` | Update project |
| DELETE | `/api/projects/:id` | Delete project |
| GET | `/api/projects/stats` | Get statistics |
| GET | `/api/projects/search?q=keyword` | Full-text search |
| GET | `/api/projects/featured/list` | Get featured projects |
| GET | `/api/projects/technology/:tech` | Find by technology |
| POST | `/api/projects/:id/view` | Increment views |
| POST | `/api/projects/:id/like` | Increment likes |
| PATCH | `/api/projects/:id/toggle-featured` | Toggle featured |
| PATCH | `/api/projects/:id/status` | Update status |

### Detailed Examples

#### 1. Create Project

```bash
curl -X POST http://localhost:4000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "title": "E-Commerce Platform",
    "description": "A full-stack e-commerce platform with MERN stack",
    "technologies": ["MongoDB", "Express.js", "React", "Node.js"],
    "githubUrl": "https://github.com/user/project",
    "liveUrl": "https://example.com",
    "featured": true,
    "status": "completed",
    "priority": "high",
    "startDate": "2024-01-15",
    "endDate": "2024-03-20",
    "tags": ["fullstack", "ecommerce"]
  }'
```

#### 2. Get All Projects (with filters)

```bash
# Basic
curl http://localhost:4000/api/projects

# With pagination
curl http://localhost:4000/api/projects?page=1&limit=10

# Filter by status
curl http://localhost:4000/api/projects?status=completed

# Filter by featured
curl http://localhost:4000/api/projects?featured=true

# Filter by technology
curl http://localhost:4000/api/projects?technology=React

# Sort by views (descending)
curl http://localhost:4000/api/projects?sort=-views

# Multiple filters + sorting
curl http://localhost:4000/api/projects?status=completed&featured=true&sort=-createdAt

# Field selection
curl http://localhost:4000/api/projects?fields=title,description,technologies
```

#### 3. Search Projects

```bash
curl http://localhost:4000/api/projects/search?q=commerce
```

#### 4. Get Statistics

```bash
curl http://localhost:4000/api/projects/stats
```

#### 5. Update Project

```bash
curl -X PUT http://localhost:4000/api/projects/PROJECT_ID \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Updated description",
    "priority": "medium"
  }'
```

#### 6. Increment Views

```bash
curl -X POST http://localhost:4000/api/projects/PROJECT_ID/view
```

#### 7. Delete Project

```bash
curl -X DELETE http://localhost:4000/api/projects/PROJECT_ID
```

### Query Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `page` | Number | Page number (default: 1) | `?page=2` |
| `limit` | Number | Items per page (default: 10, max: 100) | `?limit=20` |
| `sort` | String | Sort field (prefix `-` for descending) | `?sort=-createdAt` |
| `fields` | String | Comma-separated fields to return | `?fields=title,description` |
| `status` | String | Filter by status | `?status=completed` |
| `featured` | Boolean | Filter by featured | `?featured=true` |
| `technology` | String | Filter by technology | `?technology=React` |
| `tag` | String | Filter by tag | `?tag=fullstack` |
| `priority` | String | Filter by priority | `?priority=high` |

## 🧪 Testing

### Option 1: Bash Script (Automated Testing)

Run the comprehensive test script:

```bash
./test-api.sh
```

This script tests:

- ✅ Health check
- ✅ Create projects
- ✅ Get all projects
- ✅ Get by ID
- ✅ Filtering (status, featured, technology, tag, priority)
- ✅ Sorting
- ✅ Pagination
- ✅ Full-text search
- ✅ Statistics
- ✅ Increment views/likes
- ✅ Toggle featured
- ✅ Update status
- ✅ Update project
- ✅ Delete project
- ✅ Error handling

### Option 2: Postman Collection

1. Import `Portfolio-API.postman_collection.json` into Postman
2. Collection includes:
   - 📁 System (health, info)
   - 📁 Create (3 sample projects)
   - 📁 Read (get all, by ID, pagination, sorting, field selection)
   - 📁 Filter & Search (7 filtering scenarios)
   - 📁 Statistics
   - 📁 Update (5 update scenarios)
   - 📁 Delete
   - 📁 Error Handling (4 error scenarios)
3. Run entire collection or individual requests
4. Tests included for validation

### Option 3: Manual Testing with curl

See [API Documentation](#api-documentation) for curl examples.

## 📂 Project Structure

```
portfolio-api/
├── config/
│   └── database.js           # MongoDB connection with Mongoose
├── models/
│   └── Project.js            # Mongoose schema with validation, indexes, virtuals, methods
├── routes/
│   └── projects.js           # API routes for projects
├── middleware/
│   ├── asyncHandler.js       # Async error handler wrapper
│   ├── errorHandler.js       # Global error handler + custom AppError
│   ├── logger.js             # Request/response logging
│   └── validator.js          # Input validation middleware
├── utils/
│   └── response.js           # Standardized API response helpers
├── .env                      # Environment variables
├── .gitignore                # Git ignore patterns
├── package.json              # Dependencies and scripts
├── server.js                 # Express app entry point
├── test-api.sh               # Bash testing script
├── Portfolio-API.postman_collection.json  # Postman collection
└── README.md                 # This file
```

### File Descriptions

**config/database.js** (130+ lines)

- MongoDB connection with Mongoose
- Connection event handlers
- Graceful shutdown
- Error handling for common connection issues

**models/Project.js** (450+ lines)

- Complete Mongoose schema
- 13 fields with comprehensive validation
- 4 indexes for performance (text, compound, single)
- 4 virtual properties (slug, durationDays, isActive, engagementScore)
- Pre/post hooks for transformations and logging
- 6 static methods for model-level queries
- 8 instance methods for document-level operations

**routes/projects.js** (350+ lines)

- 14+ RESTful endpoints
- Filtering, sorting, pagination
- Full-text search
- Statistics aggregation
- CRUD operations
- View/like incrementing
- Featured toggling
- Status management

**middleware/**

- `asyncHandler.js`: Eliminates try-catch boilerplate
- `errorHandler.js`: Global error handling with custom AppError class
- `logger.js`: Colored request/response logging (development only)
- `validator.js`: Input validation and sanitization

**server.js** (180+ lines)

- Express app configuration
- Middleware chain setup
- Route mounting
- Database connection
- Error handling
- Graceful shutdown
- Detailed startup logging

## 🗄️ Database Schema

### Project Model

```javascript
{
  title: String,              // 3-100 chars, required, indexed
  description: String,        // 10-500 chars, required
  technologies: [String],     // Array, required, min 1 item
  githubUrl: String,          // GitHub URL pattern validation
  liveUrl: String,            // URL pattern validation
  imageUrl: String,           // Default: 'default-project.jpg'
  featured: Boolean,          // Default: false, indexed
  status: String,             // enum: planning/in-progress/completed/archived, indexed
  priority: String,           // enum: low/medium/high
  startDate: Date,
  endDate: Date,              // Must be >= startDate
  views: Number,              // Default: 0, min: 0
  likes: Number,              // Default: 0, min: 0
  tags: [String],
  createdAt: Date,            // Auto-managed by timestamps
  updatedAt: Date             // Auto-managed by timestamps
}
```

### Virtual Properties (computed, not stored)

- `slug`: URL-friendly title
- `durationDays`: Days between start and end
- `isActive`: Boolean (status is planning or in-progress)
- `engagementScore`: views + (likes * 5)

### Indexes

1. **Text Index**: `{ title: 'text', description: 'text' }` - For full-text search
2. **Compound**: `{ featured: -1, createdAt: -1 }` - For featured + newest queries
3. **Compound**: `{ status: 1, createdAt: -1 }` - For status filtering
4. **Single**: `{ technologies: 1 }` - For technology filtering

## 🚀 Advanced Features

### 1. Schema Validation

- **Required fields**: title, description, technologies
- **String length**: min/max for title and description
- **Enums**: status (4 values), priority (3 values)
- **Regex validation**: GitHub URL, live URL patterns
- **Custom validators**: Technologies array validation
- **Date validation**: endDate must be >= startDate

### 2. Indexes for Performance

- Text index enables full-text search across title and description
- Compound indexes optimize common query patterns
- Single field indexes for filtering

### 3. Virtual Properties

Computed fields that don't take database space:

```javascript
project.slug           // "e-commerce-platform"
project.durationDays   // 64
project.isActive       // true
project.engagementScore // 125
```

### 4. Hooks/Middleware

- **Pre-save**: Convert title to Title Case, trim technologies
- **Post-save**: Log project creation
- **Post-delete**: Log project deletion

### 5. Static Methods (Model-level)

```javascript
Project.findByTechnology('React')
Project.getFeatured(5)
Project.getByStatus('completed')
Project.getStats()
Project.searchProjects('commerce')
```

### 6. Instance Methods (Document-level)

```javascript
project.toggleFeatured()
project.incrementViews()
project.incrementLikes()
project.updateStatus('completed')
project.addTechnology('Vue.js')
project.removeTechnology('Angular')
project.getSummary()
```

## 🔒 Security

### Implemented Security Measures

1. **Helmet** - Sets security-related HTTP headers
   - XSS protection
   - Content Security Policy
   - DNS prefetch control
   - Frame guard

2. **CORS** - Configurable cross-origin resource sharing
   - Whitelist allowed origins
   - Credentials support

3. **Rate Limiting** - Prevents abuse
   - Default: 100 requests per 15 minutes per IP
   - Configurable via environment variables

4. **Input Sanitization** - XSS protection
   - Removes script tags
   - Trims whitespace
   - Applied to all requests

5. **Validation** - Data integrity
   - Schema-level validation (Mongoose)
   - Middleware validation
   - ObjectId format checking

6. **Error Handling** - Secure error messages
   - Development: Full stack traces
   - Production: Generic error messages
   - No sensitive data leakage

## 🔧 Troubleshooting

### MongoDB Connection Issues

**Error: ECONNREFUSED**

```
Solution: Ensure MongoDB is running
- Local: `brew services start mongodb-community` (macOS)
- Atlas: Check network access and IP whitelist
```

**Error: Authentication failed**

```
Solution: Check credentials in MONGO_URI
- Verify username and password
- Ensure database user has correct permissions
```

**Error: Server selection timed out**

```
Solution:
- Check internet connection (for Atlas)
- Verify MONGO_URI is correct
- For Atlas: Whitelist your IP (0.0.0.0/0 for development)
```

### Server Issues

**Port Already in Use**

```
Error: EADDRINUSE :::4000

Solution:
1. Find process: lsof -i :4000
2. Kill process: kill -9 <PID>
3. Or change PORT in .env
```

**Module Not Found**

```
Solution: Run `npm install` to install dependencies
```

### API Testing Issues

**jq: command not found** (when running test-api.sh)

```
Solution: Install jq
- macOS: brew install jq
- Linux: sudo apt-get install jq
- Or remove `| jq '.'` from script
```

## 📖 Learning Resources

### Mongoose Documentation

- [Mongoose Guide](https://mongoosejs.com/docs/guide.html)
- [Schema Validation](https://mongoosejs.com/docs/validation.html)
- [Indexes](https://mongoosejs.com/docs/guide.html#indexes)
- [Virtuals](https://mongoosejs.com/docs/tutorials/virtuals.html)
- [Middleware/Hooks](https://mongoosejs.com/docs/middleware.html)
- [Static Methods](https://mongoosejs.com/docs/guide.html#statics)
- [Instance Methods](https://mongoosejs.com/docs/guide.html#methods)

### Express.js Documentation

- [Express Guide](https://expressjs.com/en/guide/routing.html)
- [Error Handling](https://expressjs.com/en/guide/error-handling.html)
- [Middleware](https://expressjs.com/en/guide/using-middleware.html)

### MongoDB Resources

- [MongoDB Manual](https://docs.mongodb.com/manual/)
- [MongoDB Atlas](https://docs.atlas.mongodb.com/)
- [Indexes](https://docs.mongodb.com/manual/indexes/)
- [Aggregation](https://docs.mongodb.com/manual/aggregation/)

---

## 📝 License

This project is for educational purposes as part of Session 20 curriculum.

## 🤝 Contributing

This is an educational project. Feel free to fork and experiment!

## 📧 Support

For issues or questions, please review:

1. This README
2. Inline code comments
3. Session 20 materials
4. MongoDB/Mongoose documentation

---

**Happy Coding! 🚀**
