import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { userService } from '@/services/api/userService';

const AuthContext = createContext(null);

// Auth reducer for state management
const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload, isAuthenticated: !!action.payload, loading: false };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'LOGOUT':
      return { user: null, isAuthenticated: false, loading: false, error: null };
    case 'UPDATE_PROFILE':
      return {
        ...state,
        user: {
          ...state.user,
          profile: { ...state.user.profile, ...action.payload }
        }
      };
    case 'UPDATE_NUTRITION_GOALS':
      return {
        ...state,
        user: {
          ...state.user,
          nutritionGoals: action.payload
        }
      };
    default:
      return state;
  }
};

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing session on mount
  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        const savedUser = localStorage.getItem('nutriflow_user');
        if (savedUser) {
          const user = JSON.parse(savedUser);
          dispatch({ type: 'SET_USER', payload: user });
        }
      } catch (error) {
        console.error('Error checking existing session:', error);
        localStorage.removeItem('nutriflow_user');
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    checkExistingSession();
  }, []);

  const register = async (email, password) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });
      
      const user = await userService.register(email, password);
      localStorage.setItem('nutriflow_user', JSON.stringify(user));
      dispatch({ type: 'SET_USER', payload: user });
      
      return user;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });
      
      const user = await userService.login(email, password);
      localStorage.setItem('nutriflow_user', JSON.stringify(user));
      dispatch({ type: 'SET_USER', payload: user });
      
      return user;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await userService.logout();
      localStorage.removeItem('nutriflow_user');
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local state even if service call fails
      localStorage.removeItem('nutriflow_user');
      dispatch({ type: 'LOGOUT' });
    }
  };

  const updateProfile = async (profileData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });
      
      const updatedUser = await userService.updateProfile(state.user.id, profileData);
      localStorage.setItem('nutriflow_user', JSON.stringify(updatedUser));
      dispatch({ type: 'UPDATE_PROFILE', payload: profileData });
      
      return updatedUser;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateNutritionGoals = async (goalsData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });
      
      const updatedUser = await userService.updateNutritionGoals(state.user.id, goalsData);
      localStorage.setItem('nutriflow_user', JSON.stringify(updatedUser));
      dispatch({ type: 'UPDATE_NUTRITION_GOALS', payload: goalsData });
      
      return updatedUser;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    ...state,
    register,
    login,
    logout,
    updateProfile,
    updateNutritionGoals,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };