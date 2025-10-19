import React, { useState } from 'react';
import '../styles/ProjectShowcase.css';

function ProjectShowcase() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');

  const projects = [
    {
      id: 1,
      name: 'E-Commerce Platform',
      category: 'web',
      description: 'Full-stack shopping platform with React and Node.js',
      tech: ['React', 'Node.js', 'MongoDB'],
      status: 'completed',
      rating: 5
    },
    {
      id: 2,
      name: 'Mobile Banking App',
      category: 'mobile',
      description: 'Secure mobile banking application with biometric auth',
      tech: ['React Native', 'Firebase', 'Redux'],
      status: 'completed',
      rating: 5
    },
    {
      id: 3,
      name: 'AI Chatbot',
      category: 'ai',
      description: 'Intelligent chatbot using natural language processing',
      tech: ['Python', 'TensorFlow', 'Flask'],
      status: 'in-progress',
      rating: 4
    },
    {
      id: 4,
      name: 'Portfolio Website',
      category: 'web',
      description: 'Modern portfolio with animations and dark mode',
      tech: ['React', 'Tailwind', 'Framer Motion'],
      status: 'completed',
      rating: 5
    },
    {
      id: 5,
      name: 'Fitness Tracker',
      category: 'mobile',
      description: 'Track workouts, calories, and fitness goals',
      tech: ['Flutter', 'Firebase', 'Health Kit'],
      status: 'completed',
      rating: 4
    },
    {
      id: 6,
      name: 'Image Recognition',
      category: 'ai',
      description: 'ML model for object detection in images',
      tech: ['Python', 'PyTorch', 'OpenCV'],
      status: 'in-progress',
      rating: 4
    },
    {
      id: 7,
      name: 'Task Manager',
      category: 'web',
      description: 'Collaborative task management tool',
      tech: ['Vue.js', 'Express', 'PostgreSQL'],
      status: 'planning',
      rating: 3
    },
    {
      id: 8,
      name: 'Weather App',
      category: 'mobile',
      description: 'Real-time weather updates with beautiful UI',
      tech: ['React Native', 'OpenWeather API'],
      status: 'completed',
      rating: 4
    }
  ];

  const categories = [
    { id: 'all', label: 'All Projects', icon: '🚀' },
    { id: 'web', label: 'Web Apps', icon: '🌐' },
    { id: 'mobile', label: 'Mobile', icon: '📱' },
    { id: 'ai', label: 'AI/ML', icon: '🤖' }
  ];

  const sortOptions = [
    { id: 'name', label: 'Name' },
    { id: 'rating', label: 'Rating' },
    { id: 'status', label: 'Status' }
  ];

  const getFilteredProjects = () => {
    let filtered = projects;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.tech.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'status') return a.status.localeCompare(b.status);
      return 0;
    });

    return filtered;
  };

  const filteredProjects = getFilteredProjects();

  const getStatusInfo = (status) => {
    const statusMap = {
      'completed': { label: 'Completed', color: '#2ecc71', icon: '✅' },
      'in-progress': { label: 'In Progress', color: '#f39c12', icon: '🔄' },
      'planning': { label: 'Planning', color: '#3498db', icon: '📋' }
    };
    return statusMap[status] || statusMap.planning;
  };

  const stats = {
    total: projects.length,
    completed: projects.filter(p => p.status === 'completed').length,
    inProgress: projects.filter(p => p.status === 'in-progress').length,
    planning: projects.filter(p => p.status === 'planning').length
  };

  return (
    <div className="project-showcase-container">
      <div className="section-header">
        <h2>🚀 Project Showcase</h2>
        <p>Filtering, searching, and conditional rendering</p>
      </div>

      <div className="showcase-stats">
        <div className="stat-card">
          <span className="stat-icon">📊</span>
          <div>
            <div className="stat-number">{stats.total}</div>
            <div className="stat-label">Total Projects</div>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">✅</span>
          <div>
            <div className="stat-number">{stats.completed}</div>
            <div className="stat-label">Completed</div>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">🔄</span>
          <div>
            <div className="stat-number">{stats.inProgress}</div>
            <div className="stat-label">In Progress</div>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">📋</span>
          <div>
            <div className="stat-number">{stats.planning}</div>
            <div className="stat-label">Planning</div>
          </div>
        </div>
      </div>

      <div className="controls-section">
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search projects, tech stack..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button
              className="clear-search"
              onClick={() => setSearchTerm('')}
            >
              ✕
            </button>
          )}
        </div>

        <div className="sort-control">
          <label>Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            {sortOptions.map(option => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="category-filters">
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            <span className="category-icon">{cat.icon}</span>
            <span>{cat.label}</span>
            <span className="category-count">
              ({cat.id === 'all' ? projects.length : projects.filter(p => p.category === cat.id).length})
            </span>
          </button>
        ))}
      </div>

      {filteredProjects.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🔍</span>
          <h3>No projects found</h3>
          <p>Try adjusting your filters or search term</p>
          <button
            className="reset-btn"
            onClick={() => {
              setSelectedCategory('all');
              setSearchTerm('');
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <>
          <div className="results-info">
            Showing {filteredProjects.length} of {projects.length} projects
          </div>

          <div className="projects-grid">
            {filteredProjects.map(project => {
              const statusInfo = getStatusInfo(project.status);
              return (
                <div key={project.id} className="project-card">
                  <div className="project-header">
                    <h3>{project.name}</h3>
                    <span
                      className="status-badge"
                      style={{ backgroundColor: statusInfo.color }}
                    >
                      {statusInfo.icon} {statusInfo.label}
                    </span>
                  </div>

                  <p className="project-description">{project.description}</p>

                  <div className="project-rating">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < project.rating ? 'star filled' : 'star'}>
                        ⭐
                      </span>
                    ))}
                  </div>

                  <div className="tech-stack">
                    {project.tech.map(tech => (
                      <span key={tech} className="tech-tag">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <button className="view-btn">
                    View Details →
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}

      <div className="code-explanation">
        <h3>💡 Key Concepts</h3>
        <ul>
          <li><strong>Filtering:</strong> Filter projects by category and search term</li>
          <li><strong>Sorting:</strong> Dynamic sorting by different criteria</li>
          <li><strong>Derived State:</strong> Calculate filtered projects from base data</li>
          <li><strong>Conditional Rendering:</strong> Show empty state when no results</li>
          <li><strong>Array Methods:</strong> Using filter, map, and sort effectively</li>
          <li><strong>Multiple State Variables:</strong> Managing category, search, and sort</li>
        </ul>
      </div>
    </div>
  );
}

export default ProjectShowcase;
