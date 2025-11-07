# Advanced State Management App

A comprehensive React application demonstrating advanced state management concepts including Context API, useReducer, authentication, and theme management. Built with Parcel bundler for fast development.

## 🚀 Features

### State Management

- **Context API** - Global state management for auth, theme, and notifications
- **useReducer** - Complex state logic for todos and authentication
- **Local Storage Persistence** - Automatic saving of user data, theme, and todos
- **Custom Hooks** - Reusable hooks for accessing context (useAuth, useTheme, useNotification)

### Application Features

- 🔐 **Authentication System** - Login/Register with form validation
- 🎨 **Theme Switching** - Light/Dark mode with system preference detection
- 📝 **Todo Management** - Full CRUD operations with filtering
- 🔔 **Notification System** - Toast notifications for user feedback
- 👤 **User Profile** - Editable profile with avatar and stats
- 📊 **Dashboard** - Activity tracking and quick actions
- 🔒 **Protected Routes** - Route guards for authenticated pages
- 📱 **Fully Responsive** - Mobile-first design

## 📦 Installation

```bash
# Navigate to the project directory
cd advanced-state-management-app

# Install dependencies
npm install
```

## 🏃 Running the Application

```bash
# Start development server on port 3000
npm start
```

The application will automatically open at `http://localhost:3000`

## 🏗️ Building for Production

```bash
# Create optimized production build
npm run build
```

The build will be created in the `dist/` directory.

## 📁 Project Structure

```
advanced-state-management-app/
├── src/
│   ├── index.html          # Entry HTML
│   ├── index.js            # App entry point
│   ├── App.jsx             # Main app with routing
│   │
│   ├── contexts/           # Context providers
│   │   ├── AuthContext.jsx       # Authentication with useReducer
│   │   ├── ThemeContext.jsx      # Theme management
│   │   └── NotificationContext.jsx # Toast notifications
│   │
│   ├── components/         # Reusable components
│   │   ├── Navbar.jsx            # Navigation bar
│   │   └── ProtectedRoute.jsx    # Route guard
│   │
│   ├── pages/              # Page components
│   │   ├── Login.jsx             # Login page
│   │   ├── Register.jsx          # Registration page
│   │   ├── Dashboard.jsx         # Main dashboard
│   │   ├── Profile.jsx           # User profile
│   │   └── TodoApp.jsx           # Todo application
│   │
│   └── styles/             # CSS files
│       ├── global.css            # Global styles & variables
│       ├── App.css               # App-specific styles
│       └── pages.css             # Page-specific styles
│
├── package.json            # Dependencies and scripts
└── .gitignore             # Git ignore rules
```

## 🎯 Key Concepts Demonstrated

### 1. Context API Pattern

```jsx
// Creating a context
const ThemeContext = createContext();

// Provider component
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const value = useMemo(() => ({ theme, setTheme }), [theme]);
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook for consuming context
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
```

### 2. useReducer for Complex State

```jsx
// Action types
const TODO_ACTIONS = {
  ADD: 'add_todo',
  TOGGLE: 'toggle_todo',
  DELETE: 'delete_todo'
};

// Reducer function
function todoReducer(state, action) {
  switch (action.type) {
    case TODO_ACTIONS.ADD:
      return { ...state, todos: [...state.todos, action.payload] };
    case TODO_ACTIONS.TOGGLE:
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed }
            : todo
        )
      };
    default:
      return state;
  }
}

// Using the reducer
const [state, dispatch] = useReducer(todoReducer, initialState);
dispatch({ type: TODO_ACTIONS.ADD, payload: newTodo });
```

### 3. Authentication Flow

```jsx
// Login function in AuthContext
const login = async (email, password) => {
  dispatch({ type: 'LOGIN_START' });
  
  try {
    const user = await validateCredentials(email, password);
    dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    return { success: true };
  } catch (error) {
    dispatch({ type: 'LOGIN_ERROR', payload: error.message });
    return { success: false, error: error.message };
  }
};
```

### 4. Protected Routes

```jsx
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  return isAuthenticated ? children : <Navigate to="/login" />;
}
```

### 5. Performance Optimization

```jsx
// Memoize context value to prevent unnecessary re-renders
const value = useMemo(() => ({
  user,
  login,
  logout,
  updateUser
}), [user]);
```

## 🎨 Design System

### Color Palette

- **Primary**: `#6366f1` (Indigo)
- **Secondary**: `#ec4899` (Pink)
- **Success**: `#10b981` (Green)
- **Warning**: `#f59e0b` (Amber)
- **Error**: `#ef4444` (Red)

### Theme Variables

The app uses CSS custom properties for theming:

```css
:root {
  --primary-color: #6366f1;
  --bg-primary: #ffffff;
  --text-primary: #111827;
}

[data-theme="dark"] {
  --bg-primary: #1f2937;
  --text-primary: #f9fafb;
}
```

### Responsive Breakpoints

- Mobile: `< 480px`
- Tablet: `< 768px`
- Desktop: `> 768px`

## 🔧 Technologies Used

- **React** 18.2.0 - UI library
- **React Router DOM** 6.20.0 - Client-side routing
- **Parcel** 2.10.0 - Zero-config bundler
- **CSS3** - Modern styling with CSS variables

## 📝 Usage Guide

### Login

1. Navigate to `/login`
2. Use demo credentials:
   - Email: `demo@example.com`
   - Password: `demo123` (min 6 characters)
3. Or create a new account at `/register`

### Dashboard

- View activity stats and recent actions
- Access quick actions for common tasks

### Todo App

- Add new tasks with the input form
- Toggle completion by clicking checkboxes
- Edit tasks by double-clicking or using edit button
- Delete tasks with the delete button
- Filter by All/Active/Completed
- Clear all completed tasks

### Profile

- View your profile information
- Edit name, email, and bio
- Update profile picture
- View activity statistics

### Theme Toggle

- Click the sun/moon icon in the navbar
- Theme preference is saved to localStorage
- Automatically detects system preference on first visit

## 🚀 Advanced Features

### Notification System

The app includes a global notification system:

```jsx
const { success, error, warning, info } = useNotification();

// Show notifications from anywhere
success('Task completed!');
error('Something went wrong');
warning('Please save your work');
info('New update available');
```

### Local Storage Persistence

- User authentication state
- Theme preference
- Todo list data
- All automatically synced

### Error Boundaries

Context providers include error handling:

```jsx
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

## 📊 State Architecture

```
App
├── ThemeProvider (Theme state)
│   ├── NotificationProvider (Notification queue)
│   │   └── AuthProvider (User & auth state)
│   │       ├── Public Routes (Login, Register)
│   │       └── Protected Routes
│   │           ├── Dashboard
│   │           ├── Profile
│   │           └── TodoApp (Local todo state with useReducer)
```

## 🎓 Learning Objectives Covered

✅ Context API for global state management  
✅ useReducer for complex state logic  
✅ Custom hooks for context consumption  
✅ Authentication flow with protected routes  
✅ Theme management with system preference  
✅ Form validation and error handling  
✅ Local storage integration  
✅ Performance optimization with useMemo  
✅ Component composition patterns  
✅ Notification system implementation  
✅ Responsive design best practices  

## 🐛 Troubleshooting

### Port already in use

If port 3000 is busy, modify `package.json`:

```json
"start": "parcel src/index.html --port 3001"
```

### Clear cache

If you encounter build issues:

```bash
rm -rf .parcel-cache dist node_modules
npm install
npm start
```

### Theme not persisting

Check browser's localStorage permissions and clear if needed.

## 📚 Related Documentation

- [React Context API](https://react.dev/reference/react/useContext)
- [useReducer Hook](https://react.dev/reference/react/useReducer)
- [React Router](https://reactrouter.com/)
- [Parcel Bundler](https://parceljs.org/)

## 🤝 Best Practices Implemented

- ✅ Separation of concerns (contexts, components, pages)
- ✅ Custom hooks for logic reusability
- ✅ Memoization to prevent unnecessary re-renders
- ✅ Proper error handling and user feedback
- ✅ Accessible form inputs with labels
- ✅ Semantic HTML structure
- ✅ Mobile-first responsive design
- ✅ Loading states for async operations
- ✅ Consistent naming conventions

## 📄 License

This project is open source and available for educational purposes.

---

**Built with ❤️ to demonstrate Advanced React State Management Concepts**
