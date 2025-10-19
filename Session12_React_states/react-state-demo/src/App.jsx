import React, { useState } from 'react';
import Header from './components/Header';
import Counter from './components/Counter';
import LightSwitch from './components/LightSwitch';
import TodoList from './components/TodoList';
import ContactForm from './components/ContactForm';
import ProjectShowcase from './components/ProjectShowcase';
import ThemeToggle from './components/ThemeToggle';
import './styles/App.css';

function App() {
  const [activeTab, setActiveTab] = useState('counter');
  const [darkMode, setDarkMode] = useState(false);

  const tabs = [
    { id: 'counter', label: 'Counter', icon: '🔢' },
    { id: 'lightswitch', label: 'Toggle', icon: '💡' },
    { id: 'todo', label: 'Todo List', icon: '✅' },
    { id: 'form', label: 'Contact Form', icon: '📧' },
    { id: 'projects', label: 'Projects', icon: '🚀' }
  ];

  const renderContent = () => {
    switch(activeTab) {
      case 'counter':
        return <Counter />;
      case 'lightswitch':
        return <LightSwitch />;
      case 'todo':
        return <TodoList />;
      case 'form':
        return <ContactForm />;
      case 'projects':
        return <ProjectShowcase />;
      default:
        return <Counter />;
    }
  };

  return (
    <div className={`app ${darkMode ? 'dark-mode' : ''}`}>
      <Header />
      
      <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />

      <nav className="tab-navigation">
        <div className="tab-container">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      <main className="main-content">
        <div className="content-wrapper">
          {renderContent()}
        </div>
      </main>

      <footer className="app-footer">
        <p>Built with React & Parcel | Session 12: React State Management</p>
      </footer>
    </div>
  );
}

export default App;
