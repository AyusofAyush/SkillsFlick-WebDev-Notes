# Product Review API - Backend

> 🧪 **Session 23 Project**: A comprehensive Express API demonstrating testing best practices with Jest, Supertest, and Test-Driven Development (TDD)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Running Tests](#running-tests)
- [API Documentation](#api-documentation)
- [Testing Guide](#testing-guide)
- [Code Quality](#code-quality)

## ✨ Features

- ✅ RESTful API for products and reviews
- ✅ Comprehensive unit and integration tests (80%+ coverage)
- ✅ Test-Driven Development (TDD) approach
- ✅ Input validation with express-validator
- ✅ CORS enabled for frontend integration
- ✅ ESLint + Prettier for code quality
- ✅ Husky pre-commit hooks
- ✅ In-memory database for simplicity

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Testing**: Jest + Supertest
- **Validation**: express-validator
- **Code Quality**: ESLint, Prettier, Husky
- **Other**: CORS, dotenv, uuid

## 📁 Project Structure

```
product-review-backend/
├── src/
│   ├── db/
│   │   ├── __tests__/
│   │   │   └── database.test.js      # Unit tests for database
│   │   └── database.js                # In-memory database
│   ├── routes/
│   │   ├── __tests__/
│   │   │   ├── products.test.js      # Integration tests
│   │   │   └── reviews.test.js       # Integration tests
│   │   ├── products.js                # Product routes
│   │   └── reviews.js                 # Review routes
│   ├── app.js                         # Express app
│   └── server.js                      # Server entry point
├── test-api.sh                        # Shell script for API testing
├── API_TESTING.md                     # cURL testing guide
├── Product-Review-API.postman_collection.json
├── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone or navigate to the backend directory**:

   ```bash
   cd Session23/product-review-backend
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Create environment file**:

   ```bash
   cp .env.example .env
   ```

4. **Start the development server**:

   ```bash
   npm run dev
   ```

   Server will run on `http://localhost:4000`

### Available Scripts

```bash
npm start          # Start production server
npm run dev        # Start with nodemon (auto-reload)
npm test           # Run all tests with coverage
npm run test:watch # Run tests in watch mode
npm run lint       # Lint code with ESLint
npm run lint:fix   # Fix linting issues
npm run format     # Format code with Prettier
```

## 🧪 Running Tests

### Run All Tests

```bash
npm test
```

Expected output:

```
PASS  src/db/__tests__/database.test.js
PASS  src/routes/__tests__/products.test.js
PASS  src/routes/__tests__/reviews.test.js

Test Suites: 3 passed, 3 total
Tests:       50+ passed, 50+ total
Coverage:    80%+ of statements/branches/functions/lines
```

### Watch Mode

```bash
npm run test:watch
```

### Coverage Report

After running tests, open `coverage/lcov-report/index.html` in your browser to see detailed coverage.

## 📚 API Documentation

### Base URL

```
http://localhost:4000
```

### Endpoints

#### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products with stats |
| GET | `/api/products/:id` | Get single product with reviews |
| POST | `/api/products` | Create new product |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |

#### Reviews

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reviews/:productId` | Get all reviews for a product |
| POST | `/api/reviews` | Create new review |
| DELETE | `/api/reviews/:id` | Delete review |

### Sample Requests

#### Create Product

```bash
curl -X POST http://localhost:4000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Gaming Mouse",
    "description": "High-precision gaming mouse",
    "price": 59.99,
    "category": "Gaming"
  }'
```

#### Create Review

```bash
curl -X POST http://localhost:4000/api/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "1",
    "userName": "John Doe",
    "rating": 5,
    "comment": "Excellent product!"
  }'
```

For complete API testing guide, see [API_TESTING.md](./API_TESTING.md)

## 🧪 Testing Guide

### Using cURL

See [API_TESTING.md](./API_TESTING.md) for comprehensive cURL examples.

### Using Shell Script

Make the script executable and run:

```bash
chmod +x test-api.sh
./test-api.sh
```

### Using Postman

1. Import `Product-Review-API.postman_collection.json`
2. Ensure server is running on port 4000
3. Run the collection

## 🎯 Code Quality

### Pre-commit Hooks

This project uses Husky to run linting and formatting before commits:

```bash
# Automatically runs on git commit
git add .
git commit -m "Your message"

# Runs:
# - ESLint to check code quality
# - Prettier to format code
```

### Manual Quality Checks

```bash
# Check for linting errors
npm run lint

# Auto-fix linting errors
npm run lint:fix

# Format code
npm run format
```

## 🧪 Test Examples

### Unit Test (Database)

```javascript
test('creates a new product with all fields', () => {
  const productData = {
    name: 'Test Product',
    price: 99.99,
    category: 'Test'
  };

  const product = db.createProduct(productData);

  expect(product).toMatchObject(productData);
  expect(product.id).toBeDefined();
});
```

### Integration Test (API)

```javascript
test('creates a new product with valid data', async () => {
  const response = await request(app)
    .post('/api/products')
    .send({
      name: 'New Product',
      price: 149.99,
      category: 'Electronics'
    });

  expect(response.status).toBe(201);
  expect(response.body.name).toBe('New Product');
});
```

## 📊 Test Coverage Goals

- **Statements**: 80%+
- **Branches**: 80%+
- **Functions**: 80%+
- **Lines**: 80%+

## 🔗 Frontend Integration

This API is designed to work with the React frontend running on `http://localhost:3000`.

CORS is enabled for all origins in development mode.

## 🤝 Contributing

1. Write tests first (TDD approach)
2. Ensure all tests pass (`npm test`)
3. Run linting (`npm run lint`)
4. Format code (`npm run format`)
5. Commit (pre-commit hooks will run automatically)

## 📄 License

MIT

## 🎓 Learning Resources

This project demonstrates:

- ✅ Test-Driven Development (TDD)
- ✅ Unit Testing with Jest
- ✅ Integration Testing with Supertest
- ✅ API Validation
- ✅ Error Handling
- ✅ Code Quality Tools
- ✅ Pre-commit Hooks
- ✅ Test Coverage

For more information, see Session 23 README in the parent directory.
