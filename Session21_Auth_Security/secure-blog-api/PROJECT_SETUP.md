# 🔐 Secure Blog API - Project Setup Guide

A production-ready RESTful API built with Node.js, Express, MongoDB, featuring JWT authentication, role-based access control, and comprehensive security measures.

---

## 📋 Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Prerequisites](#prerequisites)
4. [Installation](#installation)
5. [Configuration](#configuration)
6. [Running the Application](#running-the-application)
7. [API Documentation](#api-documentation)
8. [Security Features](#security-features)
9. [Project Structure](#project-structure)
10. [Testing](#testing)
11. [Deployment](#deployment)
12. [Troubleshooting](#troubleshooting)

---

## ✨ Features

### Authentication & Authorization

- ✅ User registration with email and password
- ✅ Secure login with JWT tokens
- ✅ Password hashing with bcrypt (12 rounds)
- ✅ Refresh token mechanism
- ✅ Role-based access control (User, Moderator, Admin)
- ✅ Account lockout after failed login attempts
- ✅ Password change functionality

### Blog Features

- ✅ Create, read, update, delete posts (CRUD)
- ✅ Post categories and tags
- ✅ Post status (draft, published, archived)
- ✅ Like/unlike posts
- ✅ Comments system
- ✅ User-specific post management
- ✅ Search and filtering
- ✅ Pagination

### Security

- ✅ Helmet.js for security headers
- ✅ CORS protection
- ✅ Rate limiting
- ✅ NoSQL injection prevention
- ✅ XSS protection
- ✅ Input validation
- ✅ Comprehensive logging
- ✅ Error handling

---

## 🛠️ Tech Stack

- **Runtime:** Node.js (v16+)
- **Framework:** Express.js
- **Database:** MongoDB
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcrypt
- **Validation:** express-validator
- **Security:** helmet, cors, express-rate-limit, express-mongo-sanitize
- **Logging:** winston
- **Development:** nodemon

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16.0.0 or higher)

  ```bash
  node --version
  ```

- **npm** (v7.0.0 or higher)

  ```bash
  npm --version
  ```

- **MongoDB** (v5.0 or higher)
  - Local installation OR
  - MongoDB Atlas account (cloud)
  
  ```bash
  # Check MongoDB installation
  mongod --version
  ```

- **Git** (optional, for version control)

  ```bash
  git --version
  ```

---

## 📥 Installation

### Step 1: Clone or Navigate to Project

```bash
cd Session21/secure-blog-api
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages:

- express
- mongoose
- bcrypt
- jsonwebtoken
- dotenv
- cors
- helmet
- express-validator
- express-rate-limit
- winston
- cookie-parser
- compression
- express-mongo-sanitize
- nodemon (dev dependency)

### Step 3: Verify Installation

```bash
npm list --depth=0
```

You should see all dependencies listed without errors.

---

## ⚙️ Configuration

### Step 1: Environment Variables

The `.env` file is already created with sample values. **Important:** For production, generate new secure secrets!

**Generate Secure Secrets:**

```bash
# Generate JWT Secret (64 bytes)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Generate JWT Refresh Secret (64 bytes)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Generate Cookie Secret (32 bytes)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Update `.env` file:**

```env
# Server Configuration
PORT=4000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/secure-blog

# JWT Configuration (REPLACE WITH YOUR GENERATED SECRETS!)
JWT_SECRET=your_generated_secret_here
JWT_EXPIRE=24h
JWT_REFRESH_SECRET=your_generated_refresh_secret_here
JWT_REFRESH_EXPIRE=7d

# Cookie Configuration
COOKIE_SECRET=your_generated_cookie_secret_here

# Security
BCRYPT_ROUNDS=12

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:4000

# Logging
LOG_LEVEL=info
```

### Step 2: MongoDB Setup

#### Option A: Local MongoDB

1. **Start MongoDB:**

   ```bash
   # macOS (with Homebrew)
   brew services start mongodb-community

   # Linux
   sudo systemctl start mongod

   # Windows
   net start MongoDB
   ```

2. **Verify MongoDB is running:**

   ```bash
   mongosh
   # or
   mongo
   ```

3. **Create database (optional):**

   ```javascript
   use secure-blog
   db.createCollection("users")
   ```

#### Option B: MongoDB Atlas (Cloud)

1. **Sign up at** [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

2. **Create a free cluster**

3. **Get connection string:**
   - Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password

4. **Update `.env`:**

   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/secure-blog?retryWrites=true&w=majority
   ```

5. **Whitelist IP address** in Atlas (Network Access)

---

## 🚀 Running the Application

### Development Mode (with auto-reload)

```bash
npm run dev
```

This starts the server with nodemon, which automatically restarts when you make changes.

### Production Mode

```bash
npm start
```

### Expected Output

```
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║          🔐 SECURE BLOG API - SERVER RUNNING 🔐           ║
║                                                            ║
║  Port:        4000                                         ║
║  Environment: development                                  ║
║  Health:      http://localhost:4000/health                 ║
║  API Docs:    http://localhost:4000/                       ║
║                                                            ║
║  Security Features Enabled:                                ║
║  ✓ Helmet (Security Headers)                               ║
║  ✓ CORS Protection                                         ║
║  ✓ Rate Limiting                                           ║
║  ✓ NoSQL Injection Protection                              ║
║  ✓ JWT Authentication                                      ║
║  ✓ Password Hashing (Bcrypt)                               ║
║  ✓ Input Validation                                        ║
║  ✓ Request Logging                                         ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
```

### Verify Server is Running

```bash
curl http://localhost:4000/health
```

---

## 📚 API Documentation

### Base URL

```
http://localhost:4000
```

### Authentication Flow

```mermaid
sequenceDiagram
    participant Client
    participant API
    participant Database
    
    Client->>API: POST /api/auth/register
    API->>Database: Create User (hashed password)
    Database-->>API: User Created
    API-->>Client: JWT Token
    
    Client->>API: POST /api/auth/login
    API->>Database: Verify Credentials
    Database-->>API: User Found
    API-->>Client: JWT Token + Refresh Token
    
    Client->>API: GET /api/posts (with token)
    API->>API: Verify Token
    API->>Database: Fetch Posts
    Database-->>API: Posts Data
    API-->>Client: Posts Response
```

### Endpoints Overview

#### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| POST | `/api/auth/logout` | Logout user | Yes |
| POST | `/api/auth/refresh` | Refresh access token | No |
| GET | `/api/auth/profile` | Get user profile | Yes |
| PUT | `/api/auth/profile` | Update user profile | Yes |
| PUT | `/api/auth/change-password` | Change password | Yes |

#### Post Endpoints

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| GET | `/api/posts` | Get all posts | No | All |
| GET | `/api/posts/:id` | Get single post | No | All |
| POST | `/api/posts` | Create post | Yes | User+ |
| PUT | `/api/posts/:id` | Update post | Yes | Author/Mod/Admin |
| DELETE | `/api/posts/:id` | Delete post | Yes | Author/Mod/Admin |
| POST | `/api/posts/:id/like` | Like/unlike post | Yes | User+ |
| POST | `/api/posts/:id/comments` | Add comment | Yes | User+ |
| DELETE | `/api/posts/:id/comments/:commentId` | Delete comment | Yes | Author/Mod/Admin |
| GET | `/api/posts/my/posts` | Get user's posts | Yes | User+ |

### Request/Response Examples

#### Register User

**Request:**

```bash
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass@123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "username": "johndoe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "2024-01-15T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Create Post

**Request:**

```bash
POST /api/posts
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "title": "Understanding JWT Authentication",
  "content": "JSON Web Tokens are...",
  "category": "technology",
  "tags": ["jwt", "security"],
  "status": "draft"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Post created successfully",
  "data": {
    "post": {
      "_id": "507f1f77bcf86cd799439012",
      "title": "Understanding JWT Authentication",
      "content": "JSON Web Tokens are...",
      "author": {
        "_id": "507f1f77bcf86cd799439011",
        "username": "johndoe",
        "email": "john@example.com"
      },
      "category": "technology",
      "tags": ["jwt", "security"],
      "status": "draft",
      "views": 0,
      "likes": [],
      "comments": [],
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

---

## 🔒 Security Features

### 1. Password Security

- **Bcrypt hashing** with 12 rounds (configurable)
- **Password requirements:**
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character

### 2. JWT Security

- **Access tokens** expire in 24 hours (configurable)
- **Refresh tokens** expire in 7 days (configurable)
- **Token invalidation** on password change
- **Secure secret** generation required

### 3. Account Protection

- **Login attempts** limited to 5 attempts
- **Account lockout** for 2 hours after max attempts
- **Rate limiting** on all API routes
  - 100 requests per 15 minutes per IP
  - 5 registrations per hour per IP
  - 10 login attempts per 15 minutes per IP

### 4. Input Validation

- **Email format** validation
- **Username restrictions** (alphanumeric + underscore)
- **Content length** limits
- **XSS prevention** through sanitization
- **NoSQL injection** prevention

### 5. HTTP Security Headers (Helmet)

```javascript
Content-Security-Policy
Strict-Transport-Security (HSTS)
X-Content-Type-Options
X-Frame-Options
X-XSS-Protection
```

### 6. CORS Protection

- Configurable allowed origins
- Credentials support
- Preflight handling

### 7. Logging & Monitoring

- **Request logging** with Winston
- **Error logging** with stack traces (dev only)
- **Security event logging**
  - Failed login attempts
  - Unauthorized access attempts
  - Account lockouts

---

## 📁 Project Structure

```
secure-blog-api/
├── models/               # Database models
│   ├── User.js          # User schema with authentication
│   └── Post.js          # Blog post schema
├── middleware/          # Custom middleware
│   ├── auth.js          # JWT authentication
│   └── authorize.js     # Role-based authorization
├── routes/              # API routes
│   ├── auth.js          # Authentication routes
│   └── posts.js         # Post management routes
├── utils/               # Utility functions
│   ├── logger.js        # Winston logger setup
│   └── validator.js     # Validation rules
├── config/              # Configuration files
├── logs/                # Application logs (auto-created)
│   ├── error.log        # Error logs
│   └── combined.log     # All logs
├── .env                 # Environment variables (DO NOT COMMIT!)
├── .env.example         # Example environment file
├── .gitignore           # Git ignore rules
├── server.js            # Main application file
├── package.json         # Dependencies
├── test-api.sh          # Automated testing script
├── API-TESTING.md       # Testing documentation
└── PROJECT_SETUP.md     # This file
```

---

## 🧪 Testing

### Automated Testing Script

Run the comprehensive test script:

```bash
# Make script executable
chmod +x test-api.sh

# Run tests
./test-api.sh
```

This script tests:

- ✅ Health check
- ✅ User registration
- ✅ User login
- ✅ Profile management
- ✅ Post CRUD operations
- ✅ Comments and likes
- ✅ Search and pagination
- ✅ Token refresh
- ✅ Password change
- ✅ Security features

### Manual Testing with cURL

See `API-TESTING.md` for detailed cURL examples.

### Testing with Postman

1. **Import collection:**
   - See `API-TESTING.md` for Postman collection JSON
   - Import into Postman

2. **Create environment:**
   - Variable: `base_url`
   - Value: `http://localhost:4000`

3. **Run collection:**
   - Collection will auto-save tokens
   - Tests are included

---

## 🚢 Deployment

### Environment Setup

1. **Update `.env` for production:**

   ```env
   NODE_ENV=production
   PORT=4000
   MONGODB_URI=your_production_mongodb_uri
   JWT_SECRET=your_production_secret
   # ... other production values
   ```

2. **Set secure cookies:**
   - Cookies will automatically use `secure: true` in production

### Deployment Platforms

#### Heroku

```bash
# Install Heroku CLI
heroku login
heroku create your-app-name

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_secret

# Deploy
git push heroku main
```

#### DigitalOcean/AWS/Azure

1. Set up Node.js server
2. Install dependencies: `npm ci --production`
3. Set environment variables
4. Use PM2 for process management:

   ```bash
   npm install -g pm2
   pm2 start server.js --name secure-blog-api
   pm2 startup
   pm2 save
   ```

#### Docker

Create `Dockerfile`:

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
EXPOSE 4000
CMD ["node", "server.js"]
```

Build and run:

```bash
docker build -t secure-blog-api .
docker run -p 4000:4000 --env-file .env secure-blog-api
```

---

## 🔧 Troubleshooting

### Common Issues

#### 1. MongoDB Connection Failed

**Error:** `MongoServerError: connect ECONNREFUSED`

**Solutions:**

- Verify MongoDB is running: `brew services list` (macOS)
- Check connection string in `.env`
- For Atlas: Check IP whitelist and credentials

#### 2. Port Already in Use

**Error:** `Error: listen EADDRINUSE: address already in use :::4000`

**Solutions:**

```bash
# Find process using port 4000
lsof -i :4000

# Kill process
kill -9 <PID>

# Or change PORT in .env
PORT=5000
```

#### 3. JWT Token Invalid

**Error:** `401 Unauthorized - Invalid token`

**Solutions:**

- Check token is properly included in header: `Authorization: Bearer <token>`
- Verify JWT_SECRET hasn't changed
- Token may have expired - login again

#### 4. Validation Errors

**Error:** `400 Bad Request - Validation failed`

**Solutions:**

- Check password requirements (8+ chars, uppercase, lowercase, number, special char)
- Verify email format
- Ensure all required fields are provided

#### 5. Rate Limit Exceeded

**Error:** `429 Too Many Requests`

**Solutions:**

- Wait for the rate limit window to reset (15 minutes)
- Reduce request frequency
- For development, increase limits in `.env`

### Debug Mode

Enable detailed logging:

```env
LOG_LEVEL=debug
NODE_ENV=development
```

Check logs:

```bash
tail -f logs/combined.log
tail -f logs/error.log
```

---

## 📝 Best Practices

### For Development

1. **Never commit `.env` file**
2. **Use nodemon** for development
3. **Test all endpoints** after changes
4. **Review logs** regularly
5. **Keep dependencies updated**

### For Production

1. **Use strong secrets** (64+ characters)
2. **Enable HTTPS**
3. **Set `NODE_ENV=production`**
4. **Use secure MongoDB** (authentication enabled)
5. **Monitor logs** and set up alerts
6. **Regular backups** of database
7. **Keep dependencies updated**
8. **Use rate limiting**
9. **Implement CSRF protection** for web clients
10. **Regular security audits**

---

## 🤝 Support

For issues or questions:

1. Check this documentation
2. Review `API-TESTING.md`
3. Check application logs
4. Review the README.md in Session21 folder

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🎓 Learning Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [JWT.io](https://jwt.io/)
- [OWASP Security Guidelines](https://owasp.org/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

**Happy Coding! 🚀**

Built with ❤️ for Session 21: User Authentication and Security
