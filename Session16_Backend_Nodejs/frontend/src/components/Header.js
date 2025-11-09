import React from 'react';

function Header({ serverStatus, onRefresh }) {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="header-left">
            <h1 className="logo">🚀 Session 16</h1>
            <span className="subtitle">Backend Development & Node.js</span>
          </div>
          <div className="header-right">
            <div className="server-status">
              <span className={`status-indicator ${serverStatus}`}></span>
              <span className="status-text">
                Backend: {serverStatus === 'online' ? '✅ Online' : serverStatus === 'offline' ? '❌ Offline' : '⏳ Checking...'}
              </span>
              <button className="refresh-btn" onClick={onRefresh} title="Refresh server status">
                🔄
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
