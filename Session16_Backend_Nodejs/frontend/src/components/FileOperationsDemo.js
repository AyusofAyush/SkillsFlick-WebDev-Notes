import React, { useState } from 'react';

function FileOperationsDemo({ apiUrl }) {
  const [fileData, setFileData] = useState(null);
  const [loading, setLoading] = useState(false);

  const performFileOperations = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/file-operations`);
      const data = await response.json();
      if (data.success) {
        setFileData(data.data);
      }
    } catch (error) {
      setFileData({ error: 'Failed to perform file operations' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="demo-section file-operations">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">📁 File System Operations</h2>
          <p className="section-subtitle">
            Read, write, and manage files using Node.js fs module
          </p>
        </div>

        <div className="demo-content centered">
          <button 
            className="demo-button primary large"
            onClick={performFileOperations}
            disabled={loading}
          >
            {loading ? '⏳ Processing...' : '📝 Perform File Operations'}
          </button>

          {fileData && (
            <div className="file-results">
              {fileData.error ? (
                <div className="error-card">
                  <span className="error-icon">❌</span>
                  <p>{fileData.error}</p>
                </div>
              ) : (
                <>
                  <div className="result-card">
                    <h3>✅ {fileData.message}</h3>
                    <div className="file-info">
                      <p><strong>Log File:</strong> {fileData.logFile}</p>
                      <p><strong>Files in Data Directory:</strong> {fileData.filesInDataDir.join(', ')}</p>
                    </div>
                  </div>

                  <div className="logs-section">
                    <h4>📋 Recent Log Entries:</h4>
                    <div className="logs-container">
                      {fileData.recentLogs.length > 0 ? (
                        fileData.recentLogs.map((log, index) => (
                          <div key={index} className="log-entry">
                            {log}
                          </div>
                        ))
                      ) : (
                        <p className="no-logs">No log entries yet</p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          <div className="code-example">
            <div className="code-header">
              <span>📄 server.js - Using File System Module</span>
            </div>
            <pre className="code-content">
{`const fs = require('fs');
const path = require('path');

// Create directory if it doesn't exist
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Write log entry
const logFile = path.join(dataDir, 'server.log');
const logEntry = \`[\${new Date().toISOString()}] API called\\n\`;
fs.appendFileSync(logFile, logEntry);

// Read log file
const logs = fs.readFileSync(logFile, 'utf8');
console.log(logs);

// List files in directory
const files = fs.readdirSync(dataDir);
console.log('Files:', files);`}
            </pre>
          </div>

          <div className="info-box">
            <h4>🎯 What's Happening?</h4>
            <ul>
              <li>✅ Server creates a <code>data</code> directory</li>
              <li>✅ Writes a new log entry with timestamp</li>
              <li>✅ Reads the last 10 log entries</li>
              <li>✅ Lists all files in the data directory</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FileOperationsDemo;
