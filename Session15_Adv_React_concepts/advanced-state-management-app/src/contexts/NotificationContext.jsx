import { createContext, useContext, useReducer, useMemo, useCallback } from 'react';

const NotificationContext = createContext();

// Action types
const NOTIFICATION_ACTIONS = {
  ADD: 'add_notification',
  REMOVE: 'remove_notification',
  CLEAR_ALL: 'clear_all'
};

// Reducer
function notificationReducer(state, action) {
  switch (action.type) {
    case NOTIFICATION_ACTIONS.ADD:
      return [...state, action.payload];
    
    case NOTIFICATION_ACTIONS.REMOVE:
      return state.filter(notification => notification.id !== action.payload);
    
    case NOTIFICATION_ACTIONS.CLEAR_ALL:
      return [];
    
    default:
      return state;
  }
}

export function NotificationProvider({ children }) {
  const [notifications, dispatch] = useReducer(notificationReducer, []);

  const addNotification = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    const notification = { id, message, type };

    dispatch({ type: NOTIFICATION_ACTIONS.ADD, payload: notification });

    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      dispatch({ type: NOTIFICATION_ACTIONS.REMOVE, payload: id });
    }, 3000);

    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    dispatch({ type: NOTIFICATION_ACTIONS.REMOVE, payload: id });
  }, []);

  const clearAll = useCallback(() => {
    dispatch({ type: NOTIFICATION_ACTIONS.CLEAR_ALL });
  }, []);

  // Convenience methods
  const success = useCallback((message) => addNotification(message, 'success'), [addNotification]);
  const error = useCallback((message) => addNotification(message, 'error'), [addNotification]);
  const info = useCallback((message) => addNotification(message, 'info'), [addNotification]);
  const warning = useCallback((message) => addNotification(message, 'warning'), [addNotification]);

  const value = useMemo(() => ({
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    success,
    error,
    info,
    warning
  }), [notifications, addNotification, removeNotification, clearAll, success, error, info, warning]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
}

// Notification Container Component
function NotificationContainer() {
  const { notifications, removeNotification } = useNotification();

  return (
    <div className="notification-container">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`notification notification-${notification.type}`}
          onClick={() => removeNotification(notification.id)}
        >
          <span className="notification-icon">
            {notification.type === 'success' && '✓'}
            {notification.type === 'error' && '✕'}
            {notification.type === 'warning' && '⚠'}
            {notification.type === 'info' && 'ℹ'}
          </span>
          <span className="notification-message">{notification.message}</span>
        </div>
      ))}
    </div>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
}
