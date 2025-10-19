import React, { useState } from 'react';
import '../styles/Counter.css';

function Counter() {
  const [count, setCount] = useState(0);
  const [step, setStep] = useState(1);
  const [history, setHistory] = useState([0]);

  const increment = () => {
    const newCount = count + step;
    setCount(newCount);
    setHistory([...history, newCount]);
  };

  const decrement = () => {
    const newCount = count - step;
    setCount(newCount);
    setHistory([...history, newCount]);
  };

  const reset = () => {
    setCount(0);
    setHistory([0]);
  };

  const undo = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop();
      setHistory(newHistory);
      setCount(newHistory[newHistory.length - 1]);
    }
  };

  return (
    <div className="counter-container">
      <div className="section-header">
        <h2>🔢 Counter Component</h2>
        <p>Understanding useState hook with multiple state variables</p>
      </div>

      <div className="counter-card">
        <div className="count-display">
          <div className="count-value">{count}</div>
          <div className="count-label">Current Count</div>
        </div>

        <div className="controls-grid">
          <button className="control-btn decrement" onClick={decrement}>
            <span className="btn-icon">➖</span>
            <span>Decrement</span>
          </button>
          
          <button className="control-btn increment" onClick={increment}>
            <span className="btn-icon">➕</span>
            <span>Increment</span>
          </button>

          <button className="control-btn reset" onClick={reset}>
            <span className="btn-icon">🔄</span>
            <span>Reset</span>
          </button>

          <button 
            className="control-btn undo" 
            onClick={undo}
            disabled={history.length <= 1}
          >
            <span className="btn-icon">↩️</span>
            <span>Undo</span>
          </button>
        </div>

        <div className="step-control">
          <label htmlFor="step">Step Size:</label>
          <input
            id="step"
            type="number"
            value={step}
            onChange={(e) => setStep(Number(e.target.value))}
            min="1"
            max="100"
          />
        </div>

        <div className="stats-panel">
          <div className="stat">
            <span className="stat-label">Total Changes:</span>
            <span className="stat-value">{history.length - 1}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Step:</span>
            <span className="stat-value">{step}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Can Undo:</span>
            <span className="stat-value">{history.length > 1 ? 'Yes' : 'No'}</span>
          </div>
        </div>

        {history.length > 1 && (
          <div className="history-panel">
            <h4>History:</h4>
            <div className="history-items">
              {history.map((value, index) => (
                <span key={index} className={`history-item ${index === history.length - 1 ? 'current' : ''}`}>
                  {value}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="code-explanation">
        <h3>💡 Key Concepts</h3>
        <ul>
          <li><strong>useState Hook:</strong> Manages count, step, and history state</li>
          <li><strong>Functional Updates:</strong> Updates state based on previous values</li>
          <li><strong>Array State:</strong> Tracks history of all changes</li>
          <li><strong>Conditional Rendering:</strong> Shows history only when available</li>
        </ul>
      </div>
    </div>
  );
}

export default Counter;
