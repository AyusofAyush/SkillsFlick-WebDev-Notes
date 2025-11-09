# 🚀 Portfolio API - Modern Express.js REST API

A comprehensive, production-ready REST API built with Express.js for managing portfolio projects, skills, about information, and contact messages. This API follows RESTful design principles and includes advanced features like filtering, sorting, pagination, validation, and error handling.

## ✨ Features

- ✅ **Complete CRUD Operations** for projects
- ✅ **Advanced Filtering & Sorting** with query parameters
- ✅ **Pagination Support** for large datasets
- ✅ **Input Validation** with custom middleware
- ✅ **Global Error Handling** with custom error classes
- ✅ **Request Logging** with detailed information
- ✅ **Security Features** (Helmet, CORS, Rate Limiting)
- ✅ **ES Modules** (modern JavaScript)
- ✅ **Environment Configuration** with dotenv
- ✅ **RESTful API Design** following best practices
- ✅ **Comprehensive Testing** with curl script and Postman collection

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Server](#running-the-server)
- [API Documentation](#api-documentation)
- [Testing the API](#testing-the-api)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Best Practices Implemented](#best-practices-implemented)

## 🔧 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** (comes with Node.js)
- **curl** (for testing) or **Postman/Thunder Client**
- **jq** (optional, for pretty JSON output in terminal)

Check your Node.js version:

```bash
node --version
```

## 📦 Installation

1. **Navigate to the project directory:**

   ```bash
   cd portfolio-api
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

   This will install:
   - `express` - Web framework
   - `dotenv` - Environment variable management
   - `cors` - Cross-Origin Resource Sharing
   - `helmet` - Security headers
   - `express-rate-limit` - Rate limiting
   - `nodemon` - Auto-restart during development

## ⚙️ Configuration

The API uses environment variables for configuration. The `.env` file is already configured with default values:

```env
PORT=4000
NODE_ENV=development
API_VERSION=v1
API_PREFIX=/api
ALLOWED_ORIGINS=*
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

You can modify these values as needed. The API will use sensible defaults if any are missing.

## 🚀 Running the Server

### Development Mode (with auto-restart)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

You should see output like this:

```
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   🚀 PORTFOLIO API SERVER STARTED SUCCESSFULLY 🚀    ║
║                                                       ║
╠═══════════════════════════════════════════════════════╣
║                                                       ║
║   📍 Server URL:  http://localhost:4000              ║
║   🌍 Environment: DEVELOPMENT                         ║
║   📡 API Prefix:  /api                                ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
```

Visit `http://localhost:4000` in your browser to see the API welcome message!

## 📖 API Documentation

### Base URL

```
http://localhost:4000
```

### API Prefix

All API endpoints use the `/api` prefix.

---

## 🏠 Home & Health Endpoints

### Get API Information

```http
GET /
```

**Response:**

```json
{
  "success": true,
  "message": "Welcome to Portfolio API! 🚀",
  "version": "1.0.0",
  "endpoints": {
    "projects": "/api/projects",
    "skills": "/api/skills",
    "about": "/api/about",
    "contact": "/api/contact"
  }
}
```

### Health Check

```http
GET /health
```

**Response:**

```json
{
  "success": true,
  "status": "OK",
  "uptime": 3600.123,
  "timestamp": "2024-11-07T10:30:00.000Z",
  "environment": "development"
}
```

---

## 📁 Projects Endpoints

### 1. Get All Projects

```http
GET /api/projects
```

**Query Parameters:**

- `tech` - Filter by technology (e.g., `?tech=react`)
- `category` - Filter by category (e.g., `?category=frontend`)
- `featured` - Filter featured projects (e.g., `?featured=true`)
- `sort` - Sort field (e.g., `?sort=views`)
- `order` - Sort order: `asc` or `desc` (e.g., `?order=desc`)
- `page` - Page number (e.g., `?page=1`)
- `limit` - Results per page (e.g., `?limit=10`)

**Example:**

```bash
curl http://localhost:4000/api/projects?tech=react&page=1&limit=5
```

**Response:**

```json
{
  "success": true,
  "count": 5,
  "total": 6,
  "page": 1,
  "pages": 2,
  "data": [...]
}
```

### 2. Get Single Project

```http
GET /api/projects/:id
```

**Example:**

```bash
curl http://localhost:4000/api/projects/1
```

### 3. Get Project Statistics

```http
GET /api/projects/stats
```

**Response:**

```json
{
  "success": true,
  "data": {
    "totalProjects": 6,
    "featuredProjects": 3,
    "categories": ["Full Stack", "Frontend"],
    "totalTechnologies": 15,
    "mostUsedTechnologies": [...],
    "totalViews": 2566
  }
}
```

### 4. Search Projects

```http
GET /api/projects/search?q=weather
```

### 5. Get Related Projects

```http
GET /api/projects/:id/related
```

Returns projects with similar technologies.

### 6. Create Project

```http
POST /api/projects
Content-Type: application/json
```

**Body:**

```json
{
  "name": "My New Project",
  "description": "A detailed description of at least 10 characters",
  "tech": ["React", "Node.js", "MongoDB"],
  "category": "Full Stack",
  "github": "https://github.com/user/project",
  "live": "https://project-demo.com",
  "featured": false
}
```

**Example:**

```bash
curl -X POST http://localhost:4000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Weather App",
    "description": "Real-time weather application",
    "tech": ["React", "OpenWeather API"],
    "category": "Frontend"
  }'
```

### 7. Update Project

```http
PUT /api/projects/:id
Content-Type: application/json
```

**Body:** (same as Create Project)

### 8. Delete Project

```http
DELETE /api/projects/:id
```

---

## 🎯 Skills Endpoints

### 1. Get All Skills

```http
GET /api/skills
```

Returns skills grouped by category.

### 2. Get Skills as Flat Array

```http
GET /api/skills/flat
```

### 3. Get Skills Statistics

```http
GET /api/skills/stats
```

### 4. Get Skills by Category

```http
GET /api/skills/:category
```

**Example:**

```bash
curl http://localhost:4000/api/skills/frontend
```

---

## 👤 About Endpoints

### 1. Get Complete About Info

```http
GET /api/about
```

### 2. Get Basic Info

```http
GET /api/about/basic
```

Returns name, title, and bio only.

### 3. Get Contact Info

```http
GET /api/about/contact
```

### 4. Get Experience

```http
GET /api/about/experience
```

### 5. Get Education

```http
GET /api/about/education
```

### 6. Get Achievements

```http
GET /api/about/achievements
```

---

## 📧 Contact Endpoints

### 1. Submit Contact Form

```http
POST /api/contact
Content-Type: application/json
```

**Body:**

```json
{
  "name": "Ayush Raj",
  "email": "ayush.raj@example.com",
  "message": "Your message here (minimum 10 characters)"
}
```

**Example:**

```bash
curl -X POST http://localhost:4000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "message": "I would like to discuss a project opportunity with you."
  }'
```

### 2. Get All Messages (Admin)

```http
GET /api/contact/messages
```

### 3. Get Single Message (Admin)

```http
GET /api/contact/messages/:id
```

---

## 🧪 Testing the API

### Option 1: Using the Automated Test Script

Make the script executable:

```bash
chmod +x test-api.sh
```

Run all tests:

```bash
./test-api.sh
```

This script tests all endpoints automatically and displays formatted results.

### Option 2: Using Individual curl Commands

**Test home endpoint:**

```bash
curl http://localhost:4000/
```

**Test projects:**

```bash
# Get all projects
curl http://localhost:4000/api/projects

# Get project by ID
curl http://localhost:4000/api/projects/1

# Create project
curl -X POST http://localhost:4000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Project",
    "description": "Testing the API",
    "tech": ["Node.js"],
    "category": "Backend"
  }'

# Update project
curl -X PUT http://localhost:4000/api/projects/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Project",
    "description": "This has been updated",
    "tech": ["React", "Node.js"],
    "category": "Full Stack"
  }'

# Delete project
curl -X DELETE http://localhost:4000/api/projects/6
```

**Test skills:**

```bash
curl http://localhost:4000/api/skills
curl http://localhost:4000/api/skills/frontend
```

**Test about:**

```bash
curl http://localhost:4000/api/about
curl http://localhost:4000/api/about/experience
```

**Test contact:**

```bash
curl -X POST http://localhost:4000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "This is a test message from curl!"
  }'
```

### Option 3: Using Postman

1. **Import the Postman collection:**
   - Open Postman
   - Click "Import"
   - Select `Portfolio-API.postman_collection.json`

2. **Run the collection:**
   - All endpoints are pre-configured
   - Organized into folders by resource
   - Includes error testing scenarios

### Option 4: Using Thunder Client (VS Code Extension)

1. Install Thunder Client extension in VS Code
2. Import the Postman collection (Thunder Client is compatible)
3. Test endpoints directly from VS Code

---

## 📂 Project Structure

```
portfolio-api/
│
├── config/
│   └── config.js              # Environment configuration
│
├── data/
│   └── mockData.js            # Mock data for projects, skills, about
│
├── middleware/
│   ├── errorHandler.js        # Error handling middleware
│   ├── logger.js              # Request logging middleware
│   └── validator.js           # Input validation middleware
│
├── routes/
│   ├── projects.js            # Project routes
│   ├── skills.js              # Skills routes
│   ├── about.js               # About routes
│   └── contact.js             # Contact routes
│
├── .env                        # Environment variables
├── .gitignore                  # Git ignore rules
├── package.json                # Project dependencies
├── server.js                   # Main server file
├── test-api.sh                 # Automated testing script
├── Portfolio-API.postman_collection.json  # Postman collection
└── README.md                   # This file
```

---

## 🛠️ Technologies Used

| Technology | Purpose | Version |
|------------|---------|---------|
| **Node.js** | JavaScript runtime | v18+ |
| **Express.js** | Web framework | ^4.18.2 |
| **ES Modules** | Modern JavaScript | Native |
| **dotenv** | Environment variables | ^16.3.1 |
| **cors** | Cross-origin requests | ^2.8.5 |
| **helmet** | Security headers | ^7.1.0 |
| **express-rate-limit** | Rate limiting | ^7.1.5 |
| **nodemon** | Auto-restart | ^3.0.2 |

---

## ✅ Best Practices Implemented

### 1. **Project Structure**

- ✅ Modular architecture with separate routes, middleware, and data
- ✅ Clear separation of concerns
- ✅ Easy to maintain and scale

### 2. **Code Quality**

- ✅ ES6+ modern JavaScript syntax
- ✅ ES Modules instead of CommonJS
- ✅ Async/await for asynchronous operations
- ✅ Consistent naming conventions
- ✅ Comprehensive comments and documentation

### 3. **API Design**

- ✅ RESTful principles
- ✅ Resource-based URLs
- ✅ Proper HTTP methods (GET, POST, PUT, DELETE)
- ✅ Appropriate HTTP status codes
- ✅ Consistent response format

### 4. **Error Handling**

- ✅ Custom error classes
- ✅ Async error wrapper
- ✅ Global error handler
- ✅ 404 handler for undefined routes
- ✅ Validation errors with detailed messages

### 5. **Security**

- ✅ Helmet for security headers
- ✅ CORS configuration
- ✅ Rate limiting to prevent abuse
- ✅ Input validation and sanitization
- ✅ Environment variable configuration

### 6. **Developer Experience**

- ✅ Hot reload with nodemon
- ✅ Detailed logging
- ✅ Environment-based configuration
- ✅ Comprehensive testing tools
- ✅ Clear documentation

### 7. **Features**

- ✅ Filtering and sorting
- ✅ Pagination
- ✅ Search functionality
- ✅ Statistics endpoints
- ✅ Related content suggestions

---

## 🚀 Advanced Features

### Filtering

```bash
# Filter by technology
curl "http://localhost:4000/api/projects?tech=react"

# Filter by category
curl "http://localhost:4000/api/projects?category=frontend"

# Filter featured projects
curl "http://localhost:4000/api/projects?featured=true"
```

### Sorting

```bash
# Sort by views (descending)
curl "http://localhost:4000/api/projects?sort=views&order=desc"

# Sort by name (ascending)
curl "http://localhost:4000/api/projects?sort=name&order=asc"
```

### Pagination

```bash
# Get page 2 with 5 items per page
curl "http://localhost:4000/api/projects?page=2&limit=5"
```

### Combined Queries

```bash
# Featured React projects, sorted by views, page 1
curl "http://localhost:4000/api/projects?tech=react&featured=true&sort=views&order=desc&page=1&limit=3"
```

---

## 📊 HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| **200** | OK | Successful GET, PUT, DELETE |
| **201** | Created | Successful POST |
| **400** | Bad Request | Invalid input/validation error |
| **404** | Not Found | Resource doesn't exist |
| **500** | Server Error | Internal server error |

---

## 🔍 Common Issues & Solutions

### Issue: Port already in use

```
Error: listen EADDRINUSE: address already in use :::4000
```

**Solution:**

1. Change the port in `.env` file
2. Or kill the process using port 4000:

   ```bash
   lsof -ti:4000 | xargs kill -9
   ```

### Issue: Module not found

```
Error: Cannot find module 'express'
```

**Solution:**

```bash
npm install
```

### Issue: CORS errors

If you get CORS errors when calling from a frontend, check the `ALLOWED_ORIGINS` in `.env`.

---

## 🎓 Learning Outcomes

By studying and using this API, you'll learn:

1. ✅ Building RESTful APIs with Express.js
2. ✅ Implementing CRUD operations
3. ✅ Request validation and error handling
4. ✅ Middleware architecture
5. ✅ Filtering, sorting, and pagination
6. ✅ Security best practices
7. ✅ API testing strategies
8. ✅ Modern JavaScript (ES Modules, async/await)
9. ✅ Environment configuration
10. ✅ Code organization and structure

---

## 🚧 Future Enhancements

Potential improvements for learning or production:

- [ ] Database integration (MongoDB, PostgreSQL)
- [ ] Authentication & Authorization (JWT)
- [ ] File upload functionality
- [ ] WebSocket support for real-time features
- [ ] API versioning
- [ ] Automated tests (Jest, Supertest)
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Docker containerization
- [ ] CI/CD pipeline
- [ ] Deployment to cloud (AWS, Heroku, Vercel)

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🤝 Contributing

Feel free to fork this project and submit pull requests. For major changes, please open an issue first to discuss what you would like to change.

---

## 📧 Contact

For questions or feedback, please use the contact endpoint or reach out via:

- Email: <ayush.raj@example.com>
- GitHub: [@ayushraj](https://github.com/ayushraj)

---

## 🎉 Acknowledgments

This project was built as a comprehensive learning resource for Express.js and REST API development, following industry best practices and modern JavaScript standards.

---

**Happy Coding! 🚀**
