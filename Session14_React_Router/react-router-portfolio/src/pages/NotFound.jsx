import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/NotFound.css';

function NotFound() {
  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <div className="error-code">404</div>
        <h1>Page Not Found</h1>
        <p>Oops! The page you're looking for doesn't exist or has been moved.</p>
        <div className="not-found-actions">
          <Link to="/" className="btn btn-primary">
            Go Home
          </Link>
          <Link to="/projects" className="btn btn-secondary">
            View Projects
          </Link>
        </div>
      </div>
      <div className="not-found-illustration">
        <div className="illustration-404">
          <span>🔍</span>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
