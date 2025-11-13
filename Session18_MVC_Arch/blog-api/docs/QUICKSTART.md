# 🚀 Blog API - Quick Start Guide

Get your MVC Blog API up and running in 5 minutes!

---

## ⚡ Quick Setup

### 1. Install Dependencies

```bash
cd blog-api
npm install
```

### 2. Start the Server

```bash
npm run dev
```

You should see:

```
🚀 BLOG API SERVER STARTED SUCCESSFULLY!
   • Port: 4000
   • URL: http://localhost:4000
   • API Base: http://localhost:4000/api
```

### 3. Test It's Working

```bash
curl http://localhost:4000/health
```

Expected response:

```json
{
  "status": "success",
  "message": "🚀 Blog API is running!",
  "timestamp": "2024-11-09T..."
}
```

---

## 📝 Quick API Tests

### Create Your First Post

```bash
curl -X POST http://localhost:4000/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Blog Post",
    "content": "This is my first blog post created using the MVC Blog API. It demonstrates the power of proper architectural patterns in building scalable applications.",
    "author": "Your Name",
    "category": "Technology",
    "tags": ["first-post", "tutorial"],
    "published": true
  }'
```

### Get All Posts

```bash
curl http://localhost:4000/api/posts
```

### Get Statistics

```bash
curl http://localhost:4000/api/posts/stats
```

### Search Posts

```bash
curl http://localhost:4000/api/posts/search?q=first
```

---

## 🎯 All Available Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| **Home & Info** |
| GET | `/` | API information |
| GET | `/health` | Health check |
| **Posts CRUD** |
| POST | `/api/posts` | Create new post |
| GET | `/api/posts` | Get all posts |
| GET | `/api/posts/:id` | Get post by ID |
| PUT | `/api/posts/:id` | Update post |
| DELETE | `/api/posts/:id` | Delete post |
| **Posts Features** |
| GET | `/api/posts/stats` | Get statistics |
| GET | `/api/posts/search?q=keyword` | Search posts |
| GET | `/api/posts/categories` | Get categories |
| POST | `/api/posts/:id/like` | Like a post |
| **Filtering** |
| GET | `/api/posts?category=Tech` | Filter by category |
| GET | `/api/posts?author=John` | Filter by author |
| GET | `/api/posts?sortBy=popular` | Sort posts |
| GET | `/api/posts?page=1&limit=10` | Pagination |

---

## 🧪 Automated Testing

### Run Test Script

```bash
chmod +x test-api.sh
./test-api.sh
```

This will run 20 comprehensive tests covering all endpoints!

### Import Postman Collection

1. Open Postman
2. Click **Import**
3. Select `Blog-API.postman_collection.json`
4. Start testing!

---

## 📊 Understanding MVC in This Project

### 🏗️ Architecture Flow

```
Client Request
    ↓
Route (postRoutes.js)
    ↓
Middleware (validation, logging)
    ↓
Controller (postController.js)
    ↓
Model (Post.js)
    ↓
In-Memory Storage
    ↓
Back through Controller
    ↓
JSON Response to Client
```

### 📁 File Structure

```
blog-api/
├── src/
│   ├── models/           ← DATA & BUSINESS LOGIC
│   │   └── Post.js
│   ├── controllers/      ← REQUEST HANDLERS
│   │   └── postController.js
│   ├── routes/           ← URL MAPPING
│   │   └── postRoutes.js
│   ├── middlewares/      ← CROSS-CUTTING CONCERNS
│   │   ├── logger.js
│   │   ├── validator.js
│   │   └── errorHandler.js
│   ├── config/           ← CONFIGURATION
│   │   └── config.js
│   └── app.js            ← EXPRESS SETUP
├── server.js             ← ENTRY POINT
└── .env                  ← ENVIRONMENT VARS
```

---

## 🎓 Learning Features

This project demonstrates:

✅ **MVC Pattern** - Clear separation of concerns  
✅ **RESTful API Design** - Proper HTTP methods and status codes  
✅ **CRUD Operations** - Create, Read, Update, Delete  
✅ **Advanced Features** - Search, filtering, pagination, sorting  
✅ **Input Validation** - Business rules enforcement  
✅ **Error Handling** - Centralized error management  
✅ **Security** - Helmet, CORS, Rate Limiting  
✅ **Logging** - Request/response tracking  
✅ **ES Modules** - Modern JavaScript syntax  

---

## 💡 Common Use Cases

### 1. Create Multiple Posts

```bash
# Post 1
curl -X POST http://localhost:4000/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Understanding MVC",
    "content": "MVC separates concerns into Model (data), View (presentation), and Controller (logic). This makes code maintainable and testable.",
    "author": "Alice",
    "category": "Technology"
  }'

# Post 2
curl -X POST http://localhost:4000/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Healthy Living Tips",
    "content": "Regular exercise, balanced diet, and adequate sleep are fundamental to maintaining good health and wellbeing in our busy lives.",
    "author": "Bob",
    "category": "Health"
  }'
```

### 2. Filter and Search

```bash
# Get only Technology posts
curl http://localhost:4000/api/posts?category=Technology

# Search for "health"
curl http://localhost:4000/api/posts/search?q=health

# Get posts by specific author
curl http://localhost:4000/api/posts?author=Alice
```

### 3. Pagination

```bash
# Get first 5 posts
curl http://localhost:4000/api/posts?page=1&limit=5

# Get next 5 posts
curl http://localhost:4000/api/posts?page=2&limit=5
```

### 4. Like and View Posts

```bash
# View a post (auto-increments view count)
curl http://localhost:4000/api/posts/1

# Like a post
curl -X POST http://localhost:4000/api/posts/1/like

# Check updated stats
curl http://localhost:4000/api/posts/stats
```

---

## 🐛 Troubleshooting

### Port Already in Use

If port 4000 is busy:

1. Edit `.env` file
2. Change `PORT=4000` to another port (e.g., `PORT=5000`)
3. Restart server

### Module Not Found

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Permission Denied (test-api.sh)

```bash
# Make script executable
chmod +x test-api.sh
```

---

## 📚 Next Steps

1. ✅ Review the code in `src/models/Post.js` - understand data layer
2. ✅ Check `src/controllers/postController.js` - see request handling
3. ✅ Explore `src/middlewares/` - learn about cross-cutting concerns
4. ✅ Read `PROJECT_GUIDE.md` for detailed explanations
5. ✅ Try modifying the Post model to add new fields
6. ✅ Create a Comment model and implement comment endpoints

---

## 🎯 Key Concepts Demonstrated

### Model Layer (Post.js)

- Data structure definition
- Business logic (validation, slug generation)
- Database operations (CRUD)
- Static methods for querying

### Controller Layer (postController.js)

- Request/response handling
- Input extraction and validation
- Model orchestration
- Error handling

### Routes Layer (postRoutes.js)

- URL pattern definition
- HTTP method mapping
- Middleware attachment

### Middleware

- **Logger**: Request/response tracking
- **Validator**: Input validation
- **Error Handler**: Centralized error management

---

## 🚀 Production Considerations

This is a learning project using in-memory storage. For production:

1. **Database**: Replace in-memory storage with MongoDB/PostgreSQL
2. **Authentication**: Add JWT-based auth
3. **Testing**: Add unit and integration tests
4. **Documentation**: Use Swagger/OpenAPI
5. **Deployment**: Deploy to Heroku/Vercel/AWS
6. **Monitoring**: Add logging service (Winston, Morgan)
7. **Caching**: Implement Redis for performance

---

## 📞 Support

- Check `PROJECT_GUIDE.md` for detailed documentation
- Review `README.md` in Session18 for MVC concepts
- Run `./test-api.sh` to verify everything works

---

**Happy Coding! 🎉**

Built with ❤️ using Express.js MVC Architecture
