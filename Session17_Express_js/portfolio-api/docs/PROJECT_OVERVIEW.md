# 📊 Portfolio API - Project Overview

## 🎯 Project Summary

**Portfolio API** is a modern, production-ready RESTful API built with Express.js that demonstrates best practices in backend development. It's designed for beginners to learn Express.js while following industry standards.

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT REQUESTS                      │
│          (Browser, Postman, Mobile App, etc.)          │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  EXPRESS SERVER                         │
│                   (Port 4000)                           │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  MIDDLEWARE CHAIN                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐ │
│  │  Helmet  │→ │   CORS   │→ │   Rate   │→ │ Logger │ │
│  │ Security │  │  Origin  │  │  Limiter │  │ Request│ │
│  └──────────┘  └──────────┘  └──────────┘  └────────┘ │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                    ROUTER LAYER                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐ │
│  │ Projects │  │  Skills  │  │  About   │  │Contact │ │
│  │  Routes  │  │  Routes  │  │  Routes  │  │ Routes │ │
│  └──────────┘  └──────────┘  └──────────┘  └────────┘ │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│               VALIDATION MIDDLEWARE                     │
│        (Input validation, ID checks, etc.)              │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  ROUTE HANDLERS                         │
│          (Business logic, data operations)              │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                    DATA LAYER                           │
│              (Mock data in memory)                      │
│  • Projects Array  • Skills Array  • About Object       │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              ERROR HANDLING LAYER                       │
│    (Global error handler, 404 handler)                  │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  JSON RESPONSE                          │
│            (Back to client)                             │
└─────────────────────────────────────────────────────────┘
```

---

## 📁 File Structure Breakdown

```
portfolio-api/
│
├── 📄 server.js                    # Main application entry point
│   ├── Express app initialization
│   ├── Middleware setup
│   ├── Route mounting
│   └── Server start
│
├── 📁 config/
│   └── config.js                   # Environment configuration
│       ├── Port settings
│       ├── API prefix
│       ├── CORS settings
│       └── Rate limit config
│
├── 📁 data/
│   └── mockData.js                 # In-memory data storage
│       ├── Projects array (6 items)
│       ├── Skills array (4 categories)
│       ├── About object
│       └── Contact messages array
│
├── 📁 middleware/
│   ├── logger.js                   # Request/Response logging
│   │   ├── Logs method, URL, timestamp
│   │   ├── Tracks response time
│   │   └── Color-coded status codes
│   │
│   ├── validator.js                # Input validation
│   │   ├── validateProject()
│   │   ├── validateContact()
│   │   └── validateId()
│   │
│   └── errorHandler.js             # Error management
│       ├── AppError class
│       ├── asyncHandler wrapper
│       ├── notFoundHandler
│       └── globalErrorHandler
│
├── 📁 routes/
│   ├── projects.js                 # Project endpoints (9 routes)
│   │   ├── GET    /api/projects
│   │   ├── GET    /api/projects/:id
│   │   ├── GET    /api/projects/stats
│   │   ├── GET    /api/projects/search
│   │   ├── GET    /api/projects/:id/related
│   │   ├── POST   /api/projects
│   │   ├── PUT    /api/projects/:id
│   │   └── DELETE /api/projects/:id
│   │
│   ├── skills.js                   # Skills endpoints (4 routes)
│   │   ├── GET /api/skills
│   │   ├── GET /api/skills/flat
│   │   ├── GET /api/skills/stats
│   │   └── GET /api/skills/:category
│   │
│   ├── about.js                    # About endpoints (6 routes)
│   │   ├── GET /api/about
│   │   ├── GET /api/about/basic
│   │   ├── GET /api/about/contact
│   │   ├── GET /api/about/experience
│   │   ├── GET /api/about/education
│   │   └── GET /api/about/achievements
│   │
│   └── contact.js                  # Contact endpoints (3 routes)
│       ├── POST /api/contact
│       ├── GET  /api/contact/messages
│       └── GET  /api/contact/messages/:id
│
├── 📄 .env                         # Environment variables
├── 📄 .gitignore                   # Git ignore rules
├── 📄 package.json                 # Dependencies & scripts
│
├── 📄 README.md                    # Complete documentation
├── 📄 QUICKSTART.md               # Quick start guide
│
├── 🧪 test-api.sh                 # Automated testing script
└── 📦 Portfolio-API.postman_collection.json  # Postman tests
```

---

## 🔄 Request Flow Example

### Example: GET /api/projects/1

```
1. Client Request
   ↓
   GET http://localhost:4000/api/projects/1

2. Server receives request
   ↓
   Express app on port 4000

3. Middleware Chain
   ↓
   ├── Helmet (adds security headers)
   ├── CORS (checks origin)
   ├── Rate Limiter (checks request count)
   ├── JSON Parser (not needed for GET)
   └── Logger (logs request details)

4. Route Matching
   ↓
   Router: /api/projects
   Route: GET /:id

5. Validation Middleware
   ↓
   validateId() checks if ID is valid integer

6. Route Handler
   ↓
   ├── Extract ID from params
   ├── Find project in array
   ├── If found: increment views
   └── If not found: throw AppError

7. Response
   ↓
   Status: 200 OK
   Body: {
     "success": true,
     "data": { project object }
   }

8. Logger logs response
   ↓
   🟢 [timestamp] GET /api/projects/1 - 200 (5ms)
```

---

## 🎨 Key Features Implemented

### 1. **RESTful Design** ✅

- Resource-based URLs (`/projects`, `/skills`, etc.)
- Proper HTTP methods (GET, POST, PUT, DELETE)
- Meaningful status codes (200, 201, 400, 404, 500)
- Consistent response format

### 2. **Advanced Filtering** 🔍

```javascript
GET /api/projects?tech=react&category=frontend&featured=true
```

- Filter by technology
- Filter by category
- Filter by featured status

### 3. **Sorting** 📊

```javascript
GET /api/projects?sort=views&order=desc
```

- Sort by any field
- Ascending or descending order

### 4. **Pagination** 📄

```javascript
GET /api/projects?page=2&limit=5
```

- Page-based pagination
- Customizable page size
- Metadata included (total, pages, etc.)

### 5. **Search** 🔎

```javascript
GET /api/projects/search?q=weather
```

- Search across multiple fields
- Case-insensitive matching

### 6. **Statistics** 📈

```javascript
GET /api/projects/stats
```

- Aggregated data
- Most used technologies
- Project counts by category

### 7. **Related Content** 🔗

```javascript
GET /api/projects/1/related
```

- Smart recommendations
- Based on similar technologies

### 8. **Input Validation** ✔️

- Required field checks
- Format validation (email, etc.)
- Length constraints
- Custom error messages

### 9. **Error Handling** 🚨

- Custom error classes
- Global error handler
- 404 handling
- Detailed error messages in development

### 10. **Security** 🔒

- Helmet security headers
- CORS configuration
- Rate limiting (100 requests per 15 minutes)
- Input sanitization

---

## 📊 Data Models

### Project Model

```javascript
{
  id: number,              // Unique identifier
  name: string,            // Project name
  description: string,     // Detailed description
  tech: string[],          // Array of technologies
  category: string,        // Project category
  image: string,           // Image URL
  github: string,          // GitHub repository URL
  live: string,            // Live demo URL
  featured: boolean,       // Featured status
  views: number,           // View count
  createdAt: string        // Creation date
}
```

### Skill Model

```javascript
{
  category: string,        // Skill category
  items: [                 // Array of skills
    {
      name: string,        // Skill name
      level: string,       // Proficiency level
      years: number        // Years of experience
    }
  ]
}
```

### Contact Message Model

```javascript
{
  id: number,              // Unique identifier
  name: string,            // Sender name
  email: string,           // Sender email
  message: string,         // Message content
  timestamp: string,       // Submission time
  status: string           // Message status
}
```

---

## 🔧 Technologies & Dependencies

### Core

- **Express.js** `^4.18.2` - Web framework
- **Node.js** `v18+` - JavaScript runtime

### Middleware

- **helmet** `^7.1.0` - Security headers
- **cors** `^2.8.5` - CORS support
- **express-rate-limit** `^7.1.5` - Rate limiting

### Configuration

- **dotenv** `^16.3.1` - Environment variables

### Development

- **nodemon** `^3.0.2` - Auto-restart server

### Module System

- **ES Modules** - Modern JavaScript imports

---

## 🎓 Learning Concepts Covered

1. ✅ Express.js basics and setup
2. ✅ RESTful API design principles
3. ✅ HTTP methods (GET, POST, PUT, DELETE)
4. ✅ Route parameters and query strings
5. ✅ Middleware architecture
6. ✅ Custom middleware creation
7. ✅ Error handling strategies
8. ✅ Input validation
9. ✅ Async/await patterns
10. ✅ ES6+ JavaScript features
11. ✅ Environment configuration
12. ✅ Security best practices
13. ✅ API testing methodologies
14. ✅ Code organization and structure
15. ✅ Documentation practices

---

## 📈 API Statistics

- **Total Endpoints**: 24
- **Projects Endpoints**: 9
- **Skills Endpoints**: 4
- **About Endpoints**: 6
- **Contact Endpoints**: 3
- **Utility Endpoints**: 2

- **GET Requests**: 21
- **POST Requests**: 2
- **PUT Requests**: 1
- **DELETE Requests**: 1

---

## 🚀 Performance Features

1. **Fast Response Times** - In-memory data for quick access
2. **Rate Limiting** - Prevents API abuse
3. **Efficient Filtering** - Optimized array operations
4. **Minimal Dependencies** - Lean and fast
5. **Request Logging** - Performance tracking

---

## 🔒 Security Features

1. **Helmet** - Sets security headers
2. **CORS** - Controls cross-origin access
3. **Rate Limiting** - Prevents brute force
4. **Input Validation** - Sanitizes user input
5. **Error Handling** - Doesn't expose sensitive info

---

## 🧪 Testing Coverage

### Automated Tests (test-api.sh)

- ✅ 40+ test cases
- ✅ All endpoints covered
- ✅ Error scenarios included
- ✅ Different HTTP methods
- ✅ Query parameters tested

### Postman Collection

- ✅ 35+ requests
- ✅ Organized by resource
- ✅ Pre-configured variables
- ✅ Example payloads
- ✅ Error test cases

---

## 💡 Best Practices Demonstrated

1. ✅ Modular code structure
2. ✅ Separation of concerns
3. ✅ DRY principle
4. ✅ Consistent naming conventions
5. ✅ Comprehensive comments
6. ✅ Error handling at all levels
7. ✅ Environment-based configuration
8. ✅ RESTful URL design
9. ✅ Proper HTTP status codes
10. ✅ API versioning ready

---

## 🎯 Use Cases

This API is perfect for:

- ✅ Learning Express.js fundamentals
- ✅ Building portfolio websites
- ✅ Understanding RESTful APIs
- ✅ Testing frontend applications
- ✅ Prototyping backend features
- ✅ Teaching web development
- ✅ Interview preparation
- ✅ Reference implementation

---

## 🔮 Future Enhancement Ideas

1. Database integration (MongoDB, PostgreSQL)
2. User authentication (JWT, OAuth)
3. File upload functionality
4. Real-time features (WebSocket)
5. API documentation (Swagger)
6. Automated testing (Jest)
7. Docker containerization
8. CI/CD pipeline
9. Caching layer (Redis)
10. Logging service integration

---

## 📚 Resources for Learning

- [Express.js Documentation](https://expressjs.com/)
- [RESTful API Design](https://restfulapi.net/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [MDN HTTP Methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods)

---

**Built with ❤️ for learning and education**
