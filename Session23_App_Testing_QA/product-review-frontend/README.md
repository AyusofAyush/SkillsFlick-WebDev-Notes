# Product Review System - Frontend

> 🧪 **Session 23 Project**: A modern React application demonstrating comprehensive testing with Jest and React Testing Library

## ✨ Features

- ✅ Browse products with ratings and reviews
- ✅ View detailed product information
- ✅ Submit product reviews with validation
- ✅ Responsive design for all screen sizes
- ✅ Real-time API integration
- ✅ Comprehensive component testing (70%+ coverage)
- ✅ Modern UI with CSS variables
- ✅ Accessibility features

## 🛠 Tech Stack

- **Framework**: React 18
- **Build Tool**: Parcel (zero-config bundler)
- **Testing**: Jest + React Testing Library
- **Code Quality**: ESLint, Prettier
- **Styling**: Pure CSS with modern features

## 📁 Project Structure

```
product-review-frontend/
├── src/
│   ├── components/
│   │   ├── __tests__/
│   │   │   ├── ProductCard.test.jsx
│   │   │   ├── ProductList.test.jsx
│   │   │   ├── ReviewForm.test.jsx
│   │   │   └── Stars.test.jsx
│   │   ├── ProductCard.jsx
│   │   ├── ProductDetail.jsx
│   │   ├── ProductList.jsx
│   │   ├── ReviewForm.jsx
│   │   ├── ReviewList.jsx
│   │   └── Stars.jsx
│   ├── api.js
│   ├── App.jsx
│   ├── index.html
│   ├── index.js
│   ├── setupTests.js
│   └── styles.css
├── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running on port 4000

### Installation

1. **Navigate to the frontend directory**:

   ```bash
   cd Session23/product-review-frontend
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Start the development server**:

   ```bash
   npm start
   ```

   Application will run on `http://localhost:3000`

### Available Scripts

```bash
npm start          # Start development server (port 3000)
npm run build      # Build for production
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
PASS  src/components/__tests__/Stars.test.jsx
PASS  src/components/__tests__/ProductCard.test.jsx
PASS  src/components/__tests__/ProductList.test.jsx
PASS  src/components/__tests__/ReviewForm.test.jsx

Test Suites: 4 passed, 4 total
Tests:       30+ passed, 30+ total
Coverage:    70%+ of statements/branches/functions/lines
```

### Watch Mode

```bash
npm run test:watch
```

### Coverage Report

After running tests, open `coverage/lcov-report/index.html` to see detailed coverage.

## 📚 Component Documentation

### ProductList

Displays a grid of product cards.

```jsx
<ProductList 
  products={products} 
  onProductClick={(productId) => console.log(productId)} 
/>
```

### ProductCard

Shows product information with rating and review count.

```jsx
<ProductCard 
  product={product} 
  onClick={() => {}} 
/>
```

### ProductDetail

Displays full product details with reviews and review form.

```jsx
<ProductDetail 
  productId="123" 
  onBack={() => {}} 
/>
```

### ReviewForm

Form for submitting product reviews with validation.

```jsx
<ReviewForm 
  productId="123" 
  onReviewSubmitted={() => {}} 
/>
```

### Stars

Renders star rating display.

```jsx
<Stars rating={4.5} size="medium" />
```

## 🎨 Styling

This project uses pure CSS with modern features:

- CSS Variables for theming
- Flexbox and Grid layouts
- Responsive design with media queries
- Smooth transitions and animations
- Mobile-first approach

### Color Palette

```css
--primary: #2563eb
--success: #10b981
--danger: #ef4444
--warning: #f59e0b
--gray-50 to --gray-900
```

## 🔗 API Integration

The frontend connects to the backend API at `http://localhost:4000/api`.

### API Functions

```javascript
// Get all products
const products = await api.getAllProducts();

// Get single product
const product = await api.getProduct(productId);

// Get reviews
const reviews = await api.getReviews(productId);

// Create review
const review = await api.createReview(reviewData);
```

## 🧪 Testing Guide

### Unit Tests

```javascript
test('renders product information correctly', () => {
  render(<ProductCard product={mockProduct} onClick={mockFn} />);
  
  expect(screen.getByText('Test Product')).toBeInTheDocument();
});
```

### User Interaction Tests

```javascript
test('calls onClick when card is clicked', async () => {
  const user = userEvent.setup();
  render(<ProductCard product={mockProduct} onClick={mockFn} />);
  
  await user.click(screen.getByTestId('product-card-1'));
  
  expect(mockFn).toHaveBeenCalled();
});
```

### Form Validation Tests

```javascript
test('shows error when name is empty', async () => {
  const user = userEvent.setup();
  render(<ReviewForm productId="123" onReviewSubmitted={mockFn} />);
  
  await user.click(screen.getByRole('button'));
  
  expect(screen.getByText('Name is required')).toBeInTheDocument();
});
```

## 📱 Responsive Design

The application is fully responsive:

- **Desktop** (1200px+): 3-4 product cards per row
- **Tablet** (768px-1199px): 2 product cards per row
- **Mobile** (<768px): 1 product card per row, stacked layout

## ♿ Accessibility

- Semantic HTML elements
- ARIA labels and roles
- Keyboard navigation support
- Focus indicators
- Alt text for images

## 🎯 Testing Best Practices

This project demonstrates:

- ✅ Testing user behavior, not implementation
- ✅ Using semantic queries (`getByRole`, `getByLabelText`)
- ✅ Mocking API calls
- ✅ Testing form validation
- ✅ Testing loading and error states
- ✅ User event simulation
- ✅ Accessibility testing

## 🔧 Build Tool: Parcel

Why Parcel?

- ⚡ Zero configuration required
- 🚀 Fast builds with caching
- 📦 Automatic dependency management
- 🔥 Hot module replacement
- 🎯 Production-ready builds

## 📊 Code Quality

### Coverage Goals

- **Statements**: 70%+
- **Branches**: 70%+
- **Functions**: 70%+
- **Lines**: 70%+

### Linting

ESLint is configured with React-specific rules:

```bash
npm run lint
```

### Formatting

Prettier ensures consistent code style:

```bash
npm run format
```

## 🐛 Troubleshooting

### Backend Connection Issues

Make sure the backend is running:

```bash
cd ../product-review-backend
npm run dev
```

### Port Already in Use

If port 3000 is busy:

```bash
npm start -- --port 3001
```

### Test Failures

Clear Jest cache:

```bash
npx jest --clearCache
npm test
```

## 🤝 Contributing

1. Write tests first (TDD approach)
2. Ensure all tests pass (`npm test`)
3. Run linting (`npm run lint`)
4. Format code (`npm run format`)

## 📄 License

MIT

## 🎓 Learning Resources

This project demonstrates:

- ✅ React Hooks (useState, useEffect)
- ✅ Component composition
- ✅ Form handling and validation
- ✅ API integration
- ✅ Testing React components
- ✅ User event testing
- ✅ Responsive design
- ✅ Modern CSS

For more information, see Session 23 README in the parent directory.
