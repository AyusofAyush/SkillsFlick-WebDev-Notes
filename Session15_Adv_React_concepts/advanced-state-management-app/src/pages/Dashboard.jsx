import { useAuth } from '../contexts/AuthContext';
import { Navbar } from '../components/Navbar';

export default function Dashboard() {
  const { user } = useAuth();

  const stats = [
    { label: 'Total Todos', value: '24', icon: '📝', color: '#6366f1' },
    { label: 'Completed', value: '18', icon: '✓', color: '#10b981' },
    { label: 'In Progress', value: '6', icon: '⏳', color: '#f59e0b' },
    { label: 'Days Active', value: '45', icon: '📅', color: '#ec4899' }
  ];

  const recentActivity = [
    { action: 'Completed task: Fix bug in login', time: '2 hours ago', type: 'success' },
    { action: 'Added new task: Implement dark mode', time: '4 hours ago', type: 'info' },
    { action: 'Updated profile information', time: '1 day ago', type: 'info' },
    { action: 'Completed task: Write documentation', time: '2 days ago', type: 'success' },
    { action: 'Created 5 new tasks', time: '3 days ago', type: 'info' }
  ];

  return (
    <div className="dashboard">
      <Navbar />
      
      <main className="dashboard-main">
        <div className="dashboard-header">
          <div>
            <h1>Welcome back, {user?.name}! 👋</h1>
            <p>Here's what's happening with your tasks today.</p>
          </div>
        </div>

        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card" style={{ borderLeftColor: stat.color }}>
              <div className="stat-icon" style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
                {stat.icon}
              </div>
              <div className="stat-content">
                <h3>{stat.value}</h3>
                <p>{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="dashboard-content">
          <div className="activity-card">
            <h2>Recent Activity</h2>
            <div className="activity-list">
              {recentActivity.map((activity, index) => (
                <div key={index} className={`activity-item activity-${activity.type}`}>
                  <div className="activity-icon">
                    {activity.type === 'success' ? '✓' : 'ℹ'}
                  </div>
                  <div className="activity-details">
                    <p className="activity-action">{activity.action}</p>
                    <p className="activity-time">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="quick-actions-card">
            <h2>Quick Actions</h2>
            <div className="quick-actions">
              <button className="action-btn">
                <span className="action-icon">➕</span>
                <span>Add New Task</span>
              </button>
              <button className="action-btn">
                <span className="action-icon">📊</span>
                <span>View Reports</span>
              </button>
              <button className="action-btn">
                <span className="action-icon">⚙️</span>
                <span>Settings</span>
              </button>
              <button className="action-btn">
                <span className="action-icon">👥</span>
                <span>Team</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
