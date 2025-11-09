# 🚀 Session 16: Backend Development & Node.js - Full Stack Demo

An **interactive, responsive React application** demonstrating backend development concepts from Session 16, including client-server architecture, HTTP methods, Node.js built-in modules, and real-time API communication.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Learning Outcomes](#learning-outcomes)
- [Screenshots](#screenshots)

## ✨ Features

### 🌐 Client-Server Communication Demo

- **Visual Request-Response Cycle**: Step-by-step animation showing how browsers communicate with servers
- **Real-time API Calls**: Watch HTTP requests and responses in action
- **Server Status Monitoring**: Live backend server status indicator

### 🔌 HTTP Methods (CRUD Operations)

- **GET**: Fetch and display all users from the server
- **POST**: Create new users with form validation
- **PUT**: Update existing user information
- **DELETE**: Remove users from the system
- **Real-time Updates**: Automatic UI refresh after operations

### 💻 Server Information Display

- View system information using Node.js `os` module
- Display platform, architecture, CPU cores, memory, uptime
- Interactive button to fetch fresh server data

### 📁 File System Operations

- Demonstrate file read/write operations
- Create and manage log files
- Display recent server logs
- Show directory contents

### 🎨 Modern UI/UX

- **Fully Responsive**: Mobile, tablet, and desktop optimized
- **Beautiful Animations**: Smooth transitions and interactions
- **Dark Code Snippets**: Syntax-highlighted code examples
- **Real-time Feedback**: Success/error messages for all operations

## 🛠️ Tech Stack

### Frontend

- **React 18** - Modern UI library with hooks
- **Parcel 2** - Zero-config build tool (runs on port 3000)
- **Pure CSS** - No frameworks, custom responsive design
- **Modern JavaScript** - ES6+ features

### Backend

- **Node.js** - JavaScript runtime
- **Native HTTP Module** - No frameworks (Express-free)
- **Built-in Modules**: `fs`, `os`, `path`, `http`
- **CORS Enabled** - Cross-origin resource sharing

## 📁 Project Structure

```
Session16/
├── backend/
│   ├── server.js          # Node.js HTTP server
│   ├── package.json       # Backend dependencies
│   ├── data/              # Generated log files
│   └── .gitignore
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.js              # App header with status
│   │   │   ├── Hero.js                # Hero section
│   │   │   ├── ConceptsSection.js     # Core concepts cards
│   │   │   ├── ClientServerDemo.js    # Request-response demo
│   │   │   ├── HTTPMethodsDemo.js     # CRUD operations
│   │   │   ├── ServerInfoDemo.js      # OS module demo
│   │   │   ├── FileOperationsDemo.js  # File system demo
│   │   │   └── Footer.js              # App footer
│   │   ├── styles/
│   │   │   └── main.css               # All styles
│   │   ├── index.html                 # HTML entry point
│   │   ├── index.js                   # React entry point
│   │   └── App.js                     # Main app component
│   ├── package.json       # Frontend dependencies
│   └── .gitignore
│
├── Readme.md              # Session 16 tutorial content
└── PROJECT_README.md      # This file
```

## ⚙️ Prerequisites

Before running this project, make sure you have:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Terminal/Command Prompt** access
- **Web Browser** (Chrome, Firefox, Safari, or Edge)

Check your versions:

```bash
node --version  # Should be v16+
npm --version   # Should be 7+
```

## 📥 Installation

### 1. Clone or Navigate to the Project

```bash
cd /path/to/Temp-SkillsFlick/Session16
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

This installs:

- `cors` - Enable cross-origin requests
- `nodemon` - Auto-restart server on changes (dev dependency)

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

This installs:

- `react` & `react-dom` - UI library
- `parcel` - Build tool
- `@parcel/transformer-sass` - SASS support

## 🚀 Running the Application

You need to run **both** the backend and frontend servers simultaneously.

### Option 1: Using Two Terminal Windows

**Terminal 1 - Backend Server:**

```bash
cd backend
npm start
# Server runs on http://localhost:3001
```

**Terminal 2 - Frontend Development Server:**

```bash
cd frontend
npm start
# App runs on http://localhost:3000
```

### Option 2: Using Background Process (macOS/Linux)

```bash
# Start backend in background
cd backend && npm start &

# Start frontend
cd ../frontend && npm start
```

### ✅ Verification

1. Backend server console should show:

   ```
   🚀 ================================
      Session 16 Backend Server
      ================================
      ✅ Server running at http://localhost:3001
   ```

2. Frontend should automatically open `http://localhost:3000` in your browser

3. Header should show: **Backend: ✅ Online**

## 🌐 API Endpoints

### Base URL: `http://localhost:3001`

| Method | Endpoint | Description |
|--------|----------|-------------|
| **GET** | `/` | API information and available endpoints |
| **GET** | `/api/users` | Fetch all users |
| **POST** | `/api/users` | Create a new user |
| **GET** | `/api/users/:id` | Get specific user by ID |
| **PUT** | `/api/users/:id` | Update user by ID |
| **DELETE** | `/api/users/:id` | Delete user by ID |
| **GET** | `/api/server-info` | Get server system information |
| **GET** | `/api/file-operations` | Perform file system operations |
| **GET** | `/api/time` | Get current server time |

### Example API Calls

**Create User:**

```bash
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","role":"Developer"}'
```

**Get All Users:**

```bash
curl http://localhost:3001/api/users
```

**Get Server Info:**

```bash
curl http://localhost:3001/api/server-info
```

## 📚 Learning Outcomes

By exploring this project, you will understand:

### 1. **Client-Server Architecture**

- How browsers send HTTP requests
- How servers process and respond
- Request-response lifecycle visualization

### 2. **HTTP Methods (REST API)**

- **GET** - Retrieve data
- **POST** - Create new resources
- **PUT** - Update existing resources
- **DELETE** - Remove resources

### 3. **Node.js Built-in Modules**

- **http** - Creating web servers
- **fs** - File system operations
- **os** - System information
- **path** - Path manipulation

### 4. **React & Modern Frontend**

- Component-based architecture
- State management with hooks
- API communication with `fetch()`
- Responsive design principles

### 5. **Full-Stack Development**

- Frontend-backend communication
- CORS handling
- Error handling
- Real-time UI updates

## 🎨 Features Walkthrough

### 1. Hero Section

- Beautiful gradient background
- Code snippet preview
- Key statistics cards

### 2. Core Concepts

- 6 interactive concept cards
- Hover effects and animations
- Color-coded categories

### 3. Client-Server Demo

- Step-by-step request visualization
- Real API call to `/api/time`
- JSON response display

### 4. HTTP Methods Demo

- Create users (POST)
- View users list (GET)
- Edit users (PUT)
- Delete users (DELETE)
- Real-time CRUD operations

### 5. Server Info Display

- Platform and architecture
- CPU and memory information
- Node.js version
- System uptime

### 6. File Operations

- Log file creation
- Recent logs display
- Directory listing
- Real-time file operations

## 🐛 Troubleshooting

### Backend Won't Start

**Error:** `Port 3001 is already in use`

**Solution:**

```bash
# Find process using port 3001
lsof -i :3001

# Kill the process
kill -9 <PID>
```

### Frontend Can't Connect to Backend

**Error:** Server status shows "Offline"

**Solutions:**

1. Ensure backend is running on port 3001
2. Check for CORS errors in browser console
3. Verify `API_BASE_URL` in `App.js` is `http://localhost:3001`

### Dependencies Installation Failed

**Solution:**

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Parcel Build Errors

**Solution:**

```bash
cd frontend
npm run clean  # Clear .parcel-cache
npm start
```

## 🚀 Production Build

To create optimized production builds:

### Backend

```bash
cd backend
# No build needed, run directly:
node server.js
```

### Frontend

```bash
cd frontend
npm run build
# Output in dist/ folder
```

## 📝 Notes

- **Backend runs on port 3001** to avoid conflict with frontend
- **Frontend runs on port 3000** (Parcel default)
- All data is stored **in-memory** - restarting server resets data
- File operations create a `data/` folder in backend directory
- CORS is enabled for development (`Access-Control-Allow-Origin: *`)

## 🎯 Future Enhancements

Possible improvements:

- [ ] Add database (MongoDB/PostgreSQL)
- [ ] Implement authentication (JWT)
- [ ] Add more HTTP endpoints
- [ ] WebSocket for real-time updates
- [ ] Deploy to cloud (Heroku/Vercel)
- [ ] Add unit tests
- [ ] Implement rate limiting
- [ ] Add API documentation (Swagger)

## 📖 Related Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [React Documentation](https://react.dev/)
- [HTTP Methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods)
- [Parcel Documentation](https://parceljs.org/)
- [Session 16 Tutorial](./Readme.md)

## 👨‍💻 Development Tips

1. **Hot Reload**: Both frontend and backend support hot reload
   - Frontend: Parcel auto-reloads
   - Backend: Use `npm run dev` with nodemon

2. **Debugging**:
   - Open browser DevTools (F12)
   - Check Network tab for API calls
   - View Console for errors

3. **Code Structure**:
   - Components are modular and reusable
   - Styles are organized by section
   - API calls are centralized

## ⚡ Quick Commands Reference

```bash
# Backend
cd backend
npm install        # Install dependencies
npm start          # Start server (port 3001)
npm run dev        # Start with nodemon (auto-restart)

# Frontend
cd frontend
npm install        # Install dependencies
npm start          # Start dev server (port 3000)
npm run build      # Production build
npm run clean      # Clear cache

# Both
npm install        # Install all dependencies
```

## 📞 Support

If you encounter any issues:

1. Check the [Troubleshooting](#troubleshooting) section
2. Verify all prerequisites are installed
3. Ensure ports 3000 and 3001 are available
4. Review the console output for error messages

---

**Enjoy exploring backend development with Node.js! 🚀**

Built with ❤️ for learning and demonstration purposes.
