# React Hooks Demo

A comprehensive demonstration of React Hooks including useEffect, custom hooks, and Context API.

## 🚀 Features

### 6 Interactive Demos

1. **📄 Document Title** - Dynamic page title updates with useEffect
2. **⏱️ Stopwatch Timer** - Timer with cleanup and interval management
3. **👤 User Profile** - Data fetching with custom useFetch hook
4. **🌤️ Weather Dashboard** - Async/await with sequential API calls
5. **🎬 Movie Search** - Debounced search with useDebounce hook
6. **✅ Todo App** - localStorage persistence with useLocalStorage hook

### Custom Hooks

- **useFetch** - Reusable data fetching with loading/error states
- **useLocalStorage** - Sync state with browser storage
- **useDebounce** - Delay state updates for performance

### Additional Features

- 🌓 Dark/Light theme with Context API
- 📱 Fully responsive design
- ⚡ Fast HMR with Parcel
- 🎨 Modern UI with CSS variables
- ♿ Accessible components

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Clean cache and build files
npm run clean
```

## 🛠️ Technologies

- **React 19.2** - Latest React with hooks
- **Parcel 2.16** - Zero-config bundler
- **CSS Variables** - Modern theming
- **Context API** - Global state management

## 📚 Learning Objectives

### useEffect Hook

- Understand effect execution timing
- Implement cleanup functions
- Manage dependencies correctly
- Handle side effects properly

### Custom Hooks

- Extract reusable logic
- Share stateful behavior
- Follow hooks naming convention
- Compose multiple hooks

### Context API

- Global state without prop drilling
- Theme management
- Provider pattern
- Custom context hooks

### Best Practices

- Functional component patterns
- Proper dependency arrays
- Memory leak prevention
- Error boundary handling

## 🎓 Session 13 Topics Covered

✅ useEffect for side effects
✅ HTTP requests with fetch
✅ Cleanup functions
✅ Custom hooks creation
✅ Context API setup
✅ localStorage integration
✅ Debouncing technique
✅ Error handling
✅ Loading states
✅ Responsive design

## 📱 Port Configuration

The application runs on **port 3000** by default. This is configured in `package.json`:

```json
"scripts": {
  "start": "parcel src/index.html --port 3000 --open"
}
```

## 🌐 API Usage

### JSONPlaceholder (User Data)

- Free fake API for testing
- No authentication required
- Endpoint: `https://jsonplaceholder.typicode.com/users/{id}`

### Open-Meteo (Weather Data)

- Free weather API
- No API key required
- Geocoding + Weather endpoints

### OMDB (Movie Search)

- Movie database API
- Demo API key included
- Endpoint: `https://www.omdbapi.com/`

## 🎨 Theme System

The app uses Context API for theme management:

```jsx
// Access theme in any component
const { theme, toggleTheme } = useTheme();
```

Themes are persisted in localStorage and applied via CSS variables.

## 📂 Project Structure

```
react-hooks-demo/
├── src/
│   ├── index.html
│   ├── index.js
│   ├── App.jsx
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── TabNavigation.jsx
│   │   ├── DocumentTitle.jsx
│   │   ├── StopwatchTimer.jsx
│   │   ├── UserProfile.jsx
│   │   ├── WeatherDashboard.jsx
│   │   ├── MovieSearch.jsx
│   │   └── TodoApp.jsx
│   ├── context/
│   │   └── ThemeContext.jsx
│   ├── hooks/
│   │   ├── useFetch.js
│   │   ├── useLocalStorage.js
│   │   └── useDebounce.js
│   └── styles/
│       ├── global.css
│       ├── App.css
│       ├── Header.css
│       ├── TabNavigation.css
│       ├── DocumentTitle.css
│       ├── StopwatchTimer.css
│       ├── UserProfile.css
│       ├── WeatherDashboard.css
│       ├── MovieSearch.css
│       └── TodoApp.css
├── package.json
├── README.md
└── SETUP.md
```

## 🔍 Code Examples

### Custom Hook - useFetch

```javascript
const { data, loading, error } = useFetch(url);
```

### Custom Hook - useLocalStorage

```javascript
const [todos, setTodos] = useLocalStorage('todos', []);
```

### Custom Hook - useDebounce

```javascript
const debouncedValue = useDebounce(searchTerm, 500);
```

## 🚦 Running the App

1. Clone or navigate to the project directory
2. Install dependencies: `npm install`
3. Start the dev server: `npm start`
4. Open browser to `http://localhost:3000`

The app will automatically open in your default browser with hot module replacement enabled.

## 📝 Notes

- All state management uses hooks (no class components)
- Custom hooks follow the `use` prefix convention
- Effects properly clean up subscriptions and timers
- Error boundaries handle runtime errors gracefully
- Responsive design works on mobile, tablet, and desktop

## 🎯 Next Steps

After completing this session, you should be able to:

1. Create and use custom hooks
2. Manage side effects with useEffect
3. Implement global state with Context API
4. Handle async operations properly
5. Build responsive, modern React applications

## 📖 Resources

- [React Hooks Documentation](https://react.dev/reference/react)
- [useEffect Guide](https://react.dev/reference/react/useEffect)
- [Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)
- [Context API](https://react.dev/reference/react/useContext)

---

**Built with ❤️ for Session 13: React Hooks**
