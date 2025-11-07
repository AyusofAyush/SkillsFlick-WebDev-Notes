import React from 'react';
import { Link } from 'react-router-dom';
import { projectsData } from '../data/projectsData';
import ProjectCard from '../components/ProjectCard';
import '../styles/Home.css';

function Home() {
  const featuredProjects = projectsData.filter(p => p.featured);

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <span className="hero-greeting">👋 Hello, I'm</span>
            <h1 className="hero-title">
              <span className="highlight">Ayush Developer</span>
            </h1>
            <p className="hero-subtitle">
              Full-Stack Developer | Problem Solver | Tech Enthusiast
            </p>
            <p className="hero-description">
              I build exceptional digital experiences that make people's lives easier.
              Specializing in React, Node.js, and modern web technologies.
            </p>
            <div className="hero-buttons">
              <Link to="/projects" className="btn btn-primary">
                <span>View My Work</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <Link to="/contact" className="btn btn-secondary">
                <span>Get In Touch</span>
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <div className="floating-shapes">
              <div className="shape shape-1">💻</div>
              <div className="shape shape-2">🚀</div>
              <div className="shape shape-3">⚡</div>
              <div className="shape shape-4">🎨</div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="stat-item">
          <h3 className="stat-number">50+</h3>
          <p className="stat-label">Projects Completed</p>
        </div>
        <div className="stat-item">
          <h3 className="stat-number">5+</h3>
          <p className="stat-label">Years Experience</p>
        </div>
        <div className="stat-item">
          <h3 className="stat-number">30+</h3>
          <p className="stat-label">Happy Clients</p>
        </div>
        <div className="stat-item">
          <h3 className="stat-number">98%</h3>
          <p className="stat-label">Satisfaction Rate</p>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="featured-projects">
        <div className="section-header">
          <h2>Featured Projects</h2>
          <p>Check out some of my recent work</p>
        </div>
        <div className="projects-grid">
          {featuredProjects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
        <div className="section-footer">
          <Link to="/projects" className="view-all-link">
            View All Projects
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </section>

      {/* Skills Section */}
      <section className="skills-preview">
        <div className="section-header">
          <h2>Technical Skills</h2>
          <p>Technologies I work with</p>
        </div>
        <div className="skills-grid">
          <div className="skill-category">
            <h3>Frontend</h3>
            <div className="skill-tags">
              <span>React</span>
              <span>JavaScript</span>
              <span>TypeScript</span>
              <span>HTML/CSS</span>
              <span>Sass</span>
            </div>
          </div>
          <div className="skill-category">
            <h3>Backend</h3>
            <div className="skill-tags">
              <span>Node.js</span>
              <span>Express</span>
              <span>MongoDB</span>
              <span>PostgreSQL</span>
              <span>REST APIs</span>
            </div>
          </div>
          <div className="skill-category">
            <h3>Tools & Others</h3>
            <div className="skill-tags">
              <span>Git</span>
              <span>Docker</span>
              <span>AWS</span>
              <span>Webpack</span>
              <span>Parcel</span>
            </div>
          </div>
        </div>
        <div className="section-footer">
          <Link to="/about" className="view-all-link">
            Learn More About Me
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Let's Work Together</h2>
          <p>Have a project in mind? Let's create something amazing together!</p>
          <Link to="/contact" className="btn btn-primary btn-large">
            Start a Conversation
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
