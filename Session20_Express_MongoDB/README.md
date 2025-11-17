# 🗄️ Session 20: MongoDB Integration and Data Operations

## 📋 Session Overview

**Prerequisites:** Node.js, Express.js basics, JavaScript ES6+

---

## 🎯 Learning Objectives

By the end of this session, you will be able to:

✅ Connect Express.js to MongoDB Atlas using Mongoose ODM  
✅ Design schemas with validation, data types, and constraints  
✅ Build complete CRUD APIs with proper error handling  
✅ Optimize database performance with indexes and efficient queries  
✅ Deploy production-ready applications with secure configuration

---

## 🌟 Real-World Context

Imagine you're building **Instagram**. Every time someone:

- 📸 Posts a photo → **CREATE** operation
- 👀 Views their feed → **READ** operation  
- ✏️ Edits a caption → **UPDATE** operation
- 🗑️ Deletes a post → **DELETE** operation

All of this data needs to be stored, retrieved, and managed efficiently. That's where MongoDB comes in!

---

## 🏗️ Architecture Overview

```mermaid
graph LR
    A[Client Browser] -->|HTTP Requests| B[Express.js Server]
    B -->|Mongoose ODM| C[MongoDB Database]
    C -->|Data Response| B
    B -->|JSON Response| A
    
    style A fill:#e1f5ff
    style B fill:#fff4e1
    style C fill:#e8f5e9
```

### Why MongoDB?

| Feature | Benefit |
|---------|---------|
| 📄 Document-Based | Stores data in JSON-like format (familiar to JS developers) |
| 🚀 Scalable | Handles millions of records effortlessly |
| 🔄 Flexible Schema | Easy to modify structure as your app grows |
| ⚡ Fast | Optimized for read-heavy operations |

---

## 📦 Part 1: Setup and Installation

### Step 1: Install Required Packages

```bash
npm install mongoose dotenv
```

**What are these?**

- **Mongoose:** ODM (Object Data Modeling) library for MongoDB
- **dotenv:** Manages environment variables securely

### Step 2: MongoDB Atlas Setup

MongoDB Atlas is like **Dropbox for databases** - cloud-hosted, secure, and free tier available!

```mermaid
graph TD
    A[Sign up at mongodb.com/atlas] --> B[Create New Cluster]
    B --> C[Choose Free Tier M0]
    C --> D[Select Cloud Provider & Region]
    D --> E[Create Database User]
    E --> F[Whitelist IP Address 0.0.0.0/0]
    F --> G[Get Connection String]
    
    style A fill:#4CAF50
    style G fill:#2196F3
```

**Your Connection String looks like:**

```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/myDatabase
```

### Step 3: Project Structure

```
portfolio-api/
│
├── config/
│   └── database.js          # MongoDB connection logic
│
├── models/
│   └── Project.js            # Mongoose schema/model
│
├── routes/
│   └── projects.js           # API endpoints
│
├── .env                      # Environment variables
├── server.js                 # Express server
└── package.json
```

---

## 🔌 Part 2: Database Connection

### Creating the Connection (config/database.js)

```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Connect to MongoDB
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1); // Exit with failure
  }
};

module.exports = connectDB;
```

### Environment Variables (.env)

```env
MONGO_URI=mongodb+srv://yourUsername:yourPassword@cluster0.xxxxx.mongodb.net/portfolioDB?retryWrites=true&w=majority
PORT=5000
```

### Integrating with Express (server.js)

```javascript
require('dotenv').config();
const express = require('express');
const connectDB = require('./config/database');

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/api/projects', require('./routes/projects'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
```

---

## 📐 Part 3: Mongoose Schemas and Models

### What is a Schema?

Think of a schema as a **blueprint** for your data - like a job application form that defines what information is required.

```mermaid
graph LR
    A[Schema Definition] --> B[Model Creation]
    B --> C[Document Instance]
    C --> D[Database Collection]
    
    style A fill:#FFE082
    style B fill:#81C784
    style C fill:#64B5F6
    style D fill:#BA68C8
```

### Creating a Project Model (models/Project.js)

```javascript
const mongoose = require('mongoose');

// Define the schema
const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a project title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  technologies: {
    type: [String],
    required: true,
    validate: {
      validator: function(v) {
        return v.length > 0;
      },
      message: 'At least one technology is required'
    }
  },
  githubUrl: {
    type: String,
    match: [
      /^https?:\/\/(www\.)?github\.com\/.+/,
      'Please provide a valid GitHub URL'
    ]
  },
  liveUrl: {
    type: String,
    match: [
      /^https?:\/\/.+/,
      'Please provide a valid URL'
    ]
  },
  imageUrl: {
    type: String,
    default: 'default-project.jpg'
  },
  featured: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['planning', 'in-progress', 'completed', 'archived'],
    default: 'in-progress'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Create indexes for better query performance
ProjectSchema.index({ title: 'text', description: 'text' });
ProjectSchema.index({ featured: -1, createdAt: -1 });

// Export the model
module.exports = mongoose.model('Project', ProjectSchema);
```

### Schema Validation Types

| Validator | Purpose | Example |
|-----------|---------|---------|
| `required` | Field must have a value | `required: true` |
| `min/max` | Number range | `min: 0, max: 100` |
| `minlength/maxlength` | String length | `maxlength: 200` |
| `enum` | Allowed values | `enum: ['active', 'inactive']` |
| `match` | Regex pattern | `match: /^https?:\/\//` |
| `validate` | Custom validation | `validate: { validator: fn }` |

---

## 🔧 Part 4: CRUD Operations

### API Endpoints Overview

```mermaid
graph TD
    A[CRUD Operations] --> B[CREATE - POST]
    A --> C[READ - GET]
    A --> D[UPDATE - PUT/PATCH]
    A --> E[DELETE - DELETE]
    
    B --> B1[Create Single Project]
    C --> C1[Get All Projects]
    C --> C2[Get Single Project]
    D --> D1[Update Project]
    E --> E1[Delete Project]
    
    style A fill:#FF6B6B
    style B fill:#4ECDC4
    style C fill:#45B7D1
    style D fill:#FFA07A
    style E fill:#98D8C8
```

### Complete Routes Implementation (routes/projects.js)

```javascript
const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

// @route   GET /api/projects
// @desc    Get all projects
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { featured, status, sort } = req.query;
    
    // Build query
    let query = {};
    if (featured) query.featured = featured === 'true';
    if (status) query.status = status;
    
    // Execute query with sorting
    const projects = await Project.find(query)
      .sort(sort || '-createdAt')
      .select('-__v');
    
    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// @route   GET /api/projects/:id
// @desc    Get single project
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    // Handle invalid MongoDB ID
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// @route   POST /api/projects
// @desc    Create new project
// @access  Private (would add auth later)
router.post('/', async (req, res) => {
  try {
    const project = await Project.create(req.body);
    
    res.status(201).json({
      success: true,
      data: project
    });
  } catch (error) {
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        error: messages
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// @route   PUT /api/projects/:id
// @desc    Update project
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,           // Return updated document
        runValidators: true  // Run schema validators
      }
    );
    
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        error: messages
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// @route   DELETE /api/projects/:id
// @desc    Delete project
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

module.exports = router;
```

---

## 🧪 Part 5: Testing with Real Examples

### Example 1: Create a New Project

**Request:**

```http
POST http://localhost:5000/api/projects
Content-Type: application/json

{
  "title": "E-Commerce Dashboard",
  "description": "Admin dashboard for managing products, orders, and customers with real-time analytics",
  "technologies": ["React", "Node.js", "MongoDB", "Chart.js"],
  "githubUrl": "https://github.com/username/ecommerce-dashboard",
  "liveUrl": "https://dashboard-demo.netlify.app",
  "featured": true,
  "status": "completed"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "65a1234567890abcdef12345",
    "title": "E-Commerce Dashboard",
    "description": "Admin dashboard for managing products, orders, and customers with real-time analytics",
    "technologies": ["React", "Node.js", "MongoDB", "Chart.js"],
    "githubUrl": "https://github.com/username/ecommerce-dashboard",
    "liveUrl": "https://dashboard-demo.netlify.app",
    "featured": true,
    "status": "completed",
    "imageUrl": "default-project.jpg",
    "createdAt": "2025-11-16T10:30:00.000Z",
    "updatedAt": "2025-11-16T10:30:00.000Z"
  }
}
```

### Example 2: Get All Featured Projects

**Request:**

```http
GET http://localhost:5000/api/projects?featured=true&sort=-createdAt
```

**Response:**

```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "65a1234567890abcdef12345",
      "title": "E-Commerce Dashboard",
      "featured": true,
      "status": "completed"
    },
    // ... more projects
  ]
}
```

### Example 3: Update Project Status

**Request:**

```http
PUT http://localhost:5000/api/projects/65a1234567890abcdef12345
Content-Type: application/json

{
  "status": "archived"
}
```

### Example 4: Delete a Project

**Request:**

```http
DELETE http://localhost:5000/api/projects/65a1234567890abcdef12345
```

---

## 🛡️ Part 6: Error Handling Best Practices

### Error Handling Flow

```mermaid
graph TD
    A[Request Received] --> B{Valid Data?}
    B -->|No| C[Validation Error 400]
    B -->|Yes| D{Resource Exists?}
    D -->|No| E[Not Found 404]
    D -->|Yes| F{Database Operation}
    F -->|Success| G[Success Response 200/201]
    F -->|Failure| H[Server Error 500]
    
    style C fill:#ff6b6b
    style E fill:#ffa500
    style G fill:#51cf66
    style H fill:#ff0000
```

### Custom Error Handler Middleware

```javascript
// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log to console for developer
  console.error(err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { message, statusCode: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = { message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(e => e.message);
    error = { message, statusCode: 400 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error'
  });
};

module.exports = errorHandler;
```

**Add to server.js:**

```javascript
const errorHandler = require('./middleware/errorHandler');

// ... routes ...

app.use(errorHandler); // Must be last
```

---

## ⚡ Part 7: Performance Optimization

### 1. Indexing Strategy

**Why Indexes?** Think of indexes like a book's index - instead of reading every page to find "MongoDB", you check the index and jump directly to page 247!

```javascript
// In your schema
ProjectSchema.index({ title: 'text', description: 'text' }); // Text search
ProjectSchema.index({ featured: -1, createdAt: -1 }); // Compound index
ProjectSchema.index({ status: 1 }); // Single field index
```

### 2. Query Optimization Tips

```javascript
// ❌ BAD - Loads all fields
const projects = await Project.find();

// ✅ GOOD - Select only needed fields
const projects = await Project.find().select('title description imageUrl');

// ✅ EVEN BETTER - Pagination
const projects = await Project.find()
  .select('title description')
  .limit(10)
  .skip(page * 10);
```

### 3. Connection Pooling

Already handled by Mongoose default settings:

- Default pool size: 5 connections
- Automatically manages connection lifecycle

---

## 🎯 Part 8: Advanced Mongoose Features

### Virtual Properties

```javascript
// Add to ProjectSchema
ProjectSchema.virtual('urlSlug').get(function() {
  return this.title.toLowerCase().replace(/\s+/g, '-');
});

// Usage
const project = await Project.findById(id);
console.log(project.urlSlug); // "e-commerce-dashboard"
```

### Middleware (Hooks)

```javascript
// Pre-save hook - runs before saving
ProjectSchema.pre('save', function(next) {
  // Convert title to Title Case
  this.title = this.title
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
  next();
});

// Post-save hook - runs after saving
ProjectSchema.post('save', function(doc) {
  console.log(`✅ Project "${doc.title}" was saved`);
});
```

### Statics and Methods

```javascript
// Static method - called on Model
ProjectSchema.statics.findByTechnology = function(tech) {
  return this.find({ technologies: tech });
};

// Instance method - called on document
ProjectSchema.methods.toggleFeatured = function() {
  this.featured = !this.featured;
  return this.save();
};

// Usage
const reactProjects = await Project.findByTechnology('React');
await myProject.toggleFeatured();
```

---

## 🔍 Part 9: Data Validation Deep Dive

### Custom Validators

```javascript
const ProjectSchema = new mongoose.Schema({
  rating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5'],
    validate: {
      validator: function(v) {
        return v >= 1 && v <= 5 && v % 0.5 === 0; // Only .5 increments
      },
      message: 'Rating must be in 0.5 increments between 1 and 5'
    }
  },
  email: {
    type: String,
    validate: {
      validator: function(v) {
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
      },
      message: 'Please provide a valid email address'
    }
  }
});
```

### Async Validators

```javascript
technologies: {
  type: [String],
  validate: {
    validator: async function(techs) {
      const validTechs = ['React', 'Node.js', 'MongoDB', 'Express'];
      return techs.every(tech => validTechs.includes(tech));
    },
    message: 'Invalid technology provided'
  }
}
```

---

## 🎓 Hands-On Practice Exercise

### Challenge: Build a Blog API

Create a complete CRUD API for blog posts with:

**Requirements:**

1. Schema with fields: title, content, author, tags, published, views
2. Validation: title (5-100 chars), content (required, min 50 chars)
3. Endpoints for:
   - Get all published posts
   - Search posts by tag
   - Increment view count on read
   - Filter by author
4. Indexing on: title (text), tags, published + createdAt

**Bonus Features:**

- Add comment count virtual property
- Pre-save hook to generate URL slug
- Method to toggle published status

### Solution Structure

```javascript
// models/BlogPost.js
const BlogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    minlength: [5, 'Title must be at least 5 characters'],
    maxlength: [100, 'Title cannot exceed 100 characters'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    minlength: [50, 'Content must be at least 50 characters']
  },
  author: {
    type: String,
    required: true
  },
  tags: {
    type: [String],
    default: []
  },
  published: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  slug: String
}, { timestamps: true });

// Indexes
BlogPostSchema.index({ title: 'text' });
BlogPostSchema.index({ tags: 1 });
BlogPostSchema.index({ published: -1, createdAt: -1 });

// Generate slug before saving
BlogPostSchema.pre('save', function(next) {
  this.slug = this.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
  next();
});

// Method to increment views
BlogPostSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

module.exports = mongoose.model('BlogPost', BlogPostSchema);
```

---

## 📊 Common Patterns and Best Practices

### 1. Response Standardization

```javascript
// utils/responseHandler.js
class ApiResponse {
  static success(res, data, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  }

  static error(res, message = 'Error', statusCode = 500) {
    return res.status(statusCode).json({
      success: false,
      message,
      error: message
    });
  }
}

// Usage in routes
ApiResponse.success(res, projects, 'Projects retrieved successfully');
```

### 2. Request Validation Middleware

```javascript
// middleware/validateProject.js
const validateProject = (req, res, next) => {
  const { title, description, technologies } = req.body;
  
  if (!title || title.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Title is required'
    });
  }
  
  if (!technologies || !Array.isArray(technologies) || technologies.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'At least one technology is required'
    });
  }
  
  next();
};

// Usage
router.post('/', validateProject, async (req, res) => {
  // Your logic
});
```

### 3. Async Handler Wrapper

```javascript
// middleware/asyncHandler.js
const asyncHandler = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Usage - No more try-catch blocks!
router.get('/', asyncHandler(async (req, res) => {
  const projects = await Project.find();
  res.json({ success: true, data: projects });
}));
```

---

## 🚀 Deployment Checklist

```mermaid
graph LR
    A[Local Development] --> B[Environment Variables]
    B --> C[MongoDB Atlas Setup]
    C --> D[Deploy to Heroku/Railway]
    D --> E[Test Production]
    
    style A fill:#64B5F6
    style E fill:#81C784
```

### Pre-Deployment Steps

1. **Environment Variables**

   ```env
   NODE_ENV=production
   MONGO_URI=mongodb+srv://...
   PORT=5000
   ```

2. **Connection String Whitelist**
   - Add `0.0.0.0/0` in MongoDB Atlas Network Access

3. **Production Connection Options**

   ```javascript
   const options = {
     useNewUrlParser: true,
     useUnifiedTopology: true,
     maxPoolSize: 10,
     serverSelectionTimeoutMS: 5000,
     socketTimeoutMS: 45000,
   };
   ```

---

## 📚 Quick Reference

### Mongoose Query Methods

| Method | Purpose | Example |
|--------|---------|---------|
| `find()` | Get all documents | `Project.find({ status: 'completed' })` |
| `findById()` | Get by ID | `Project.findById(id)` |
| `findOne()` | Get first match | `Project.findOne({ title: 'MyApp' })` |
| `create()` | Create document | `Project.create({ title: 'New' })` |
| `findByIdAndUpdate()` | Update by ID | `Project.findByIdAndUpdate(id, data)` |
| `findByIdAndDelete()` | Delete by ID | `Project.findByIdAndDelete(id)` |
| `countDocuments()` | Count matches | `Project.countDocuments({ featured: true })` |

### HTTP Status Codes

| Code | Meaning | Use Case |
|------|---------|----------|
| 200 | OK | Successful GET, PUT, DELETE |
| 201 | Created | Successful POST |
| 400 | Bad Request | Validation errors |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Database or server issues |

---

## 🎯 Session Recap

### What We Covered

✅ **MongoDB Connection** - Connected Express.js to MongoDB Atlas  
✅ **Mongoose Schemas** - Created structured data models with validation  
✅ **CRUD Operations** - Implemented Create, Read, Update, Delete endpoints  
✅ **Error Handling** - Built robust error handling mechanisms  
✅ **Performance** - Added indexing and query optimization  
✅ **Best Practices** - Learned industry-standard patterns

### Next Steps

1. **Authentication** - Add user login and JWT tokens
2. **File Uploads** - Handle images with Multer/Cloudinary
3. **Advanced Queries** - Pagination, filtering, sorting
4. **Relationships** - References and population between models
5. **Testing** - Unit and integration tests with Jest

---

## 🔗 Additional Resources

- **Official Docs:** [mongoosejs.com](https://mongoosejs.com)
- **MongoDB University:** [Free courses on MongoDB](https://university.mongodb.com)
- **REST API Design:** [Best practices guide](https://restfulapi.net)
- **MongoDB Compass:** [GUI for database management](https://mongodb.com/compass)

---

## 💡 Key Takeaways

> **"Databases are like gyms - the more you practice CRUD operations, the stronger your applications become!"**

1. Always validate data at schema level
2. Handle errors gracefully with proper status codes
3. Use indexes for frequently queried fields
4. Never expose sensitive data in error messages
5. Test your API with tools like Postman or Thunder Client

---

**Happy Coding! 🚀**

*Remember: Every master was once a beginner who never gave up!*
