import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { Navbar } from '../components/Navbar';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const { success: showSuccess } = useNotification();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || 'A passionate developer building amazing things with React!'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUser(formData);
    setIsEditing(false);
    showSuccess('Profile updated successfully!');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="profile-page">
      <Navbar />
      
      <main className="profile-main">
        <div className="profile-container">
          <div className="profile-header">
            <div className="profile-avatar-section">
              <img src={user?.avatar} alt={user?.name} className="profile-avatar-large" />
              <button className="btn-change-avatar">Change Photo</button>
            </div>
            
            <div className="profile-info">
              <h1>{user?.name}</h1>
              <p className="profile-email">{user?.email}</p>
              <p className="profile-role">
                <span className="role-badge">{user?.role}</span>
              </p>
              <p className="profile-joined">
                Member since {new Date(user?.joinedDate).toLocaleDateString('en-US', { 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </p>
            </div>
          </div>

          <div className="profile-content">
            <div className="profile-card">
              <div className="card-header">
                <h2>Personal Information</h2>
                {!isEditing && (
                  <button 
                    className="btn btn-secondary"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleSubmit} className="profile-form">
                  <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="bio">Bio</label>
                    <textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      rows="4"
                    />
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary">
                      Save Changes
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          name: user?.name || '',
                          email: user?.email || '',
                          bio: user?.bio || ''
                        });
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="profile-details">
                  <div className="detail-item">
                    <span className="detail-label">Full Name</span>
                    <span className="detail-value">{user?.name}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Email</span>
                    <span className="detail-value">{user?.email}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Bio</span>
                    <span className="detail-value">{formData.bio}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="profile-card">
              <h2>Activity Stats</h2>
              <div className="stats-list">
                <div className="stat-item">
                  <span className="stat-label">Total Tasks</span>
                  <span className="stat-value">24</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Completed</span>
                  <span className="stat-value">18</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Success Rate</span>
                  <span className="stat-value">75%</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Current Streak</span>
                  <span className="stat-value">7 days</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
