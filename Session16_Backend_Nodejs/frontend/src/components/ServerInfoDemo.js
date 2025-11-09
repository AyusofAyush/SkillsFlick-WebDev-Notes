import React, { useState } from 'react';

function ServerInfoDemo({ apiUrl }) {
  const [serverInfo, setServerInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchServerInfo = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/server-info`);
      const data = await response.json();
      if (data.success) {
        setServerInfo(data.data);
      }
    } catch (error) {
      setServerInfo({ error: 'Failed to fetch server information' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="demo-section server-info">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">💻 Server Information (OS Module)</h2>
          <p className="section-subtitle">
            Access system information using Node.js built-in modules
          </p>
        </div>

        <div className="demo-content centered">
          <button 
            className="demo-button primary large"
            onClick={fetchServerInfo}
            disabled={loading}
          >
            {loading ? '⏳ Fetching...' : '🔍 Get Server Information'}
          </button>

          {serverInfo && (
            <div className="server-info-grid">
              {serverInfo.error ? (
                <div className="error-card">
                  <span className="error-icon">❌</span>
                  <p>{serverInfo.error}</p>
                </div>
              ) : (
                <>
                  <div className="info-card">
                    <div className="info-icon">🖥️</div>
                    <div className="info-content">
                      <span className="info-label">Platform</span>
                      <span className="info-value">{serverInfo.platform}</span>
                    </div>
                  </div>
                  <div className="info-card">
                    <div className="info-icon">⚙️</div>
                    <div className="info-content">
                      <span className="info-label">Architecture</span>
                      <span className="info-value">{serverInfo.architecture}</span>
                    </div>
                  </div>
                  <div className="info-card">
                    <div className="info-icon">🔧</div>
                    <div className="info-content">
                      <span className="info-label">CPU Cores</span>
                      <span className="info-value">{serverInfo.cpuCores}</span>
                    </div>
                  </div>
                  <div className="info-card">
                    <div className="info-icon">💾</div>
                    <div className="info-content">
                      <span className="info-label">Total Memory</span>
                      <span className="info-value">{serverInfo.totalMemory}</span>
                    </div>
                  </div>
                  <div className="info-card">
                    <div className="info-icon">📊</div>
                    <div className="info-content">
                      <span className="info-label">Free Memory</span>
                      <span className="info-value">{serverInfo.freeMemory}</span>
                    </div>
                  </div>
                  <div className="info-card">
                    <div className="info-icon">⏱️</div>
                    <div className="info-content">
                      <span className="info-label">Uptime</span>
                      <span className="info-value">{serverInfo.uptime}</span>
                    </div>
                  </div>
                  <div className="info-card">
                    <div className="info-icon">🟢</div>
                    <div className="info-content">
                      <span className="info-label">Node.js Version</span>
                      <span className="info-value">{serverInfo.nodeVersion}</span>
                    </div>
                  </div>
                  {/*<div className="info-card">
                    <div className="info-icon">🌐</div>
                    <div className="info-content">
                      <span className="info-label">Hostname</span>
                      <span className="info-value">{serverInfo.hostname}</span>
                    </div>
                  </div>*/}
                </>
              )}
            </div>
          )}

          <div className="code-example">
            <div className="code-header">
              <span>📄 server.js - Using OS Module</span>
            </div>
            <pre className="code-content">
{`const os = require('os');

// Get system information
const serverInfo = {
  platform: os.platform(),
  architecture: os.arch(),
  cpuCores: os.cpus().length,
  totalMemory: os.totalmem(),
  freeMemory: os.freemem(),
  uptime: os.uptime(),
  hostname: os.hostname()
};

console.log(serverInfo);`}
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ServerInfoDemo;
