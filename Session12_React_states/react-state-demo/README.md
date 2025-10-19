# 🎯 React State Management Demo

A comprehensive, interactive React application demonstrating state management concepts, hooks, and modern component patterns. Built with React and Parcel for Session 12 of the SkillsFlick Web Development course.

![React](https://img.shields.io/badge/React-19.2.0-61dafb?logo=react)
![Parcel](https://img.shields.io/badge/Parcel-2.16.0-e9a96e?logo=parcel)
![License](https://img.shields.io/badge/License-MIT-green)

## 🌟 Features

### 📚 Interactive Components

1. **Counter Component** 🔢
   - Multiple state variables
   - Step controls
   - History tracking with undo functionality
   - Real-time statistics

2. **Light Switch Component** 💡
   - Boolean state management
   - Brightness and color controls
   - Conditional rendering
   - Preset color options

3. **Todo List Component** ✅
   - CRUD operations
   - Filter by status (All/Active/Completed)
   - Edit mode with save/cancel
   - Statistics tracking
   - Empty state handling

4. **Contact Form Component** 📧
   - Controlled form inputs
   - Real-time validation
   - Field-level error handling
   - Character count tracking
   - Form submission with loading state

5. **Project Showcase Component** 🚀
   - Dynamic filtering by category
   - Search functionality
   - Sorting options
   - Responsive grid layout
   - Empty state with reset

### 🎨 Additional Features

- **Dark/Light Theme Toggle** 🌙☀️
- **Responsive Design** - Mobile, Tablet, Desktop
- **Modern UI/UX** - Smooth animations and transitions
- **Accessibility** - Semantic HTML and ARIA labels
- **Code Examples** - Each component explains key concepts

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Navigate to the project directory:**

   ```bash
   cd Session12_React_states/react-state-demo
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the development server:**

   ```bash
   npm start
   ```

The app will automatically open in your browser at `http://localhost:3000` 🎉

### Available Scripts

- `npm start` - Start development server on port 3000
- `npm run build` - Build for production
- `npm run clean` - Remove build artifacts and cache

## 📂 Project Structure

```
react-state-demo/
├── src/
│   ├── components/
│   │   ├── Counter.jsx           # Counter with history
│   │   ├── LightSwitch.jsx       # Toggle with controls
│   │   ├── TodoList.jsx          # Full CRUD todo app
│   │   ├── ContactForm.jsx       # Form with validation
│   │   ├── ProjectShowcase.jsx   # Filter & search demo
│   │   ├── Header.jsx            # App header
│   │   └── ThemeToggle.jsx       # Dark mode toggle
│   ├── styles/
│   │   ├── global.css            # Global styles & variables
│   │   ├── App.css               # Main app layout
│   │   ├── Counter.css           # Counter styles
│   │   ├── LightSwitch.css       # Light switch styles
│   │   ├── TodoList.css          # Todo list styles
│   │   ├── ContactForm.css       # Form styles
│   │   ├── ProjectShowcase.css   # Showcase styles
│   │   ├── Header.css            # Header styles
│   │   └── ThemeToggle.css       # Theme toggle styles
│   ├── App.jsx                   # Main app component
│   ├── index.js                  # App entry point
│   └── index.html                # HTML template
├── package.json                  # Project dependencies
└── README.md                     # This file
```

## 🎓 Learning Objectives

This project demonstrates:

### 1. **useState Hook**

```jsx
const [count, setCount] = useState(0);
const [isOn, setIsOn] = useState(false);
const [todos, setTodos] = useState([]);
```

### 2. **Event Handling**

- onClick events for buttons
- onChange events for inputs
- onSubmit events for forms
- onBlur for validation

### 3. **Controlled Components**

```jsx
<input
  value={formData.email}
  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
/>
```

### 4. **Form Validation**

- Real-time field validation
- Error message display
- Touch state tracking
- Submit button state management

### 5. **Conditional Rendering**

```jsx
{isOn && <div>Light is ON</div>}
{todos.length === 0 ? <EmptyState /> : <TodoList />}
```

### 6. **Array State Management**

- Adding items: `setTodos([...todos, newTodo])`
- Updating items: `setTodos(todos.map(...))`
- Deleting items: `setTodos(todos.filter(...))`

### 7. **Derived State**

```jsx
const stats = {
  total: todos.length,
  completed: todos.filter(t => t.completed).length
};
```

### 8. **Lifting State Up**

- Theme state managed in App.jsx
- Passed down to ThemeToggle component

## 🎨 UI/UX Features

- **Responsive Design**: Works on all screen sizes
- **Dark Mode**: Full theme toggle support
- **Animations**: Smooth transitions and fade-ins
- **Modern Styling**: Gradient backgrounds, shadows, and rounded corners
- **Interactive Feedback**: Hover effects and loading states
- **Accessibility**: Semantic HTML and proper labels

## 🔧 Technical Stack

- **React 19.2.0**: Latest React features
- **Parcel 2.16.0**: Zero-config bundler
- **CSS3**: Modern styling with variables
- **ES6+**: Modern JavaScript features

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 641px - 1024px
- **Desktop**: > 1024px

## 🎯 Key Concepts Covered

### State Management Best Practices

1. ✅ **Keep state minimal** - Don't store derived data
2. ✅ **Don't mutate state** - Always create new objects/arrays
3. ✅ **Use functional updates** - When state depends on previous state
4. ✅ **Lift state up** - Share state between components
5. ✅ **Colocate state** - Keep state close to where it's used

### Component Patterns

- **Controlled Components**: Form inputs controlled by React state
- **Conditional Rendering**: Show/hide UI based on state
- **List Rendering**: Map over arrays to render lists
- **Event Handlers**: Handle user interactions
- **Props Passing**: Pass data and functions to child components

## 🌈 Color Palette

```css
--primary-color: #667eea;
--secondary-color: #764ba2;
--success-color: #2ecc71;
--error-color: #e74c3c;
--warning-color: #f39c12;
```

## 🚀 Deployment

To build for production:

```bash
npm run build
```

The optimized files will be in the `dist/` directory, ready to deploy to any static hosting service.

## 📖 Usage Examples

### Counter Component

Demonstrates basic state management with increment/decrement operations, step controls, and history tracking.

### Light Switch Component

Shows boolean state toggles with additional controls for brightness and color, perfect for understanding conditional rendering.

### Todo List Component

Complete CRUD application with filtering, search, and edit functionality. Demonstrates array state management.

### Contact Form Component

Professional form with validation, error handling, and submit states. Shows controlled components in action.

### Project Showcase Component

Advanced filtering and search with multiple state variables and derived state calculations.

## 🤝 Contributing

This is a learning project for SkillsFlick Web Development course. Feel free to fork and experiment!

## 📄 License

MIT License - Feel free to use this project for learning purposes.

## 🙏 Acknowledgments

- Created for Session 12: React State Management
- Part of SkillsFlick Web Development Course
- Built with React and Parcel

## 📞 Support

For questions or issues related to this project, please refer to the Session 12 README.md for detailed explanations of concepts.

---

**Happy Coding! 🎉**

Built by Ayush Raj with ❤️ for SkillsFlick Web Development Course
