import api from './api';

export const uploadMedia = async (file) => {
  try {
    // Create FormData object to send file
    const formData = new FormData();
    formData.append('file', file);

    // Make API call to upload media
    const response = await api.post('/api/v1/media/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Upload API response:', response);

    // Handle different response formats
    if (response.success && response.imageUrl) {
      return {
        success: true,
        imageUrl: response.imageUrl,
        metadata: response.metadata
      };
    }

    if (response.data?.imageUrl) {
      return {
        success: true,
        imageUrl: response.data.imageUrl,
        metadata: response.data.metadata
      };
    }

    if (response.data?.url) {
      return {
        success: true,
        imageUrl: response.data.url,
        metadata: response.data.metadata
      };
    }

    if (typeof response === 'string' && response.startsWith('http')) {
      return {
        success: true,
        imageUrl: response
      };
    }

    throw new Error('Invalid response format from upload service');
  } catch (error) {
    console.error('Error uploading media:', error);
    if (error.message === 'Network Error') {
      throw new Error('Network error occurred while uploading. Please check your connection.');
    }
    if (error.response?.status === 413) {
      throw new Error('File size too large. Please upload a smaller file.');
    }
    if (error.response?.status === 415) {
      throw new Error('Invalid file type. Please upload a valid image file.');
    }
    throw new Error(error.message || 'Failed to upload file. Please try again.');
  }
};

export default {
  uploadMedia
}; 