// src/components/Header.jsx
import React from 'react';

function Header({ theme, onToggleTheme }) {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <a href="#" className="logo">
            🍳 Recipe Finder
          </a>
          <button 
            className="theme-toggle"
            onClick={onToggleTheme}
            aria-label="Toggle dark mode"
          >
            {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;