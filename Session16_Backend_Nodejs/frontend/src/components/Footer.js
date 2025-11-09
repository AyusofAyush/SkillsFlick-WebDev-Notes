import React from 'react';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>🚀 Session 16</h3>
            <p>Backend Development & Node.js</p>
            <p className="footer-description">
              An interactive demonstration of Node.js concepts, HTTP methods, and server-side JavaScript.
            </p>
          </div>

          <div className="footer-section">
            <h4>📚 Topics Covered</h4>
            <ul>
              <li>Client-Server Architecture</li>
              <li>Node.js Runtime Environment</li>
              <li>HTTP Methods (GET, POST, PUT, DELETE)</li>
              <li>Built-in Modules (fs, os, http, path)</li>
              <li>RESTful API Design</li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>🛠️ Technologies</h4>
            <ul>
              <li>React 18 - Frontend UI</li>
              <li>Parcel - Build Tool</li>
              <li>Node.js - Backend Server</li>
              <li>Native HTTP Module - Server Creation</li>
              <li>Modern CSS - Responsive Design</li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>🔗 Quick Links</h4>
            <ul>
              <li><a href="https://nodejs.org" target="_blank" rel="noopener noreferrer">Node.js Official</a></li>
              <li><a href="https://developer.mozilla.org/en-US/docs/Web/HTTP" target="_blank" rel="noopener noreferrer">HTTP Documentation</a></li>
              <li><a href="https://reactjs.org" target="_blank" rel="noopener noreferrer">React Documentation</a></li>
              <li><a href="https://parceljs.org" target="_blank" rel="noopener noreferrer">Parcel Bundler</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2024 Session 16 - Backend Development Tutorial</p>
          <p>Built with ❤️ using React, Parcel, and Node.js</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
