# Setup Guide - React Hooks Demo

This guide will help you set up and run the React Hooks demonstration project.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 16.0 or higher)
- **npm** (comes with Node.js)
- A code editor (VS Code recommended)
- A modern web browser (Chrome, Firefox, Safari, or Edge)

## Installation Steps

### 1. Check Node.js Installation

Open your terminal and verify Node.js is installed:

```bash
node --version
npm --version
```

If not installed, download from [nodejs.org](https://nodejs.org/)

### 2. Navigate to Project Directory

```bash
cd Session13_React_Hooks/react-hooks-demo
```

### 3. Install Dependencies

```bash
npm install
```

This will install:

- React 19.2.0
- React DOM 19.2.0
- Parcel 2.16.0
- Parcel React Refresh plugin

Expected output:

```
added 130 packages in 15s
```

### 4. Start Development Server

```bash
npm start
```

This command will:

- Start Parcel bundler
- Launch development server on port 3000
- Automatically open your browser to `http://localhost:3000`
- Enable Hot Module Replacement (HMR)

### 5. Verify Installation

You should see:

- ✅ Browser opens automatically
- ✅ React Hooks Demo app loads
- ✅ Header with theme toggle button
- ✅ Six demo tabs
- ✅ No console errors

## Available Scripts

### `npm start`

Starts the development server on port 3000 with hot reload.

```bash
npm start
```

### `npm run build`

Creates an optimized production build in the `dist` folder.

```bash
npm run build
```

### `npm run clean`

Removes cache and build files.

```bash
npm run clean
```

## Port Configuration

The application is configured to run on **port 3000** by default.

If port 3000 is already in use, you can:

**Option 1:** Stop the other process using port 3000

```bash
# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

**Option 2:** Change the port in `package.json`

```json
"scripts": {
  "start": "parcel src/index.html --port 3001 --open"
}
```

## Project Structure

After installation, your directory should look like this:

```
react-hooks-demo/
├── node_modules/          # Dependencies (auto-generated)
├── src/
│   ├── index.html         # Entry HTML file
│   ├── index.js           # React entry point
│   ├── App.jsx            # Main App component
│   ├── components/        # 8 component files
│   ├── context/           # ThemeContext
│   ├── hooks/             # 3 custom hooks
│   └── styles/            # 10 CSS files
├── package.json           # Project configuration
├── package-lock.json      # Dependency lock file (auto-generated)
├── .parcel-cache/         # Parcel cache (auto-generated)
└── dist/                  # Production build (created by npm run build)
```

## Troubleshooting

### Issue: Port 3000 Already in Use

**Solution:**

```bash
# Find and kill the process
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm start -- --port 3001
```

### Issue: Dependencies Not Installing

**Solution:**

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue: Parcel Build Errors

**Solution:**

```bash
# Clean Parcel cache
npm run clean

# Restart the server
npm start
```

### Issue: Module Not Found

**Solution:**
Ensure all files are in the correct directories and file paths in imports match exactly (case-sensitive).

### Issue: Browser Not Opening

**Solution:**
Manually open your browser and navigate to:

```
http://localhost:3000
```

## Development Tips

### 1. Hot Module Replacement

Changes to your code will automatically reflect in the browser without full page reload.

### 2. Theme Toggle

Click the theme button in the header to switch between light and dark modes.

### 3. Component Exploration

Each tab demonstrates different React Hooks concepts:

- **Document Title**: useEffect basics
- **Stopwatch**: Cleanup functions
- **User Profile**: Custom useFetch hook
- **Weather**: Async/await patterns
- **Movie Search**: Debouncing technique
- **Todo App**: localStorage integration

### 4. Browser DevTools

Open React DevTools to inspect:

- Component hierarchy
- State and props
- Hook values
- Context values

## API Information

### User Profile Demo

- **API**: JSONPlaceholder
- **Endpoint**: `https://jsonplaceholder.typicode.com/users/{id}`
- **No API key required**

### Weather Dashboard Demo

- **API**: Open-Meteo
- **Endpoints**: Geocoding + Weather forecast
- **No API key required**

### Movie Search Demo

- **API**: OMDB
- **Endpoint**: `https://www.omdbapi.com/`
- **Demo API key included**: `trilogy`
- **Note**: Limited to 1000 requests/day

## Next Steps

After successful setup:

1. ✅ Explore each demo tab
2. ✅ Read the code in each component
3. ✅ Check the custom hooks implementation
4. ✅ Experiment with the theme toggle
5. ✅ Try modifying components and see HMR in action
6. ✅ Read the main README.md for learning objectives

## Resources

- **React Documentation**: <https://react.dev>
- **Parcel Documentation**: <https://parceljs.org>
- **Session README**: See `README.md` in project root
- **Main Session Guide**: `Session13_React_Hooks/README.md`

## Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Verify all prerequisites are met
3. Ensure you're in the correct directory
4. Check for typos in commands
5. Read error messages carefully

---

**Happy Coding! 🚀**

*Last updated: Session 13 - React Hooks*
