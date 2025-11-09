import api from './api';

export const getAllInfirmaryRecords = async (params = {}) => {
  try {
    // If params is a string (query string), convert it to an object
    const queryParams = typeof params === 'string' 
      ? Object.fromEntries(new URLSearchParams(params.startsWith('?') ? params.substring(1) : params))
      : params;

    const response = await api.get('/api/v1/infirmary', { 
      params: {
        ...queryParams,
        studentId: queryParams.studentId || undefined,
        schoolId: queryParams.schoolId || undefined,
        search: queryParams.search || undefined,
        page: queryParams.page || 1,
        limit: queryParams.limit || 10,
        sortBy: queryParams.sortBy || 'createdAt',
        sortOrder: queryParams.sortOrder || 'desc'
      }
    });
    return response;
  } catch (error) {
    console.error('Error fetching infirmary records:', error);
    throw error;
  }
};

export const getInfirmaryRecordById = async (id) => {
  try {
    const response = await api.get(`/api/v1/infirmary/${id}`);
    return response;
  } catch (error) {
    console.error('Error fetching infirmary record:', error);
    throw error;
  }
};

export const createInfirmaryRecord = async (data) => {
  try {
    // Validate required fields
    const requiredFields = ['studentId', 'schoolId', 'nurseId', 'date', 'time', 'consentFrom'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Format the data
    const formattedData = {
      ...data,
      date: new Date(data.date).toISOString().split('T')[0],
      time: data.time,
      medicineProvided: data.medicineProvided ? {
        inventoryId: data.medicineProvided.inventoryId,
        quantity: parseInt(data.medicineProvided.quantity, 10)
      } : undefined
    };

    console.log('Sending formatted data to API:', formattedData);
    const response = await api.post('/api/v1/infirmary', formattedData);
    return response;
  } catch (error) {
    console.error('Error creating infirmary record:', error);
    throw error;
  }
};

export const updateInfirmaryRecord = async (id, data) => {
  try {
    // Format the data
    const formattedData = {
      ...data,
      date: data.date ? new Date(data.date).toISOString().split('T')[0] : undefined,
      medicineProvided: data.medicineProvided ? {
        inventoryId: data.medicineProvided.inventoryId,
        quantity: parseInt(data.medicineProvided.quantity, 10)
      } : undefined
    };

    console.log('Updating record with formatted data:', formattedData);
    const response = await api.put(`/api/v1/infirmary/${id}`, formattedData);
    return response;
  } catch (error) {
    console.error('Error updating infirmary record:', error);
    throw error;
  }
};

export const deleteInfirmaryRecord = async (id) => {
  try {
    const response = await api.delete(`/api/v1/infirmary/${id}`);
    return response;
  } catch (error) {
    console.error('Error deleting infirmary record:', error);
    throw error;
  }
};

// Helper function to validate medicine quantity against inventory
export const validateMedicineQuantity = async (inventoryId, requestedQuantity) => {
  try {
    const response = await api.get(`/api/v1/inventory/${inventoryId}`);
    const currentStock = response.data?.current_stock || 0;
    
    if (requestedQuantity > currentStock) {
      throw new Error(`Insufficient stock. Available: ${currentStock}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error validating medicine quantity:', error);
    throw error;
  }
};

export const infirmaryService = {
  getAllInfirmaryRecords,
  getInfirmaryRecordById,
  createInfirmaryRecord,
  updateInfirmaryRecord,
  deleteInfirmaryRecord,
  validateMedicineQuantity
}; 