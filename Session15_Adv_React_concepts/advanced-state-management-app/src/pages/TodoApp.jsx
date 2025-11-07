import { useReducer, useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { useNotification } from '../contexts/NotificationContext';

// Action types
const TODO_ACTIONS = {
  ADD: 'add_todo',
  TOGGLE: 'toggle_todo',
  DELETE: 'delete_todo',
  UPDATE: 'update_todo',
  SET_FILTER: 'set_filter',
  LOAD_TODOS: 'load_todos',
  CLEAR_COMPLETED: 'clear_completed'
};

// Reducer function
function todoReducer(state, action) {
  switch (action.type) {
    case TODO_ACTIONS.ADD:
      return {
        ...state,
        todos: [...state.todos, action.payload]
      };

    case TODO_ACTIONS.TOGGLE:
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed }
            : todo
        )
      };

    case TODO_ACTIONS.DELETE:
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload)
      };

    case TODO_ACTIONS.UPDATE:
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.id
            ? { ...todo, ...action.payload.updates }
            : todo
        )
      };

    case TODO_ACTIONS.SET_FILTER:
      return {
        ...state,
        filter: action.payload
      };

    case TODO_ACTIONS.LOAD_TODOS:
      return {
        ...state,
        todos: action.payload
      };

    case TODO_ACTIONS.CLEAR_COMPLETED:
      return {
        ...state,
        todos: state.todos.filter(todo => !todo.completed)
      };

    default:
      return state;
  }
}

export default function TodoApp() {
  const [state, dispatch] = useReducer(todoReducer, {
    todos: [],
    filter: 'all'
  });

  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const { success: showSuccess, error: showError } = useNotification();

  // Load todos from localStorage
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      dispatch({ type: TODO_ACTIONS.LOAD_TODOS, payload: JSON.parse(savedTodos) });
    }
  }, []);

  // Save todos to localStorage
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(state.todos));
  }, [state.todos]);

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (!newTodo.trim()) {
      showError('Please enter a task');
      return;
    }

    const todo = {
      id: Date.now(),
      text: newTodo.trim(),
      completed: false,
      createdAt: new Date().toISOString()
    };

    dispatch({ type: TODO_ACTIONS.ADD, payload: todo });
    setNewTodo('');
    showSuccess('Task added successfully!');
  };

  const handleToggleTodo = (id) => {
    dispatch({ type: TODO_ACTIONS.TOGGLE, payload: id });
  };

  const handleDeleteTodo = (id) => {
    dispatch({ type: TODO_ACTIONS.DELETE, payload: id });
    showSuccess('Task deleted');
  };

  const handleStartEdit = (todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const handleUpdateTodo = (id) => {
    if (!editText.trim()) {
      showError('Task cannot be empty');
      return;
    }

    dispatch({
      type: TODO_ACTIONS.UPDATE,
      payload: { id, updates: { text: editText.trim() } }
    });
    setEditingId(null);
    setEditText('');
    showSuccess('Task updated');
  };

  const handleClearCompleted = () => {
    dispatch({ type: TODO_ACTIONS.CLEAR_COMPLETED });
    showSuccess('Completed tasks cleared');
  };

  // Filter todos
  const filteredTodos = state.todos.filter(todo => {
    if (state.filter === 'active') return !todo.completed;
    if (state.filter === 'completed') return todo.completed;
    return true;
  });

  const stats = {
    total: state.todos.length,
    active: state.todos.filter(t => !t.completed).length,
    completed: state.todos.filter(t => t.completed).length
  };

  return (
    <div className="todo-app">
      <Navbar />
      
      <main className="todo-main">
        <div className="todo-container">
          <div className="todo-header">
            <h1>📝 My Tasks</h1>
            <p>Manage your daily tasks efficiently</p>
          </div>

          <div className="todo-stats">
            <div className="stat-badge">
              <span className="stat-value">{stats.total}</span>
              <span className="stat-label">Total</span>
            </div>
            <div className="stat-badge">
              <span className="stat-value">{stats.active}</span>
              <span className="stat-label">Active</span>
            </div>
            <div className="stat-badge">
              <span className="stat-value">{stats.completed}</span>
              <span className="stat-label">Completed</span>
            </div>
          </div>

          <form onSubmit={handleAddTodo} className="todo-form">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="What needs to be done?"
              className="todo-input"
            />
            <button type="submit" className="btn btn-primary">
              Add Task
            </button>
          </form>

          <div className="todo-filters">
            <button
              className={`filter-btn ${state.filter === 'all' ? 'active' : ''}`}
              onClick={() => dispatch({ type: TODO_ACTIONS.SET_FILTER, payload: 'all' })}
            >
              All
            </button>
            <button
              className={`filter-btn ${state.filter === 'active' ? 'active' : ''}`}
              onClick={() => dispatch({ type: TODO_ACTIONS.SET_FILTER, payload: 'active' })}
            >
              Active
            </button>
            <button
              className={`filter-btn ${state.filter === 'completed' ? 'active' : ''}`}
              onClick={() => dispatch({ type: TODO_ACTIONS.SET_FILTER, payload: 'completed' })}
            >
              Completed
            </button>
            {stats.completed > 0 && (
              <button
                className="filter-btn clear-btn"
                onClick={handleClearCompleted}
              >
                Clear Completed
              </button>
            )}
          </div>

          <div className="todo-list">
            {filteredTodos.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">📋</span>
                <p>No tasks found</p>
                <p className="empty-subtitle">
                  {state.filter === 'active' && 'All tasks are completed!'}
                  {state.filter === 'completed' && 'No completed tasks yet'}
                  {state.filter === 'all' && 'Add your first task above'}
                </p>
              </div>
            ) : (
              filteredTodos.map(todo => (
                <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                  <div className="todo-item-content">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => handleToggleTodo(todo.id)}
                      className="todo-checkbox"
                    />
                    
                    {editingId === todo.id ? (
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onBlur={() => handleUpdateTodo(todo.id)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') handleUpdateTodo(todo.id);
                          if (e.key === 'Escape') setEditingId(null);
                        }}
                        className="todo-edit-input"
                        autoFocus
                      />
                    ) : (
                      <span 
                        className="todo-text"
                        onDoubleClick={() => handleStartEdit(todo)}
                      >
                        {todo.text}
                      </span>
                    )}
                  </div>

                  <div className="todo-item-actions">
                    {editingId !== todo.id && (
                      <>
                        <button
                          onClick={() => handleStartEdit(todo)}
                          className="btn-icon"
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteTodo(todo.id)}
                          className="btn-icon btn-delete"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
