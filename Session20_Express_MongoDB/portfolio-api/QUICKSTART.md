# 🚀 Portfolio API - Quick Start Guide

Get up and running in 5 minutes!

## ⚡ Fast Track Setup

### 1. Prerequisites Check

```bash
# Check Node.js version (must be >= 18)
node --version

# Check if MongoDB is running (local setup)
mongosh
# If this opens MongoDB shell, you're good! Type 'exit' to quit.
```

### 2. Install & Configure

```bash
# Navigate to project directory
cd /Users/ayushraj/Ayush/Temp-SkillsFlick/Session20/portfolio-api

# Install dependencies (already done if you see node_modules folder)
npm install

# Verify .env file exists and has PORT=4000
cat .env | grep PORT
```

### 3. Start the Server

```bash
# Development mode (auto-restart on changes)
npm run dev

# Or production mode
npm start
```

**Expected Output:**

```
═══════════════════════════════════════════════════════════════════════════════
🚀 PORTFOLIO API SERVER STARTED SUCCESSFULLY!
═══════════════════════════════════════════════════════════════════════════════
...
✨ Ready to accept requests!
```

### 4. Test It Works

Open a new terminal and run:

```bash
# Health check
curl http://localhost:4000/health

# Create a project
curl -X POST http://localhost:4000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Project",
    "description": "Testing the Portfolio API with a sample project",
    "technologies": ["Node.js", "MongoDB", "Express.js"]
  }'

# Get all projects
curl http://localhost:4000/api/projects
```

### 5. Run Full Test Suite

```bash
# Make script executable (if not already)
chmod +x test-api.sh

# Run all tests
./test-api.sh
```

## 📋 Common Commands

```bash
# Start development server
npm run dev

# Start production server
npm start

# Run tests
./test-api.sh

# View server logs
# (Just watch the terminal where server is running)

# Stop server
# Press Ctrl+C in the terminal where server is running
```

## 🎯 Quick API Reference

### Base URL

```
http://localhost:4000
```

### Most Used Endpoints

| Action | Method | Endpoint | Body |
|--------|--------|----------|------|
| Create | POST | `/api/projects` | `{ title, description, technologies }` |
| Get All | GET | `/api/projects` | - |
| Get One | GET | `/api/projects/:id` | - |
| Update | PUT | `/api/projects/:id` | `{ any_field: value }` |
| Delete | DELETE | `/api/projects/:id` | - |
| Search | GET | `/api/projects/search?q=keyword` | - |
| Stats | GET | `/api/projects/stats` | - |

### Quick Examples

**Create Project:**

```bash
curl -X POST http://localhost:4000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "title": "E-Commerce Platform",
    "description": "Full-stack MERN e-commerce application",
    "technologies": ["MongoDB", "Express", "React", "Node.js"],
    "status": "completed",
    "featured": true
  }'
```

**Get All Projects:**

```bash
curl http://localhost:4000/api/projects
```

**Filter Featured Projects:**

```bash
curl http://localhost:4000/api/projects?featured=true
```

**Search Projects:**

```bash
curl http://localhost:4000/api/projects/search?q=commerce
```

**Get Statistics:**

```bash
curl http://localhost:4000/api/projects/stats
```

## 🔧 Troubleshooting

### MongoDB Not Running?

**Local MongoDB:**

```bash
# macOS (Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

**Using MongoDB Atlas (Cloud)?**
Update `.env`:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolioDB
```

### Port 4000 Already in Use?

```bash
# Find what's using port 4000
lsof -i :4000

# Kill the process (replace <PID> with actual process ID)
kill -9 <PID>

# Or change port in .env
PORT=5000
```

### Dependencies Not Installed?

```bash
# Remove old installations
rm -rf node_modules package-lock.json

# Fresh install
npm install
```

## 📚 Next Steps

1. ✅ **Import Postman Collection** - `Portfolio-API.postman_collection.json`
2. ✅ **Read Full Documentation** - See `README.md`
3. ✅ **Explore Code** - Check out `models/Project.js` for schema
4. ✅ **Try All Endpoints** - Run `./test-api.sh`
5. ✅ **Modify & Experiment** - Add new fields, methods, or endpoints!

## 🎓 Learning Path

1. **Understand Schema** - Open `models/Project.js` (450+ lines)
   - See validation rules
   - Study indexes
   - Learn virtual properties
   - Explore hooks and methods

2. **Study Routes** - Open `routes/projects.js` (350+ lines)
   - CRUD operations
   - Filtering and sorting
   - Pagination
   - Search functionality

3. **Review Middleware** - Check `middleware/` folder
   - Error handling
   - Validation
   - Logging
   - Async wrappers

4. **Experiment** - Make changes and test!
   - Add new fields to schema
   - Create new endpoints
   - Write custom validators
   - Add more statistics

---

**That's it! You're ready to go! 🎉**

For detailed documentation, see [README.md](./README.md)
