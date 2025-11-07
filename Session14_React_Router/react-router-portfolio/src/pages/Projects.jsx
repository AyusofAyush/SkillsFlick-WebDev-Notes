import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { projectsData, categories, allTechnologies } from '../data/projectsData';
import ProjectCard from '../components/ProjectCard';
import '../styles/Projects.css';

function Projects() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category') || 'All';
  const techFilter = searchParams.get('tech') || 'All';

  // Filter projects
  let filteredProjects = projectsData;

  if (categoryFilter !== 'All') {
    filteredProjects = filteredProjects.filter(p => p.category === categoryFilter);
  }

  if (techFilter !== 'All') {
    filteredProjects = filteredProjects.filter(p => p.tech.includes(techFilter));
  }

  const handleCategoryChange = (category) => {
    const params = new URLSearchParams(searchParams);
    if (category === 'All') {
      params.delete('category');
    } else {
      params.set('category', category);
    }
    setSearchParams(params);
  };

  const handleTechChange = (tech) => {
    const params = new URLSearchParams(searchParams);
    if (tech === 'All') {
      params.delete('tech');
    } else {
      params.set('tech', tech);
    }
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="projects-page">
      {/* Header */}
      <section className="projects-header">
        <h1>My Projects</h1>
        <p>A collection of my recent work and side projects showcasing various technologies and skills</p>
      </section>

      {/* Filters */}
      <section className="filters-section">
        <div className="filter-group">
          <label>Category:</label>
          <div className="filter-buttons">
            {categories.map(category => (
              <button
                key={category}
                className={categoryFilter === category ? 'filter-btn active' : 'filter-btn'}
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <label>Technology:</label>
          <div className="filter-buttons tech-filters">
            {allTechnologies.map(tech => (
              <button
                key={tech}
                className={techFilter === tech ? 'filter-btn active' : 'filter-btn'}
                onClick={() => handleTechChange(tech)}
              >
                {tech}
              </button>
            ))}
          </div>
        </div>

        {(categoryFilter !== 'All' || techFilter !== 'All') && (
          <button className="clear-filters-btn" onClick={clearFilters}>
            Clear All Filters ✕
          </button>
        )}
      </section>

      {/* Results Summary */}
      <div className="results-summary">
        <p>
          Showing <strong>{filteredProjects.length}</strong> project{filteredProjects.length !== 1 ? 's' : ''}
          {categoryFilter !== 'All' && ` in ${categoryFilter}`}
          {techFilter !== 'All' && ` using ${techFilter}`}
        </p>
      </div>

      {/* Projects Grid */}
      <section className="projects-grid-section">
        {filteredProjects.length > 0 ? (
          <div className="projects-grid">
            {filteredProjects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="no-projects">
            <div className="no-projects-icon">🔍</div>
            <h3>No projects found</h3>
            <p>Try adjusting your filters to see more results</p>
            <button className="btn btn-primary" onClick={clearFilters}>
              Clear Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

export default Projects;
