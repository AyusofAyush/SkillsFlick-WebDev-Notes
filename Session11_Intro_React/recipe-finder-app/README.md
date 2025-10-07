# Recipe Finder App - React Learning Project

A modern, interactive Recipe Finder application built with React to demonstrate component-based architecture, state management, and modern development practices.

## 🚀 Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm (comes with Node.js)

### Installation & Setup

1. **Navigate to the project directory:**

   ```bash
   cd recipe-finder-app
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the development server:**

   ```bash
   npm run dev
   ```

4. **Open your browser and visit:**

   ```
   http://localhost:1234
   ```

The app will automatically reload when you make changes to the code!

## 🏗️ Project Structure

```
recipe-finder-app/
├── package.json          # Project dependencies and scripts
├── index.html           # Main HTML file
└── src/
    ├── index.js         # Application entry point
    ├── App.jsx          # Main app component
    ├── App.css          # Global styles
    ├── components/      # React components
    │   ├── Header.jsx
    │   ├── SearchBar.jsx
    │   ├── RecipeCard.jsx
    │   ├── RecipeList.jsx
    │   └── Footer.jsx
    └── services/        # API services (future use)
        └── recipeAPI.js
```

## 🎯 React Concepts Demonstrated

### 1. **Component Architecture**

- Functional components with hooks
- Component composition and reusability
- Props passing and data flow

### 2. **State Management**

- useState for local component state
- useEffect for side effects
- State lifting and sharing

### 3. **Event Handling**

- Form submission and input changes
- Button clicks and user interactions
- Synthetic events

### 4. **Modern React Patterns**

- Conditional rendering
- List rendering with keys
- Loading states and error handling
- Theme switching

## 🎨 Features

- **🔍 Smart Search**: Search recipes by name or ingredients
- **🌙 Dark/Light Theme**: Toggle between themes with CSS variables
- **📱 Responsive Design**: Works on all device sizes
- **⚡ Loading States**: Smooth loading animations
- **🎭 Interactive UI**: Hover effects and smooth transitions
- **♿ Accessibility**: Proper ARIA labels and semantic HTML

## 🛠️ Built With

- **React 18** - UI library with modern hooks
- **Parcel** - Zero-configuration build tool
- **CSS Variables** - Dynamic theming support
- **Unsplash API** - Recipe images
- **Inter Font** - Modern typography

## 📚 Learning Points

This project teaches:

1. **React Fundamentals**
   - JSX syntax and components
   - Props and state management
   - Event handling patterns

2. **Modern Development**
   - ES6+ JavaScript features
   - CSS custom properties
   - Responsive design principles

3. **User Experience**
   - Loading and error states
   - Smooth animations
   - Accessible interfaces

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Alias for npm run dev

## 🌟 Next Steps

To extend this project, consider adding:

- Real recipe API integration (Spoonacular, TheMealDB)
- Recipe favorites and local storage
- Detailed recipe view with instructions
- User authentication and saved recipes
- Recipe categories and filtering
- Social sharing features

## 📖 Resources

- [React Documentation](https://react.dev/)
- [Parcel Documentation](https://parceljs.org/)
- [CSS Variables Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Happy Coding! 🚀**

*This project was created as part of a React learning session focused on modern development practices and component-based architecture.*
