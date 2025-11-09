import api from './api';

export const membersService = {
  getMembers: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.search) queryParams.append('search', params.search);
      if (params.schoolId) queryParams.append('schoolId', params.schoolId);
      if (params.isStudent) queryParams.append('isStudent', params.isStudent);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
      if (params.grade) queryParams.append('grade', params.grade);
      if (params.section) queryParams.append('section', params.section);

      console.log('Query params being sent:', Object.fromEntries(queryParams.entries()));
      
      const response = await api.get(`/api/v1/members?${queryParams}`);
      console.log('Members service response:', response);

      // Ensure we have the expected response structure
      if (!response || !response.status || response.status !== 'success') {
        throw new Error('Invalid response format from API');
      }

      return response;
    } catch (error) {
      console.error('Error fetching members:', error);
      throw error;
    }
  },

  getMemberById: async (id) => {
    try {
      const response = await api.get(`/api/v1/members/${id}`);
      console.log('Get member by ID response:', response);

      // Ensure we have the expected response structure
      if (!response || !response.status || response.status !== 'success') {
        throw new Error('Invalid response format from API');
      }

      return response;
    } catch (error) {
      console.error('Error fetching member by ID:', error);
      throw error;
    }
  },

  createMember: async (memberData) => {
    try {
      const response = await api.post('/api/v1/members', memberData);
      console.log('Create member response:', response);

      // Ensure we have the expected response structure
      if (!response || !response.status || response.status !== 'success') {
        throw new Error('Invalid response format from API');
      }

      return response;
    } catch (error) {
      console.error('Error creating member:', error);
      // If it's an API error with a specific message (like member already exists)
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  updateMember: async (id, memberData) => {
    try {
      console.log('Updating member with ID:', id);
      console.log('Update data:', memberData);

      const response = await api.put(`/api/v1/members/${id}`, memberData);
      console.log('Update member response:', response);

      // Ensure we have the expected response structure
      if (!response || !response.status || response.status !== 'success') {
        throw new Error('Invalid response format from API');
      }

      return response;
    } catch (error) {
      console.error('Error updating member:', error);
      // If it's an API error with a specific message
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }
};

export default membersService; 