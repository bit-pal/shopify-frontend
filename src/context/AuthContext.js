import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

const BASE_URL = process.env.REACT_APP_BASE_URL;

// Add axios interceptor for token refresh
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await axios.post(`${BASE_URL}/auth/refresh-token`, {
          refreshToken
        });

        const { token } = response.data;
        localStorage.setItem('token', token);

        // Retry the original request with new token
        originalRequest.headers['Authorization'] = `Bearer ${token}`;
        return axios(originalRequest);
      } catch (refreshError) {
        // If refresh token fails, logout user
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (token && storedUser) {
        try {
          const response = await axios.get(`${BASE_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(response.data.user);
          localStorage.setItem('user', JSON.stringify(response.data.user));
        } catch (err) {
          // If token is invalid, clear everything
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (err) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await axios.post(`${BASE_URL}/auth/login`, { email, password });
      const { token, refreshToken, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      return user;
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during login');
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const response = await axios.post(`${BASE_URL}/auth/register`, userData);
      const { token, refreshToken, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
      console.log(user)
      const response1 = await axios.post(`${BASE_URL}/tebraUser/signup/${user.id}`);
      console.log(response1);
      setUser(user);
      return user;
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during registration');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  // Fetch all users (admin only)
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
      throw err;
    }
  };

  // Update user role
  const updateUser = async (userId, userData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(`${BASE_URL}/users/${userId}`, userData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user');
      throw err;
    }
  };

  // Delete user
  const deleteUser = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${BASE_URL}/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user');
      throw err;
    }
  };

  // Reset user password
  const resetUserPassword = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${BASE_URL}/users/${userId}/reset-password`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
      throw err;
    }
  };

  const fetchUsersWithTebraData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Get users from your backend
      const response = await axios.get(`${BASE_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const users = response.data;
      
      // If mock flag is enabled, add Tebra data
      if (process.env.REACT_APP_USE_TEBRA_MOCK === 'true') {
        const usersWithTebra = await Promise.all(
          users.map(async (user) => {
            try {
              // Get Tebra data for each user
              const tebraResponse = await axios.get(`${BASE_URL}/tebra/users/${user._id}`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              
              return {
                ...user,
                tebraData: tebraResponse.data.tebraData
              };
            } catch (error) {
              // If user doesn't have Tebra data, just return user
              return {
                ...user,
                tebraData: null
              };
            }
          })
        );
        
        return usersWithTebra;
      }
      
      return users;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
      throw err;
    }
  };
  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error,
      login,
      register,
      logout,
      checkAuth,
      fetchUsers,
      updateUser,
      deleteUser,
      resetUserPassword,
      fetchUsersWithTebraData,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};