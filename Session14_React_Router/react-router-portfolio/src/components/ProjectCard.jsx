import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/ProjectCard.css';

function ProjectCard({ project }) {
  return (
    <div className="project-card">
      <div className="project-image">
        <img src={project.image} alt={project.title} loading="lazy" />
        <div className="project-overlay">
          <Link to={`/projects/${project.id}`} className="view-project-btn">
            View Details →
          </Link>
        </div>
      </div>

      <div className="project-info">
        <div className="project-header">
          <h3>{project.title}</h3>
          {project.featured && <span className="featured-badge">Featured</span>}
        </div>
        <p className="project-description">{project.shortDesc}</p>

        <div className="project-tech">
          {project.tech.slice(0, 3).map(tech => (
            <span key={tech} className="tech-tag">{tech}</span>
          ))}
          {project.tech.length > 3 && (
            <span className="tech-tag more">+{project.tech.length - 3} more</span>
          )}
        </div>

        <div className="project-category">
          <span className="category-badge">{project.category}</span>
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;
