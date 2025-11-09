import React from 'react';

function ConceptsSection() {
  const concepts = [
    {
      icon: '🏗️',
      title: 'Client-Server Architecture',
      description: 'Understanding how browsers (clients) communicate with servers through HTTP requests and responses.',
      color: '#4CAF50'
    },
    {
      icon: '🟢',
      title: 'Node.js Runtime',
      description: 'JavaScript running on the server-side using Chrome\'s V8 engine for high-performance applications.',
      color: '#2196F3'
    },
    {
      icon: '🔌',
      title: 'HTTP Methods',
      description: 'GET, POST, PUT, DELETE - the fundamental operations for creating RESTful APIs.',
      color: '#FF9800'
    },
    {
      icon: '📦',
      title: 'NPM Packages',
      description: 'Access to over 2 million packages for extending your application\'s functionality.',
      color: '#9C27B0'
    },
    {
      icon: '📁',
      title: 'File System',
      description: 'Read, write, and manage files on the server using Node.js built-in fs module.',
      color: '#F44336'
    },
    {
      icon: '⚡',
      title: 'Non-blocking I/O',
      description: 'Asynchronous operations that allow handling thousands of concurrent connections.',
      color: '#00BCD4'
    }
  ];

  return (
    <section className="concepts-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Core Concepts</h2>
          <p className="section-subtitle">
            Master these fundamental concepts to build powerful backend applications
          </p>
        </div>
        <div className="concepts-grid">
          {concepts.map((concept, index) => (
            <div key={index} className="concept-card" style={{ '--card-color': concept.color }}>
              <div className="concept-icon">{concept.icon}</div>
              <h3 className="concept-title">{concept.title}</h3>
              <p className="concept-description">{concept.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ConceptsSection;
