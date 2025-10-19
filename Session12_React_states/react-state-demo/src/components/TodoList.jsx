import React, { useState } from 'react';
import '../styles/TodoList.css';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  const addTodo = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      const newTodo = {
        id: Date.now(),
        text: inputValue.trim(),
        completed: false,
        createdAt: new Date().toLocaleString()
      };
      setTodos([...todos, newTodo]);
      setInputValue('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const startEdit = (id, text) => {
    setEditingId(id);
    setEditText(text);
  };

  const saveEdit = (id) => {
    if (editText.trim()) {
      setTodos(todos.map(todo =>
        todo.id === id ? { ...todo, text: editText.trim() } : todo
      ));
      setEditingId(null);
      setEditText('');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const stats = {
    total: todos.length,
    active: todos.filter(t => !t.completed).length,
    completed: todos.filter(t => t.completed).length
  };

  return (
    <div className="todo-container">
      <div className="section-header">
        <h2>✅ Todo List Component</h2>
        <p>Array state management with CRUD operations</p>
      </div>

      <div className="todo-card">
        <form className="todo-input-form" onSubmit={addTodo}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="What needs to be done?"
            className="todo-input"
          />
          <button type="submit" className="add-btn">
            <span>➕</span> Add
          </button>
        </form>

        <div className="filter-buttons">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({stats.total})
          </button>
          <button 
            className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            Active ({stats.active})
          </button>
          <button 
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed ({stats.completed})
          </button>
        </div>

        <div className="stats-bar">
          <div className="stat-item">
            <span className="stat-icon">📝</span>
            <span>{stats.total} Total</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">⏳</span>
            <span>{stats.active} Active</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">✅</span>
            <span>{stats.completed} Done</span>
          </div>
        </div>

        {filteredTodos.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📭</span>
            <p>No todos {filter !== 'all' ? `in "${filter}" filter` : 'yet'}!</p>
            <p className="empty-hint">Add a task to get started</p>
          </div>
        ) : (
          <ul className="todo-list">
            {filteredTodos.map(todo => (
              <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                {editingId === todo.id ? (
                  <div className="edit-mode">
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="edit-input"
                      autoFocus
                    />
                    <div className="edit-actions">
                      <button onClick={() => saveEdit(todo.id)} className="save-btn">
                        💾 Save
                      </button>
                      <button onClick={cancelEdit} className="cancel-btn">
                        ❌ Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="todo-content">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => toggleTodo(todo.id)}
                        className="todo-checkbox"
                      />
                      <div className="todo-text-wrapper">
                        <span className="todo-text">{todo.text}</span>
                        <span className="todo-date">{todo.createdAt}</span>
                      </div>
                    </div>
                    <div className="todo-actions">
                      <button 
                        onClick={() => startEdit(todo.id, todo.text)}
                        className="edit-btn"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button 
                        onClick={() => deleteTodo(todo.id)}
                        className="delete-btn"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}

        {stats.completed > 0 && (
          <button onClick={clearCompleted} className="clear-completed-btn">
            🧹 Clear Completed ({stats.completed})
          </button>
        )}
      </div>

      <div className="code-explanation">
        <h3>💡 Key Concepts</h3>
        <ul>
          <li><strong>Array State:</strong> Managing a list of todo items</li>
          <li><strong>CRUD Operations:</strong> Create, Read, Update, Delete todos</li>
          <li><strong>Filtering:</strong> Display todos based on completion status</li>
          <li><strong>Derived State:</strong> Calculate statistics from todos array</li>
          <li><strong>Conditional Rendering:</strong> Show edit mode or display mode</li>
        </ul>
      </div>
    </div>
  );
}

export default TodoList;
