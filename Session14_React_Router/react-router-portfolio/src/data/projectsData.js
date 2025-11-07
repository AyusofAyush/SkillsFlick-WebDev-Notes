export const projectsData = [
  {
    id: 1,
    title: "E-Commerce Platform",
    description: "A full-stack online shopping platform with cart functionality, payment integration, and admin dashboard.",
    shortDesc: "Full-featured e-commerce solution with modern UI",
    tech: ["React", "Node.js", "Express", "MongoDB", "Stripe"],
    category: "Full Stack",
    image: "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=600&fit=crop",
    liveUrl: "https://demo-ecommerce.com",
    githubUrl: "https://github.com/yourusername/ecommerce",
    featured: true,
    details: {
      challenge: "Building a scalable platform that handles real-time inventory and secure payments while providing an intuitive user experience.",
      solution: "Implemented microservices architecture with Redis caching for inventory management and JWT authentication for secure user sessions. Integrated Stripe for payment processing.",
      results: "Reduced page load time by 60% and successfully handled 1000+ concurrent users during peak sales.",
      features: [
        "Real-time inventory management",
        "Secure payment processing with Stripe",
        "Admin dashboard for product management",
        "User authentication and authorization",
        "Shopping cart with persistent storage",
        "Order tracking and history"
      ]
    }
  },
  {
    id: 2,
    title: "Weather Dashboard",
    description: "Real-time weather application with 7-day forecasts, location search, and interactive maps.",
    shortDesc: "Intuitive weather forecasting application",
    tech: ["React", "OpenWeather API", "Chart.js", "Leaflet"],
    category: "Frontend",
    image: "https://images.unsplash.com/photo-1592210454359-9043f067919b?w=800&h=600&fit=crop",
    liveUrl: "https://weather-dash.com",
    githubUrl: "https://github.com/yourusername/weather",
    featured: true,
    details: {
      challenge: "Presenting complex weather data in an intuitive, user-friendly interface while handling multiple API calls efficiently.",
      solution: "Created custom data visualizations using Chart.js and implemented geolocation features. Used React Query for efficient data fetching and caching.",
      results: "Achieved 95% user satisfaction rate and 50K+ monthly active users within the first three months.",
      features: [
        "7-day weather forecast",
        "Hourly weather updates",
        "Interactive weather maps",
        "Location-based weather",
        "Weather alerts and notifications",
        "Historical weather data visualization"
      ]
    }
  },
  {
    id: 3,
    title: "Task Management App",
    description: "Collaborative productivity tool with real-time updates, team features, and progress tracking.",
    shortDesc: "Team collaboration and productivity tool",
    tech: ["React", "Firebase", "Material-UI", "Redux"],
    category: "Full Stack",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop",
    liveUrl: "https://taskmaster-app.com",
    githubUrl: "https://github.com/yourusername/taskmanager",
    featured: false,
    details: {
      challenge: "Ensuring real-time synchronization across multiple users and devices without conflicts or data loss.",
      solution: "Leveraged Firebase Realtime Database with optimistic UI updates and conflict resolution strategies. Implemented Redux for state management.",
      results: "Enabled seamless collaboration for teams up to 50 members with 99.9% uptime.",
      features: [
        "Real-time task updates",
        "Team collaboration features",
        "Task assignment and tracking",
        "Project progress visualization",
        "Notification system",
        "File attachments and comments"
      ]
    }
  },
  {
    id: 4,
    title: "Social Media Dashboard",
    description: "Analytics dashboard for social media managers to track performance across multiple platforms.",
    shortDesc: "Multi-platform social media analytics",
    tech: ["React", "D3.js", "Node.js", "PostgreSQL"],
    category: "Full Stack",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
    liveUrl: "https://social-dash.com",
    githubUrl: "https://github.com/yourusername/socialdash",
    featured: false,
    details: {
      challenge: "Aggregating data from multiple social media APIs and presenting it in a unified, actionable format.",
      solution: "Built a backend service that polls various social media APIs and stores normalized data. Created interactive D3.js visualizations for data analysis.",
      results: "Helped 500+ businesses improve their social media ROI by an average of 35%.",
      features: [
        "Multi-platform integration",
        "Advanced analytics and reporting",
        "Custom data visualizations",
        "Scheduled post management",
        "Engagement tracking",
        "Competitor analysis"
      ]
    }
  },
  {
    id: 5,
    title: "Recipe Finder App",
    description: "Discover and save recipes with ingredient-based search and meal planning features.",
    shortDesc: "Smart recipe discovery and meal planning",
    tech: ["React", "Spoonacular API", "LocalStorage"],
    category: "Frontend",
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&h=600&fit=crop",
    liveUrl: "https://recipe-finder.com",
    githubUrl: "https://github.com/yourusername/recipes",
    featured: true,
    details: {
      challenge: "Creating an intuitive search experience that helps users find recipes based on available ingredients.",
      solution: "Implemented smart filtering algorithms and integrated Spoonacular API for comprehensive recipe data. Added offline support using LocalStorage.",
      results: "Over 100K recipes discovered by users, with 85% positive feedback on search accuracy.",
      features: [
        "Ingredient-based search",
        "Nutritional information",
        "Step-by-step cooking instructions",
        "Save favorite recipes",
        "Meal planning calendar",
        "Shopping list generator"
      ]
    }
  },
  {
    id: 6,
    title: "Fitness Tracker",
    description: "Personal fitness tracking app with workout logging, progress charts, and goal setting.",
    shortDesc: "Track workouts and achieve fitness goals",
    tech: ["React", "Chart.js", "IndexedDB", "PWA"],
    category: "Frontend",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=600&fit=crop",
    liveUrl: "https://fitness-tracker.com",
    githubUrl: "https://github.com/yourusername/fitness",
    featured: false,
    details: {
      challenge: "Creating a reliable offline-first application that works seamlessly even without internet connection.",
      solution: "Built as a Progressive Web App (PWA) with IndexedDB for local storage and service workers for offline functionality.",
      results: "10K+ active users with an average of 4.5 stars in app reviews.",
      features: [
        "Workout logging and tracking",
        "Progress visualization",
        "Goal setting and reminders",
        "Exercise library with instructions",
        "Offline functionality",
        "Export workout data"
      ]
    }
  }
];

export const categories = ["All", "Frontend", "Full Stack"];

export const allTechnologies = [
  "All",
  ...new Set(projectsData.flatMap(p => p.tech))
];
