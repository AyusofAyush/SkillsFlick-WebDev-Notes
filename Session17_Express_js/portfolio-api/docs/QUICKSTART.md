# 🚀 Quick Start Guide - Portfolio API

Welcome! This guide will get you up and running with the Portfolio API in **5 minutes**.

## ⚡ Quick Setup (3 Steps)

### Step 1: Install Dependencies

```bash
cd portfolio-api
npm install
```

### Step 2: Start the Server

```bash
npm run dev
```

Or for production:

```bash
npm start
```

### Step 3: Test the API

Open your browser and visit:

```
http://localhost:4000
```

You should see a welcome message! 🎉

---

## 🧪 Quick API Tests

### Test with curl (Terminal)

```bash
# 1. Get API info
curl http://localhost:4000/

# 2. Get all projects
curl http://localhost:4000/api/projects

# 3. Get a single project
curl http://localhost:4000/api/projects/1

# 4. Get all skills
curl http://localhost:4000/api/skills

# 5. Get about information
curl http://localhost:4000/api/about

# 6. Submit contact form
curl -X POST http://localhost:4000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ayush Raj",
    "email": "ayush.raj@example.com",
    "message": "Hello! This is a test message."
  }'
```

### Test with Automated Script

Make the test script executable:

```bash
chmod +x test-api.sh
```

Run all tests:

```bash
./test-api.sh
```

### Test with Postman

1. Open Postman
2. Click "Import"
3. Select `Portfolio-API.postman_collection.json`
4. Click on any request and hit "Send"

---

## 📚 Common Use Cases

### 1. Filter Projects by Technology

```bash
curl "http://localhost:4000/api/projects?tech=react"
```

### 2. Get Featured Projects Only

```bash
curl "http://localhost:4000/api/projects?featured=true"
```

### 3. Get Projects with Pagination

```bash
curl "http://localhost:4000/api/projects?page=1&limit=3"
```

### 4. Sort Projects by Views (Descending)

```bash
curl "http://localhost:4000/api/projects?sort=views&order=desc"
```

### 5. Search Projects

```bash
curl "http://localhost:4000/api/projects/search?q=weather"
```

### 6. Get Skills by Category

```bash
curl "http://localhost:4000/api/skills/frontend"
```

### 7. Create a New Project

```bash
curl -X POST http://localhost:4000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Awesome Project",
    "description": "A detailed description of my project",
    "tech": ["React", "Node.js", "MongoDB"],
    "category": "Full Stack",
    "featured": true
  }'
```

### 8. Update a Project

```bash
curl -X PUT http://localhost:4000/api/projects/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Project Name",
    "description": "Updated description",
    "tech": ["React", "TypeScript", "Next.js"],
    "category": "Frontend",
    "featured": true
  }'
```

### 9. Delete a Project

```bash
curl -X DELETE http://localhost:4000/api/projects/6
```

---

## 📊 All Available Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API information |
| GET | `/health` | Health check |
| **Projects** |
| GET | `/api/projects` | Get all projects |
| GET | `/api/projects/:id` | Get single project |
| GET | `/api/projects/stats` | Get statistics |
| GET | `/api/projects/search?q=term` | Search projects |
| GET | `/api/projects/:id/related` | Get related projects |
| POST | `/api/projects` | Create project |
| PUT | `/api/projects/:id` | Update project |
| DELETE | `/api/projects/:id` | Delete project |
| **Skills** |
| GET | `/api/skills` | Get all skills |
| GET | `/api/skills/flat` | Get flat skills array |
| GET | `/api/skills/stats` | Get skills statistics |
| GET | `/api/skills/:category` | Get skills by category |
| **About** |
| GET | `/api/about` | Get all about info |
| GET | `/api/about/basic` | Get basic info |
| GET | `/api/about/contact` | Get contact info |
| GET | `/api/about/experience` | Get experience |
| GET | `/api/about/education` | Get education |
| GET | `/api/about/achievements` | Get achievements |
| **Contact** |
| POST | `/api/contact` | Submit contact form |
| GET | `/api/contact/messages` | Get all messages |
| GET | `/api/contact/messages/:id` | Get single message |

---

## 🎯 Query Parameters

### For `/api/projects`

| Parameter | Type | Example | Description |
|-----------|------|---------|-------------|
| `tech` | string | `?tech=react` | Filter by technology |
| `category` | string | `?category=frontend` | Filter by category |
| `featured` | boolean | `?featured=true` | Filter featured only |
| `sort` | string | `?sort=views` | Sort field |
| `order` | string | `?order=desc` | Sort order (asc/desc) |
| `page` | number | `?page=2` | Page number |
| `limit` | number | `?limit=5` | Items per page |

### Combine Multiple Parameters

```bash
curl "http://localhost:4000/api/projects?tech=react&featured=true&sort=views&order=desc&page=1&limit=3"
```

---

## ✅ Expected Responses

### Success Response (200/201)

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response (400/404/500)

```json
{
  "success": false,
  "status": "fail",
  "message": "Error description"
}
```

---

## 🛠️ Troubleshooting

### Port Already in Use

If you see `EADDRINUSE` error:

```bash
# Kill the process using port 4000
lsof -ti:4000 | xargs kill -9

# Or change the port in .env file
PORT=5000
```

### Module Not Found

```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

### Can't Connect to Server

1. Make sure the server is running
2. Check if it's listening on port 4000
3. Try `http://localhost:4000` in your browser

---

## 📖 Next Steps

- ✅ Read the full [README.md](README.md) for detailed documentation
- ✅ Try all endpoints using the test script
- ✅ Import Postman collection for easier testing
- ✅ Modify the mock data in `data/mockData.js`
- ✅ Explore the code structure and middleware
- ✅ Add your own endpoints and features

---

## 🎓 Learning Path

1. **Beginner**: Test all GET endpoints
2. **Intermediate**: Try POST, PUT, DELETE operations
3. **Advanced**: Explore filtering, sorting, pagination
4. **Expert**: Modify middleware and add new features

---

## 💡 Pro Tips

1. Use `npm run dev` for development (auto-restart)
2. Check terminal logs to see request details
3. Use `| python3 -m json.tool` for pretty JSON in terminal
4. Test error cases (invalid IDs, missing fields)
5. Read the code comments to understand each part

---

## 🚀 You're Ready

The API is now running at `http://localhost:4000`. Start making requests and have fun! 🎉

For full documentation, see [README.md](README.md)
