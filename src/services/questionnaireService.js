import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL;

// Create an Axios instance with default settings
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token from localStorage or cookies
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      if (error.response.status === 403) {
        // Handle unauthorized access
        console.error('Access forbidden. Please check your authentication.');
        // Optionally redirect to login page
        // window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Save questionnaire data
 */
export const saveQuestionnaire = async (questionnaire) => {
  try {
    const response = await api.post('/questionnaires', questionnaire);
    return response.data;
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      throw new Error(error.response.data.message || 'Failed to save questionnaire');
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('No response from server. Please check your connection.');
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error('Error setting up the request');
    }
  }
};

/**
 * Get a single user by ID
 */
// export const getUserById = async (id) => {
//   const response = await api.get(`/users/${id}`);
//   return response.data;
// };

/**
 * Create a new user
 */
// export const createUser = async (userData) => {
//   const response = await api.post('/users', userData);
//   return response.data;
// };

/**
 * Update an existing user
 */
// export const updateUser = async (id, userData) => {
//   const response = await api.put(`/users/${id}`, userData);
//   return response.data;
// };

/**
 * Delete a user
 */
// export const deleteUser = async (id) => {
//   const response = await api.delete(`/users/${id}`);
//   return response.data;
// };
