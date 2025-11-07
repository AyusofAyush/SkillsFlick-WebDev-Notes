import { createContext, useContext, useReducer, useEffect, useMemo } from 'react';

const AuthContext = createContext();

// Action types
const AUTH_ACTIONS = {
  LOGIN_START: 'login_start',
  LOGIN_SUCCESS: 'login_success',
  LOGIN_ERROR: 'login_error',
  LOGOUT: 'logout',
  UPDATE_USER: 'update_user',
  LOAD_USER: 'load_user'
};

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null
};

// Reducer function
function authReducer(state, action) {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
      return {
        ...state,
        loading: true,
        error: null
      };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null
      };

    case AUTH_ACTIONS.LOGIN_ERROR:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null
      };

    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };

    case AUTH_ACTIONS.LOAD_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        loading: false
      };

    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      try {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          dispatch({ type: AUTH_ACTIONS.LOAD_USER, payload: JSON.parse(savedUser) });
        } else {
          dispatch({ type: AUTH_ACTIONS.LOAD_USER, payload: null });
        }
      } catch (error) {
        console.error('Error loading user:', error);
        dispatch({ type: AUTH_ACTIONS.LOAD_USER, payload: null });
      }
    };

    loadUser();
  }, []);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (state.user) {
      localStorage.setItem('user', JSON.stringify(state.user));
    } else {
      localStorage.removeItem('user');
    }
  }, [state.user]);

  const login = async (email, password) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock validation
      if (email && password.length >= 6) {
        const user = {
          id: Date.now(),
          name: email.split('@')[0],
          email: email,
          avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=6366f1&color=fff`,
          joinedDate: new Date().toISOString(),
          role: 'user'
        };

        dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: user });
        return { success: true };
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      dispatch({ type: AUTH_ACTIONS.LOGIN_ERROR, payload: error.message });
      return { success: false, error: error.message };
    }
  };

  const register = async (name, email, password) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (name && email && password.length >= 6) {
        const user = {
          id: Date.now(),
          name: name,
          email: email,
          avatar: `https://ui-avatars.com/api/?name=${name}&background=6366f1&color=fff`,
          joinedDate: new Date().toISOString(),
          role: 'user'
        };

        dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: user });
        return { success: true };
      } else {
        throw new Error('Invalid registration data');
      }
    } catch (error) {
      dispatch({ type: AUTH_ACTIONS.LOGIN_ERROR, payload: error.message });
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  };

  const updateUser = (updates) => {
    dispatch({ type: AUTH_ACTIONS.UPDATE_USER, payload: updates });
  };

  // Memoize value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    ...state,
    login,
    register,
    logout,
    updateUser
  }), [state]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
