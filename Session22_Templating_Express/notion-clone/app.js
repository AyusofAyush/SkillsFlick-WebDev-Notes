// NoteMaster - A Modern Notion Clone
// Built with Express.js and EJS Templating

require("dotenv").config();
const express = require("express");
const session = require("express-session");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");
const path = require("path");
const connectDB = require("./config/database");

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 4000;

// Connect to MongoDB
connectDB();

// Import middleware
const logger = require("./middleware/logger");
const { attachUser } = require("./middleware/auth");
const { notFound, errorHandler } = require("./middleware/errorHandler");

// Import routes
const indexRoutes = require("./routes/index");
const authRoutes = require("./routes/auth");
const workspaceRoutes = require("./routes/workspaces");
const pageRoutes = require("./routes/pages");
const apiRoutes = require("./routes/api");

// ===== VIEW ENGINE SETUP =====
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ===== MIDDLEWARE SETUP =====

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// Method override for PUT and DELETE in forms
app.use(methodOverride("_method"));

// Static files (CSS, JS, images)
app.use(express.static(path.join(__dirname, "public")));

// Session middleware
app.use(
  session({
    secret:
      process.env.SESSION_SECRET ||
      "notemaster-secret-key-change-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    },
  })
);

// Custom logger middleware
app.use(logger);

// Attach user to all requests
app.use(attachUser);

// Make helper functions available to all views
app.use((req, res, next) => {
  res.locals.formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  res.locals.formatDateTime = (date) => {
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  res.locals.timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);

    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };

    for (const [name, value] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / value);
      if (interval >= 1) {
        return interval === 1 ? `1 ${name} ago` : `${interval} ${name}s ago`;
      }
    }

    return "just now";
  };

  res.locals.truncate = (str, length = 100) => {
    if (!str) return "";
    return str.length > length ? str.substring(0, length) + "..." : str;
  };

  next();
});

// ===== ROUTES =====

// Authentication routes
app.use("/", authRoutes);

// Main routes
app.use("/", indexRoutes);

// Workspace routes
app.use("/workspaces", workspaceRoutes);

// Page routes (nested under workspaces)
app.use("/workspaces/:workspaceId/pages", pageRoutes);

// API routes (for testing)
app.use("/api", apiRoutes);

// ===== ERROR HANDLING =====

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

// ===== START SERVER =====

app.listen(PORT, () => {
  console.log("");
  console.log("╔═══════════════════════════════════════════════════════╗");
  console.log("║                                                       ║");
  console.log("║           🚀 NoteMaster Server Started! 🚀            ║");
  console.log("║                                                       ║");
  console.log("╚═══════════════════════════════════════════════════════╝");
  console.log("");
  console.log(`📝 Server running at: http://localhost:${PORT}`);
  console.log("");
  console.log("✨ Demo Accounts:");
  console.log("   - Username: admin     | Password: (any)");
  console.log("   - Username: john_doe  | Password: (any)");
  console.log("   - Username: jane_smith| Password: (any)");
  console.log("");
  console.log("📚 Available Routes:");
  console.log("   - GET  /              → Landing page");
  console.log("   - GET  /login         → Login page");
  console.log("   - GET  /register      → Registration page");
  console.log("   - GET  /workspaces    → All workspaces");
  console.log("   - GET  /templates     → Template library");
  console.log("");
  console.log("🔌 API Endpoints:");
  console.log("   - GET  /api/workspaces     → Get all workspaces");
  console.log("   - GET  /api/pages/:id      → Get single page");
  console.log("   - POST /api/workspaces     → Create workspace");
  console.log("   - GET  /api/stats          → Get statistics");
  console.log("");
  console.log("📖 Documentation: Check TESTING.md for API testing guide");
  console.log("");
  console.log("Press Ctrl+C to stop the server");
  console.log("════════════════════════════════════════════════════════");
  console.log("");
});

module.exports = app;
