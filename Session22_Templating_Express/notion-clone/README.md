# NoteMaster 📝

A modern, Notion-inspired workspace and note-taking application built with Express.js and EJS templates. This project demonstrates server-side rendering, MVC architecture, and comprehensive Express.js patterns.

## ✨ Features

### Core Functionality

- 🏢 **Multi-Workspace Support** - Organize notes across different workspaces
- 📄 **Hierarchical Pages** - Create nested pages with unlimited depth
- ⭐ **Favorites System** - Quick access to important pages
- 🔍 **Full-Text Search** - Find content across all your pages
- 📋 **Templates** - Quick-start pages with pre-built content blocks
- 🏷️ **Tagging System** - Organize and categorize pages
- 🔒 **Access Control** - Private and public workspace options
- 🕒 **Activity Tracking** - Monitor recent changes

### Technical Features

- 🎨 **Server-Side Rendering** - EJS templates with layouts and partials
- 🔐 **Session-Based Authentication** - Secure user sessions with bcrypt
- ✅ **Input Validation** - Comprehensive validation with express-validator
- 📡 **RESTful API** - JSON API endpoints for all operations
- 🎯 **MVC Architecture** - Clean separation of concerns
- 🌲 **Recursive Page Trees** - Dynamic nested navigation
- 💾 **Mock Database** - In-memory data with full CRUD operations

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone or navigate to the project**

```bash
cd Session22/notemaster
```

2. **Install dependencies**

```bash
npm install
```

3. **Start the server**

```bash
# Production mode
npm start

# Development mode with auto-reload
npm run dev
```

4. **Access the application**

```
http://localhost:4000
```

## 🔑 Demo Accounts

The application runs in demo mode with three pre-configured accounts:

| Username | Password | Role | Description |
|----------|----------|------|-------------|
| `admin` | any | Admin | Full access to all features |
| `john_doe` | any | User | Standard user account |
| `jane_smith` | any | User | Standard user account |

**Note:** In demo mode, any password will work for authentication.

## 📁 Project Structure

```
notemaster/
├── app.js                 # Main application entry point
├── package.json           # Dependencies and scripts
├── config/
│   └── config.js          # Configuration settings
├── controllers/
│   ├── authController.js      # Authentication logic
│   ├── indexController.js     # Home and templates
│   ├── pageController.js      # Page CRUD operations
│   └── workspaceController.js # Workspace management
├── data/
│   └── database.js        # Mock database with seed data
├── middleware/
│   ├── auth.js            # Authentication middleware
│   ├── errorHandler.js    # Error handling
│   ├── logger.js          # Request logging
│   └── validation.js      # Input validation rules
├── routes/
│   ├── api.js             # JSON API endpoints
│   ├── auth.js            # Authentication routes
│   ├── index.js           # Home routes
│   ├── pages.js           # Page routes
│   └── workspaces.js      # Workspace routes
├── views/
│   ├── layouts/
│   │   └── main.ejs       # Base layout template
│   ├── partials/
│   │   ├── header.ejs     # Site header
│   │   ├── footer.ejs     # Site footer
│   │   ├── sidebar.ejs    # Workspace sidebar
│   │   └── page-tree-item.ejs # Recursive page tree
│   ├── auth/
│   │   ├── login.ejs      # Login page
│   │   └── register.ejs   # Registration page
│   ├── workspaces/
│   │   ├── index.ejs      # Workspace list
│   │   ├── show.ejs       # Workspace detail
│   │   ├── new.ejs        # Create workspace
│   │   └── edit.ejs       # Edit workspace
│   ├── pages/
│   │   ├── show.ejs       # Page detail
│   │   ├── new.ejs        # Create page
│   │   ├── edit.ejs       # Edit page
│   │   └── search.ejs     # Search results
│   └── templates/
│       ├── index.ejs      # Template library
│       └── show.ejs       # Template detail
└── public/
    ├── css/
    │   └── style.css      # Application styles
    └── js/
        └── main.js        # Client-side JavaScript
```

## 🛠️ Technology Stack

### Backend

- **Express.js 4.18.2** - Web application framework
- **EJS 3.1.9** - Embedded JavaScript templating
- **express-session 1.17.3** - Session middleware
- **bcrypt 5.1.1** - Password hashing
- **express-validator 7.0.1** - Input validation
- **method-override 3.0.0** - HTTP method support
- **cookie-parser 1.4.6** - Cookie parsing

### Frontend

- **Vanilla JavaScript** - Client-side interactivity
- **CSS Grid & Flexbox** - Modern responsive layout
- **Custom CSS** - Notion-inspired design

### Development

- **nodemon 3.0.2** - Auto-reload during development

## 📖 Usage Guide

### Creating a Workspace

1. Login with a demo account
2. Click "New Workspace" button
3. Enter workspace name and icon (emoji)
4. Choose public/private setting
5. Click "Create Workspace"

### Creating Pages

1. Navigate to a workspace
2. Click "New Page" in the sidebar
3. Enter page title, icon, and content
4. Optionally select a template
5. Add tags for organization
6. Click "Create Page"

### Nested Pages

- Click "Add Sub-page" on any page to create a child page
- Sub-pages appear indented in the sidebar
- Use breadcrumbs to navigate page hierarchy

### Using Templates

1. Click "Templates" in navigation
2. Browse available templates by category
3. Click on a template to preview
4. Click "Use This Template" to create a page
5. Customize the pre-filled content

### Search

- Use the search bar in the sidebar
- Search across all page titles and content
- Results show matching pages with context
- Filter by workspace automatically

## 🔌 API Endpoints

NoteMaster provides a comprehensive RESTful API. See [TESTING.md](./TESTING.md) for detailed API documentation and curl examples.

### Quick Reference

**Authentication**

- `POST /auth/login` - Login
- `POST /auth/register` - Register
- `GET /auth/logout` - Logout

**Workspaces**

- `GET /api/workspaces` - List all workspaces
- `POST /api/workspaces` - Create workspace
- `GET /api/workspaces/:id` - Get workspace

**Pages**

- `GET /api/workspaces/:id/pages` - List workspace pages
- `POST /api/workspaces/:id/pages` - Create page
- `GET /api/pages/:id` - Get page
- `PUT /api/pages/:id` - Update page
- `DELETE /api/pages/:id` - Delete page

**Search & Stats**

- `GET /api/search?q=query` - Search pages
- `GET /api/stats` - Get statistics
- `GET /api/templates` - List templates

## 🧪 Testing

See [TESTING.md](./TESTING.md) for comprehensive testing documentation including:

- curl command examples
- Postman collection
- API response formats
- Testing workflows

Quick test:

```bash
# Login and save cookies
curl -X POST http://localhost:4000/auth/login \
  -d "username=admin&password=test" \
  -c cookies.txt

# Get workspaces
curl -X GET http://localhost:4000/api/workspaces \
  -b cookies.txt
```

## 🎓 Learning Objectives

This project demonstrates key Express.js concepts from Session 22:

### 1. **Templating Engines (EJS)**

- Layout inheritance with partials
- Dynamic content rendering
- Helper functions in templates
- Recursive partials (page tree)

### 2. **Dynamic Routing**

- Nested routes with `mergeParams`
- Route parameters (`:id`, `:workspaceId`)
- Query parameters for search
- Method override for REST operations

### 3. **Middleware**

- Authentication middleware
- Authorization (canAccessWorkspace, canModifyWorkspace)
- Input validation
- Error handling
- Request logging

### 4. **MVC Architecture**

- Controllers for business logic
- Routes for URL mapping
- Views for presentation
- Models (database.js)

### 5. **Session Management**

- Session-based authentication
- Cookie configuration
- User persistence across requests

### 6. **Form Handling**

- POST form submissions
- File validation
- Error display
- CSRF protection ready

## 🔒 Security Features

- **Password Hashing** - bcrypt for secure password storage
- **Session Security** - HTTP-only cookies, secret key
- **Input Validation** - All inputs validated and sanitized
- **Authorization** - Workspace access control
- **XSS Protection** - EJS auto-escaping
- **SQL Injection** - N/A (in-memory database)

## 🚧 Future Enhancements

- [ ] Real database integration (MongoDB/PostgreSQL)
- [ ] Rich text editor (TinyMCE/Quill)
- [ ] Real-time collaboration (Socket.io)
- [ ] File uploads and attachments
- [ ] Comments on pages
- [ ] Page versioning and history
- [ ] Export to PDF/Markdown
- [ ] Mobile responsive improvements
- [ ] Dark mode support
- [ ] Email notifications
- [ ] API rate limiting
- [ ] OAuth social login

## 🐛 Known Limitations

- **In-Memory Database** - Data is lost on server restart
- **No Persistence** - Use a real database for production
- **Single Server** - Not horizontally scalable
- **No File Uploads** - Template only, would need multer
- **Basic Search** - Simple string matching, not full-text search
- **Demo Mode** - All passwords accepted (disable in production)

## 📝 Environment Variables

Create a `.env` file for production (optional):

```env
PORT=4000
NODE_ENV=production
SESSION_SECRET=your-secret-key-here
DEMO_MODE=false
```

## 🤝 Contributing

This is an educational project. Feel free to:

- Fork the repository
- Create a feature branch
- Submit pull requests
- Report issues

## 📄 License

MIT License - Feel free to use this project for learning purposes.

## 👨‍💻 Author

Created as part of Session 22 - Express.js Templating Engines, Dynamic Routing, and SSR

## 🙏 Acknowledgments

- Inspired by [Notion](https://notion.so)
- Built with [Express.js](https://expressjs.com)
- Templating by [EJS](https://ejs.co)

---

**Happy Note-Taking! 📝✨**
