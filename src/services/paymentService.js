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

export const createPaymentLink = async (optionData, _id) => {
  try {
    const response = await api.post('/payment/createPaymentLink', {optionData, _id});
    return response.data;
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      throw new Error(error.response.data.message || 'Failed to create Payment Link');
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('No response from server. Please check your connection.');
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error('Error setting up the request');
    }
  }
}