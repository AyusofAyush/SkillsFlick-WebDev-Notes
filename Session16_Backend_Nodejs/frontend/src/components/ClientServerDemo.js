import React, { useState } from 'react';

function ClientServerDemo({ apiUrl }) {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [step, setStep] = useState(0);

  const steps = [
    { label: '1️⃣ User clicks button', description: 'Client initiates request' },
    { label: '2️⃣ HTTP Request sent', description: 'Browser sends GET request to server' },
    { label: '3️⃣ Server processes', description: 'Node.js server receives and handles request' },
    { label: '4️⃣ Response returned', description: 'Server sends JSON data back to client' },
    { label: '5️⃣ Display data', description: 'React renders the received data' }
  ];

  const fetchTime = async () => {
    setLoading(true);
    setStep(0);
    setResponse(null);

    // Simulate step-by-step process
    for (let i = 0; i <= 4; i++) {
      setStep(i);
      await new Promise(resolve => setTimeout(resolve, 600));
    }

    try {
      const res = await fetch(`${apiUrl}/api/time`);
      const data = await res.json();
      setResponse(data);
    } catch (error) {
      setResponse({ 
        success: false, 
        error: 'Failed to connect to backend. Make sure the server is running on port 3001.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="demo-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">🌐 Client-Server Communication</h2>
          <p className="section-subtitle">
            Watch the request-response cycle in action
          </p>
        </div>

        <div className="demo-content">
          <div className="demo-visual">
            <div className="timeline">
              {steps.map((s, index) => (
                <div 
                  key={index} 
                  className={`timeline-step ${index <= step ? 'active' : ''} ${index === step ? 'current' : ''}`}
                >
                  <div className="step-marker">{s.label}</div>
                  <div className="step-content">
                    <h4>{s.description}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="demo-controls">
            <button 
              className="demo-button primary"
              onClick={fetchTime}
              disabled={loading}
            >
              {loading ? '⏳ Processing...' : '🚀 Send Request to Server'}
            </button>

            {response && (
              <div className={`response-box ${response.success ? 'success' : 'error'}`}>
                <div className="response-header">
                  <span className="response-title">
                    {response.success ? '✅ Server Response' : '❌ Error'}
                  </span>
                  <span className="response-status">
                    {response.success ? 'Status: 200 OK' : 'Connection Failed'}
                  </span>
                </div>
                <pre className="response-content">
                  {JSON.stringify(response, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ClientServerDemo;
