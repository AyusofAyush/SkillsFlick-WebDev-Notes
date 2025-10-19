import React from 'react';
import '../styles/ThemeToggle.css';

function ThemeToggle({ darkMode, setDarkMode }) {
  return (
    <button 
      className={`theme-toggle ${darkMode ? 'dark' : 'light'}`}
      onClick={() => setDarkMode(!darkMode)}
      aria-label="Toggle theme"
    >
      <span className="theme-icon">
        {darkMode ? '🌙' : '☀️'}
      </span>
    </button>
  );
}

export default ThemeToggle;
