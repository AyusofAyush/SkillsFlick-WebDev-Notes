# 📬 API Testing Guide - Postman & cURL

Complete testing guide for the Secure Blog API with examples for both Postman and cURL.

---

## 📋 Table of Contents

1. [Setup](#setup)
2. [Authentication Endpoints](#authentication-endpoints)
3. [Post Endpoints](#post-endpoints)
4. [Postman Collection](#postman-collection)
5. [Testing Scenarios](#testing-scenarios)

---

## 🔧 Setup

### Prerequisites

- Server running on `http://localhost:4000`
- MongoDB running locally or connection to MongoDB Atlas
- Postman installed (or use cURL)
- `jq` installed for cURL JSON formatting (optional)

### Environment Variables for Postman

Create a Postman environment with these variables:

```
base_url: http://localhost:4000
token: (will be set automatically after login)
refresh_token: (will be set automatically after login)
user_id: (will be set automatically after registration)
post_id: (will be set automatically after creating a post)
comment_id: (will be set automatically after adding a comment)
```

---

## 🔐 Authentication Endpoints

### 1. Health Check

**Endpoint:** `GET /health`

**Postman:**

```
GET {{base_url}}/health
```

**cURL:**

```bash
curl -X GET http://localhost:4000/health
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 123.456,
  "environment": "development"
}
```

---

### 2. Register User

**Endpoint:** `POST /api/auth/register`

**Postman:**

```
POST {{base_url}}/api/auth/register
Content-Type: application/json

Body (raw JSON):
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass@123"
}
```

**Postman Test Script:**

```javascript
if (pm.response.code === 201) {
    const response = pm.response.json();
    pm.environment.set("token", response.data.token);
    pm.environment.set("user_id", response.data.user.id);
    pm.test("User registered successfully", () => {
        pm.expect(response.success).to.be.true;
    });
}
```

**cURL:**

```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "SecurePass@123"
  }'
```

**Expected Response:**

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

---

### 3. Login User

**Endpoint:** `POST /api/auth/login`

**Postman:**

```
POST {{base_url}}/api/auth/login
Content-Type: application/json

Body (raw JSON):
{
  "email": "john@example.com",
  "password": "SecurePass@123"
}
```

**Postman Test Script:**

```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    pm.environment.set("token", response.data.token);
    pm.environment.set("refresh_token", response.data.refreshToken);
    pm.test("Login successful", () => {
        pm.expect(response.success).to.be.true;
    });
}
```

**cURL:**

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass@123"
  }'
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "username": "johndoe",
      "email": "john@example.com",
      "role": "user",
      "lastLogin": "2024-01-15T10:05:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 4. Get Profile

**Endpoint:** `GET /api/auth/profile`

**Postman:**

```
GET {{base_url}}/api/auth/profile
Authorization: Bearer {{token}}
```

**cURL:**

```bash
TOKEN="your_jwt_token_here"
curl -X GET http://localhost:4000/api/auth/profile \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "johndoe",
      "email": "john@example.com",
      "role": "user",
      "bio": "",
      "isActive": true,
      "createdAt": "2024-01-15T10:00:00.000Z"
    }
  }
}
```

---

### 5. Update Profile

**Endpoint:** `PUT /api/auth/profile`

**Postman:**

```
PUT {{base_url}}/api/auth/profile
Authorization: Bearer {{token}}
Content-Type: application/json

Body (raw JSON):
{
  "username": "john_updated",
  "bio": "Full-stack developer passionate about security"
}
```

**cURL:**

```bash
curl -X PUT http://localhost:4000/api/auth/profile \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_updated",
    "bio": "Full-stack developer passionate about security"
  }'
```

---

### 6. Change Password

**Endpoint:** `PUT /api/auth/change-password`

**Postman:**

```
PUT {{base_url}}/api/auth/change-password
Authorization: Bearer {{token}}
Content-Type: application/json

Body (raw JSON):
{
  "currentPassword": "SecurePass@123",
  "newPassword": "NewSecure@456",
  "confirmPassword": "NewSecure@456"
}
```

**cURL:**

```bash
curl -X PUT http://localhost:4000/api/auth/change-password \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "SecurePass@123",
    "newPassword": "NewSecure@456",
    "confirmPassword": "NewSecure@456"
  }'
```

---

### 7. Refresh Token

**Endpoint:** `POST /api/auth/refresh`

**Postman:**

```
POST {{base_url}}/api/auth/refresh
Content-Type: application/json

Body (raw JSON):
{
  "refreshToken": "{{refresh_token}}"
}
```

**Postman Test Script:**

```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    pm.environment.set("token", response.data.token);
}
```

**cURL:**

```bash
curl -X POST http://localhost:4000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d "{
    \"refreshToken\": \"$REFRESH_TOKEN\"
  }"
```

---

### 8. Logout

**Endpoint:** `POST /api/auth/logout`

**Postman:**

```
POST {{base_url}}/api/auth/logout
Authorization: Bearer {{token}}
Content-Type: application/json

Body (raw JSON):
{
  "refreshToken": "{{refresh_token}}"
}
```

**cURL:**

```bash
curl -X POST http://localhost:4000/api/auth/logout \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"refreshToken\": \"$REFRESH_TOKEN\"
  }"
```

---

## 📝 Post Endpoints

### 9. Create Post

**Endpoint:** `POST /api/posts`

**Postman:**

```
POST {{base_url}}/api/posts
Authorization: Bearer {{token}}
Content-Type: application/json

Body (raw JSON):
{
  "title": "Understanding JWT Authentication",
  "content": "JSON Web Tokens (JWT) are a compact, URL-safe means of representing claims...",
  "excerpt": "Learn about JWT authentication in modern web applications",
  "category": "technology",
  "tags": ["jwt", "security", "authentication"],
  "status": "draft"
}
```

**Postman Test Script:**

```javascript
if (pm.response.code === 201) {
    const response = pm.response.json();
    pm.environment.set("post_id", response.data.post._id);
}
```

**cURL:**

```bash
curl -X POST http://localhost:4000/api/posts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Understanding JWT Authentication",
    "content": "JSON Web Tokens (JWT) are a compact, URL-safe means...",
    "category": "technology",
    "tags": ["jwt", "security", "authentication"],
    "status": "draft"
  }'
```

---

### 10. Get All Posts

**Endpoint:** `GET /api/posts`

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `category` (optional): Filter by category
- `tag` (optional): Filter by tag
- `search` (optional): Search in title/content

**Postman:**

```
GET {{base_url}}/api/posts?page=1&limit=10&category=technology
```

**cURL:**

```bash
# All posts
curl -X GET http://localhost:4000/api/posts

# With pagination
curl -X GET "http://localhost:4000/api/posts?page=1&limit=5"

# With filters
curl -X GET "http://localhost:4000/api/posts?category=technology&tag=security"

# With search
curl -X GET "http://localhost:4000/api/posts?search=authentication"
```

---

### 11. Get Single Post

**Endpoint:** `GET /api/posts/:id`

**Postman:**

```
GET {{base_url}}/api/posts/{{post_id}}
Authorization: Bearer {{token}}
```

**cURL:**

```bash
POST_ID="your_post_id_here"
curl -X GET http://localhost:4000/api/posts/$POST_ID \
  -H "Authorization: Bearer $TOKEN"
```

---

### 12. Update Post

**Endpoint:** `PUT /api/posts/:id`

**Postman:**

```
PUT {{base_url}}/api/posts/{{post_id}}
Authorization: Bearer {{token}}
Content-Type: application/json

Body (raw JSON):
{
  "title": "Understanding JWT Authentication - Updated",
  "content": "Updated content with more details...",
  "status": "published"
}
```

**cURL:**

```bash
curl -X PUT http://localhost:4000/api/posts/$POST_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Understanding JWT Authentication - Updated",
    "content": "Updated content...",
    "status": "published"
  }'
```

---

### 13. Delete Post

**Endpoint:** `DELETE /api/posts/:id`

**Postman:**

```
DELETE {{base_url}}/api/posts/{{post_id}}
Authorization: Bearer {{token}}
```

**cURL:**

```bash
curl -X DELETE http://localhost:4000/api/posts/$POST_ID \
  -H "Authorization: Bearer $TOKEN"
```

---

### 14. Like Post

**Endpoint:** `POST /api/posts/:id/like`

**Postman:**

```
POST {{base_url}}/api/posts/{{post_id}}/like
Authorization: Bearer {{token}}
```

**cURL:**

```bash
curl -X POST http://localhost:4000/api/posts/$POST_ID/like \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Post liked",
  "data": {
    "liked": true,
    "likeCount": 1
  }
}
```

---

### 15. Add Comment

**Endpoint:** `POST /api/posts/:id/comments`

**Postman:**

```
POST {{base_url}}/api/posts/{{post_id}}/comments
Authorization: Bearer {{token}}
Content-Type: application/json

Body (raw JSON):
{
  "text": "Great article! Very informative."
}
```

**Postman Test Script:**

```javascript
if (pm.response.code === 201) {
    const response = pm.response.json();
    pm.environment.set("comment_id", response.data.comment._id);
}
```

**cURL:**

```bash
curl -X POST http://localhost:4000/api/posts/$POST_ID/comments \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Great article! Very informative."
  }'
```

---

### 16. Delete Comment

**Endpoint:** `DELETE /api/posts/:id/comments/:commentId`

**Postman:**

```
DELETE {{base_url}}/api/posts/{{post_id}}/comments/{{comment_id}}
Authorization: Bearer {{token}}
```

**cURL:**

```bash
COMMENT_ID="your_comment_id_here"
curl -X DELETE http://localhost:4000/api/posts/$POST_ID/comments/$COMMENT_ID \
  -H "Authorization: Bearer $TOKEN"
```

---

### 17. Get My Posts

**Endpoint:** `GET /api/posts/my/posts`

**Postman:**

```
GET {{base_url}}/api/posts/my/posts
Authorization: Bearer {{token}}
```

**cURL:**

```bash
curl -X GET http://localhost:4000/api/posts/my/posts \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📦 Postman Collection JSON

Save this as `Secure-Blog-API.postman_collection.json`:

```json
{
  "info": {
    "name": "Secure Blog API",
    "description": "Complete API collection for Secure Blog API with JWT authentication",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "auth": {
    "type": "bearer",
    "bearer": [
      {
        "key": "token",
        "value": "{{token}}",
        "type": "string"
      }
    ]
  },
  "item": [
    {
      "name": "Authentication",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"username\": \"testuser\",\n  \"email\": \"test@example.com\",\n  \"password\": \"Test@1234\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/api/auth/register",
              "host": ["{{base_url}}"],
              "path": ["api", "auth", "register"]
            }
          }
        },
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"test@example.com\",\n  \"password\": \"Test@1234\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/api/auth/login",
              "host": ["{{base_url}}"],
              "path": ["api", "auth", "login"]
            }
          }
        },
        {
          "name": "Get Profile",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{base_url}}/api/auth/profile",
              "host": ["{{base_url}}"],
              "path": ["api", "auth", "profile"]
            }
          }
        },
        {
          "name": "Update Profile",
          "request": {
            "method": "PUT",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"username\": \"updated_user\",\n  \"bio\": \"My updated bio\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/api/auth/profile",
              "host": ["{{base_url}}"],
              "path": ["api", "auth", "profile"]
            }
          }
        },
        {
          "name": "Change Password",
          "request": {
            "method": "PUT",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"currentPassword\": \"Test@1234\",\n  \"newPassword\": \"NewTest@1234\",\n  \"confirmPassword\": \"NewTest@1234\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/api/auth/change-password",
              "host": ["{{base_url}}"],
              "path": ["api", "auth", "change-password"]
            }
          }
        },
        {
          "name": "Refresh Token",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"refreshToken\": \"{{refresh_token}}\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/api/auth/refresh",
              "host": ["{{base_url}}"],
              "path": ["api", "auth", "refresh"]
            }
          }
        },
        {
          "name": "Logout",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"refreshToken\": \"{{refresh_token}}\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/api/auth/logout",
              "host": ["{{base_url}}"],
              "path": ["api", "auth", "logout"]
            }
          }
        }
      ]
    },
    {
      "name": "Posts",
      "item": [
        {
          "name": "Create Post",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"title\": \"My First Post\",\n  \"content\": \"This is the content of my first blog post.\",\n  \"category\": \"technology\",\n  \"tags\": [\"nodejs\", \"express\"],\n  \"status\": \"draft\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/api/posts",
              "host": ["{{base_url}}"],
              "path": ["api", "posts"]
            }
          }
        },
        {
          "name": "Get All Posts",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{base_url}}/api/posts?page=1&limit=10",
              "host": ["{{base_url}}"],
              "path": ["api", "posts"],
              "query": [
                {
                  "key": "page",
                  "value": "1"
                },
                {
                  "key": "limit",
                  "value": "10"
                }
              ]
            }
          }
        },
        {
          "name": "Get Single Post",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{base_url}}/api/posts/{{post_id}}",
              "host": ["{{base_url}}"],
              "path": ["api", "posts", "{{post_id}}"]
            }
          }
        },
        {
          "name": "Update Post",
          "request": {
            "method": "PUT",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"title\": \"Updated Post Title\",\n  \"content\": \"Updated content\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/api/posts/{{post_id}}",
              "host": ["{{base_url}}"],
              "path": ["api", "posts", "{{post_id}}"]
            }
          }
        },
        {
          "name": "Delete Post",
          "request": {
            "method": "DELETE",
            "header": [],
            "url": {
              "raw": "{{base_url}}/api/posts/{{post_id}}",
              "host": ["{{base_url}}"],
              "path": ["api", "posts", "{{post_id}}"]
            }
          }
        },
        {
          "name": "Like Post",
          "request": {
            "method": "POST",
            "header": [],
            "url": {
              "raw": "{{base_url}}/api/posts/{{post_id}}/like",
              "host": ["{{base_url}}"],
              "path": ["api", "posts", "{{post_id}}", "like"]
            }
          }
        },
        {
          "name": "Add Comment",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"text\": \"Great post!\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/api/posts/{{post_id}}/comments",
              "host": ["{{base_url}}"],
              "path": ["api", "posts", "{{post_id}}", "comments"]
            }
          }
        },
        {
          "name": "Delete Comment",
          "request": {
            "method": "DELETE",
            "header": [],
            "url": {
              "raw": "{{base_url}}/api/posts/{{post_id}}/comments/{{comment_id}}",
              "host": ["{{base_url}}"],
              "path": ["api", "posts", "{{post_id}}", "comments", "{{comment_id}}"]
            }
          }
        },
        {
          "name": "Get My Posts",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{base_url}}/api/posts/my/posts",
              "host": ["{{base_url}}"],
              "path": ["api", "posts", "my", "posts"]
            }
          }
        }
      ]
    }
  ]
}
```

---

## 🧪 Testing Scenarios

### Scenario 1: Complete User Journey

1. Register a new user
2. Login with credentials
3. Get user profile
4. Update profile
5. Create a post
6. Like the post
7. Add a comment
8. Update the post
9. Change password
10. Logout

### Scenario 2: Security Testing

1. Try to access protected route without token (should fail)
2. Try to use expired token (should fail)
3. Try to access another user's private data (should fail)
4. Test rate limiting by making many requests
5. Test SQL injection in inputs
6. Test XSS in post content

### Scenario 3: Error Handling

1. Register with invalid email format
2. Login with wrong password
3. Create post with missing required fields
4. Update non-existent post
5. Delete already deleted post

---

## 🔑 Important Notes

1. **Token Management**: Save the token from login/register responses and use it in subsequent requests
2. **Rate Limiting**: Don't make too many requests too quickly
3. **Password Requirements**: Minimum 8 characters, must include uppercase, lowercase, number, and special character
4. **Post Status**: Users can only create drafts; moderators/admins can publish
5. **Permissions**: Users can only edit/delete their own posts

---

## 🚀 Quick Start

**Run the test script:**

```bash
chmod +x test-api.sh
./test-api.sh
```

**Import into Postman:**

1. Open Postman
2. Click Import
3. Choose the JSON file
4. Create an environment with base_url variable
5. Run the collection

---

Happy Testing! 🎉
