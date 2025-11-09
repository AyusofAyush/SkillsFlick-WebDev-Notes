import React, { useState, useEffect } from 'react';

function HTTPMethodsDemo({ apiUrl }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', role: 'Developer' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/users`);
      const data = await response.json();
      if (data.success) {
        setUsers(data.data);
      }
    } catch (error) {
      showMessage('Failed to fetch users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        // PUT - Update user
        const response = await fetch(`${apiUrl}/api/users/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const data = await response.json();
        if (data.success) {
          showMessage('✅ User updated successfully!', 'success');
          setEditingId(null);
        }
      } else {
        // POST - Create user
        const response = await fetch(`${apiUrl}/api/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const data = await response.json();
        if (data.success) {
          showMessage('✅ User created successfully!', 'success');
        }
      }
      setFormData({ name: '', email: '', role: 'Developer' });
      fetchUsers();
    } catch (error) {
      showMessage('❌ Operation failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingId(user.id);
    setFormData({ name: user.name, email: user.email, role: user.role });
    // window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/users/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        showMessage('✅ User deleted successfully!', 'success');
        fetchUsers();
      }
    } catch (error) {
      showMessage('❌ Delete failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', email: '', role: 'Developer' });
  };

  return (
    <section className="demo-section http-methods">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">🔌 HTTP Methods in Action</h2>
          <p className="section-subtitle">
            Create, Read, Update, and Delete operations (CRUD)
          </p>
        </div>

        {message && (
          <div className={`message-banner ${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="demo-grid">
          <div className="demo-panel">
            <div className="panel-header">
              <h3>{editingId ? '✏️ Update User (PUT)' : '➕ Create User (POST)'}</h3>
            </div>
            <form className="user-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="Enter name"
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  placeholder="Enter email"
                />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="Developer">Developer</option>
                  <option value="Designer">Designer</option>
                  <option value="Manager">Manager</option>
                  <option value="User">User</option>
                </select>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn primary" disabled={loading}>
                  {editingId ? '💾 Update' : '➕ Create'}
                </button>
                {editingId && (
                  <button type="button" className="btn secondary" onClick={cancelEdit}>
                    ❌ Cancel
                  </button>
                )}
              </div>
            </form>

            <div className="http-methods-info">
              <div className="method-badge post">POST</div>
              <div className="method-badge put">PUT</div>
              <span className="info-text">Create and Update operations</span>
            </div>
          </div>

          <div className="demo-panel">
            <div className="panel-header">
              <h3>👥 Users List (GET)</h3>
              <button className="btn small" onClick={fetchUsers} disabled={loading}>
                🔄 Refresh
              </button>
            </div>

            {loading && <div className="loading">Loading...</div>}

            <div className="users-list">
              {users.length === 0 ? (
                <div className="empty-state">
                  <span className="empty-icon">📭</span>
                  <p>No users found. Create your first user!</p>
                </div>
              ) : (
                users.map((user) => (
                  <div key={user.id} className="user-card">
                    <div className="user-info">
                      <div className="user-avatar">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="user-details">
                        <h4>{user.name}</h4>
                        <p className="user-email">{user.email}</p>
                        <span className="user-role">{user.role}</span>
                      </div>
                    </div>
                    <div className="user-actions">
                      <button 
                        className="btn icon edit" 
                        onClick={() => handleEdit(user)}
                        title="Edit user"
                      >
                        ✏️
                      </button>
                      <button 
                        className="btn icon delete" 
                        onClick={() => handleDelete(user.id)}
                        title="Delete user"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="http-methods-info">
              <div className="method-badge get">GET</div>
              <div className="method-badge delete">DELETE</div>
              <span className="info-text">Read and Delete operations</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HTTPMethodsDemo;
