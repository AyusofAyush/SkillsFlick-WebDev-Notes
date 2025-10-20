import React, { useState } from 'react';
import useFetch from '../hooks/useFetch';
import '../styles/UserProfile.css';

function UserProfile() {
  const [userId, setUserId] = useState(1);
  const { data: user, loading, error } = useFetch(`https://jsonplaceholder.typicode.com/users/${userId}`);

  const handlePrevious = () => {
    if (userId > 1) setUserId(userId - 1);
  };

  const handleNext = () => {
    if (userId < 10) setUserId(userId + 1);
  };

  return (
    <div className="user-profile">
      <h2>👤 User Profile</h2>
      <p className="description">
        Fetch user data from an API using the custom <code>useFetch</code> hook
      </p>

      <div className="user-controls">
        <button onClick={handlePrevious} disabled={userId === 1}>
          ← Previous
        </button>
        <span className="user-id">User ID: {userId}</span>
        <button onClick={handleNext} disabled={userId === 10}>
          Next →
        </button>
      </div>

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading user data...</p>
        </div>
      )}

      {error && (
        <div className="error">
          <p>❌ Error: {error}</p>
        </div>
      )}

      {user && !loading && (
        <div className="user-card">
          <div className="user-header">
            <div className="user-avatar">
              {user.name.charAt(0)}
            </div>
            <div className="user-info">
              <h3>{user.name}</h3>
              <p className="username">@{user.username}</p>
            </div>
          </div>

          <div className="user-details">
            <div className="detail-item">
              <span className="icon">📧</span>
              <div>
                <strong>Email</strong>
                <p>{user.email}</p>
              </div>
            </div>

            <div className="detail-item">
              <span className="icon">📱</span>
              <div>
                <strong>Phone</strong>
                <p>{user.phone}</p>
              </div>
            </div>

            <div className="detail-item">
              <span className="icon">🌐</span>
              <div>
                <strong>Website</strong>
                <p>{user.website}</p>
              </div>
            </div>

            <div className="detail-item">
              <span className="icon">🏢</span>
              <div>
                <strong>Company</strong>
                <p>{user.company?.name}</p>
                <small>{user.company?.catchPhrase}</small>
              </div>
            </div>

            <div className="detail-item">
              <span className="icon">📍</span>
              <div>
                <strong>Address</strong>
                <p>{user.address?.street}, {user.address?.suite}</p>
                <small>{user.address?.city}, {user.address?.zipcode}</small>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="explanation">
        <h3>💡 Key Concepts</h3>
        <ul>
          <li><strong>Custom Hook:</strong> useFetch abstracts data fetching logic</li>
          <li><strong>Loading States:</strong> Shows spinner while data is being fetched</li>
          <li><strong>Error Handling:</strong> Displays error messages if request fails</li>
          <li><strong>Dynamic URL:</strong> API endpoint changes based on userId state</li>
          <li><strong>Cleanup:</strong> AbortController cancels requests on unmount</li>
        </ul>
      </div>
    </div>
  );
}

export default UserProfile;
