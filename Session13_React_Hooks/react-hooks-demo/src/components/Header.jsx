import React from 'react';
import { useTheme } from '../context/ThemeContext';
import '../styles/Header.css';

function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-title">
          <span className="header-logo">🎣</span>
          <div>
            <h1>React Hooks & Side Effects</h1>
            <p className="header-subtitle">Master useEffect, Context, and Custom Hooks</p>
          </div>
        </div>
        <button 
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          <span className="theme-icon">{theme === 'light' ? '🌙' : '☀️'}</span>
          <span>{theme === 'light' ? 'Dark' : 'Light'}</span>
        </button>
      </div>
    </header>
  );
}

export default Header;
