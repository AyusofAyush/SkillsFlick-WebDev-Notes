// Mock data for Portfolio API

export const projects = [
  {
    id: 1,
    name: "E-Commerce Platform",
    description: "A full-stack e-commerce application with shopping cart, payment integration, and admin dashboard",
    tech: ["React", "Node.js", "MongoDB", "Stripe"],
    image: "https://images.unsplash.com/photo-1557821552-17105176677c",
    github: "https://github.com/yourusername/ecommerce-platform",
    live: "https://ecommerce-demo.com",
    featured: true,
    category: "Full Stack",
    views: 342,
    createdAt: "2024-01-15"
  },
  {
    id: 2,
    name: "Weather Dashboard",
    description: "Real-time weather application with 7-day forecast, location search, and interactive maps",
    tech: ["Vue.js", "OpenWeather API", "Chart.js", "Tailwind CSS"],
    image: "https://images.unsplash.com/photo-1592210454359-9043f067919b",
    github: "https://github.com/yourusername/weather-dashboard",
    live: "https://weather-demo.com",
    featured: true,
    category: "Frontend",
    views: 528,
    createdAt: "2024-02-20"
  },
  {
    id: 3,
    name: "Task Management App",
    description: "Collaborative task manager with drag-and-drop, real-time updates, and team features",
    tech: ["React", "Express.js", "Socket.io", "PostgreSQL"],
    image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b",
    github: "https://github.com/yourusername/task-manager",
    live: "https://tasks-demo.com",
    featured: false,
    category: "Full Stack",
    views: 215,
    createdAt: "2024-03-10"
  },
  {
    id: 4,
    name: "Portfolio Website",
    description: "Modern and responsive portfolio website with animations, dark mode, and contact form",
    tech: ["Next.js", "Framer Motion", "Tailwind CSS", "Vercel"],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
    github: "https://github.com/yourusername/portfolio",
    live: "https://yourportfolio.com",
    featured: true,
    category: "Frontend",
    views: 891,
    createdAt: "2024-04-05"
  },
  {
    id: 5,
    name: "Social Media Dashboard",
    description: "Analytics dashboard for social media metrics with data visualization and export features",
    tech: ["React", "D3.js", "Express.js", "MySQL"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
    github: "https://github.com/yourusername/social-dashboard",
    live: "https://social-demo.com",
    featured: false,
    category: "Full Stack",
    views: 167,
    createdAt: "2024-05-18"
  },
  {
    id: 6,
    name: "Blog CMS",
    description: "Content management system for blogs with markdown editor, SEO optimization, and analytics",
    tech: ["React", "Node.js", "MongoDB", "AWS S3"],
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643",
    github: "https://github.com/yourusername/blog-cms",
    live: "https://blog-demo.com",
    featured: false,
    category: "Full Stack",
    views: 423,
    createdAt: "2024-06-22"
  }
];

export const skills = [
  {
    category: "Frontend",
    items: [
      { name: "HTML5", level: "Expert", years: 5 },
      { name: "CSS3/SCSS", level: "Expert", years: 5 },
      { name: "JavaScript", level: "Expert", years: 4 },
      { name: "TypeScript", level: "Advanced", years: 2 },
      { name: "React.js", level: "Expert", years: 3 },
      { name: "Vue.js", level: "Advanced", years: 2 },
      { name: "Next.js", level: "Advanced", years: 2 },
      { name: "Tailwind CSS", level: "Expert", years: 2 }
    ]
  },
  {
    category: "Backend",
    items: [
      { name: "Node.js", level: "Expert", years: 4 },
      { name: "Express.js", level: "Expert", years: 4 },
      { name: "Python", level: "Advanced", years: 3 },
      { name: "Django", level: "Intermediate", years: 2 },
      { name: "REST APIs", level: "Expert", years: 4 },
      { name: "GraphQL", level: "Advanced", years: 1 }
    ]
  },
  {
    category: "Database",
    items: [
      { name: "MongoDB", level: "Expert", years: 3 },
      { name: "PostgreSQL", level: "Advanced", years: 2 },
      { name: "MySQL", level: "Advanced", years: 3 },
      { name: "Redis", level: "Intermediate", years: 1 }
    ]
  },
  {
    category: "Tools & DevOps",
    items: [
      { name: "Git/GitHub", level: "Expert", years: 5 },
      { name: "Docker", level: "Advanced", years: 2 },
      { name: "AWS", level: "Intermediate", years: 2 },
      { name: "CI/CD", level: "Advanced", years: 2 },
      { name: "VS Code", level: "Expert", years: 5 },
      { name: "Postman", level: "Expert", years: 4 }
    ]
  }
];

export const about = {
  name: "Ayush Raj",
  title: "Full Stack Developer",
  bio: "Passionate full-stack developer with 5+ years of experience building modern web applications. I specialize in React, Node.js, and cloud technologies. I love creating elegant solutions to complex problems and staying up-to-date with the latest technologies.",
  email: "ayush.raj@example.com",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
  social: {
    github: "https://github.com/ayushraj",
    linkedin: "https://linkedin.com/in/ayushraj",
    twitter: "https://twitter.com/ayushraj",
    portfolio: "https://ayushraj.dev"
  },
  experience: [
    {
      company: "Tech Corp",
      position: "Senior Full Stack Developer",
      period: "2022 - Present",
      description: "Leading development of cloud-based applications"
    },
    {
      company: "StartUp Inc",
      position: "Full Stack Developer",
      period: "2020 - 2022",
      description: "Built and maintained multiple web applications"
    },
    {
      company: "Web Agency",
      position: "Junior Developer",
      period: "2019 - 2020",
      description: "Developed responsive websites and web applications"
    }
  ],
  education: [
    {
      school: "University of Technology",
      degree: "Bachelor of Science in Computer Science",
      period: "2015 - 2019",
      gpa: "3.8/4.0"
    }
  ],
  achievements: [
    "Built and deployed 20+ production applications",
    "Contributed to 15+ open-source projects",
    "Mentored 10+ junior developers",
    "Speaker at 3 tech conferences"
  ]
};

export const contactMessages = [];

// Helper function to get next ID for contact messages
export const getNextContactId = () => {
  return contactMessages.length > 0 
    ? Math.max(...contactMessages.map(m => m.id)) + 1 
    : 1;
};
