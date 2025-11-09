import React, { useState } from 'react'
import { FaEye } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const Utilities = () => {
  const navigate = useNavigate()
  const [error, setError] = useState(null)

  const handleSchoolClick = () => {
    navigate('school')
  }

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
          <button
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => setError(null)}
          >
            <span className="sr-only">Dismiss</span>
            <span className="text-xl">&times;</span>
          </button>
        </div>
      )}

      {/* Schools Card */}
      <div className="bg-white p-4 rounded-lg shadow-sm max-w-sm">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-base font-medium text-gray-800">Schools</h3>
            <p className="text-sm text-gray-500">Manage school information</p>
          </div>
          <button
            onClick={handleSchoolClick}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
            title="View Schools"
          >
            <FaEye />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Utilities 