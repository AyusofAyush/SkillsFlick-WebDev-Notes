import React, { useState, useEffect } from 'react';
import '../styles/StopwatchTimer.css';

function StopwatchTimer() {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;

    if (isActive) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds + 1);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive]);

  const toggle = () => {
    setIsActive(!isActive);
  };

  const reset = () => {
    setSeconds(0);
    setIsActive(false);
  };

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="demo-container">
      <div className="demo-header">
        <h2>⏱️ Stopwatch Timer with Cleanup</h2>
        <p>Demonstrates timer management and cleanup in useEffect</p>
      </div>

      <div className="demo-card timer-card">
        <div className="timer-display">
          <div className="time-value">{formatTime(seconds)}</div>
          <div className="time-label">
            {isActive ? '🏃 Running' : '⏸️ Paused'}
          </div>
        </div>

        <div className="timer-controls">
          <button 
            onClick={toggle}
            className={`btn-timer ${isActive ? 'btn-pause' : 'btn-start'}`}
          >
            {isActive ? '⏸️ Pause' : '▶️ Start'}
          </button>
          <button onClick={reset} className="btn-reset">
            🔄 Reset
          </button>
        </div>

        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-label">Seconds:</span>
            <span className="stat-value">{seconds}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Minutes:</span>
            <span className="stat-value">{Math.floor(seconds / 60)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Status:</span>
            <span className="stat-value">{isActive ? 'Active' : 'Inactive'}</span>
          </div>
        </div>
      </div>

      <div className="explanation">
        <h3>💡 Key Concepts</h3>
        <ul>
          <li><strong>setInterval:</strong> Creates a timer that runs every second</li>
          <li><strong>Cleanup Function:</strong> clearInterval prevents memory leaks</li>
          <li><strong>Dependency:</strong> Effect re-runs when isActive changes</li>
          <li><strong>Functional Update:</strong> setSeconds with callback ensures correct value</li>
        </ul>
      </div>
    </div>
  );
}

export default StopwatchTimer;
