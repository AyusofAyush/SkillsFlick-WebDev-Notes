# 📝 Blog API - MVC Architecture in Express.js

A **production-ready RESTful Blog API** built with Express.js demonstrating best practices in MVC architecture, security, validation, and modern JavaScript patterns.

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/express-4.18.2-blue)](https://expressjs.com/)
[![ES Modules](https://img.shields.io/badge/ES-Modules-yellow)](https://nodejs.org/api/esm.html)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

---

## ✨ Features

### Architecture & Design

- ✅ **MVC Pattern** - Clean separation of Models, Controllers, and Routes
- ✅ **RESTful API** - Following REST principles and best practices
- ✅ **ES Modules** - Modern JavaScript import/export syntax
- ✅ **Async/Await** - Clean asynchronous code throughout

### Core Functionality

- ✅ **CRUD Operations** - Create, Read, Update, Delete posts
- ✅ **Advanced Filtering** - Filter by category, author, tags
- ✅ **Full-Text Search** - Search across titles and content
- ✅ **Pagination** - Configurable page size and navigation
- ✅ **Sorting** - Sort by date, popularity, likes
- ✅ **Statistics** - Aggregate data and analytics

### Security & Production Features

- ✅ **Helmet** - Security headers protection
- ✅ **CORS** - Cross-Origin Resource Sharing
- ✅ **Rate Limiting** - Prevent abuse (100 requests per 15 minutes)
- ✅ **Input Validation** - Comprehensive data validation
- ✅ **Error Handling** - Centralized error management
- ✅ **Request Logging** - Colored development logs

### Testing & Documentation

- ✅ **Automated Tests** - Bash script with 20+ test cases
- ✅ **Postman Collection** - 25+ organized API requests
- ✅ **Comprehensive Docs** - Quick start and detailed guides

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18 or higher ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)

### Installation

```bash
# 1. Navigate to project directory
cd blog-api

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Server starts on **<http://localhost:4000>** 🎉

### Verify Installation

```bash
# Test health endpoint
curl http://localhost:4000/health

# Expected response:
# {"status":"success","message":"🚀 Blog API is running!"}
```

---

## 📖 API Overview

### Base URL

```
http://localhost:4000
```

### Quick Test

Create your first post:

```bash
curl -X POST http://localhost:4000/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Post",
    "content": "This is a blog post created via the API. It demonstrates the MVC architecture pattern.",
    "author": "Ayush Raj",
    "category": "Technology",
    "tags": ["MVC", "Express", "Node.js"]
  }'
```

Get all posts:

```bash
curl http://localhost:4000/api/posts
```

### Main Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Server health check |
| GET | `/` | API information |
| POST | `/api/posts` | Create new post |
| GET | `/api/posts` | Get all posts (with filtering) |
| GET | `/api/posts/:id` | Get post by ID |
| PUT | `/api/posts/:id` | Update post |
| DELETE | `/api/posts/:id` | Delete post |
| GET | `/api/posts/stats` | Get statistics |
| GET | `/api/posts/search?q=keyword` | Search posts |
| POST | `/api/posts/:id/like` | Like a post |

**See [PROJECT_GUIDE.md](./PROJECT_GUIDE.md) for complete API documentation**

---

## 🧪 Testing

### 1. Automated Test Script

Run comprehensive automated tests:

```bash
# Make executable (first time only)
chmod +x test-api.sh

# Run all 20 tests
./test-api.sh
```

**Coverage**: Health checks, CRUD operations, filtering, sorting, pagination, search, statistics, error scenarios

### 2. Postman Collection

Import `Blog-API.postman_collection.json` into Postman:

1. Open Postman
2. Click **Import**
3. Select `Blog-API.postman_collection.json`
4. Explore 25+ organized requests in 5 folders

### 3. Manual Testing

```bash
# Filter by category
curl "http://localhost:4000/api/posts?category=Technology"

# Search
curl "http://localhost:4000/api/posts/search?q=MVC"

# Pagination
curl "http://localhost:4000/api/posts?page=1&limit=5"

# Sort by popularity
curl "http://localhost:4000/api/posts?sortBy=popular"

# Get statistics
curl http://localhost:4000/api/posts/stats
```

---

## 📚 Documentation

### Quick References

- **[QUICKSTART.md](./QUICKSTART.md)** - Get up and running in 5 minutes
- **[PROJECT_GUIDE.md](./PROJECT_GUIDE.md)** - Complete architecture guide and code walkthrough

### What You'll Learn

From **PROJECT_GUIDE.md**:

- 🏗️ **MVC Architecture** - How Models, Controllers, and Routes work together
- 🔄 **Request Flow** - Step-by-step trace of a request through the system
- 📁 **Project Structure** - Understanding each file's purpose
- ✅ **Best Practices** - Production-ready patterns and principles
- 🚀 **Extending** - How to add new features (authentication, database, etc.)

---

## 🏗️ Project Structure

```
blog-api/
├── server.js              # Entry point - starts HTTP server
├── package.json           # Dependencies & scripts
├── .env                   # Configuration (PORT=4000)
│
├── src/
│   ├── app.js            # Express app setup
│   ├── models/           # Data layer & business logic
│   ├── controllers/      # Request handlers
│   ├── routes/           # URL routing
│   ├── middlewares/      # Logging, validation, errors
│   └── config/           # Environment configuration
│
├── test-api.sh           # Automated tests
└── Blog-API.postman_collection.json  # Postman tests
```

---

## 🛠️ Technology Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.18.2
- **Security**: Helmet, CORS, Rate Limiting
- **Module System**: ES Modules
- **Development**: Nodemon

---

## 🎯 Learning Objectives

This project teaches:

1. **MVC Architecture Pattern**
   - Separation of concerns
   - Models for data and business logic
   - Controllers for request handling
   - Routes for URL mapping

2. **RESTful API Design**
   - Resource-based URLs
   - Proper HTTP methods (GET, POST, PUT, DELETE)
   - Consistent response formats
   - HTTP status codes

3. **Express.js Best Practices**
   - Middleware chain organization
   - Error handling strategies
   - Input validation
   - Security hardening

4. **Modern JavaScript**
   - ES Modules (import/export)
   - Async/await patterns
   - ES6+ class syntax
   - Destructuring and spread operators

5. **Production Patterns**
   - Environment configuration
   - Logging and monitoring
   - Testing strategies
   - Documentation practices

---

## 📝 Available Scripts

```bash
# Start production server
npm start

# Start development server with auto-reload
npm run dev

# Run automated tests
npm test
```

---

## 🔧 Configuration

### Environment Variables (.env)

```env
PORT=4000                           # Server port
NODE_ENV=development                # Environment
API_PREFIX=/api                     # API route prefix
ALLOWED_ORIGINS=http://localhost:3000  # CORS origins
RATE_LIMIT_WINDOW_MS=900000        # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100        # Max requests per window
```

### Categories

Available post categories:

- Technology
- Health
- Business
- Lifestyle
- Education
- Entertainment
- Sports
- Travel
- Food
- General (default)

---

## 🚀 Next Steps

### For Learning

1. **Understand the Flow**
   - Read [PROJECT_GUIDE.md](./PROJECT_GUIDE.md)
   - Follow a request from route to model
   - Examine middleware chain

2. **Experiment**
   - Create posts via API
   - Try different filters and sorts
   - Test error scenarios

3. **Extend**
   - Add a Comment model
   - Implement user authentication
   - Connect to MongoDB

### For Production

1. **Add Database**
   - Install MongoDB/PostgreSQL
   - Replace in-memory storage
   - Add database migrations

2. **Add Authentication**
   - JWT tokens
   - User registration/login
   - Protected routes

3. **Add Features**
   - File upload for images
   - Email notifications
   - Social media integration

4. **Deploy**
   - Configure for production
   - Set up CI/CD
   - Deploy to cloud platform

---

## 🤝 Contributing

This is an educational project. Feel free to:

- Fork and experiment
- Suggest improvements
- Report issues
- Share your learnings

---

## 📄 License

MIT License - Feel free to use this project for learning and teaching.

---

## 🙏 Acknowledgments

Built to demonstrate:

- Clean architecture principles
- RESTful API best practices  
- Production-ready patterns
- Modern JavaScript features

**Perfect for learning Express.js and MVC architecture!** 🎓

---

## 📞 Support

- 📖 Read the [PROJECT_GUIDE.md](./PROJECT_GUIDE.md) for detailed explanations
- 🚀 Check [QUICKSTART.md](./QUICKSTART.md) for quick setup
- 🧪 Run automated tests to verify everything works

---

**Happy Coding!** 🎉

Built with ❤️ for learning and best practices
