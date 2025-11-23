# Contributing to Product Review System

Thank you for your interest in contributing! This guide will help you get started with contributing to this project.

## 🎯 For Beginners

This project is designed to teach testing and quality assurance practices. Don't worry if you're new to testing - we've made it beginner-friendly!

## 📋 Prerequisites

Before you start, make sure you have:

- **Node.js** (version 18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- A code editor (we recommend [VS Code](https://code.visualstudio.com/))
- Basic knowledge of JavaScript/React (helpful but not required)

### Checking Your Setup

```bash
# Check Node.js version
node --version  # Should show v18.x.x or higher

# Check npm version
npm --version   # Should show 9.x.x or higher
```

## 🚀 Getting Started

### 1. Fork & Clone (If Contributing to a Repo)

If this is on GitHub:

1. Click the "Fork" button at the top right
2. Clone your fork:

   ```bash
   git clone https://github.com/YOUR-USERNAME/session23-testing.git
   cd session23-testing/Session23
   ```

### 2. Install Dependencies

#### Backend Setup

```bash
cd product-review-backend
npm install
```

#### Frontend Setup

```bash
cd product-review-frontend
npm install
```

### 3. Run the Projects

#### Backend (Terminal 1)

```bash
cd product-review-backend
npm run dev
```

You should see: `Server running on port 4000`

#### Frontend (Terminal 2)

```bash
cd product-review-frontend
npm start
```

You should see: `Server running at http://localhost:3000`

## ✅ Before Making Changes

### Run Tests

Always run tests before and after making changes:

```bash
# Backend tests
cd product-review-backend
npm test

# Frontend tests
cd product-review-frontend
npm test
```

### Check Code Quality

```bash
# Lint your code
npm run lint

# Auto-fix lint issues
npm run lint:fix

# Format code with Prettier
npm run format
```

## 📝 Making Changes

### Step 1: Create a Branch

```bash
git checkout -b feature/your-feature-name
# Example: git checkout -b feature/add-delete-review
```

### Step 2: Write Tests First (TDD Approach)

We follow Test-Driven Development:

1. **Write a failing test** for your new feature
2. **Run the test** to see it fail (proves test works)
3. **Write minimal code** to pass the test
4. **Refactor** to improve code quality

#### Example: Adding a New Feature

Let's say you want to add a "delete review" feature:

```javascript
// 1. Write the test first (reviews.test.js)
describe('DELETE /api/products/:productId/reviews/:reviewId', () => {
  test('deletes a review', async () => {
    // Your test code here
  });
});

// 2. Run test - it should FAIL
// 3. Write code to make it pass
// 4. Run test again - it should PASS
```

### Step 3: Follow Coding Standards

#### JavaScript/React Style Guide

- Use **single quotes** for strings
- Use **2 spaces** for indentation
- Add **semicolons** at the end of statements
- Use **const** and **let**, never **var**
- Use **descriptive variable names**

```javascript
// ✅ Good
const userName = 'John Doe';
const calculateTotal = (items) => {
  return items.reduce((sum, item) => sum + item.price, 0);
};

// ❌ Bad
var user_name="John Doe"
function calc(i){
return i.reduce((s,x)=>s+x.price,0)}
```

#### Test Naming

Use descriptive test names that explain what you're testing:

```javascript
// ✅ Good - Clear and descriptive
test('returns 404 when product does not exist', () => {});
test('creates new product with valid data', () => {});

// ❌ Bad - Vague
test('works', () => {});
test('product test', () => {});
```

### Step 4: Commit Your Changes

```bash
# Stage your files
git add .

# Commit with a descriptive message
git commit -m "feat: add delete review functionality"
```

#### Commit Message Format

Use conventional commits:

- `feat:` - New feature
- `fix:` - Bug fix
- `test:` - Adding/updating tests
- `docs:` - Documentation changes
- `style:` - Code formatting (no logic change)
- `refactor:` - Code restructuring

Examples:

```
feat: add review deletion endpoint
fix: resolve rating validation bug
test: add integration tests for products API
docs: update API documentation
```

## 🧪 Testing Guidelines

### What to Test

1. **Happy Path** - Normal usage scenarios
2. **Edge Cases** - Boundary conditions
3. **Error Cases** - Invalid inputs, missing data
4. **Integration** - How components work together

### Test Coverage Goals

- **Backend**: Aim for 80%+ coverage
- **Frontend Components**: Aim for 80%+ coverage
- **Focus on critical paths** over 100% coverage

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (auto-rerun on changes)
npm run test:watch

# Run specific test file
npm test -- reviews.test.js

# Run tests with coverage report
npm test -- --coverage
```

## 🐛 Debugging Tips

### Backend Issues

```bash
# Check if server is running
curl http://localhost:4000/api/products

# View server logs
npm run dev  # Logs will show in terminal
```

### Frontend Issues

```bash
# Clear Parcel cache
rm -rf .parcel-cache dist

# Restart development server
npm start
```

### Test Issues

```bash
# Clear Jest cache
npx jest --clearCache

# Run tests with verbose output
npm test -- --verbose
```

## 📚 Learning Resources

### Testing

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Supertest Guide](https://github.com/visionmedia/supertest)

### Best Practices

- [Arrange-Act-Assert Pattern](https://automationpanda.com/2020/07/07/arrange-act-assert-a-pattern-for-writing-good-tests/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## ❓ Getting Help

### Common Issues

#### "Module not found"

```bash
# Solution: Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### "Port already in use"

```bash
# Solution: Kill process on port 4000/3000
lsof -ti:4000 | xargs kill  # Backend
lsof -ti:3000 | xargs kill  # Frontend
```

#### "Tests failing"

```bash
# Solution: Check if you have the latest code
git pull origin main
npm install
npm test
```

### Ask Questions

- Check existing issues on GitHub
- Create a new issue with:
  - What you tried
  - What happened
  - Error messages (if any)
  - Screenshots (if helpful)

## 🎉 Submitting Your Contribution

### 1. Push Your Changes

```bash
git push origin feature/your-feature-name
```

### 2. Create a Pull Request

1. Go to the original repository on GitHub
2. Click "Pull Requests" → "New Pull Request"
3. Select your branch
4. Fill in the PR template:
   - **What**: Brief description of changes
   - **Why**: Reason for the change
   - **Testing**: How you tested it
   - **Screenshots**: If UI changes

### 3. Code Review

- Maintainers will review your code
- They may request changes
- Make requested changes and push again
- Once approved, your code will be merged!

## 🌟 Code of Conduct

- Be respectful and inclusive
- Help beginners learn
- Provide constructive feedback
- Follow the established patterns

## 🎓 Learning by Doing

Don't be afraid to:

- Make mistakes (that's how we learn!)
- Ask questions
- Experiment with the code
- Read existing tests to understand patterns

## 📖 Next Steps

1. Read the main [README.md](../Readme.md)
2. Run the projects locally
3. Look at existing tests
4. Try fixing an open issue
5. Add a small feature

**Remember**: Every expert was once a beginner. Happy coding! 🚀
