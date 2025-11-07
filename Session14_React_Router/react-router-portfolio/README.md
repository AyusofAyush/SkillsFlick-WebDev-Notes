# React Router Portfolio

A modern, responsive portfolio application demonstrating React Router v6 concepts and best practices. Built with Parcel bundler for fast development and optimized builds.

## 🚀 Features

### React Router Implementation

- **Client-side Routing** - Fast navigation without page reloads
- **Dynamic Routes** - Project details with URL parameters (`:id`)
- **Query Parameters** - Filter projects by category and technology
- **Programmatic Navigation** - Form submissions with `useNavigate`
- **Active Links** - Visual feedback with `NavLink`
- **Scroll Restoration** - Auto-scroll to top on route changes
- **404 Handling** - Custom not found page

### Application Features

- 📱 **Fully Responsive** - Mobile-first design
- 🎨 **Modern UI** - Clean, professional design with animations
- 🔍 **Project Filtering** - Filter by category and technology
- 📝 **Contact Form** - With validation and success handling
- ⚡ **Fast Performance** - Parcel bundler optimization
- 🎯 **Accessibility** - Semantic HTML and ARIA labels

## 📦 Installation

```bash
# Navigate to the project directory
cd react-router-portfolio

# Install dependencies
npm install
```

## 🏃 Running the Application

```bash
# Start development server on port 3000
npm start
```

The application will automatically open in your browser at `http://localhost:3000`

## 🏗️ Building for Production

```bash
# Create optimized production build
npm run build
```

The production build will be created in the `dist/` directory.

## 📁 Project Structure

```
react-router-portfolio/
├── src/
│   ├── index.html          # Entry HTML file
│   ├── index.js            # App entry point with BrowserRouter
│   ├── App.jsx             # Main routing configuration
│   │
│   ├── components/         # Reusable components
│   │   ├── Navbar.jsx      # Navigation with mobile menu
│   │   ├── Footer.jsx      # Footer with links
│   │   ├── ScrollToTop.jsx # Scroll restoration component
│   │   └── ProjectCard.jsx # Project preview cards
│   │
│   ├── pages/              # Page components (routes)
│   │   ├── Home.jsx        # Landing page
│   │   ├── About.jsx       # About page with timeline
│   │   ├── Projects.jsx    # Projects with filters
│   │   ├── ProjectDetail.jsx # Individual project details
│   │   ├── Contact.jsx     # Contact form
│   │   └── NotFound.jsx    # 404 page
│   │
│   ├── data/               # Static data
│   │   └── projectsData.js # Project information
│   │
│   └── styles/             # CSS modules
│       ├── global.css      # Global styles & variables
│       ├── App.css         # App layout
│       └── [component].css # Component-specific styles
│
├── package.json            # Dependencies and scripts
└── .gitignore             # Git ignore rules
```

## 🛣️ Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | Home | Landing page with hero and featured projects |
| `/about` | About | About section with timeline and skills |
| `/projects` | Projects | All projects with filtering |
| `/projects/:id` | ProjectDetail | Individual project details |
| `/contact` | Contact | Contact form |
| `*` | NotFound | 404 page for invalid routes |

## 🎯 React Router Concepts Demonstrated

### 1. **Basic Routing Setup**

```jsx
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/about" element={<About />} />
  </Routes>
</BrowserRouter>
```

### 2. **Dynamic Routes with Parameters**

```jsx
// Route definition
<Route path="/projects/:id" element={<ProjectDetail />} />

// Accessing parameters
const { id } = useParams();
```

### 3. **Query String Parameters**

```jsx
const [searchParams, setSearchParams] = useSearchParams();
const category = searchParams.get('category');
```

### 4. **Active Link Styling**

```jsx
<NavLink 
  to="/about"
  className={({ isActive }) => isActive ? 'active' : ''}
/>
```

### 5. **Programmatic Navigation**

```jsx
const navigate = useNavigate();
navigate('/projects');
```

### 6. **Scroll Restoration**

```jsx
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
}
```

## 🎨 Design System

### Color Palette

- **Primary**: `#6366f1` (Indigo)
- **Secondary**: `#ec4899` (Pink)
- **Success**: `#10b981` (Green)
- **Danger**: `#ef4444` (Red)

### Responsive Breakpoints

- Mobile: `< 480px`
- Tablet: `< 768px`
- Desktop: `> 768px`

### Typography

- Font Family: `'Inter', sans-serif`
- Headings: 600-800 weight
- Body: 400 weight

## 🔧 Technologies Used

- **React** 18.2.0 - UI library
- **React Router DOM** 6.20.0 - Client-side routing
- **Parcel** 2.10.0 - Build tool and bundler
- **CSS3** - Styling with CSS variables
- **Google Fonts** - Inter font family

## 📝 Key Features Explained

### Project Filtering

Projects can be filtered by:

- **Category**: Web App, Mobile, Data Viz, Productivity
- **Technology**: React, Node.js, Python, etc.

Filters update the URL with query parameters, making filtered views shareable.

### Form Validation

The contact form includes:

- Required field validation
- Email format validation
- Real-time error messages
- Loading state during submission
- Success confirmation with redirect

### Mobile Navigation

- Hamburger menu for mobile devices
- Smooth slide-in animation
- Close on route change
- Touch-friendly tap targets

## 🚀 Performance Optimizations

- Parcel's automatic code splitting
- Optimized CSS with minimal redundancy
- Lazy loading of images
- CSS animations using `transform` and `opacity`
- Efficient re-renders with proper key props

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

This is a learning project demonstrating React Router concepts. Feel free to:

- Fork the repository
- Experiment with new features
- Improve the design
- Add more routing examples

## 📄 License

This project is open source and available for educational purposes.

## 🎓 Learning Resources

To understand the concepts used in this project, refer to:

- [React Router Documentation](https://reactrouter.com/)
- [React Documentation](https://react.dev/)
- [Parcel Documentation](https://parceljs.org/)

## 📞 Support

If you encounter any issues or have questions:

1. Check the console for error messages
2. Ensure all dependencies are installed (`npm install`)
3. Verify Node.js version (v14 or higher recommended)
4. Clear Parcel cache: `rm -rf .parcel-cache`

---

**Built with ❤️ for Session 14 - React Router**
