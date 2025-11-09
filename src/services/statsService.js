import api from './api';

export const getStats = async () => {
  try {
    const response = await api.get('/api/v1/nurses/stats');
    console.log('Stats API response:', response);
    
    // Since api.js already returns response.data, we can return it directly
    return response;
  } catch (error) {
    console.error('Error fetching stats:', error);
    throw error;
  }
}; 