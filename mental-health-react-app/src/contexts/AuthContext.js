import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // API base URL
  const API_BASE_URL = 'http://localhost:5000';

  // Check if user is already logged in on app start
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      verifyToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async (token) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/verify`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setCurrentUser(response.data.user);
        localStorage.setItem('token', token);
      } else {
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (userData) => {
    try {
      setError('');
      const response = await axios.post(`${API_BASE_URL}/auth/signup`, userData);
      
      if (response.data.success) {
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        setCurrentUser(user);
        return { success: true, user };
      } else {
        throw new Error(response.data.error || 'Sign up failed');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Sign up failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const signIn = async (email, password) => {
    try {
      setError('');
      console.log('🔍 AuthContext: Starting sign in process...');
      console.log('🔍 AuthContext: API URL:', `${API_BASE_URL}/auth/signin`);
      
      const response = await axios.post(`${API_BASE_URL}/auth/signin`, {
        email,
        password
      });
      
      console.log('🔍 AuthContext: Response received:', response.data);
      
      if (response.data.success) {
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        setCurrentUser(user);
        console.log('✅ AuthContext: Sign in successful, user set:', user.username);
        return { success: true, user };
      } else {
        throw new Error(response.data.error || 'Sign in failed');
      }
    } catch (error) {
      console.error('❌ AuthContext: Sign in error:', error);
      console.error('❌ AuthContext: Error response:', error.response?.data);
      console.error('❌ AuthContext: Error status:', error.response?.status);
      const errorMessage = error.response?.data?.error || error.message || 'Sign in failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await axios.post(`${API_BASE_URL}/auth/logout`, {}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      setCurrentUser(null);
      setError('');
    }
  };

  const clearError = () => {
    setError('');
  };

  const value = {
    currentUser,
    signUp,
    signIn,
    logout,
    error,
    clearError,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 