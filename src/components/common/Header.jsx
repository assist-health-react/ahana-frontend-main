import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileMenu from './ProfileMenu';
import { useNurse } from '../../context/NurseContext';
import { logout } from '../../services/authService';

const Header = () => {
  const { nurseDetails } = useNurse();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-gray-800">
          Welcome, {nurseDetails?.name || 'Nurse'}
          {nurseDetails?.nurseId && (
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({nurseDetails.nurseId})
            </span>
          )}
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <ProfileMenu 
          onLogout={handleLogout} 
          userName={nurseDetails?.name} 
          profilePic={nurseDetails?.profilePic}
          nurseId={nurseDetails?.nurseId}
        />
      </div>
    </header>
  );
};

export default Header; 