import { useState, useEffect } from 'react'
import { FaPlus, FaTimes, FaEye } from 'react-icons/fa'
import { useLocation } from 'react-router-dom'

const TabButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 font-medium text-sm rounded-lg transition-colors
      ${active 
        ? 'bg-blue-500 text-white' 
        : 'text-gray-600 hover:bg-gray-100'}`}
  >
    {children}
  </button>
)

const BasicSettings = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
    <div className="bg-white p-4 rounded-lg shadow-sm max-w-sm">
      <h3 className="text-base font-medium text-gray-800 mb-3">Profile Settings</h3>
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
          />
        </div>
      </div>
    </div>

    <div className="bg-white p-4 rounded-lg shadow-sm max-w-sm">
      <h3 className="text-base font-medium text-gray-800 mb-3">Notification Preferences</h3>
      <div className="space-y-2">
        <label className="flex items-center space-x-2">
          <input type="checkbox" className="w-4 h-4 text-blue-500 rounded" />
          <span className="text-sm text-gray-700">Email Notifications</span>
        </label>
        <label className="flex items-center space-x-2">
          <input type="checkbox" className="w-4 h-4 text-blue-500 rounded" />
          <span className="text-sm text-gray-700">SMS Notifications</span>
        </label>
      </div>
    </div>
  </div>
)

const SecondarySettings = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
    <div className="bg-white p-4 rounded-lg shadow-sm max-w-sm">
      <h3 className="text-base font-medium text-gray-800 mb-3">Appearance</h3>
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
          <select className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Light</option>
            <option>Dark</option>
            <option>System</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
          <select className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>English</option>
            <option>Hindi</option>
            <option>Tamil</option>
          </select>
        </div>
      </div>
    </div>

    <div className="bg-white p-4 rounded-lg shadow-sm max-w-sm">
      <h3 className="text-base font-medium text-gray-800 mb-3">Privacy</h3>
      <div className="space-y-2">
        <label className="flex items-center space-x-2">
          <input type="checkbox" className="w-4 h-4 text-blue-500 rounded" />
          <span className="text-sm text-gray-700">Show Online Status</span>
        </label>
        <label className="flex items-center space-x-2">
          <input type="checkbox" className="w-4 h-4 text-blue-500 rounded" />
          <span className="text-sm text-gray-700">Share Usage Data</span>
        </label>
      </div>
    </div>
  </div>
)

// Modal Component
const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
          <FaTimes className="text-gray-500" />
        </button>
      </div>
      {children}
    </div>
  </div>
)

// Confirmation Modal Component
const ConfirmationModal = ({ title, message, onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6">{message}</p>
      <div className="flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)

const Utilities = () => {
  // State for schools only
  const [schools, setSchools] = useState(['Delhi Public School', 'St. Mary School', 'Modern School'])

  // Modal states
  const [activeModal, setActiveModal] = useState(null)
  const [newItem, setNewItem] = useState('')

  // Add new states for confirmation modal
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [itemToRemove, setItemToRemove] = useState(null)

  const handleAdd = (type) => {
    if (newItem.trim()) {
      setSchools([...schools, newItem.trim()])
      setNewItem('')
    }
  }

  const handleRemoveClick = (item) => {
    setItemToRemove(item)
    setShowConfirmation(true)
  }

  const handleConfirmRemove = () => {
    if (itemToRemove) {
      setSchools(schools.filter(s => s !== itemToRemove))
    }
    setShowConfirmation(false)
    setItemToRemove(null)
  }

  const handleCancelRemove = () => {
    setShowConfirmation(false)
    setItemToRemove(null)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {/* School Card */}
      <div className="bg-white p-4 rounded-lg shadow-sm max-w-sm">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-base font-medium text-gray-800">School</h3>
            <p className="text-sm text-gray-500">{schools.length} schools</p>
          </div>
          <button
            onClick={() => setActiveModal('viewSchools')}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
          >
            <FaEye />
          </button>
        </div>
      </div>

      {/* View Schools Modal */}
      {activeModal === 'viewSchools' && (
        <Modal title="All Schools" onClose={() => setActiveModal(null)}>
          <div className="space-y-4">
            <div className="flex justify-end">
              <button
                onClick={() => setActiveModal('addSchool')}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
              >
                <FaPlus size={14} />
                Add School
              </button>
            </div>
            <div className="space-y-2">
              {schools.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                  <span>{item}</span>
                  <button
                    onClick={() => handleRemoveClick(item)}
                    className="text-red-500 hover:bg-red-50 p-1 rounded"
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}

      {/* Confirmation Modal */}
      {showConfirmation && (
        <ConfirmationModal
          title="Confirm Delete"
          message={`Are you sure you want to delete "${itemToRemove}"?`}
          onConfirm={handleConfirmRemove}
          onCancel={handleCancelRemove}
        />
      )}

      {/* Add School Modal */}
      {activeModal === 'addSchool' && (
        <Modal title="Add School" onClose={() => setActiveModal(null)}>
          <div className="space-y-4">
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter school name"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleAdd('school')
                  setActiveModal(null)
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Add
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

const Settings = () => {
  const [activeTab, setActiveTab] = useState('basic')
  const location = useLocation()

  useEffect(() => {
    // Check if we're coming from the profile menu
    if (location.state?.from === 'profile') {
      setActiveTab('secondary')
    }
  }, [location])

  const tabs = [
    { id: 'basic', label: 'Basic Settings' },
    { id: 'secondary', label: 'Secondary Settings' },
    { id: 'utilities', label: 'Utilities' }
  ]

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Settings</h2>
      </div>

      {/* Tab Navigation */}
      <div className="bg-gray-50 p-1 rounded-lg inline-flex gap-2">
        {tabs.map(tab => (
          <TabButton
            key={tab.id}
            active={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </TabButton>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {activeTab === 'basic' && <BasicSettings />}
        {activeTab === 'secondary' && <SecondarySettings />}
        {activeTab === 'utilities' && <Utilities />}
      </div>
    </div>
  )
}

export default Settings 