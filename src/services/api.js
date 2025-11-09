import axios from 'axios';

const BASE_URL = 'https://api.assisthealth.cloud';

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response.data; // Return only the data part of the response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data but don't redirect (let components handle it)
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
    }
    
    // Format error message
    const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
    return Promise.reject({ message: errorMessage });
  }
);

export default api; 