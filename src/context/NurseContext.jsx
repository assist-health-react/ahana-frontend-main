import React, { createContext, useContext, useState, useEffect } from 'react';
import { nursesService } from '../services/nursesService';

const NurseContext = createContext();

export const useNurse = () => {
  const context = useContext(NurseContext);
  if (!context) {
    throw new Error('useNurse must be used within a NurseProvider');
  }
  return context;
};

export const NurseProvider = ({ children }) => {
  const [nurseDetails, setNurseDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false);

  const fetchNurseDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get user from localStorage
      const user = JSON.parse(localStorage.getItem('user'));
      const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
      
      if (!isAuthenticated || !user?.userId) {
        setNurseDetails(null);
        return;
      }

      const response = await nursesService.getNurseByUserId(user.userId);
      if (response.status === 'success' && response.data) {
        setNurseDetails(response.data);
      } else {
        throw new Error('Failed to fetch nurse details');
      }
    } catch (err) {
      console.error('Error fetching nurse details:', err);
      setError(err.message || 'Failed to fetch nurse details');
      setNurseDetails(null);
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  };

  // Initial fetch on mount and auth state changes
  useEffect(() => {
    const handleAuthChange = () => {
      const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
      if (isAuthenticated) {
        fetchNurseDetails();
      } else {
        setNurseDetails(null);
        setInitialized(true);
        setLoading(false);
      }
    };

    // Initial fetch
    handleAuthChange();

    // Listen for auth state changes
    window.addEventListener('storage', handleAuthChange);
    window.addEventListener('authStateChanged', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleAuthChange);
      window.removeEventListener('authStateChanged', handleAuthChange);
    };
  }, []);

  const value = {
    nurseDetails,
    loading,
    error,
    initialized,
    refreshNurseDetails: fetchNurseDetails
  };

  if (!initialized && loading) {
    return <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>;
  }

  return (
    <NurseContext.Provider value={value}>
      {children}
    </NurseContext.Provider>
  );
};

export default NurseContext; 