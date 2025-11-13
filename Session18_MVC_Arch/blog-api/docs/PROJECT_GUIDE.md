# 📚 Blog API - Complete Project Guide

## MVC Architecture in Express.js - A Comprehensive Implementation

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [MVC Architecture Explained](#mvc-architecture)
3. [Project Structure](#project-structure)
4. [Installation & Setup](#installation)
5. [API Documentation](#api-documentation)
6. [Testing](#testing)
7. [Code Walkthrough](#code-walkthrough)
8. [Best Practices](#best-practices)
9. [Extending the Project](#extending)

---

<a name="project-overview"></a>

## 🎯 Project Overview

### What This Project Demonstrates

This Blog API is a **production-ready RESTful API** built with Express.js that showcases:

- ✅ **MVC Architecture Pattern** - Clean separation of concerns
- ✅ **RESTful API Design** - Following REST principles  
- ✅ **CRUD Operations** - Complete Create, Read, Update, Delete functionality
- ✅ **Advanced Features** - Search, filtering, pagination, sorting, statistics
- ✅ **Input Validation** - Comprehensive data validation
- ✅ **Error Handling** - Centralized error management system
- ✅ **Security** - Helmet, CORS, Rate Limiting
- ✅ **Logging** - Request/response tracking
- ✅ **Modern JavaScript** - ES Modules, async/await, classes

### Technology Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.18.2
- **Module System**: ES Modules
- **Security**: Helmet, CORS, Rate Limiting
- **Development**: Nodemon for auto-restart

---

<a name="mvc-architecture"></a>

## 🏗️ MVC Architecture Explained

### What is MVC?

**MVC (Model-View-Controller)** is a design pattern that separates application logic into three interconnected components:

```
┌─────────────────────────────────────────────────┐
│                    CLIENT                        │
│            (Browser, Postman, curl)             │
└──────────────────┬──────────────────────────────┘
                   │
                   │ HTTP Request
                   ↓
┌─────────────────────────────────────────────────┐
│                   ROUTES                         │
│         (Define URL patterns & methods)          │
└──────────────────┬──────────────────────────────┘
                   │
                   ↓
┌─────────────────────────────────────────────────┐
│                 MIDDLEWARE                       │
│    (Logging, Validation, Authentication)         │
└──────────────────┬──────────────────────────────┘
                   │
                   ↓
┌─────────────────────────────────────────────────┐
│                CONTROLLER                        │
│     • Extract request data                       │
│     • Validate input                             │
│     • Call Model methods                         │
│     • Format responses                           │
└──────────────────┬──────────────────────────────┘
                   │
                   ↓
┌─────────────────────────────────────────────────┐
│                  MODEL                           │
│     • Business logic                             │
│     • Data validation                            │
│     • Database operations                        │
│     • Data structure                             │
└──────────────────┬──────────────────────────────┘
                   │
                   ↓
┌─────────────────────────────────────────────────┐
│                 DATABASE                         │
│         (In-memory storage for demo)             │
└─────────────────────────────────────────────────┘
```

### The Three Components

#### 1. MODEL (`src/models/Post.js`)

**Responsibility**: Manage data and business logic

```javascript
class Post {
  // Define data structure
  constructor(data) { ... }
  
  // Business logic
  validate() { ... }
  generateSlug() { ... }
  
  // Database operations
  async save() { ... }
  static async findAll() { ... }
}
```

**Key Principle**: Model doesn't know about HTTP or Controllers

#### 2. CONTROLLER (`src/controllers/postController.js`)

**Responsibility**: Handle HTTP requests and coordinate

```javascript
class PostController {
  async createPost(req, res) {
    // 1. Extract data from request
    // 2. Create Model instance
    // 3. Call Model methods
    // 4. Format and send response
  }
}
```

**Key Principle**: Controller is thin - delegates to Model

#### 3. VIEW (JSON Responses)

**Responsibility**: Present data to user

In REST APIs, the "View" is JSON responses:

```json
{
  "status": "success",
  "data": { ... }
}
```

---

<a name="project-structure"></a>

## 📁 Project Structure

```
blog-api/
│
├── 📄 server.js                    # Entry point - starts HTTP server
├── 📄 package.json                 # Dependencies & scripts
├── 📄 .env                         # Environment variables (PORT=4000)
├── 📄 .gitignore                   # Git ignore patterns
│
├── 📁 src/                         # Source code
│   ├── 📄 app.js                   # Express app configuration
│   │
│   ├── 📁 models/                  # DATA LAYER
│   │   └── Post.js                 # Post model with business logic
│   │
│   ├── 📁 controllers/             # REQUEST HANDLERS
│   │   └── postController.js       # Post controller
│   │
│   ├── 📁 routes/                  # URL ROUTING
│   │   └── postRoutes.js           # Post routes
│   │
│   ├── 📁 middlewares/             # CROSS-CUTTING CONCERNS
│   │   ├── logger.js               # Request/response logging
│   │   ├── validator.js            # Input validation
│   │   └── errorHandler.js         # Error handling
│   │
│   └── 📁 config/                  # CONFIGURATION
│       └── config.js               # Environment config
│
└── 📁 Testing/                     # TESTING INFRASTRUCTURE
    ├── test-api.sh                 # Automated test script
    └── Blog-API.postman_collection.json  # Postman tests
```

### File Responsibilities

| File | Purpose | Key Concepts |
|------|---------|--------------|
| `server.js` | Start HTTP server | Server initialization |
| `app.js` | Configure Express | Middleware chain |
| `Post.js` | Data & business logic | MVC Model |
| `postController.js` | Request handling | MVC Controller |
| `postRoutes.js` | URL mapping | Routing |
| `logger.js` | Request logging | Middleware |
| `errorHandler.js` | Error management | Error handling |

---

<a name="installation"></a>

## ⚙️ Installation & Setup

### Prerequisites

- Node.js 18 or higher
- npm (comes with Node.js)
- curl (for testing)
- Optional: jq (for JSON formatting)

### Installation Steps

```bash
# 1. Navigate to project directory
cd blog-api

# 2. Install dependencies
npm install

# 3. Verify .env file exists (already created)
cat .env

# 4. Start development server
npm run dev
```

### Verification

```bash
# Check health
curl http://localhost:4000/health

# Expected: {"status":"success","message":"🚀 Blog API is running!"}
```

---

<a name="api-documentation"></a>

## 📖 API Documentation

### Base URL

```
http://localhost:4000
```

### Endpoints Summary

#### Health & Information

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Server health check |
| GET | `/` | API information |

#### Posts - CRUD Operations

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/posts` | Create new post | No |
| GET | `/api/posts` | Get all posts | No |
| GET | `/api/posts/:id` | Get post by ID | No |
| PUT | `/api/posts/:id` | Update post | No |
| DELETE | `/api/posts/:id` | Delete post | No |

#### Posts - Advanced Features

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/posts/stats` | Get blog statistics |
| GET | `/api/posts/search?q=keyword` | Search posts |
| GET | `/api/posts/categories` | Get all categories |
| POST | `/api/posts/:id/like` | Like a post |

#### Filtering & Sorting

| Query Parameter | Description | Example |
|----------------|-------------|---------|
| `category` | Filter by category | `?category=Technology` |
| `author` | Filter by author | `?author=John` |
| `tag` | Filter by tag | `?tag=MVC` |
| `search` | Full-text search | `?search=express` |
| `sortBy` | Sort order | `?sortBy=popular` |
| `page` | Page number | `?page=1` |
| `limit` | Results per page | `?limit=10` |

### Detailed Endpoints

#### 1. Create Post

```http
POST /api/posts
Content-Type: application/json

{
  "title": "Post Title (required, 5-100 chars)",
  "content": "Post content (required, 50-10000 chars)",
  "author": "Author Name (required, 2-50 chars)",
  "category": "Technology (optional, default: General)",
  "tags": ["tag1", "tag2"] (optional, max 10),
  "published": true (optional, default: true)
}
```

**Response** (201 Created):

```json
{
  "status": "success",
  "message": "Post created successfully",
  "data": {
    "post": {
      "id": 1,
      "title": "Post Title",
      "content": "Post content",
      "author": "Author Name",
      "category": "Technology",
      "tags": ["tag1", "tag2"],
      "published": true,
      "views": 0,
      "likes": 0,
      "createdAt": "2024-11-09T...",
      "updatedAt": "2024-11-09T..."
    },
    "slug": "post-title",
    "readingTime": 2
  }
}
```

#### 2. Get All Posts

```http
GET /api/posts?page=1&limit=10&sortBy=newest
```

**Response** (200 OK):

```json
{
  "status": "success",
  "count": 15,
  "page": 1,
  "totalPages": 2,
  "data": [
    {
      "id": 1,
      "title": "Post Title",
      "summary": "First 150 characters...",
      "readingTime": 2,
      ...
    }
  ]
}
```

#### 3. Search Posts

```http
GET /api/posts/search?q=MVC
```

**Response** (200 OK):

```json
{
  "status": "success",
  "query": "MVC",
  "count": 3,
  "data": [
    {
      "id": 1,
      "title": "Understanding MVC",
      "summary": "...",
      ...
    }
  ]
}
```

#### 4. Get Statistics

```http
GET /api/posts/stats
```

**Response** (200 OK):

```json
{
  "status": "success",
  "data": {
    "totalPosts": 15,
    "publishedPosts": 12,
    "draftPosts": 3,
    "totalViews": 1250,
    "totalLikes": 340,
    "averageViews": 83,
    "categoryDistribution": {
      "Technology": 8,
      "Health": 4,
      "Business": 3
    },
    "popularPosts": [
      { "id": 1, "title": "...", "views": 250 }
    ]
  }
}
```

### Error Responses

#### Validation Error (400)

```json
{
  "status": "fail",
  "message": "Title is required, Content must be at least 50 characters"
}
```

#### Not Found (404)

```json
{
  "status": "error",
  "message": "Post with ID 999 not found"
}
```

#### Server Error (500)

```json
{
  "status": "error",
  "message": "Internal server error",
  "stack": "..." // Only in development
}
```

---

<a name="testing"></a>

## 🧪 Testing

### 1. Automated Test Script

```bash
# Make executable
chmod +x test-api.sh

# Run all tests
./test-api.sh
```

**Tests Included**:

- ✅ Health check
- ✅ Create posts (3 different posts)
- ✅ Get all posts
- ✅ Get single post
- ✅ Update post
- ✅ Delete post
- ✅ Search functionality
- ✅ Filtering (by category, author)
- ✅ Sorting (newest, popular, likes)
- ✅ Pagination
- ✅ Statistics
- ✅ Like post
- ✅ Error scenarios (invalid ID, not found, validation)

### 2. Postman Collection

```bash
# Import in Postman
1. Open Postman
2. Click Import
3. Select Blog-API.postman_collection.json
4. Collection includes 25+ requests organized by category
```

### 3. Manual Testing with curl

```bash
# Create a post
curl -X POST http://localhost:4000/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","content":"Content here...","author":"Me"}'

# Get all posts
curl http://localhost:4000/api/posts

# Filter by category
curl "http://localhost:4000/api/posts?category=Technology"

# Search
curl "http://localhost:4000/api/posts/search?q=test"
```

---

<a name="code-walkthrough"></a>

## 💻 Code Walkthrough

### How a Request Flows Through the System

Let's trace a **"Create Post"** request:

#### Step 1: Client Makes Request

```bash
curl -X POST http://localhost:4000/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"MVC Tutorial","content":"...","author":"John"}'
```

#### Step 2: Route Matches (`src/routes/postRoutes.js`)

```javascript
router.post('/', postController.createPost);
// Maps POST /api/posts to postController.createPost method
```

#### Step 3: Middleware Runs

1. **Helmet** - Sets security headers
2. **CORS** - Validates origin
3. **Rate Limiter** - Checks request count
4. **JSON Parser** - Parses request body
5. **Logger** - Logs request details
6. **Sanitizer** - Sanitizes input

#### Step 4: Controller Handles Request (`src/controllers/postController.js`)

```javascript
async createPost(req, res) {
  try {
    // Extract data from request
    const { title, content, author } = req.body;
    
    // Create Model instance
    const post = new Post({ title, content, author });
    
    // Save via Model (includes validation)
    const savedPost = await post.save();
    
    // Send response
    res.status(201).json({
      status: 'success',
      data: savedPost
    });
  } catch (error) {
    // Handle errors
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
}
```

#### Step 5: Model Processes Data (`src/models/Post.js`)

```javascript
class Post {
  // Constructor sets up data
  constructor(data) {
    this.title = data.title;
    this.content = data.content;
    this.author = data.author;
    // ...
  }
  
  // Validate business rules
  validate() {
    const errors = [];
    if (!this.title || this.title.length < 5) {
      errors.push('Title must be at least 5 characters');
    }
    // ... more validation
    return { isValid: errors.length === 0, errors };
  }
  
  // Save to storage
  async save() {
    const validation = this.validate();
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }
    this.id = Post.nextId++;
    Post.posts.push(this);
    return this;
  }
}
```

#### Step 6: Response Sent to Client

```json
{
  "status": "success",
  "message": "Post created successfully",
  "data": {
    "post": {
      "id": 1,
      "title": "MVC Tutorial",
      ...
    }
  }
}
```

---

<a name="best-practices"></a>

## ✅ Best Practices Demonstrated

### 1. Separation of Concerns

❌ **Bad**: Everything in one file

```javascript
app.post('/posts', async (req, res) => {
  // Validation logic
  // Business logic
  // Database logic
  // Response formatting
  // All mixed together!
});
```

✅ **Good**: Separated by responsibility

```javascript
// Route defines endpoint
router.post('/', postController.createPost);

// Controller handles request
postController.createPost(req, res) { ... }

// Model handles data
Post.validate() { ... }
Post.save() { ... }
```

### 2. Thin Controllers

Controllers should delegate to models:

```javascript
// ✅ Good: Thin controller
async createPost(req, res) {
  const post = new Post(req.body);
  await post.save();
  res.json(post);
}

// ❌ Bad: Fat controller
async createPost(req, res) {
  // Tons of validation logic
  // Business rules
  // Database queries
  // All in controller!
}
```

### 3. Centralized Error Handling

```javascript
// Global error handler catches all errors
app.use(globalErrorHandler);

// Controllers can throw errors
throw new AppError('Post not found', 404);
```

### 4. Input Validation

```javascript
// Validate in Model (business rules)
validate() {
  if (this.title.length < 5) {
    errors.push('Title too short');
  }
}

// Validate in Middleware (structure)
validatePostData(req, res, next) {
  if (!req.body.title) {
    return res.status(400).json({...});
  }
  next();
}
```

### 5. Consistent Response Format

```javascript
// Success
{
  "status": "success",
  "data": { ... }
}

// Error
{
  "status": "error",
  "message": "Error description"
}
```

---

<a name="extending"></a>

## 🚀 Extending the Project

### Add a Comment Model

1. Create `src/models/Comment.js`
2. Create `src/controllers/commentController.js`
3. Create `src/routes/commentRoutes.js`
4. Mount routes in `app.js`

### Add Database (MongoDB)

Replace in-memory storage:

```javascript
// Install mongoose
npm install mongoose

// Create connection
import mongoose from 'mongoose';

// Create schema
const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  // ...
});

// Create model
const Post = mongoose.model('Post', postSchema);
```

### Add Authentication

```javascript
// Install JWT
npm install jsonwebtoken bcryptjs

// Create auth middleware
const authMiddleware = (req, res, next) => {
  // Verify token
  // Attach user to request
  next();
};

// Protect routes
router.post('/', authMiddleware, postController.createPost);
```

---

## 📚 Learning Resources

- **Express.js Docs**: <https://expressjs.com/>
- **MVC Pattern**: <https://en.wikipedia.org/wiki/Model–view–controller>
- **REST API Design**: <https://restfulapi.net/>
- **Node.js Best Practices**: <https://github.com/goldbergyoni/nodebestpractices>

---

## 🎯 Summary

This project demonstrates:

✅ **MVC Architecture** - Proper separation of Model, Controller, and Routes  
✅ **RESTful Design** - Following REST principles  
✅ **Production Patterns** - Error handling, logging, validation  
✅ **Modern JavaScript** - ES Modules, async/await, classes  
✅ **Testing** - Automated tests and Postman collection  
✅ **Documentation** - Comprehensive guides  
✅ **Security** - Helmet, CORS, Rate Limiting  
✅ **Scalability** - Easy to extend and maintain  

**Built for learning and production-ready patterns!** 🚀
