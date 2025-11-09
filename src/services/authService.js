import api from './api';

// Custom event for auth state changes
const AUTH_STATE_CHANGED = 'authStateChanged';
const dispatchAuthStateChange = () => {
  window.dispatchEvent(new Event('storage')); // Trigger storage event for context updates
  window.dispatchEvent(new Event(AUTH_STATE_CHANGED));
};

export const requestTempPassword = async (email) => {
  try {
    const response = await api.post('/api/v1/auth/forgot-password', { email });
    return response;
  } catch (error) {
    throw error;
  }
};

export const login = async (credentials) => {
  try {
    const response = await api.post('/api/v1/auth/login', credentials);
    
    if (response.status === 'success') {
      const { user, tokens } = response.data;
      
      // Store tokens and user data
      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
      
      // Store complete user object including userId
      const userData = {
        id: user.id,
        userId: user.userId,
        email: user.email,
        phoneNumber: user.phoneNumber,
        userType: user.userType,
        isFirstLogin: user.isFirstLogin,
        passwordResetRequired: user.passwordResetRequired
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Set authentication status based on password reset requirement
      localStorage.setItem('isAuthenticated', 
        (!user.isFirstLogin && !user.passwordResetRequired).toString()
      );

      // Dispatch auth state change event
      dispatchAuthStateChange();
    }
    return response;
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (password, token) => {
  try {
    // Temporarily set the token for this request
    localStorage.setItem('accessToken', token);
    
    const response = await api.post('/api/v1/auth/reset-password', { password });
    
    if (response.status === 'success') {
      // After successful password reset, clear all auth data
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.setItem('isAuthenticated', 'false');
      
      // Dispatch auth state change event
      dispatchAuthStateChange();
    }
    
    return response;
  } catch (error) {
    // Clean up token even if there's an error
    localStorage.removeItem('accessToken');
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  localStorage.setItem('isAuthenticated', 'false');
  
  // Dispatch auth state change event
  dispatchAuthStateChange();
}; 