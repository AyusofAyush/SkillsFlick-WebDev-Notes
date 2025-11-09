import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ClientServerDemo from './components/ClientServerDemo';
import HTTPMethodsDemo from './components/HTTPMethodsDemo';
import ServerInfoDemo from './components/ServerInfoDemo';
import FileOperationsDemo from './components/FileOperationsDemo';
import ConceptsSection from './components/ConceptsSection';
import Footer from './components/Footer';

const API_BASE_URL = 'http://localhost:3001';

function App() {
  const [serverStatus, setServerStatus] = useState('checking');

  useEffect(() => {
    checkServerStatus();
  }, []);

  const checkServerStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/`);
      if (response.ok) {
        setServerStatus('online');
      } else {
        setServerStatus('offline');
      }
    } catch (error) {
      setServerStatus('offline');
    }
  };

  return (
    <div className="app">
      <Header serverStatus={serverStatus} onRefresh={checkServerStatus} />
      <main>
        <Hero />
        <ConceptsSection />
        <ClientServerDemo apiUrl={API_BASE_URL} />
        <HTTPMethodsDemo apiUrl={API_BASE_URL} />
        <ServerInfoDemo apiUrl={API_BASE_URL} />
        <FileOperationsDemo apiUrl={API_BASE_URL} />
      </main>
      <Footer />
    </div>
  );
}

export default App;
