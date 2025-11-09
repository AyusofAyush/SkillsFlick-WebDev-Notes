import React from 'react';

function Hero() {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Introduction to Backend Development
            </h1>
            <p className="hero-description">
              Learn how Node.js powers modern web applications through interactive examples.
              This demo showcases client-server architecture, HTTP methods, and real-time API communication.
            </p>
            <div className="hero-stats">
              <div className="stat-card">
                <span className="stat-icon">🌐</span>
                <span className="stat-label">Full-Stack JavaScript</span>
              </div>
              <div className="stat-card">
                <span className="stat-icon">⚡</span>
                <span className="stat-label">Fast & Non-blocking</span>
              </div>
              <div className="stat-card">
                <span className="stat-icon">📦</span>
                <span className="stat-label">NPM Ecosystem</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="code-snippet">
              <div className="code-header">
                <span className="code-title">server.js</span>
                <span className="code-language">Node.js</span>
              </div>
              <pre className="code-content">
{`const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 
    'Content-Type': 'application/json' 
  });
  res.end(JSON.stringify({ 
    message: 'Hello from Node.js!' 
  }));
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
