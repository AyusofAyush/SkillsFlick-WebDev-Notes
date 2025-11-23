# NoteMaster API Testing Guide

This document provides comprehensive testing instructions for the NoteMaster API using curl commands and Postman.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Authentication](#authentication)
3. [Workspaces](#workspaces)
4. [Pages](#pages)
5. [Templates](#templates)
6. [Search & Stats](#search--stats)
7. [Postman Collection](#postman-collection)

---

## Getting Started

### Prerequisites

- NoteMaster server running on `http://localhost:4000`
- curl installed (or Postman)
- Demo accounts available (see below)

### Demo Accounts

```
Username: admin | Password: (any password works in demo mode)
Username: john_doe | Password: (any password works in demo mode)
Username: jane_smith | Password: (any password works in demo mode)
```

### Base URL

```
http://localhost:4000
```

---

## Authentication

### 1. Register New User

```bash
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "fullName=Test User" \
  -d "username=testuser" \
  -d "email=test@example.com" \
  -d "password=password123" \
  -d "confirmPassword=password123" \
  -c cookies.txt
```

**Expected Response:** Redirect to `/workspaces` with session cookie

### 2. Login

```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin" \
  -d "password=anypassword" \
  -c cookies.txt \
  -L
```

**Expected Response:** Redirect to `/workspaces` with session cookie set

### 3. Logout

```bash
curl -X GET http://localhost:4000/auth/logout \
  -b cookies.txt \
  -c cookies.txt \
  -L
```

**Expected Response:** Redirect to `/` with session cleared

---

## Workspaces

### 1. Get All Workspaces (API)

```bash
curl -X GET http://localhost:4000/api/workspaces \
  -b cookies.txt \
  -H "Accept: application/json"
```

**Expected Response:**

```json
{
  "success": true,
  "workspaces": [
    {
      "id": "ws1",
      "name": "Personal",
      "icon": "🏠",
      "owner": "user1",
      "members": ["user1"],
      "isPublic": false,
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T10:00:00.000Z"
    }
  ]
}
```

### 2. Get Workspace by ID (API)

```bash
curl -X GET http://localhost:4000/api/workspaces/ws1 \
  -b cookies.txt \
  -H "Accept: application/json"
```

**Expected Response:**

```json
{
  "success": true,
  "workspace": {
    "id": "ws1",
    "name": "Personal",
    "icon": "🏠",
    "owner": "user1",
    "members": ["user1"],
    "isPublic": false,
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z"
  }
}
```

### 3. Create New Workspace (Web Form)

```bash
curl -X POST http://localhost:4000/workspaces \
  -b cookies.txt \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "name=My New Workspace" \
  -d "icon=💼" \
  -d "isPublic=false" \
  -L
```

**Expected Response:** Redirect to new workspace page

### 4. Create Workspace (API)

```bash
curl -X POST http://localhost:4000/api/workspaces \
  -b cookies.txt \
  -H "Content-Type: application/json" \
  -d '{
    "name": "API Test Workspace",
    "icon": "🧪",
    "isPublic": true
  }'
```

**Expected Response:**

```json
{
  "success": true,
  "workspace": {
    "id": "ws_new",
    "name": "API Test Workspace",
    "icon": "🧪",
    "owner": "user1",
    "members": ["user1"],
    "isPublic": true,
    "createdAt": "2024-01-20T12:00:00.000Z",
    "updatedAt": "2024-01-20T12:00:00.000Z"
  }
}
```

### 5. Update Workspace (Web Form)

```bash
curl -X POST http://localhost:4000/workspaces/ws1 \
  -b cookies.txt \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "name=Updated Workspace Name" \
  -d "icon=🎯" \
  -d "isPublic=true" \
  -L
```

**Expected Response:** Redirect to workspace page

### 6. Delete Workspace (Web Form)

```bash
curl -X POST http://localhost:4000/workspaces/ws1/delete \
  -b cookies.txt \
  -L
```

**Expected Response:** Redirect to `/workspaces`

---

## Pages

### 1. Get Workspace Pages (API)

```bash
curl -X GET http://localhost:4000/api/workspaces/ws1/pages \
  -b cookies.txt \
  -H "Accept: application/json"
```

**Expected Response:**

```json
{
  "success": true,
  "pages": [
    {
      "id": "page1",
      "workspaceId": "ws1",
      "title": "Getting Started",
      "icon": "📘",
      "content": "Welcome to NoteMaster...",
      "parentId": null,
      "tags": ["guide", "setup"],
      "isFavorite": true,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-16T14:20:00.000Z"
    }
  ]
}
```

### 2. Get Single Page (API)

```bash
curl -X GET http://localhost:4000/api/pages/page1 \
  -b cookies.txt \
  -H "Accept: application/json"
```

**Expected Response:**

```json
{
  "success": true,
  "page": {
    "id": "page1",
    "workspaceId": "ws1",
    "title": "Getting Started",
    "icon": "📘",
    "content": "Welcome to NoteMaster...",
    "parentId": null,
    "tags": ["guide", "setup"],
    "isFavorite": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-16T14:20:00.000Z"
  }
}
```

### 3. Create New Page (Web Form)

```bash
curl -X POST http://localhost:4000/workspaces/ws1/pages \
  -b cookies.txt \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "title=New Page" \
  -d "icon=📄" \
  -d "content=This is my new page content" \
  -d "tags=test,new" \
  -L
```

**Expected Response:** Redirect to new page

### 4. Create Page (API)

```bash
curl -X POST http://localhost:4000/api/workspaces/ws1/pages \
  -b cookies.txt \
  -H "Content-Type: application/json" \
  -d '{
    "title": "API Created Page",
    "icon": "🚀",
    "content": "This page was created via API",
    "tags": ["api", "test"],
    "templateId": "tmpl1"
  }'
```

**Expected Response:**

```json
{
  "success": true,
  "page": {
    "id": "page_new",
    "workspaceId": "ws1",
    "title": "API Created Page",
    "icon": "🚀",
    "content": "This page was created via API",
    "parentId": null,
    "tags": ["api", "test"],
    "isFavorite": false,
    "createdAt": "2024-01-20T12:00:00.000Z",
    "updatedAt": "2024-01-20T12:00:00.000Z"
  }
}
```

### 5. Create Nested Page (Sub-page)

```bash
curl -X POST http://localhost:4000/workspaces/ws1/pages \
  -b cookies.txt \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "title=Sub Page" \
  -d "icon=📑" \
  -d "content=This is a child page" \
  -d "parentId=page1" \
  -L
```

**Expected Response:** Redirect to new sub-page

### 6. Update Page (API)

```bash
curl -X PUT http://localhost:4000/api/pages/page1 \
  -b cookies.txt \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title",
    "content": "Updated content",
    "tags": ["updated", "modified"],
    "isFavorite": true
  }'
```

**Expected Response:**

```json
{
  "success": true,
  "page": {
    "id": "page1",
    "title": "Updated Title",
    "content": "Updated content",
    "tags": ["updated", "modified"],
    "isFavorite": true,
    "updatedAt": "2024-01-20T12:30:00.000Z"
  }
}
```

### 7. Toggle Favorite (Web Form)

```bash
curl -X POST http://localhost:4000/workspaces/ws1/pages/page1/favorite \
  -b cookies.txt \
  -L
```

**Expected Response:** Redirect to page with favorite toggled

### 8. Delete Page (API)

```bash
curl -X DELETE http://localhost:4000/api/pages/page1 \
  -b cookies.txt
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Page deleted successfully"
}
```

### 9. Search Pages in Workspace

```bash
curl -X GET "http://localhost:4000/workspaces/ws1/pages/search?q=setup" \
  -b cookies.txt \
  -H "Accept: text/html"
```

**Expected Response:** HTML page with search results

---

## Templates

### 1. Get All Templates (API)

```bash
curl -X GET http://localhost:4000/api/templates \
  -b cookies.txt \
  -H "Accept: application/json"
```

**Expected Response:**

```json
{
  "success": true,
  "templates": [
    {
      "id": "tmpl1",
      "name": "Meeting Notes",
      "icon": "📝",
      "description": "Template for taking meeting notes",
      "category": "meeting",
      "blocks": [
        {
          "type": "heading",
          "content": "Meeting Notes"
        },
        {
          "type": "text",
          "content": "Date: \nAttendees: \nAgenda: "
        }
      ]
    }
  ]
}
```

### 2. Get Template by ID (Web)

```bash
curl -X GET http://localhost:4000/templates/tmpl1 \
  -b cookies.txt \
  -H "Accept: text/html"
```

**Expected Response:** HTML template detail page

---

## Search & Stats

### 1. Global Search (API)

```bash
curl -X GET "http://localhost:4000/api/search?q=project" \
  -b cookies.txt \
  -H "Accept: application/json"
```

**Expected Response:**

```json
{
  "success": true,
  "query": "project",
  "results": {
    "pages": [
      {
        "id": "page2",
        "title": "Project Plan",
        "workspaceId": "ws2",
        "workspaceName": "Work",
        "content": "Project details...",
        "tags": ["project", "planning"]
      }
    ],
    "count": 1
  }
}
```

### 2. Get Statistics (API)

```bash
curl -X GET http://localhost:4000/api/stats \
  -b cookies.txt \
  -H "Accept: application/json"
```

**Expected Response:**

```json
{
  "success": true,
  "stats": {
    "totalWorkspaces": 3,
    "totalPages": 12,
    "favoritePages": 4,
    "recentActivity": [
      {
        "action": "created",
        "targetType": "page",
        "targetId": "page1",
        "targetName": "Getting Started",
        "timestamp": "2024-01-20T10:00:00.000Z"
      }
    ]
  }
}
```

---

## Postman Collection

### Import Instructions

1. Open Postman
2. Click "Import" button
3. Copy the JSON below and paste it into Postman
4. Update the `baseUrl` variable if needed
5. Use the "Login" request first to authenticate
6. Cookies will be automatically managed

### Collection JSON

```json
{
  "info": {
    "name": "NoteMaster API",
    "description": "Complete API testing collection for NoteMaster",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:4000",
      "type": "string"
    }
  ],
  "item": [
    {
      "name": "Authentication",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/auth/register",
            "body": {
              "mode": "urlencoded",
              "urlencoded": [
                {"key": "fullName", "value": "Test User"},
                {"key": "username", "value": "testuser"},
                {"key": "email", "value": "test@example.com"},
                {"key": "password", "value": "password123"},
                {"key": "confirmPassword", "value": "password123"}
              ]
            }
          }
        },
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/auth/login",
            "body": {
              "mode": "urlencoded",
              "urlencoded": [
                {"key": "username", "value": "admin"},
                {"key": "password", "value": "password"}
              ]
            }
          }
        },
        {
          "name": "Logout",
          "request": {
            "method": "GET",
            "url": "{{baseUrl}}/auth/logout"
          }
        }
      ]
    },
    {
      "name": "Workspaces",
      "item": [
        {
          "name": "Get All Workspaces",
          "request": {
            "method": "GET",
            "url": "{{baseUrl}}/api/workspaces",
            "header": [
              {"key": "Accept", "value": "application/json"}
            ]
          }
        },
        {
          "name": "Get Workspace by ID",
          "request": {
            "method": "GET",
            "url": "{{baseUrl}}/api/workspaces/ws1",
            "header": [
              {"key": "Accept", "value": "application/json"}
            ]
          }
        },
        {
          "name": "Create Workspace",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/api/workspaces",
            "header": [
              {"key": "Content-Type", "value": "application/json"}
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"New Workspace\",\n  \"icon\": \"💼\",\n  \"isPublic\": false\n}"
            }
          }
        }
      ]
    },
    {
      "name": "Pages",
      "item": [
        {
          "name": "Get Workspace Pages",
          "request": {
            "method": "GET",
            "url": "{{baseUrl}}/api/workspaces/ws1/pages",
            "header": [
              {"key": "Accept", "value": "application/json"}
            ]
          }
        },
        {
          "name": "Get Page by ID",
          "request": {
            "method": "GET",
            "url": "{{baseUrl}}/api/pages/page1",
            "header": [
              {"key": "Accept", "value": "application/json"}
            ]
          }
        },
        {
          "name": "Create Page",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/api/workspaces/ws1/pages",
            "header": [
              {"key": "Content-Type", "value": "application/json"}
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"title\": \"New Page\",\n  \"icon\": \"📄\",\n  \"content\": \"Page content here\",\n  \"tags\": [\"test\"]\n}"
            }
          }
        },
        {
          "name": "Update Page",
          "request": {
            "method": "PUT",
            "url": "{{baseUrl}}/api/pages/page1",
            "header": [
              {"key": "Content-Type", "value": "application/json"}
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"title\": \"Updated Title\",\n  \"content\": \"Updated content\",\n  \"isFavorite\": true\n}"
            }
          }
        },
        {
          "name": "Delete Page",
          "request": {
            "method": "DELETE",
            "url": "{{baseUrl}}/api/pages/page1"
          }
        }
      ]
    },
    {
      "name": "Templates",
      "item": [
        {
          "name": "Get All Templates",
          "request": {
            "method": "GET",
            "url": "{{baseUrl}}/api/templates",
            "header": [
              {"key": "Accept", "value": "application/json"}
            ]
          }
        }
      ]
    },
    {
      "name": "Search & Stats",
      "item": [
        {
          "name": "Search",
          "request": {
            "method": "GET",
            "url": "{{baseUrl}}/api/search?q=project",
            "header": [
              {"key": "Accept", "value": "application/json"}
            ]
          }
        },
        {
          "name": "Get Stats",
          "request": {
            "method": "GET",
            "url": "{{baseUrl}}/api/stats",
            "header": [
              {"key": "Accept", "value": "application/json"}
            ]
          }
        }
      ]
    }
  ]
}
```

---

## Testing Workflow

### Complete Test Sequence

```bash
# 1. Login
curl -X POST http://localhost:4000/auth/login \
  -d "username=admin&password=test" \
  -c cookies.txt -L

# 2. View workspaces
curl -X GET http://localhost:4000/api/workspaces \
  -b cookies.txt

# 3. Create workspace
curl -X POST http://localhost:4000/api/workspaces \
  -b cookies.txt \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","icon":"🧪","isPublic":false}'

# 4. Create page
curl -X POST http://localhost:4000/api/workspaces/ws1/pages \
  -b cookies.txt \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Page","icon":"📝","content":"Hello"}'

# 5. Search
curl -X GET "http://localhost:4000/api/search?q=test" \
  -b cookies.txt

# 6. Get stats
curl -X GET http://localhost:4000/api/stats \
  -b cookies.txt

# 7. Logout
curl -X GET http://localhost:4000/auth/logout \
  -b cookies.txt -L
```

---

## Error Handling

All API endpoints return appropriate HTTP status codes:

- `200 OK` - Successful request
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Not authorized
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

### Error Response Format

```json
{
  "success": false,
  "error": "Error message here"
}
```

---

## Tips

1. **Save cookies**: Use `-c cookies.txt` to save session cookies and `-b cookies.txt` to send them
2. **Follow redirects**: Use `-L` flag to follow HTTP redirects
3. **Pretty JSON**: Pipe curl output to `jq` for formatted JSON: `curl ... | jq`
4. **Verbose mode**: Add `-v` flag to see request/response headers
5. **Test in order**: Login first, then test other endpoints
6. **Check responses**: Verify status codes and response bodies match expectations

---

## Troubleshooting

**Issue**: "Unauthorized" errors

- **Solution**: Make sure you're logged in and using cookies

**Issue**: "Validation failed" errors

- **Solution**: Check required fields match validation rules

**Issue**: "Not found" errors

- **Solution**: Verify IDs exist in the database

**Issue**: Cannot access workspace/page

- **Solution**: Ensure user has permission (is member or workspace is public)

---

For more information, see the main README.md file.
