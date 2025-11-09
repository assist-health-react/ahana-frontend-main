import api from './api';

// Export the service object as a named export
export const nursesService = {
  getNurses: async (params = {}) => {
    const { page = 1, limit = 10, search } = params;
    
    const queryParams = new URLSearchParams();
    queryParams.append('page', page);
    queryParams.append('limit', limit);
    
    if (search) queryParams.append('search', search);
    
    return api.get(`/api/v1/nurses?${queryParams.toString()}`);
  },

  getNurseById: async (id) => {
    return api.get(`/api/v1/nurses/${id}`);
  },

  createNurse: async (data) => {
    try {
      console.log('Creating nurse with data:', data);
      
      // Format the request data according to the API requirements
      const requestData = {
        name: data.name,
        email: data.email?.toLowerCase(),
        phone: data.phone,
        dob: new Date(data.dob).toISOString(), // Ensure proper date format
        gender: data.gender?.toLowerCase(),
        profilePic: data.profilePic,
        schoolId: data.schoolId,
        languagesSpoken: Array.isArray(data.languagesSpoken) ? data.languagesSpoken : [],
        introduction: data.introduction?.trim()
      };

      console.log('Formatted request data:', requestData);
      const response = await api.post('/api/v1/nurses', requestData);
      console.log('Create nurse response:', response);

      // Check if we have a valid response
      if (response && response.data) {
        return {
          status: 'success',
          data: response.data.data,
          message: 'Nurse created successfully'
        };
      }

      // If no valid response, throw an error
      throw new Error('Invalid response from server');
    } catch (error) {
      console.error('Error in createNurse:', {
        message: error.message,
        response: error.response?.data
      });
      
      // Handle specific error cases
      if (error.response?.status === 400) {
        throw {
          message: error.response.data.message || 'Invalid nurse data',
          type: 'validation'
        };
      } else if (error.response?.status === 401) {
        throw {
          message: 'Unauthorized. Please log in again.',
          type: 'auth'
        };
      } else if (error.response?.status === 403) {
        throw {
          message: 'You do not have permission to create nurses.',
          type: 'permission'
        };
      }
      
      // For other errors, throw a standardized error structure
      throw {
        message: error.message || 'Failed to create nurse',
        type: 'unknown'
      };
    }
  },

  updateNurse: async (id, data) => {
    try {
      console.log('Updating nurse with ID:', id, 'Data:', data);
      
      // Format the request data for update
      const requestData = {
        name: data.name,
        phone: data.phone,
        dob: new Date(data.dob).toISOString(),
        gender: data.gender?.toLowerCase(),
        profilePic: data.profilePic,
        languagesSpoken: Array.isArray(data.languagesSpoken) ? data.languagesSpoken : [],
        introduction: data.introduction?.trim()
      };

      console.log('Formatted request data:', requestData);

      const response = await api.put(`/api/v1/nurses/${id}`, requestData);
      console.log('Update nurse response:', response);

      if (response?.status === 'success') {
        return response;
      }

      throw new Error(response?.message || 'Failed to update nurse');
    } catch (error) {
      console.error('Error in updateNurse:', error);
      throw error.response?.data || error;
    }
  },

  deleteNurse: async (id) => {
    return api.delete(`/api/v1/nurses/${id}`);
  },

  getAllNurses: async () => {
    try {
      const response = await api.get('/api/v1/nurses');
      console.log('Raw nurses response:', response);
      
      // If response is in { status, data } format
      if (response?.data?.status === 'success' && response?.data?.data) {
        return response.data.data;
      }
      
      // If response itself is the data
      if (Array.isArray(response.data)) {
        return response.data;
      }
      
      // If response.data is the array directly
      if (Array.isArray(response?.data?.data)) {
        return response.data.data;
      }
      
      console.error('Unexpected nurses response format:', response);
      return [];
    } catch (error) {
      console.error('Error fetching nurses:', error);
      return [];
    }
  },

  getNurseByUserId: async (userId) => {
    try {
      console.log('Fetching nurse details for userId:', userId);
      const response = await api.get(`/api/v1/nurses/${userId}`);
      console.log('Nurse API Response:', response);
      
      if (response?.status === 'success' && response?.data) {
        return response;
      }
      throw new Error('Failed to fetch nurse details');
    } catch (error) {
      console.error('Error in getNurseByUserId:', error);
      throw error;
    }
  }
}; 