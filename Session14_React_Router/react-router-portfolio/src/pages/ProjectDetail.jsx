import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { projectsData } from '../data/projectsData';
import '../styles/ProjectDetail.css';

function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = projectsData.find(p => p.id === parseInt(id));

  if (!project) {
    return (
      <div className="project-not-found">
        <div className="not-found-content">
          <h1>Project Not Found</h1>
          <p>The project you're looking for doesn't exist or has been removed.</p>
          <Link to="/projects" className="btn btn-primary">
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="project-detail">
      <button onClick={() => navigate(-1)} className="back-button">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Back
      </button>

      {/* Project Hero */}
      <section className="project-hero">
        <div className="project-hero-image">
          <img src={project.image} alt={project.title} />
        </div>
      </section>

      {/* Project Header */}
      <section className="project-header">
        <div className="project-title-section">
          <h1>{project.title}</h1>
          {project.featured && <span className="featured-badge large">Featured Project</span>}
        </div>
        <p className="project-main-description">{project.description}</p>

        <div className="project-meta">
          <div className="meta-item">
            <span className="meta-label">Category</span>
            <span className="meta-value">{project.category}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Technologies</span>
            <span className="meta-value">{project.tech.length} used</span>
          </div>
        </div>

        <div className="project-actions">
          <a 
            href={project.liveUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn btn-primary"
          >
            <span>View Live Site</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M15 10.8333V15.8333C15 16.2754 14.8244 16.6993 14.5118 17.0118C14.1993 17.3244 13.7754 17.5 13.3333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V6.66667C2.5 6.22464 2.67559 5.80072 2.98816 5.48816C3.30072 5.17559 3.72464 5 4.16667 5H9.16667" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12.5 2.5H17.5V7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8.33333 11.6667L17.5 2.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
          <a 
            href={project.githubUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn btn-secondary"
          >
            <span>View Code</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 0c-5.523 0-10 4.477-10 10 0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.532 1.03 1.532 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.03-2.683-.103-.253-.447-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0110 4.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.547 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.138 18.163 20 14.418 20 10c0-5.523-4.477-10-10-10z"/>
            </svg>
          </a>
        </div>
      </section>

      {/* Technologies */}
      <section className="project-technologies">
        <h2>Technologies Used</h2>
        <div className="tech-grid">
          {project.tech.map(tech => (
            <div key={tech} className="tech-card">
              <span className="tech-name">{tech}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Project Details */}
      <section className="project-details-section">
        <h2>Project Overview</h2>
        
        <div className="detail-card">
          <div className="detail-icon">🎯</div>
          <div className="detail-content">
            <h3>The Challenge</h3>
            <p>{project.details.challenge}</p>
          </div>
        </div>

        <div className="detail-card">
          <div className="detail-icon">💡</div>
          <div className="detail-content">
            <h3>The Solution</h3>
            <p>{project.details.solution}</p>
          </div>
        </div>

        <div className="detail-card">
          <div className="detail-icon">📊</div>
          <div className="detail-content">
            <h3>The Results</h3>
            <p>{project.details.results}</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="project-features">
        <h2>Key Features</h2>
        <div className="features-grid">
          {project.details.features.map((feature, index) => (
            <div key={index} className="feature-item">
              <div className="feature-icon">✓</div>
              <p>{feature}</p>
            </div>
          ))}
        </div>
      </section>

      {/* More Projects */}
      <section className="more-projects">
        <h2>Explore More Projects</h2>
        <div className="more-projects-actions">
          <Link to="/projects" className="btn btn-secondary">
            View All Projects
          </Link>
        </div>
      </section>
    </div>
  );
}

export default ProjectDetail;
