import React from 'react';
import '../styles/Header.css';

function Header() {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-title">
          <h1>⚛️ React State Management</h1>
          <p className="subtitle">Interactive Components & State Hooks</p>
        </div>
        <div className="header-badges">
          <span className="badge">useState</span>
          <span className="badge">Events</span>
          <span className="badge">Forms</span>
        </div>
      </div>
    </header>
  );
}

export default Header;
