import React, { useState } from 'react';
import '../styles/LightSwitch.css';

function LightSwitch() {
  const [isOn, setIsOn] = useState(false);
  const [brightness, setBrightness] = useState(100);
  const [color, setColor] = useState('#FFD700');
  const [switchCount, setSwitchCount] = useState(0);

  const toggle = () => {
    setIsOn(!isOn);
    setSwitchCount(switchCount + 1);
  };

  return (
    <div className="lightswitch-container">
      <div className="section-header">
        <h2>💡 Light Switch Component</h2>
        <p>Boolean state management with toggles and additional controls</p>
      </div>

      <div className="lightswitch-card">
        <div className={`light-bulb ${isOn ? 'on' : 'off'}`}>
          <div 
            className="bulb"
            style={{
              opacity: isOn ? brightness / 100 : 0.2,
              background: isOn ? color : '#666',
              boxShadow: isOn ? `0 0 ${brightness}px ${color}` : 'none'
            }}
          >
            <span className="bulb-icon">{isOn ? '💡' : '🌑'}</span>
          </div>
        </div>

        <div className="switch-status">
          <h3>Status: <span className={isOn ? 'status-on' : 'status-off'}>
            {isOn ? 'ON' : 'OFF'}
          </span></h3>
        </div>

        <button className={`toggle-btn ${isOn ? 'btn-on' : 'btn-off'}`} onClick={toggle}>
          <span className="toggle-icon">{isOn ? '🔌' : '⚡'}</span>
          <span>Turn {isOn ? 'OFF' : 'ON'}</span>
        </button>

        {isOn && (
          <div className="controls-panel">
            <div className="control-group">
              <label htmlFor="brightness">
                <span>🔆 Brightness: {brightness}%</span>
              </label>
              <input
                id="brightness"
                type="range"
                min="10"
                max="100"
                value={brightness}
                onChange={(e) => setBrightness(Number(e.target.value))}
                className="slider"
              />
            </div>

            <div className="control-group">
              <label htmlFor="color">
                <span>🎨 Color:</span>
              </label>
              <div className="color-picker-wrapper">
                <input
                  id="color"
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="color-picker"
                />
                <span className="color-value">{color}</span>
              </div>
            </div>

            <div className="preset-colors">
              <button onClick={() => setColor('#FFD700')} className="preset-btn" style={{background: '#FFD700'}}>Warm</button>
              <button onClick={() => setColor('#FFFFFF')} className="preset-btn" style={{background: '#FFFFFF'}}>Cool</button>
              <button onClick={() => setColor('#FF6B6B')} className="preset-btn" style={{background: '#FF6B6B'}}>Red</button>
              <button onClick={() => setColor('#4ECDC4')} className="preset-btn" style={{background: '#4ECDC4'}}>Blue</button>
            </div>
          </div>
        )}

        <div className="stats-panel">
          <div className="stat">
            <span className="stat-label">Switch Count:</span>
            <span className="stat-value">{switchCount}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Brightness:</span>
            <span className="stat-value">{brightness}%</span>
          </div>
          <div className="stat">
            <span className="stat-label">Color:</span>
            <span className="stat-value">{color}</span>
          </div>
        </div>
      </div>

      <div className="code-explanation">
        <h3>💡 Key Concepts</h3>
        <ul>
          <li><strong>Boolean State:</strong> Toggle between ON/OFF states</li>
          <li><strong>Conditional Rendering:</strong> Show controls only when light is ON</li>
          <li><strong>Multiple State Variables:</strong> Managing brightness, color, and count</li>
          <li><strong>Event Handlers:</strong> onChange for inputs, onClick for buttons</li>
        </ul>
      </div>
    </div>
  );
}

export default LightSwitch;
