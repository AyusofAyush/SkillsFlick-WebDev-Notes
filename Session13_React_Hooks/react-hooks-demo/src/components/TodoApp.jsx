import React, { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import '../styles/TodoApp.css';

function TodoApp() {
  const [todos, setTodos] = useLocalStorage('react-hooks-todos', []);
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState('all'); // all, active, completed

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newTodo = {
      id: Date.now(),
      text: inputValue.trim(),
      completed: false,
      createdAt: new Date().toISOString()
    };

    setTodos([...todos, newTodo]);
    setInputValue('');
  };

  const handleToggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const handleDeleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleClearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodosCount = todos.filter(todo => todo.completed).length;

  return (
    <div className="todo-app">
      <h2>✅ Todo App</h2>
      <p className="description">
        Manage todos with localStorage persistence using <code>useLocalStorage</code> hook
      </p>

      <form onSubmit={handleAddTodo} className="todo-form">
        <input
          type="text"
          placeholder="What needs to be done?"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="todo-input"
        />
        <button type="submit" className="add-button">
          Add Todo
        </button>
      </form>

      <div className="todo-stats">
        <div className="stat">
          <span className="stat-value">{todos.length}</span>
          <span className="stat-label">Total</span>
        </div>
        <div className="stat">
          <span className="stat-value">{activeTodosCount}</span>
          <span className="stat-label">Active</span>
        </div>
        <div className="stat">
          <span className="stat-value">{completedTodosCount}</span>
          <span className="stat-label">Completed</span>
        </div>
      </div>

      <div className="todo-filters">
        <button
          onClick={() => setFilter('all')}
          className={filter === 'all' ? 'active' : ''}
        >
          All
        </button>
        <button
          onClick={() => setFilter('active')}
          className={filter === 'active' ? 'active' : ''}
        >
          Active
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={filter === 'completed' ? 'active' : ''}
        >
          Completed
        </button>
      </div>

      {filteredTodos.length === 0 ? (
        <div className="empty-state">
          <p>
            {filter === 'all' && '📝 No todos yet. Add one to get started!'}
            {filter === 'active' && '🎉 No active todos. You\'re all done!'}
            {filter === 'completed' && '⏳ No completed todos yet.'}
          </p>
        </div>
      ) : (
        <ul className="todo-list">
          {filteredTodos.map((todo) => (
            <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggleTodo(todo.id)}
                className="todo-checkbox"
              />
              <span className="todo-text">{todo.text}</span>
              <span className="todo-date">
                {new Date(todo.createdAt).toLocaleDateString()}
              </span>
              <button
                onClick={() => handleDeleteTodo(todo.id)}
                className="delete-button"
                aria-label="Delete todo"
              >
                🗑️
              </button>
            </li>
          ))}
        </ul>
      )}

      {completedTodosCount > 0 && (
        <button onClick={handleClearCompleted} className="clear-completed-button">
          Clear Completed ({completedTodosCount})
        </button>
      )}

      <div className="explanation">
        <h3>💡 Key Concepts</h3>
        <ul>
          <li><strong>localStorage Hook:</strong> Automatically syncs state with browser storage</li>
          <li><strong>Data Persistence:</strong> Todos survive page refreshes</li>
          <li><strong>Array Operations:</strong> map, filter for immutable updates</li>
          <li><strong>Filtering Logic:</strong> Show all, active, or completed todos</li>
          <li><strong>Form Handling:</strong> Controlled input with submit handler</li>
        </ul>
      </div>
    </div>
  );
}

export default TodoApp;
