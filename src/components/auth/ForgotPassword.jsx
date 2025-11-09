import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { resetPassword, login, requestTempPassword } from '../../services/authService';

const ConfirmationDialog = ({ isOpen, onConfirm, onCancel, email }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Password Reset</h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to send a temporary password to <span className="font-medium">{email}</span>?
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Send Password
          </button>
        </div>
      </div>
    </div>
  );
};

const ForgotPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isFromLogin = location.state?.fromLogin;
  const emailFromLogin = location.state?.email;
  const isFirstLogin = location.state?.isFirstLogin;
  const passwordResetRequired = location.state?.passwordResetRequired;
  const tokenFromLogin = location.state?.token;

  console.log('ForgotPassword: Initial state from location:', {
    isFromLogin,
    emailFromLogin,
    isFirstLogin,
    passwordResetRequired,
    hasToken: !!tokenFromLogin
  });

  // If coming from login with either flag true, start at password reset step
  const initialStep = (isFromLogin && (isFirstLogin || passwordResetRequired)) ? 3 : 1;
  console.log('ForgotPassword: Setting initial step to:', initialStep);
  
  const [step, setStep] = useState(initialStep);
  const [email, setEmail] = useState(emailFromLogin || '');
  const [tempPassword, setTempPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showTempPassword, setShowTempPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [accessToken, setAccessToken] = useState(tokenFromLogin || '');

  // Add state to track if we're in temp password verification flow
  const [isInTempPasswordFlow, setIsInTempPasswordFlow] = useState(false);

  // Store token from login if available
  useEffect(() => {
    if (tokenFromLogin) {
      console.log('ForgotPassword: Received token from login, storing it');
      localStorage.setItem('temp_access_token', tokenFromLogin);
      setAccessToken(tokenFromLogin);
    }
  }, [tokenFromLogin]);

  useEffect(() => {
    // Set temporary authentication state for password reset flow
    if (step === 2) {
      setIsInTempPasswordFlow(true);
      localStorage.setItem('tempAuthFlow', 'true');
    }
    return () => {
      // Clean up temp auth state when component unmounts
      localStorage.removeItem('tempAuthFlow');
    };
  }, [step]);

  // Auto-trigger temp password request if coming from login with required password reset
  useEffect(() => {
    console.log('ForgotPassword: useEffect triggered with:', {
      isFromLogin,
      emailFromLogin,
      step,
      shouldRequestTemp: isFromLogin && emailFromLogin && step === 1
    });
    
    if (isFromLogin && emailFromLogin && step === 1) {
      console.log('ForgotPassword: Auto-triggering temp password request');
      handleRequestTempPassword(new Event('submit'));
    }
  }, [isFromLogin, emailFromLogin]);

  const handleRequestTempPassword = async (e) => {
    e.preventDefault();
    console.log('ForgotPassword: Requesting temp password for email:', email);
    if (!email) {
      setError('Email is required');
      return;
    }
    setShowConfirmDialog(true);
  };

  const handleConfirmSendPassword = async () => {
    setShowConfirmDialog(false);
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      console.log('ForgotPassword: Sending temp password request');
      const response = await requestTempPassword(email);
      console.log('ForgotPassword: Temp password response:', response);
      if (response.status === 'success') {
        setSuccessMessage(response.message || 'Temporary password has been sent to your email');
        setStep(2);
        console.log('ForgotPassword: Moving to step 2 (verify temp password)');
      }
    } catch (err) {
      console.error('ForgotPassword: Error requesting temp password:', err);
      setError(err.message || 'Failed to send temporary password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyTempPassword = async (e) => {
    e.preventDefault();
    console.log('ForgotPassword: Verifying temp password');
    setIsLoading(true);
    setError('');

    try {
      // Use login API to verify temporary password
      const loginResponse = await login({ 
        email, 
        password: tempPassword
      });

      if (loginResponse.status === 'success') {
        // Store the access token for password reset
        const token = loginResponse.data.tokens.accessToken;
        setAccessToken(token);
        localStorage.setItem('temp_access_token', token);
        
        // Move to password reset step
        setStep(3);
        setSuccessMessage('Temporary password verified successfully. Please set your new password.');
      }
    } catch (err) {
      console.error('ForgotPassword: Error verifying temp password:', err);
      setError(err.message || 'Invalid temporary password');
      // Clear any stored tokens on error
      setAccessToken('');
      localStorage.removeItem('temp_access_token');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!newPassword || !confirmPassword) {
      setError('All fields are required');
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      // First try to get token from state (for users coming directly from login)
      let token = accessToken;
      
      // If no token in state, try getting from localStorage (for users going through temp password flow)
      if (!token) {
        token = localStorage.getItem('temp_access_token');
      }
      
      console.log('ForgotPassword: Resetting password with token:', !!token); // Log if we have a token without exposing it
      
      if (!token) {
        throw new Error('No authentication token found. Please try again.');
      }

      // Call reset password API with the token
      const response = await resetPassword(newPassword, token);
      
      if (response.status === 'success') {
        // Clear temporary token
        localStorage.removeItem('temp_access_token');
        setAccessToken('');
        
        setSuccessMessage('Password reset successful! Please login with your new password.');
        
        // Wait for 2 seconds to show the success message before redirecting
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      console.error('ForgotPassword: Error resetting password:', err);
      setError(err.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  // Cleanup effect
  useEffect(() => {
    return () => {
      // Clean up temporary token on component unmount
      localStorage.removeItem('temp_access_token');
    };
  }, []);

  const renderEmailStep = () => (
    <form onSubmit={handleRequestTempPassword} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email Address
        </label>
        <div className="mt-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaEnvelope className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your email"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#38B6FF] hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
      >
        {isLoading ? 'Sending...' : 'Send Temporary Password'}
      </button>
    </form>
  );

  const renderVerifyStep = () => (
    <form onSubmit={handleVerifyTempPassword} className="space-y-6">
      <div>
        <label htmlFor="tempPassword" className="block text-sm font-medium text-gray-700">
          Temporary Password
        </label>
        <div className="mt-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaLock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="tempPassword"
            name="tempPassword"
            type={showTempPassword ? "text" : "password"}
            required
            value={tempPassword}
            onChange={(e) => setTempPassword(e.target.value)}
            className="appearance-none block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter temporary password"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowTempPassword(!showTempPassword)}
          >
            {showTempPassword ? (
              <FaEyeSlash className="h-5 w-5 text-gray-400" />
            ) : (
              <FaEye className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Enter the temporary password sent to {email}
        </p>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#38B6FF] hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
      >
        {isLoading ? 'Verifying...' : 'Verify Password'}
      </button>
    </form>
  );

  const renderResetPasswordStep = () => (
    <form onSubmit={handleResetPassword} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
            New Password
          </label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaLock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="newPassword"
              name="newPassword"
              type={showNewPassword ? "text" : "password"}
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="appearance-none block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter new password"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? (
                <FaEyeSlash className="h-5 w-5 text-gray-400" />
              ) : (
                <FaEye className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaLock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="appearance-none block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Confirm new password"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <FaEyeSlash className="h-5 w-5 text-gray-400" />
              ) : (
                <FaEye className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#38B6FF] hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
      >
        {isLoading ? 'Resetting Password...' : 'Reset Password'}
      </button>
    </form>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <div className="flex justify-center">
            <img 
              src="/assets/assist-health-logo.png" 
              alt="AssistHealth" 
              className="h-16 w-16 object-contain"
            />
          </div>
          <h2 className="mt-4 text-3xl font-bold text-gray-900">
            <span className="text-gray-800">Reset</span>
            <span className="text-[#38B6FF]"> Password</span>
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isFromLogin ? 'Please set your new password' :
             step === 1 ? 'Enter your email to receive a temporary password' :
             step === 2 ? 'Enter the temporary password sent to your email' :
             'Create your new password'}
          </p>
        </div>

        {error && (
          <div className="text-red-500 text-sm text-center">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-50 text-green-800 p-4 rounded-lg text-center mb-4">
            <p className="text-sm font-medium">{successMessage}</p>
          </div>
        )}

        {isFromLogin ? renderResetPasswordStep() :
         step === 1 ? renderEmailStep() :
         step === 2 ? renderVerifyStep() :
         renderResetPasswordStep()}

        <div className="text-center">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-sm text-[#38B6FF] hover:text-blue-500"
          >
            Back to Login
          </button>
        </div>
      </div>

      <ConfirmationDialog
        isOpen={showConfirmDialog}
        onConfirm={handleConfirmSendPassword}
        onCancel={() => setShowConfirmDialog(false)}
        email={email}
      />
    </div>
  );
};

export default ForgotPassword; 