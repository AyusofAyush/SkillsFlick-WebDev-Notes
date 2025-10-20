import React from 'react';
import '../styles/TabNavigation.css';

function TabNavigation({ tabs, activeTab, setActiveTab }) {
  return (
    <nav className="tab-navigation">
      <ul className="tabs-list">
        {tabs.map(tab => (
          <li key={tab.id}>
            <button
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default TabNavigation;
