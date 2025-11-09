import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ProfileMenu = () => {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  const handleNavigation = (path, state = {}) => {
    navigate(path, { state })
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg"
      >
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
          PS
        </div>
        <span className="hidden laptop:block">Priya Sharma</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
          <button 
            onClick={() => handleNavigation('/settings', { from: 'profile' })} 
            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Profile
          </button>
          <button 
            onClick={() => handleNavigation('/settings', { from: 'profile' })} 
            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Settings
          </button>
          <hr className="my-1" />
          <button 
            onClick={() => console.log('Logout')} 
            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  )
}

export default ProfileMenu 