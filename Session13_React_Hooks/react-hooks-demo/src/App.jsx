import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import TabNavigation from './components/TabNavigation';
import DocumentTitle from './components/DocumentTitle';
import StopwatchTimer from './components/StopwatchTimer';
import UserProfile from './components/UserProfile';
import WeatherDashboard from './components/WeatherDashboard';
import MovieSearch from './components/MovieSearch';
import TodoApp from './components/TodoApp';
import './styles/App.css';

function App() {
  const [activeTab, setActiveTab] = useState('document-title');

  const tabs = [
    { id: 'document-title', label: 'Document Title', icon: '📄' },
    { id: 'timer', label: 'Timer', icon: '⏱️' },
    { id: 'user-profile', label: 'User Data', icon: '👤' },
    { id: 'weather', label: 'Weather', icon: '🌤️' },
    { id: 'movies', label: 'Movies', icon: '🎬' },
    { id: 'todos', label: 'Todos', icon: '✅' }
  ];

  const renderContent = () => {
    switch(activeTab) {
      case 'document-title':
        return <DocumentTitle />;
      case 'timer':
        return <StopwatchTimer />;
      case 'user-profile':
        return <UserProfile />;
      case 'weather':
        return <WeatherDashboard />;
      case 'movies':
        return <MovieSearch />;
      case 'todos':
        return <TodoApp />;
      default:
        return <DocumentTitle />;
    }
  };

  return (
    <ThemeProvider>
      <div className="app">
        <Header />
        <main className="main-content">
          <div className="container">
            <TabNavigation 
              tabs={tabs} 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
            />
            <div className="content-wrapper">
              {renderContent()}
            </div>
          </div>
        </main>
        <footer className="app-footer">
          <p>Built with React Hooks & Parcel | Session 13: Managing Side Effects</p>
        </footer>
      </div>
    </ThemeProvider>
  );
}

export default App;
