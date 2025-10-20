import React, { useState, useEffect } from 'react';
import '../styles/DocumentTitle.css';

function DocumentTitle() {
  const [count, setCount] = useState(0);
  const [prefix, setPrefix] = useState('Notifications');

  useEffect(() => {
    document.title = `(${count}) ${prefix} - React Hooks Demo`;
    
    return () => {
      document.title = 'React Hooks Demo';
    };
  }, [count, prefix]);

  return (
    <div className="demo-container">
      <div className="demo-header">
        <h2>📄 Document Title Side Effect</h2>
        <p>Watch the browser tab title change as you interact!</p>
      </div>

      <div className="demo-card">
        <div className="count-display">
          <div className="count-value">{count}</div>
          <div className="count-label">{prefix}</div>
        </div>

        <div className="controls">
          <button onClick={() => setCount(count + 1)} className="btn-increment">
            ➕ Increment
          </button>
          <button onClick={() => setCount(count - 1)} className="btn-decrement">
            ➖ Decrement
          </button>
          <button onClick={() => setCount(0)} className="btn-reset">
            🔄 Reset
          </button>
        </div>

        <div className="prefix-control">
          <label htmlFor="prefix">Title Prefix:</label>
          <select 
            id="prefix"
            value={prefix} 
            onChange={(e) => setPrefix(e.target.value)}
          >
            <option value="Notifications">Notifications</option>
            <option value="Messages">Messages</option>
            <option value="Alerts">Alerts</option>
            <option value="Updates">Updates</option>
          </select>
        </div>
      </div>

      <div className="explanation">
        <h3>💡 What's Happening?</h3>
        <ul>
          <li><strong>useEffect Hook:</strong> Runs after every render when count or prefix changes</li>
          <li><strong>Dependency Array:</strong> [count, prefix] - effect re-runs when these change</li>
          <li><strong>Cleanup Function:</strong> Resets title when component unmounts</li>
          <li><strong>Real-World Use:</strong> Like WhatsApp showing unread message count in tab</li>
        </ul>
      </div>
    </div>
  );
}

export default DocumentTitle;
