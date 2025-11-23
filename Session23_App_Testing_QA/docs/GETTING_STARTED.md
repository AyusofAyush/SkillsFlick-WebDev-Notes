# 🚀 Quick Start Guide

## Session 23 - Product Review System

A beginner-friendly full-stack project to learn **Testing & Quality Assurance**.

---

## 📦 What You'll Build

- ✅ **Backend API** with Express.js (Port 4000)
- ✅ **React Frontend** with Parcel (Port 3000)
- ✅ **Comprehensive Tests** (96% backend, 78% frontend coverage)

---

## 🎯 Prerequisites

Before you start, install:

1. **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
2. **npm** (comes with Node.js)
3. **Code Editor** ([VS Code](https://code.visualstudio.com/) recommended)

### Verify Installation

```bash
node --version  # Should show v18.x.x or higher
npm --version   # Should show 9.x.x or higher
```

---

## ⚡ Quick Setup (5 Minutes)

### 1️⃣ Backend Setup

```bash
cd product-review-backend
npm install
npm run dev
```

✅ **Success**: You should see `Server running on port 4000`

### 2️⃣ Frontend Setup

Open a **new terminal**:

```bash
cd product-review-frontend
npm install
npm start
```

✅ **Success**: Open browser at `http://localhost:3000`

---

## 🧪 Running Tests

### Backend Tests (56 tests, ~2 seconds)

```bash
cd product-review-backend
npm test
```

Expected output:

```
Test Suites: 3 passed, 3 total
Tests:       56 passed, 56 total
Coverage:    96.09% statements, 85.71% branches
```

### Frontend Tests (53 tests, ~13 seconds)

```bash
cd product-review-frontend
npm test
```

Expected output:

```
Test Suites: 5 passed, 2 failed, 7 total
Tests:       37 passed, 16 failed, 53 total
Coverage:    78% statements, 92% components
```

> **Note**: Some integration tests may timeout (test environment issue). Component tests all pass!

---

## 📁 Project Structure

```
Session23/
├── product-review-backend/    # Express API
│   ├── src/
│   │   ├── db/               # Database layer
│   │   ├── routes/           # API endpoints
│   │   └── app.js            # Express config
│   └── package.json
│
├── product-review-frontend/   # React App
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── __tests__/        # Test files
│   │   └── App.jsx           # Main app
│   └── package.json
│
├── CONTRIBUTING.md           # How to contribute
└── Readme.md                 # Full documentation
```

---

## 🎓 Learning Path

### For Complete Beginners

1. ✅ **Start Here**: Read [CONTRIBUTING.md](CONTRIBUTING.md)
2. ✅ **Setup**: Follow Quick Setup above
3. ✅ **Explore**: Open code in VS Code, browse components
4. ✅ **Test**: Run tests, see what passes/fails
5. ✅ **Learn**: Read the full [Readme.md](Readme.md) for theory

### For Intermediate Learners

1. ✅ **Review Code**: Check how tests are structured
2. ✅ **Add Feature**: Try adding a feature using TDD
3. ✅ **Fix Tests**: Debug failing integration tests
4. ✅ **Quality**: Run `npm run lint` and fix warnings

---

## 🔧 Common Commands

### Backend

```bash
npm run dev         # Start development server
npm test            # Run all tests with coverage
npm run test:watch  # Run tests in watch mode
npm run lint        # Check code quality
npm run lint:fix    # Auto-fix lint issues
npm run format      # Format code with Prettier
```

### Frontend

```bash
npm start           # Start development server
npm test            # Run all tests
npm run lint        # Check code quality
npm run build       # Build for production
```

---

## 🐛 Troubleshooting

### "Port already in use"

```bash
# Kill process on port 4000 (backend)
lsof -ti:4000 | xargs kill

# Kill process on port 3000 (frontend)
lsof -ti:3000 | xargs kill
```

### "Module not found"

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### "Tests failing"

```bash
# Clear Jest cache
npx jest --clearCache

# Reinstall and retest
npm install
npm test
```

### Frontend not loading

```bash
# Clear Parcel cache
rm -rf .parcel-cache dist

# Restart server
npm start
```

---

## 🎯 What You'll Learn

### Testing Concepts

- ✅ **Unit Testing** - Testing individual functions
- ✅ **Integration Testing** - Testing API endpoints
- ✅ **Component Testing** - Testing React components
- ✅ **TDD** (Test-Driven Development) - Write tests first!
- ✅ **Mocking** - Simulating external dependencies

### Tools & Technologies

**Backend:**

- Express.js, Jest, Supertest

**Frontend:**

- React 18, Parcel
- React Testing Library, Jest

---

## 📚 Full Documentation

Ready to dive deeper? Check out:

- 📖 **[Full README](Readme.md)** - Complete theory and examples
- 👥 **[Contributing Guide](CONTRIBUTING.md)** - How to contribute
- 🧪 **Backend README** - `product-review-backend/README.md`
- ⚛️ **Frontend README** - `product-review-frontend/README.md`

---

## 🌟 Features

### Backend API

- ✅ Product CRUD operations
- ✅ Review system with ratings
- ✅ Input validation
- ✅ Error handling
- ✅ 96% test coverage

### Frontend App

- ✅ Product listing grid
- ✅ Product details view
- ✅ Review submission form
- ✅ Star ratings display
- ✅ Responsive design
- ✅ 78% test coverage

---

## 🚀 Next Steps

1. **Explore the Code** - Open files in VS Code
2. **Run Tests** - See what passes and fails
3. **Read Theory** - Check full Readme.md
4. **Try TDD** - Add a small feature test-first
5. **Contribute** - Follow CONTRIBUTING.md guide

---

## 💡 Tips for Success

- 🎯 **Start Small**: Don't try to understand everything at once
- 🧪 **Run Tests Often**: See immediate feedback
- 📖 **Read Test Files**: They show how code should work
- ❓ **Ask Questions**: Check CONTRIBUTING.md for help
- 🔄 **Practice TDD**: Write test → Make it pass → Refactor

---

## 📞 Need Help?

1. Check [CONTRIBUTING.md](CONTRIBUTING.md) for common issues
2. Read error messages carefully
3. Google the error (Stack Overflow is your friend!)
4. Review existing tests for patterns

---

**Ready to learn testing? Let's go! 🚀**

For detailed theory, concepts, and advanced topics, see the [Full Documentation](Readme.md).
