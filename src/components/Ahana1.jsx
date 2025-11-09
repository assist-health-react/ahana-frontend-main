import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { FaSearch, FaClipboardList, FaEdit, FaTrash, FaEye, FaFilter, FaTimes, FaUserCircle, FaUsers, FaChevronLeft, FaChevronRight, FaPlus, FaDownload, FaChevronDown, FaFileUpload, FaUser, FaEnvelope, FaPhone, FaCalendar, FaClock, FaMapMarkerAlt, FaEllipsisV } from 'react-icons/fa'
import { IoMdClose } from 'react-icons/io'

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

const FilterPopup = ({ isOpen, onClose, selectedClass, selectedSection, onClassChange, onSectionChange }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl m-4">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-medium text-gray-700">Filters</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <IoMdClose className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label htmlFor="class" className="block text-sm font-medium text-gray-700 mb-1">
                Class
              </label>
              <select
                id="class"
                value={selectedClass}
                onChange={(e) => onClassChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Classes</option>
                {['IX', 'X', 'XI', 'XII'].map(cls => (
                  <option key={cls} value={cls}>Class {cls}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="section" className="block text-sm font-medium text-gray-700 mb-1">
                Section
              </label>
              <select
                id="section"
                value={selectedSection}
                onChange={(e) => onSectionChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Sections</option>
                {['A', 'B', 'C'].map(section => (
                  <option key={section} value={section}>Section {section}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  )
}

const AddStudentForm = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    dob: '',
    email: '',
    contactNumber: '',
    alternateContactNumber: '',
    grade: '',
    section: '',
    schoolName: '',
    city: '',
    state: '',
    password: ''
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    // Add your form submission logic here
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Add New Student</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <FaTimes className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender *
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth *
              </label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Contact Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Number *
              </label>
              <input
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleInputChange}
                required
                pattern="[0-9]{10}"
                placeholder="10-digit mobile number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Alternate Contact Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alternate Contact Number
              </label>
              <input
                type="tel"
                name="alternateContactNumber"
                value={formData.alternateContactNumber}
                onChange={handleInputChange}
                pattern="[0-9]{10}"
                placeholder="10-digit mobile number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Grade/Class */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Grade/Class *
              </label>
              <select
                name="grade"
                value={formData.grade}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Grade</option>
                {['IX', 'X', 'XI', 'XII'].map(grade => (
                  <option key={grade} value={grade}>Class {grade}</option>
                ))}
              </select>
            </div>

            {/* Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Section *
              </label>
              <select
                name="section"
                value={formData.section}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Section</option>
                {['A', 'B', 'C'].map(section => (
                  <option key={section} value={section}>Section {section}</option>
                ))}
              </select>
            </div>

            {/* School Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                School Name *
              </label>
              <select
                name="schoolName"
                value={formData.schoolName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select School</option>
                {['Delhi Public School', 'St. Mary School', 'Modern School'].map(school => (
                  <option key={school} value={school}>{school}</option>
                ))}
              </select>
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* State */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State *
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                minLength="6"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600"
            >
              Add Student
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const AddAssessmentForm = ({ isOpen, onClose, student }) => {
  const [assessments, setAssessments] = useState([])
  const [formData, setFormData] = useState({
    parentName: '',
    height: '',
    weight: '',
    bmi: '',
    temperature: '',
    pulseRate: '',
    spO2: '',
    bp: '',
    oralHealth: '',
    dentalIssues: '',
    leftEye: '',
    rightEye: '',
    hearingComments: '',
    additionalComments: '',
    doctorSignature: null
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setFormData(prev => ({
      ...prev,
      doctorSignature: file
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newAssessment = {
      ...formData,
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      studentName: student?.name,
      studentId: student?.id
    }
    setAssessments(prev => [...prev, newAssessment])
    
    // Reset form
    setFormData({
      parentName: '',
      height: '',
      weight: '',
      bmi: '',
      temperature: '',
      pulseRate: '',
      spO2: '',
      bp: '',
      oralHealth: '',
      dentalIssues: '',
      leftEye: '',
      rightEye: '',
      hearingComments: '',
      additionalComments: '',
      doctorSignature: null
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Add Assessment</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <FaTimes className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Static Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-lg font-medium text-gray-700 mb-4">Student Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">Name</label>
                <p className="text-gray-900">{student?.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Student ID</label>
                <p className="text-gray-900">{student?.id}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Date of Birth</label>
                <p className="text-gray-900">{student?.dob}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Grade</label>
                <p className="text-gray-900">{student?.class}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Gender</label>
                <p className="text-gray-900">{student?.gender}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Contact Number</label>
                <p className="text-gray-900">{student?.mobile}</p>
              </div>
            </div>
          </div>

          {/* Assessment Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Parent Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Parent Name *
              </label>
              <input
                type="text"
                name="parentName"
                value={formData.parentName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Height */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Height (cm) *
              </label>
              <input
                type="number"
                step="0.01"
                name="height"
                value={formData.height}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Weight */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weight (kg) *
              </label>
              <input
                type="number"
                step="0.01"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* BMI */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                BMI *
              </label>
              <input
                type="number"
                step="0.01"
                name="bmi"
                value={formData.bmi}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Temperature */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Temperature (°F) *
              </label>
              <input
                type="number"
                step="0.1"
                name="temperature"
                value={formData.temperature}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Pulse Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pulse Rate (bpm) *
              </label>
              <input
                type="number"
                name="pulseRate"
                value={formData.pulseRate}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* SpO2 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SpO2 (%) *
              </label>
              <input
                type="number"
                min="0"
                max="100"
                name="spO2"
                value={formData.spO2}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* BP */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                BP *
              </label>
              <input
                type="text"
                name="bp"
                value={formData.bp}
                onChange={handleInputChange}
                placeholder="120/80"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Oral Health */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Oral Health *
              </label>
              <select
                name="oralHealth"
                value={formData.oralHealth}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Status</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
              </select>
            </div>

            {/* Dental Issues */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Any Other Dental Issues
              </label>
              <textarea
                name="dentalIssues"
                value={formData.dentalIssues}
                onChange={handleInputChange}
                rows="2"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            {/* Vision Fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Right Eye *
              </label>
              <input
                type="text"
                name="rightEye"
                value={formData.rightEye}
                onChange={handleInputChange}
                required
                placeholder="Enter vision (e.g. 6/6)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Left Eye *
              </label>
              <input
                type="text"
                name="leftEye"
                value={formData.leftEye}
                onChange={handleInputChange}
                required
                placeholder="Enter vision (e.g. 6/6)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Hearing Comments */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hearing Comments
              </label>
              <textarea
                name="hearingComments"
                value={formData.hearingComments}
                onChange={handleInputChange}
                rows="2"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            {/* Additional Comments */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Comments
              </label>
              <textarea
                name="additionalComments"
                value={formData.additionalComments}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            {/* Doctor Signature */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Doctor Signature *
              </label>
              <input
                type="file"
                name="doctorSignature"
                onChange={handleFileChange}
                accept="image/*"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600"
            >
              Submit Assessment
            </button>
          </div>
        </form>

        {/* Assessment History Table */}
        {assessments.length > 0 && (
          <div className="mt-8">
            <h4 className="text-lg font-medium text-gray-800 mb-4">Assessment History</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Height</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Weight</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">BMI</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Temperature</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pulse Rate</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">SpO2</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">BP</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Oral Health</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {assessments.map((assessment) => (
                    <tr key={assessment.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{assessment.date}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{assessment.height} cm</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{assessment.weight} kg</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{assessment.bmi}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{assessment.temperature}°F</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{assessment.pulseRate} bpm</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{assessment.spO2}%</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{assessment.bp}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{assessment.oralHealth}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const ViewStudentDetails = ({ isOpen, onClose, student, onEdit, onDelete }) => {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)

  if (!isOpen) return null

  const handleDelete = () => {
    setShowDeleteConfirmation(true)
  }

  const confirmDelete = () => {
    onDelete(student.id)
    setShowDeleteConfirmation(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Student Details</h3>
          <div className="flex items-center gap-4">
            <button
              onClick={() => onEdit(student)}
              className="text-blue-600 hover:text-blue-800"
              title="Edit Student"
            >
              <FaEdit className="w-5 h-5" />
            </button>
            <button
              onClick={handleDelete}
              className="text-red-600 hover:text-red-800"
              title="Delete Student"
            >
              <FaTrash className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-600">Name</label>
            <p className="text-gray-900">{student?.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Student ID</label>
            <p className="text-gray-900">{student?.id}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Gender</label>
            <p className="text-gray-900">{student?.gender}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Date of Birth</label>
            <p className="text-gray-900">{student?.dob}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <p className="text-gray-900">{student?.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Contact Number</label>
            <p className="text-gray-900">{student?.contactNumber}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Alternate Contact</label>
            <p className="text-gray-900">{student?.alternateContactNumber || '-'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Class</label>
            <p className="text-gray-900">Class {student?.grade}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Section</label>
            <p className="text-gray-900">Section {student?.section}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">School</label>
            <p className="text-gray-900">{student?.schoolName}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">City</label>
            <p className="text-gray-900">{student?.city}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">State</label>
            <p className="text-gray-900">{student?.state}</p>
          </div>
        </div>

        {/* Delete Confirmation Dialog */}
        {showDeleteConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h4>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this student? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowDeleteConfirmation(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const AllStudents = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedSection, setSelectedSection] = useState('')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [showAddStudentForm, setShowAddStudentForm] = useState(false)
  const [showAssessmentForm, setShowAssessmentForm] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [showViewDetails, setShowViewDetails] = useState(false)
  const [selectedStudentForView, setSelectedStudentForView] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const tableRef = useRef(null)
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: itemsPerPage })
  
  // Sample data - replace with actual data
  const students = [
    { id: 'STU001', name: 'Rahul Kumar', mobile: '9876543210', school: 'Delhi Public School', class: 'X', section: 'A', gender: 'Male' },
    { id: 'STU002', name: 'Priya Singh', mobile: '9876543211', school: 'St. Mary School', class: 'IX', section: 'B', gender: 'Female' },
    { id: 'STU003', name: 'Amit Sharma', mobile: '9876543212', school: 'Modern School', class: 'XI', section: 'C', gender: 'Male' },
    { id: 'STU004', name: 'Neha Patel', mobile: '9876543213', school: 'Delhi Public School', class: 'XII', section: 'A', gender: 'Female' },
    { id: 'STU005', name: 'Raj Malhotra', mobile: '9876543214', school: 'St. Mary School', class: 'X', section: 'B', gender: 'Male' },
    { id: 'STU006', name: 'Anita Gupta', mobile: '9876543215', school: 'Modern School', class: 'IX', section: 'A', gender: 'Female' },
    { id: 'STU007', name: 'Vikram Singh', mobile: '9876543216', school: 'Delhi Public School', class: 'XI', section: 'C', gender: 'Male' },
    { id: 'STU008', name: 'Meera Reddy', mobile: '9876543217', school: 'St. Mary School', class: 'XII', section: 'B', gender: 'Female' },
    { id: 'STU009', name: 'Arjun Mehta', mobile: '9876543218', school: 'Modern School', class: 'X', section: 'A', gender: 'Male' },
    { id: 'STU010', name: 'Sanya Kapoor', mobile: '9876543219', school: 'Delhi Public School', class: 'IX', section: 'C', gender: 'Female' },
    { id: 'STU011', name: 'Rohan Verma', mobile: '9876543220', school: 'St. Mary School', class: 'XI', section: 'B', gender: 'Male' },
    { id: 'STU012', name: 'Ishaan Kumar', mobile: '9876543221', school: 'Modern School', class: 'XII', section: 'A', gender: 'Male' },
    { id: 'STU013', name: 'Zara Sheikh', mobile: '9876543222', school: 'Delhi Public School', class: 'X', section: 'C', gender: 'Female' },
    { id: 'STU014', name: 'Aditya Sharma', mobile: '9876543223', school: 'St. Mary School', class: 'IX', section: 'B', gender: 'Male' },
    { id: 'STU015', name: 'Riya Patel', mobile: '9876543224', school: 'Modern School', class: 'XI', section: 'A', gender: 'Female' },
    { id: 'STU016', name: 'Karan Malhotra', mobile: '9876543225', school: 'Delhi Public School', class: 'X', section: 'B', gender: 'Male' },
    { id: 'STU017', name: 'Nisha Verma', mobile: '9876543226', school: 'St. Mary School', class: 'XII', section: 'C', gender: 'Female' },
    { id: 'STU018', name: 'Aryan Shah', mobile: '9876543227', school: 'Modern School', class: 'IX', section: 'A', gender: 'Male' },
    { id: 'STU019', name: 'Kavya Reddy', mobile: '9876543228', school: 'Delhi Public School', class: 'XI', section: 'B', gender: 'Female' },
    { id: 'STU020', name: 'Dhruv Patel', mobile: '9876543229', school: 'St. Mary School', class: 'X', section: 'C', gender: 'Male' },
    { id: 'STU021', name: 'Aisha Khan', mobile: '9876543230', school: 'Modern School', class: 'XII', section: 'A', gender: 'Female' },
    { id: 'STU022', name: 'Varun Mehta', mobile: '9876543231', school: 'Delhi Public School', class: 'IX', section: 'B', gender: 'Male' },
    { id: 'STU023', name: 'Tanvi Gupta', mobile: '9876543232', school: 'St. Mary School', class: 'XI', section: 'C', gender: 'Female' },
    { id: 'STU024', name: 'Yash Sharma', mobile: '9876543233', school: 'Modern School', class: 'X', section: 'A', gender: 'Male' },
    { id: 'STU025', name: 'Shreya Singh', mobile: '9876543234', school: 'Delhi Public School', class: 'XII', section: 'B', gender: 'Female' },
    { id: 'STU026', name: 'Aarav Kumar', mobile: '9876543235', school: 'St. Mary School', class: 'IX', section: 'C', gender: 'Male' },
    { id: 'STU027', name: 'Diya Patel', mobile: '9876543236', school: 'Modern School', class: 'XI', section: 'A', gender: 'Female' },
    { id: 'STU028', name: 'Kabir Sinha', mobile: '9876543237', school: 'Delhi Public School', class: 'X', section: 'B', gender: 'Male' },
    { id: 'STU029', name: 'Ananya Reddy', mobile: '9876543238', school: 'St. Mary School', class: 'XII', section: 'C', gender: 'Female' },
    { id: 'STU030', name: 'Vihaan Kapoor', mobile: '9876543239', school: 'Modern School', class: 'IX', section: 'A', gender: 'Male' },
    { id: 'STU031', name: 'Advait Menon', mobile: '9876543240', school: 'Delhi Public School', class: 'XI', section: 'B', gender: 'Male' },
    { id: 'STU032', name: 'Saanvi Iyer', mobile: '9876543241', school: 'St. Mary School', class: 'X', section: 'A', gender: 'Female' },
    { id: 'STU033', name: 'Reyansh Shah', mobile: '9876543242', school: 'Modern School', class: 'XII', section: 'C', gender: 'Male' },
    { id: 'STU034', name: 'Avni Desai', mobile: '9876543243', school: 'Delhi Public School', class: 'IX', section: 'B', gender: 'Female' },
    { id: 'STU035', name: 'Veer Malhotra', mobile: '9876543244', school: 'St. Mary School', class: 'XI', section: 'A', gender: 'Male' },
    { id: 'STU036', name: 'Aisha Syed', mobile: '9876543245', school: 'Modern School', class: 'X', section: 'C', gender: 'Female' },
    { id: 'STU037', name: 'Arjun Nair', mobile: '9876543246', school: 'Delhi Public School', class: 'XII', section: 'B', gender: 'Male' },
    { id: 'STU038', name: 'Myra Khan', mobile: '9876543247', school: 'St. Mary School', class: 'IX', section: 'A', gender: 'Female' },
    { id: 'STU039', name: 'Vivaan Reddy', mobile: '9876543248', school: 'Modern School', class: 'XI', section: 'C', gender: 'Male' },
    { id: 'STU040', name: 'Anaya Sharma', mobile: '9876543249', school: 'Delhi Public School', class: 'X', section: 'B', gender: 'Female' },
    { id: 'STU041', name: 'Aarav Choudhury', mobile: '9876543250', school: 'St. Mary School', class: 'XII', section: 'A', gender: 'Male' },
    { id: 'STU042', name: 'Zara Malik', mobile: '9876543251', school: 'Modern School', class: 'IX', section: 'C', gender: 'Female' },
    { id: 'STU043', name: 'Kabir Joshi', mobile: '9876543252', school: 'Delhi Public School', class: 'XI', section: 'B', gender: 'Male' },
    { id: 'STU044', name: 'Anika Gupta', mobile: '9876543253', school: 'St. Mary School', class: 'X', section: 'A', gender: 'Female' },
    { id: 'STU045', name: 'Ishaan Verma', mobile: '9876543254', school: 'Modern School', class: 'XII', section: 'C', gender: 'Male' },
    { id: 'STU046', name: 'Riya Kapoor', mobile: '9876543255', school: 'Delhi Public School', class: 'IX', section: 'B', gender: 'Female' },
    { id: 'STU047', name: 'Aditya Mehta', mobile: '9876543256', school: 'St. Mary School', class: 'XI', section: 'A', gender: 'Male' },
    { id: 'STU048', name: 'Siya Patel', mobile: '9876543257', school: 'Modern School', class: 'X', section: 'C', gender: 'Female' },
    { id: 'STU049', name: 'Dhruv Singh', mobile: '9876543258', school: 'Delhi Public School', class: 'XII', section: 'B', gender: 'Male' },
    { id: 'STU050', name: 'Aaradhya Kumar', mobile: '9876543259', school: 'St. Mary School', class: 'IX', section: 'A', gender: 'Female' },
    { id: 'STU051', name: 'Aryan Khanna', mobile: '9876543260', school: 'Modern School', class: 'XI', section: 'C', gender: 'Male' },
    { id: 'STU052', name: 'Avani Reddy', mobile: '9876543261', school: 'Delhi Public School', class: 'X', section: 'B', gender: 'Female' },
    { id: 'STU053', name: 'Shaurya Malhotra', mobile: '9876543262', school: 'St. Mary School', class: 'XII', section: 'A', gender: 'Male' },
    { id: 'STU054', name: 'Anvi Sharma', mobile: '9876543263', school: 'Modern School', class: 'IX', section: 'C', gender: 'Female' },
    { id: 'STU055', name: 'Yash Verma', mobile: '9876543264', school: 'Delhi Public School', class: 'XI', section: 'B', gender: 'Male' },
    { id: 'STU056', name: 'Mira Kapoor', mobile: '9876543265', school: 'St. Mary School', class: 'X', section: 'A', gender: 'Female' },
    { id: 'STU057', name: 'Rudra Singh', mobile: '9876543266', school: 'Modern School', class: 'XII', section: 'C', gender: 'Male' },
    { id: 'STU058', name: 'Amaira Patel', mobile: '9876543267', school: 'Delhi Public School', class: 'IX', section: 'B', gender: 'Female' },
    { id: 'STU059', name: 'Ved Sharma', mobile: '9876543268', school: 'St. Mary School', class: 'XI', section: 'A', gender: 'Male' },
    { id: 'STU060', name: 'Kyra Mehta', mobile: '9876543269', school: 'Modern School', class: 'X', section: 'C', gender: 'Female' },
    { id: 'STU061', name: 'Vihaan Gupta', mobile: '9876543270', school: 'Delhi Public School', class: 'XII', section: 'B', gender: 'Male' },
    { id: 'STU062', name: 'Shanaya Reddy', mobile: '9876543271', school: 'St. Mary School', class: 'IX', section: 'A', gender: 'Female' },
    { id: 'STU063', name: 'Aarush Kumar', mobile: '9876543272', school: 'Modern School', class: 'XI', section: 'C', gender: 'Male' },
    { id: 'STU064', name: 'Kiara Singh', mobile: '9876543273', school: 'Delhi Public School', class: 'X', section: 'B', gender: 'Female' },
    { id: 'STU065', name: 'Atharv Malhotra', mobile: '9876543274', school: 'St. Mary School', class: 'XII', section: 'A', gender: 'Male' },
    { id: 'STU066', name: 'Navya Kapoor', mobile: '9876543275', school: 'Modern School', class: 'IX', section: 'C', gender: 'Female' },
    { id: 'STU067', name: 'Krish Sharma', mobile: '9876543276', school: 'Delhi Public School', class: 'XI', section: 'B', gender: 'Male' },
    { id: 'STU068', name: 'Ira Patel', mobile: '9876543277', school: 'St. Mary School', class: 'X', section: 'A', gender: 'Female' },
    { id: 'STU069', name: 'Ayaan Khan', mobile: '9876543278', school: 'Modern School', class: 'XII', section: 'C', gender: 'Male' },
    { id: 'STU070', name: 'Diya Verma', mobile: '9876543279', school: 'Delhi Public School', class: 'IX', section: 'B', gender: 'Female' },
    { id: 'STU071', name: 'Shiv Reddy', mobile: '9876543280', school: 'St. Mary School', class: 'XI', section: 'A', gender: 'Male' },
    { id: 'STU072', name: 'Pari Malhotra', mobile: '9876543281', school: 'Modern School', class: 'X', section: 'C', gender: 'Female' },
    { id: 'STU073', name: 'Arnav Mehta', mobile: '9876543282', school: 'Delhi Public School', class: 'XII', section: 'B', gender: 'Male' },
    { id: 'STU074', name: 'Sara Khan', mobile: '9876543283', school: 'St. Mary School', class: 'IX', section: 'A', gender: 'Female' },
    { id: 'STU075', name: 'Yuvan Singh', mobile: '9876543284', school: 'Modern School', class: 'XI', section: 'C', gender: 'Male' },
    { id: 'STU076', name: 'Ahana Sharma', mobile: '9876543285', school: 'Delhi Public School', class: 'X', section: 'B', gender: 'Female' },
    { id: 'STU077', name: 'Aayan Kumar', mobile: '9876543286', school: 'St. Mary School', class: 'XII', section: 'A', gender: 'Male' },
    { id: 'STU078', name: 'Mishka Gupta', mobile: '9876543287', school: 'Modern School', class: 'IX', section: 'C', gender: 'Female' },
    { id: 'STU079', name: 'Rehan Patel', mobile: '9876543288', school: 'Delhi Public School', class: 'XI', section: 'B', gender: 'Male' },
    { id: 'STU080', name: 'Anvi Reddy', mobile: '9876543289', school: 'St. Mary School', class: 'X', section: 'A', gender: 'Female' },
    { id: 'STU081', name: 'Viraj Malhotra', mobile: '9876543290', school: 'Modern School', class: 'XII', section: 'C', gender: 'Male' },
    { id: 'STU082', name: 'Tara Kapoor', mobile: '9876543291', school: 'Delhi Public School', class: 'IX', section: 'B', gender: 'Female' },
    { id: 'STU083', name: 'Aadit Sharma', mobile: '9876543292', school: 'St. Mary School', class: 'XI', section: 'A', gender: 'Male' },
    { id: 'STU084', name: 'Myra Verma', mobile: '9876543293', school: 'Modern School', class: 'X', section: 'C', gender: 'Female' },
    { id: 'STU085', name: 'Kabir Mehta', mobile: '9876543294', school: 'Delhi Public School', class: 'XII', section: 'B', gender: 'Male' },
    { id: 'STU086', name: 'Aanya Singh', mobile: '9876543295', school: 'St. Mary School', class: 'IX', section: 'A', gender: 'Female' },
    { id: 'STU087', name: 'Vivaan Kumar', mobile: '9876543296', school: 'Modern School', class: 'XI', section: 'C', gender: 'Male' },
    { id: 'STU088', name: 'Pihu Gupta', mobile: '9876543297', school: 'Delhi Public School', class: 'X', section: 'B', gender: 'Female' },
    { id: 'STU089', name: 'Advaith Reddy', mobile: '9876543298', school: 'St. Mary School', class: 'XII', section: 'A', gender: 'Male' },
    { id: 'STU090', name: 'Aadhya Patel', mobile: '9876543299', school: 'Modern School', class: 'IX', section: 'C', gender: 'Female' },
    { id: 'STU091', name: 'Shlok Malhotra', mobile: '9876543200', school: 'Delhi Public School', class: 'XI', section: 'B', gender: 'Male' },
    { id: 'STU092', name: 'Nitya Sharma', mobile: '9876543201', school: 'St. Mary School', class: 'X', section: 'A', gender: 'Female' },
    { id: 'STU093', name: 'Aaryan Khan', mobile: '9876543202', school: 'Modern School', class: 'XII', section: 'C', gender: 'Male' },
    { id: 'STU094', name: 'Ishita Verma', mobile: '9876543203', school: 'Delhi Public School', class: 'IX', section: 'B', gender: 'Female' },
    { id: 'STU095', name: 'Shaan Mehta', mobile: '9876543204', school: 'St. Mary School', class: 'XI', section: 'A', gender: 'Male' },
    { id: 'STU096', name: 'Anushka Kapoor', mobile: '9876543205', school: 'Modern School', class: 'X', section: 'C', gender: 'Female' },
    { id: 'STU097', name: 'Laksh Singh', mobile: '9876543206', school: 'Delhi Public School', class: 'XII', section: 'B', gender: 'Male' },
    { id: 'STU098', name: 'Samaira Gupta', mobile: '9876543207', school: 'St. Mary School', class: 'IX', section: 'A', gender: 'Female' },
    { id: 'STU099', name: 'Pranav Kumar', mobile: '9876543208', school: 'Modern School', class: 'XI', section: 'C', gender: 'Male' },
    { id: 'STU100', name: 'Vanya Reddy', mobile: '9876543209', school: 'Delhi Public School', class: 'X', section: 'B', gender: 'Female' },
  ]

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesClass = !selectedClass || student.class === selectedClass
    const matchesSection = !selectedSection || student.section === selectedSection

    return matchesSearch && matchesClass && matchesSection
  })

  // Calculate pagination
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedStudents = filteredStudents.slice(startIndex, startIndex + itemsPerPage)

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedStudents(paginatedStudents.map(student => student.id))
    } else {
      setSelectedStudents([])
    }
  }

  const handleSelectStudent = (studentId) => {
    setSelectedStudents(prev => {
      if (prev.includes(studentId)) {
        return prev.filter(id => id !== studentId)
      } else {
        return [...prev, studentId]
      }
    })
  }

  const handleNavigatorSelect = (navigator, selectedStudents) => {
    console.log('Assigning navigator:', navigator, 'to students:', selectedStudents)
    // Implement your assignment logic here
    setSelectedStudents([]) // Clear selections after assignment
  }

  const handleEditStudent = (student) => {
    setSelectedStudent(student)
    setShowAddStudentForm(true)
    setShowViewDetails(false)
  }

  const handleDeleteStudent = (studentId) => {
    // Filter out the deleted student
    const updatedStudents = students.filter(student => student.id !== studentId)
    // Update your students state here
    console.log('Student deleted:', studentId)
  }

  // Modify the pagination logic
  const loadMoreItems = () => {
    if (loading || !hasMore) return

    setLoading(true)
    setTimeout(() => {
      const nextPage = currentPage + 1
      if (nextPage <= totalPages) {
        setCurrentPage(nextPage)
        setVisibleRange(prev => ({
          start: prev.start,
          end: Math.min(nextPage * itemsPerPage, filteredStudents.length)
        }))
      } else {
        setHasMore(false)
      }
      setLoading(false)
    }, 300)
  }

  // Handle scroll event
  const handleScroll = useCallback(() => {
    if (!tableRef.current) return

    const { scrollTop, scrollHeight, clientHeight } = tableRef.current
    const scrollPercentage = scrollTop / (scrollHeight - clientHeight)

    // Load more when scrolling down near bottom
    if (scrollPercentage > 0.8) {
      loadMoreItems()
    }

    // Update visible range based on scroll position
    const estimatedRowHeight = 53 // Approximate height of each row
    const visibleStart = Math.floor(scrollTop / estimatedRowHeight)
    const visibleEnd = Math.min(
      visibleStart + Math.ceil(clientHeight / estimatedRowHeight),
      filteredStudents.length
    )

    // Keep one page worth of buffer above and below
    const bufferSize = itemsPerPage
    const rangeStart = Math.max(0, visibleStart - bufferSize)
    const rangeEnd = Math.min(filteredStudents.length, visibleEnd + bufferSize)

    setVisibleRange({ start: rangeStart, end: rangeEnd })
    
    // Update current page based on visible content
    const newPage = Math.ceil(visibleEnd / itemsPerPage)
    if (newPage !== currentPage) {
      setCurrentPage(newPage)
    }
  }, [loading, hasMore, filteredStudents.length, currentPage, itemsPerPage])

  // Add scroll event listener
  useEffect(() => {
    const tableElement = tableRef.current
    if (tableElement) {
      tableElement.addEventListener('scroll', handleScroll)
      return () => tableElement.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1)
    setHasMore(true)
    setVisibleRange({ start: 0, end: itemsPerPage })
  }, [searchTerm, selectedClass, selectedSection])

  // Modify how we get displayed students
  const displayedStudents = useMemo(() => {
    return filteredStudents.slice(visibleRange.start, visibleRange.end)
  }, [filteredStudents, visibleRange])

  return (
    <div className="flex flex-col h-full">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        {/* Search and Filter */}
        <div className="flex gap-2 items-center flex-1">
          <div className="relative flex-1 md:flex-none md:w-96">
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1) // Reset to first page on search
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <button
            onClick={() => setIsFilterOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <FaFilter className="w-4 h-4" />
            Filter
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 sm:justify-end">
          <button
            onClick={() => setShowAddStudentForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Student
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="flex-1 bg-white rounded-lg shadow overflow-hidden">
        <div 
          ref={tableRef}
          className="h-[calc(100vh-240px)] overflow-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
        >
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th scope="col" className="sticky left-0 bg-gray-50 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                  Sl. No
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                  Student ID
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[140px]">
                  Name
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[140px]">
                  School
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                  Mobile Number
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                  Gender
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                  Grade
                </th>
                <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                  Action
                </th>
                <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                  Assessment
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Add spacer for proper scrolling */}
              <tr style={{ height: `${visibleRange.start * 53}px` }} />
              
              {displayedStudents.map((student, index) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="sticky left-0 bg-white px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {visibleRange.start + index + 1}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.id}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.name}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.school}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.mobile}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.gender}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.class} - {student.section}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      title="View Details"
                      onClick={() => {
                        setSelectedStudentForView(student)
                        setShowViewDetails(true)
                      }}
                    >
                      <FaEye className="w-5 h-5" />
                    </button>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => {
                        setSelectedStudent(student)
                        setShowAssessmentForm(true)
                      }}
                      className="text-green-600 hover:text-green-900"
                      title="Add Assessment"
                    >
                      <FaPlus className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}

              {loading && (
                <tr>
                  <td colSpan="9" className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                      <span className="ml-2">Loading...</span>
                    </div>
                  </td>
                </tr>
              )}

              {/* Add bottom spacer for proper scrolling */}
              <tr style={{ height: `${(filteredStudents.length - visibleRange.end) * 53}px` }} />
            </tbody>
          </table>

          {filteredStudents.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              No students found matching your search.
            </div>
          )}
        </div>
      </div>

      {/* Update Pagination to show current progress */}
      {filteredStudents.length > 0 && (
        <div className="flex justify-between items-center mt-4 bg-white px-4 py-3 rounded-lg shadow">
          <div className="text-sm text-gray-700">
            Showing {visibleRange.start + 1} to {Math.min(visibleRange.end, filteredStudents.length)} of {filteredStudents.length} results
          </div>
          <div className="flex items-center gap-2">
            <div className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </div>
          </div>
        </div>
      )}

      {/* Filter Popup */}
      <FilterPopup
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        selectedClass={selectedClass}
        selectedSection={selectedSection}
        onClassChange={setSelectedClass}
        onSectionChange={setSelectedSection}
      />

      {/* Add Student Form */}
      <AddStudentForm
        isOpen={showAddStudentForm}
        onClose={() => setShowAddStudentForm(false)}
      />

      {/* Add Assessment Form */}
      <AddAssessmentForm
        isOpen={showAssessmentForm}
        onClose={() => {
          setShowAssessmentForm(false)
          setSelectedStudent(null)
        }}
        student={selectedStudent}
      />

      {/* View Student Details */}
      <ViewStudentDetails
        isOpen={showViewDetails}
        onClose={() => {
          setShowViewDetails(false)
          setSelectedStudentForView(null)
        }}
        student={selectedStudentForView}
        onEdit={handleEditStudent}
        onDelete={handleDeleteStudent}
      />
    </div>
  )
}

export const ViewAssessmentDetails = ({ isOpen, onClose, assessment }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Assessment Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <IoMdClose className="h-6 w-6" />
          </button>
        </div>
        
        <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Student Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Student Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Student ID</label>
                <div className="mt-1 text-sm text-gray-900">{assessment.studentId}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Name</label>
                <div className="mt-1 text-sm text-gray-900">{assessment.studentName}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Mobile</label>
                <div className="mt-1 text-sm text-gray-900">{assessment.mobile}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Gender</label>
                <div className="mt-1 text-sm text-gray-900">{assessment.gender}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Grade</label>
                <div className="mt-1 text-sm text-gray-900">{assessment.grade}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Parent Name</label>
                <div className="mt-1 text-sm text-gray-900">{assessment.parentName}</div>
              </div>
            </div>
          </div>

          {/* Physical Measurements */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Physical Measurements</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Height</label>
                <div className="mt-1 text-sm text-gray-900">{assessment.height} cm</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Weight</label>
                <div className="mt-1 text-sm text-gray-900">{assessment.weight} kg</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">BMI</label>
                <div className="mt-1 text-sm text-gray-900">{assessment.bmi}</div>
              </div>
            </div>
          </div>

          {/* Vital Signs */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Vital Signs</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Temperature</label>
                <div className="mt-1 text-sm text-gray-900">{((assessment.temperature - 32) * 5/9).toFixed(1)}°C</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Pulse Rate</label>
                <div className="mt-1 text-sm text-gray-900">{assessment.pulseRate} bpm</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">SpO2</label>
                <div className="mt-1 text-sm text-gray-900">{assessment.spO2}%</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Blood Pressure</label>
                <div className="mt-1 text-sm text-gray-900">{assessment.bp} mmHg</div>
              </div>
            </div>
          </div>

          {/* Oral Health */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Oral Health</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Status</label>
                <div className="mt-1 text-sm text-gray-900">{assessment.oralHealth}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Dental Issues</label>
                <div className="mt-1 text-sm text-gray-900">{assessment.dentalIssues}</div>
              </div>
            </div>
          </div>

          {/* Vision Assessment */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Vision Assessment</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Right Eye</label>
                <div className="mt-1 text-sm text-gray-900">{assessment.rightEye}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Left Eye</label>
                <div className="mt-1 text-sm text-gray-900">{assessment.leftEye}</div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="col-span-1 md:col-span-2 space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Additional Information</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Hearing Comments</label>
                <div className="mt-1 text-sm text-gray-900">{assessment.hearingComments}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Additional Comments</label>
                <div className="mt-1 text-sm text-gray-900">{assessment.additionalComments}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AssessmentReport = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [showViewDetails, setShowViewDetails] = useState(false)
  const [selectedAssessment, setSelectedAssessment] = useState(null)
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedSection, setSelectedSection] = useState('')
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [showStudentDropdown, setShowStudentDropdown] = useState(false)
  const itemsPerPage = 10

  // Generate 100 sample assessments
  const sampleAssessments = useMemo(() => Array.from({ length: 100 }, (_, index) => ({
    id: `ASS${(index + 1).toString().padStart(3, '0')}`,
    date: new Date(2024, 2, Math.floor(index / 5) + 1).toISOString().split('T')[0],
    studentId: `STU${(index + 1).toString().padStart(3, '0')}`,
    studentName: `Student ${index + 1}`,
    school: ['Delhi Public School', 'St. Mary School', 'Modern School'][index % 3],
    mobile: `98765${(index + 1).toString().padStart(5, '0')}`,
    gender: index % 2 === 0 ? 'Male' : 'Female',
    grade: `${['IX', 'X', 'XI', 'XII'][index % 4]}-${['A', 'B', 'C'][index % 3]}`,
    parentName: `Parent ${index + 1}`,
    height: Math.floor(150 + Math.random() * 30),
    weight: Math.floor(45 + Math.random() * 25),
    bmi: (20 + Math.random() * 5).toFixed(1),
    temperature: (98 + Math.random()).toFixed(1),
    pulseRate: Math.floor(70 + Math.random() * 20),
    spO2: Math.floor(95 + Math.random() * 5),
    bp: `${Math.floor(110 + Math.random() * 20)}/${Math.floor(70 + Math.random() * 10)}`,
    oralHealth: ['Good', 'Fair', 'Poor'][index % 3],
    dentalIssues: index % 5 === 0 ? 'Cavity' : index % 4 === 0 ? 'Gingivitis' : 'None',
    leftEye: Math.random() > 0.8 ? '6/6' : '6/5',
    rightEye: Math.random() > 0.8 ? '6/6' : '6/5',
    hearingComments: index % 10 === 0 ? 'Mild hearing loss' : 'Normal',
    additionalComments: index % 7 === 0 ? 'Regular follow-up recommended' : ''
  })), []);

  // Get unique values for filters (remove schools)
  const classes = useMemo(() => [...new Set(sampleAssessments.map(a => a.grade.split('-')[0]))], [sampleAssessments]);
  const sections = ['A', 'B', 'C'];
  
  // Get unique students from assessments
  const uniqueStudents = useMemo(() => 
    [...new Set(sampleAssessments.map(a => ({ 
      id: a.studentId, 
      name: a.studentName 
    })))].sort((a, b) => a.name.localeCompare(b.name))
  , [sampleAssessments]);

  // Filter assessments based on all filters (remove school filter)
  const filteredAssessments = useMemo(() => 
    sampleAssessments.filter(assessment => {
      const matchesSearch = 
    assessment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assessment.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assessment.mobile.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesClass = !selectedClass || assessment.grade.split('-')[0] === selectedClass;
      const matchesSection = !selectedSection || assessment.grade.split('-')[1] === selectedSection;
      const matchesStudent = !selectedStudent || assessment.studentId === selectedStudent.id;
      const matchesDate = !selectedDate || assessment.date === selectedDate;

      return matchesSearch && matchesClass && matchesSection && matchesStudent && matchesDate;
    })
  , [sampleAssessments, searchTerm, selectedClass, selectedSection, selectedStudent, selectedDate]);

  // Handle bulk upload
  const handleBulkUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('Uploading file:', file.name);
      e.target.value = '';
    }
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle view details
  const handleViewDetails = (assessment) => {
    setSelectedAssessment(assessment);
    setShowViewDetails(true);
  };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedClass, selectedSection, selectedStudent, selectedDate]);

  // Add new handler for bulk download
  const handleBulkDownload = () => {
    // Create CSV content from filteredAssessments
    const headers = [
      'Date',
      'Student ID',
      'Name',
      'School',
      'Mobile',
      'Gender',
      'Grade',
      'Height',
      'Weight',
      'BMI',
      'Temperature',
      'Pulse Rate',
      'SpO2',
      'BP',
      'Oral Health',
      'Dental Issues',
      'Left Eye',
      'Right Eye',
      'Hearing Comments',
      'Additional Comments'
    ].join(',');

    const rows = filteredAssessments.map(assessment => [
      assessment.date,
      assessment.studentId,
      assessment.studentName,
      assessment.school,
      assessment.mobile,
      assessment.gender,
      assessment.grade,
      assessment.height,
      assessment.weight,
      assessment.bmi,
      assessment.temperature,
      assessment.pulseRate,
      assessment.spO2,
      assessment.bp,
      assessment.oralHealth,
      assessment.dentalIssues,
      assessment.leftEye,
      assessment.rightEye,
      assessment.hearingComments,
      assessment.additionalComments
    ].map(cell => `"${cell || ''}"`).join(','));

    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `assessment_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!sampleAssessments || sampleAssessments.length === 0) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header with Search and Actions */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
        <div className="flex flex-col space-y-4">
          {/* Search and Buttons Row */}
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
          <input
            type="text"
            placeholder="Search by name, ID or mobile..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
        </div>
          
            <div className="flex items-center gap-4">
              <label className="cursor-pointer">
                <span className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                  <FaFileUpload className="text-lg" />
                  <span>Bulk Upload</span>
                </span>
              <input
                type="file"
                onChange={handleBulkUpload}
                  accept=".csv,.xlsx"
                className="hidden"
              />
            </label>

              <button
                onClick={handleBulkDownload}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                <FaFileUpload className="text-lg transform rotate-180" />
                <span>Bulk Download</span>
              </button>
            </div>
            </div>

          {/* Filters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Class Dropdown */}
          <div>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Classes</option>
              {classes.map(cls => (
                <option key={cls} value={cls}>Class {cls}</option>
              ))}
            </select>
          </div>

          {/* Section Dropdown */}
          <div>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Sections</option>
              {sections.map(section => (
                <option key={section} value={section}>Section {section}</option>
              ))}
            </select>
          </div>

            {/* Student Dropdown */}
          <div className="relative">
            <div
              onClick={() => setShowStudentDropdown(!showStudentDropdown)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer bg-white flex justify-between items-center"
            >
              <span className="truncate">
                {selectedStudent ? selectedStudent.name : 'Select Student'}
              </span>
              <FaChevronDown className={`transition-transform ${showStudentDropdown ? 'rotate-180' : ''}`} />
            </div>
            {showStudentDropdown && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                  <div className="p-2">
                <input
                  type="text"
                  placeholder="Search students..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  {/* Student list items */}
              </div>
            )}
          </div>

          {/* Date Picker */}
          <div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            </div>
          </div>
        </div>
      </div>

      {/* Table Container with Fixed Header */}
      <div className="flex-1 overflow-hidden bg-white">
        <div className="overflow-auto h-[calc(100vh-280px)]">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-40">
              <tr>
                <th scope="col" className="sticky top-0 left-0 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sl. No
                    </th>
                <th scope="col" className="sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student ID
                    </th>
                <th scope="col" className="sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                <th scope="col" className="sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                School
              </th>
                <th scope="col" className="sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mobile
                    </th>
                <th scope="col" className="sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Gender
                    </th>
                <th scope="col" className="sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Grade
                    </th>
                <th scope="col" className="sticky top-0 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
            {filteredAssessments
              .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
              .map((assessment, index) => (
                    <tr key={assessment.id} className="hover:bg-gray-50">
                    <td className="sticky left-0 bg-white px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {assessment.studentId}
                      </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {assessment.studentName}
                      </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {assessment.school}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {assessment.mobile}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {assessment.gender}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {assessment.grade}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => handleViewDetails(assessment)}
                      className="text-blue-600 hover:text-blue-800"
                        >
                      <FaEye className="w-5 h-5 mx-auto" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
        </div>
          </div>

      {/* Pagination */}
      <div className="bg-white border-t px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredAssessments.length)} of {filteredAssessments.length} results
          </div>
          <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border'
                    }`}
                >
                  Previous
                </button>
            <div className="flex space-x-1">
              {Array.from({ length: Math.ceil(filteredAssessments.length / itemsPerPage) }, (_, i) => i + 1)
                .filter(page => 
                  page === 1 || 
                  page === Math.ceil(filteredAssessments.length / itemsPerPage) || 
                  Math.abs(currentPage - page) <= 2
                )
                .map((page, index, array) => (
                  <React.Fragment key={page}>
                    {index > 0 && array[index - 1] !== page - 1 && (
                      <span className="px-3 py-1">...</span>
                    )}
                <button
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === page
                          ? 'bg-blue-500 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-50 border'
                      }`}
                    >
                      {page}
                </button>
                  </React.Fragment>
                ))}
              </div>
                  <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === Math.ceil(filteredAssessments.length / itemsPerPage)}
              className={`px-3 py-1 rounded-md ${
                currentPage === Math.ceil(filteredAssessments.length / itemsPerPage)
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border'
              }`}
            >
              Next
                  </button>
              </div>
        </div>
      </div>

      {/* View Details Modal */}
      {selectedAssessment && (
        <ViewAssessmentDetails
          isOpen={showViewDetails}
          onClose={() => {
            setShowViewDetails(false)
            setSelectedAssessment(null)
          }}
          assessment={selectedAssessment}
        />
      )}
    </div>
  );
};

const infirmaryData = Array.from({ length: 40 }, (_, index) => ({
  id: `STU${(index + 1).toString().padStart(3, '0')}`,
  name: `Student ${index + 1}`,
  school: `School ${Math.floor(index / 10) + 1}`,
  mobile: `98765${(index + 1).toString().padStart(5, '0')}`,
  class: `Grade ${Math.floor(Math.random() * 12) + 1}`,
  section: ['A', 'B', 'C'][Math.floor(Math.random() * 3)],
  gender: ['Male', 'Female'][Math.floor(Math.random() * 2)],
  email: `student${index + 1}@school.com`
}));

const AddInfirmaryRecord = ({ isOpen, onClose, student }) => {
  const [records, setRecords] = useState([{ complaints: '', details: '', treatment: '', consentFrom: '', date: new Date().toISOString().split('T')[0], time: new Date().toLocaleTimeString('en-US', { hour12: false, hours: '2-digit', minutes: '2-digit' }) }]);
  const [recentComplaint, setRecentComplaint] = useState(null);
  
  // Simulated recent complaint - replace with actual data fetch
  useEffect(() => {
    // This is a mock recent complaint. Replace with actual API call or data fetch
    const mockRecentComplaint = {
      date: '2024-03-10',
      complaints: 'Fever',
      details: 'Temperature: 101°F',
      treatment: 'Prescribed paracetamol'
    };
    setRecentComplaint(mockRecentComplaint);
  }, []);
  
  if (!isOpen) return null;

  const handleAddMore = () => {
    setRecords([...records, { 
      complaints: '', 
      details: '', 
      treatment: '', 
      consentFrom: '',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', { hour12: false, hours: '2-digit', minutes: '2-digit' })
    }]);
  };

  const handleRemoveRecord = (index) => {
    setRecords(records.filter((_, i) => i !== index));
  };

  const handleInputChange = (index, field, value) => {
    const newRecords = [...records];
    newRecords[index][field] = value;
    setRecords(newRecords);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ student, records });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="px-6 py-4 border-b flex justify-between items-center sticky top-0 bg-white z-10">
            <h2 className="text-xl font-semibold text-gray-800">Add Infirmary Record</h2>
            <button 
              type="button" 
              onClick={onClose} 
              className="text-gray-500 hover:text-gray-700"
            >
              <IoMdClose className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6">
            {/* Student Info Section */}
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600">Student Name</label>
                  <p className="text-gray-900 font-medium">{student?.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Student ID</label>
                  <p className="text-gray-900 font-medium">{student?.id}</p>
                </div>
                </div>
              </div>

            {/* Recent Complaint Section */}
            {recentComplaint && (
              <div className="mb-6">
                <h3 className="text-md font-medium text-gray-700 mb-2">Recent Complaint</h3>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                      <span className="font-medium">Date: </span>
                      {recentComplaint.date}
                </div>
                <div>
                      <span className="font-medium">Complaint: </span>
                      {recentComplaint.complaints}
                </div>
                <div>
                      <span className="font-medium">Details: </span>
                      {recentComplaint.details}
                </div>
                    <div>
                      <span className="font-medium">Treatment: </span>
                      {recentComplaint.treatment}
              </div>
            </div>
                </div>
              </div>
            )}

            {/* Records Section */}
            <div className="space-y-4">
              {records.map((record, index) => (
                <div key={index} className="relative bg-gray-50 rounded-lg p-4 border">
                  <div className="space-y-4">
                    {/* Date and Time Row */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date *
                        </label>
                        <input
                          type="date"
                          value={record.date}
                          onChange={(e) => handleInputChange(index, 'date', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Time *
                        </label>
                        <input
                          type="time"
                          value={record.time}
                          onChange={(e) => handleInputChange(index, 'time', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>

                    {/* Consent From Row */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Consent From *
                      </label>
                      <select
                        value={record.consentFrom}
                        onChange={(e) => handleInputChange(index, 'consentFrom', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Select Consent From</option>
                        <option value="Parent">Parent</option>
                        <option value="Guardian">Guardian</option>
                        <option value="Teacher">Teacher</option>
                        <option value="School Authority">School Authority</option>
                      </select>
                    </div>

                    {/* Complaints, Details, and Treatment Row */}
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Complaints *
                        </label>
                        <select
                          value={record.complaints}
                          onChange={(e) => handleInputChange(index, 'complaints', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value="">Select Complaint</option>
                          <option value="Fever">Fever</option>
                          <option value="Headache">Headache</option>
                          <option value="Stomach Pain">Stomach Pain</option>
                          <option value="Injury">Injury</option>
                          <option value="Others">Others</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Details *
                        </label>
                        <input
                          type="text"
                          value={record.details}
                          onChange={(e) => handleInputChange(index, 'details', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter details"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Treatment *
                        </label>
                        <input
                          type="text"
                          value={record.treatment}
                          onChange={(e) => handleInputChange(index, 'treatment', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter treatment"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveRecord(index)}
                      className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1 hover:bg-red-200"
                      title="Remove"
                    >
                      <FaTimes className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Add More Button */}
            <button
              type="button"
              onClick={handleAddMore}
              className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center justify-center w-full"
            >
              <FaPlus className="mr-2" /> Add More Records
            </button>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t flex justify-end gap-4 sticky bottom-0 bg-white">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Save Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Infirmary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 20 });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const itemsPerPage = 20;
  const tableRef = useRef(null);

  const filteredData = useMemo(() => {
    return infirmaryData.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.school.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleScroll = useCallback((e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;
    
    if (scrollPercentage > 80 && !loading && hasMore) {
      loadMoreItems();
    }
  }, [loading, hasMore]);

  const loadMoreItems = () => {
    if (loading || !hasMore) return;

    setLoading(true);
    const nextPage = currentPage + 1;
    const nextEnd = Math.min(nextPage * itemsPerPage, filteredData.length);
    
    // Simulate loading delay
    setTimeout(() => {
      setVisibleRange(prev => ({
        start: prev.start,
        end: nextEnd
      }));
      setCurrentPage(nextPage);
      setHasMore(nextEnd < filteredData.length);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    const tableElement = tableRef.current;
    if (tableElement) {
      tableElement.addEventListener('scroll', handleScroll);
      return () => tableElement.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  // Reset pagination when search term changes
  useEffect(() => {
    setVisibleRange({ start: 0, end: itemsPerPage });
    setCurrentPage(1);
    setHasMore(true);
  }, [searchTerm]);

  const handleAddRecord = (student) => {
    setSelectedStudent(student);
    setShowAddRecord(true);
  };

  return (
    <div className="flex flex-col h-full bg-white p-6">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name, ID, school, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-12 px-12 text-lg border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
        </div>
      </div>

      {/* Table Container */}
      <div className="flex-1 border rounded-lg overflow-hidden shadow-lg bg-white">
        {/* Table Header */}
        <div className="grid grid-cols-8 gap-4 px-6 py-4 bg-gray-50 border-b sticky top-0 z-10">
          <div className="text-sm font-semibold text-gray-700">Sl.No</div>
          <div className="text-sm font-semibold text-gray-700">Student ID</div>
          <div className="text-sm font-semibold text-gray-700">Name</div>
          <div className="text-sm font-semibold text-gray-700">School</div>
          <div className="text-sm font-semibold text-gray-700">Mobile Number</div>
          <div className="text-sm font-semibold text-gray-700">Class</div>
          <div className="text-sm font-semibold text-gray-700">Email</div>
          <div className="text-sm font-semibold text-gray-700 text-center">Records</div>
        </div>

        {/* Table Body */}
        <div 
          ref={tableRef}
          className="overflow-y-auto max-h-[calc(100vh-300px)]"
        >
          {filteredData.slice(visibleRange.start, visibleRange.end).map((student, index) => (
            <div 
              key={student.id} 
              className="grid grid-cols-8 gap-4 px-6 py-4 border-b transition-colors hover:bg-gray-50"
            >
              <div className="flex items-center text-gray-600">
                {visibleRange.start + index + 1}
              </div>
              <div className="flex items-center font-medium text-gray-700">
                {student.id}
              </div>
              <div className="flex items-center text-gray-700">
                {student.name}
              </div>
              <div className="flex items-center text-gray-600">
                {student.school}
              </div>
              <div className="flex items-center text-gray-600">
                {student.mobile}
              </div>
              <div className="flex items-center text-gray-600">
                {student.class}
              </div>
              <div className="flex items-center text-gray-600">
                {student.email || `${student.id.toLowerCase()}@school.com`}
              </div>
              <div className="flex items-center justify-center">
                <button
                  onClick={() => handleAddRecord(student)}
                  className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors"
                  title="Add Record"
                >
                  <FaPlus className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {loading && (
            <div className="px-6 py-8 text-center text-gray-500 bg-gray-50 border-b">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
              <div className="mt-2">Loading more items...</div>
            </div>
          )}

          {/* Empty state */}
          {filteredData.length === 0 && (
            <div className="px-6 py-12 text-center">
              <div className="text-gray-400 text-lg mb-2">No records found</div>
              <div className="text-gray-500 text-sm">Try adjusting your search terms</div>
            </div>
          )}
        </div>
      </div>

      {/* Pagination info */}
      <div className="mt-4 px-2 text-sm text-gray-600 flex items-center justify-between">
        <div>
          Showing {visibleRange.start + 1} to {Math.min(visibleRange.end, filteredData.length)} of {filteredData.length} entries
        </div>
        {hasMore && (
          <div className="text-gray-500">
            Scroll down to load more
          </div>
        )}
      </div>

      {/* Add Record Form */}
      <AddInfirmaryRecord
        isOpen={showAddRecord}
        onClose={() => setShowAddRecord(false)}
        student={selectedStudent}
      />
    </div>
  );
};

const ReportFilters = ({ isOpen, onClose, filters, onFilterChange }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl m-4">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-medium text-gray-700">Report Filters</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <IoMdClose className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Class Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Class
            </label>
            <select
              value={filters.class}
              onChange={(e) => onFilterChange('class', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Classes</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={`Grade ${i + 1}`}>
                  Grade {i + 1}
                </option>
              ))}
            </select>
          </div>

          {/* Section Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Section
            </label>
            <select
              value={filters.section}
              onChange={(e) => onFilterChange('section', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Sections</option>
              <option value="A">Section A</option>
              <option value="B">Section B</option>
              <option value="C">Section C</option>
            </select>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                From Date
              </label>
              <input
                type="date"
                value={filters.fromDate}
                onChange={(e) => onFilterChange('fromDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To Date
              </label>
              <input
                type="date"
                value={filters.toDate}
                onChange={(e) => onFilterChange('toDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Report Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Report Type
            </label>
            <select
              value={filters.reportType}
              onChange={(e) => onFilterChange('reportType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Report Type</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        </div>

        <div className="px-6 py-4 border-t flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

const Report = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    class: '',
    section: '',
    fromDate: '',
    toDate: '',
    reportType: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 20 });
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const tableRef = useRef(null);

  const filteredData = useMemo(() => {
    return infirmaryData.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.school.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleScroll = useCallback((e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;
    
    if (scrollPercentage > 80 && !loading && hasMore) {
      loadMoreItems();
    }
  }, [loading, hasMore]);

  const loadMoreItems = () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setTimeout(() => {
      setVisibleRange(prev => ({
        start: prev.start,
        end: Math.min(prev.end + 10, filteredData.length)
      }));
      setHasMore(visibleRange.end + 10 < filteredData.length);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    const tableElement = tableRef.current;
    if (tableElement) {
      tableElement.addEventListener('scroll', handleScroll);
      return () => tableElement.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  return (
    <div className="flex flex-col h-full bg-white p-6">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative flex gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-12 px-12 text-lg border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
          </div>
          <button
            onClick={() => setShowFilters(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
          >
            <FaFilter />
            Filters
          </button>
        </div>

        {/* Active Filters Display */}
        {Object.values(filters).some(value => value) && (
          <div className="mt-3 flex flex-wrap gap-2">
            {Object.entries(filters).map(([key, value]) => {
              if (!value) return null;
              return (
                <div key={key} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  <span>{key}: {value}</span>
                  <button
                    onClick={() => handleFilterChange(key, '')}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FaTimes className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="flex-1 border rounded-lg overflow-hidden shadow-lg bg-white">
        {/* Table Header */}
        <div className="grid grid-cols-9 gap-4 px-6 py-4 bg-gray-50 border-b sticky top-0 z-10">
          <div className="text-sm font-semibold text-gray-700">Sl.No</div>
          <div className="text-sm font-semibold text-gray-700">Date</div>
          <div className="text-sm font-semibold text-gray-700">Name</div>
          <div className="text-sm font-semibold text-gray-700">Student ID</div>
          <div className="text-sm font-semibold text-gray-700">School</div>
          <div className="text-sm font-semibold text-gray-700">Complaints</div>
          <div className="text-sm font-semibold text-gray-700">Details</div>
          <div className="text-sm font-semibold text-gray-700">Consent From</div>
          <div className="text-sm font-semibold text-gray-700">Treatment</div>
        </div>

        {/* Table Body */}
        <div 
          ref={tableRef}
          className="overflow-y-auto max-h-[calc(100vh-300px)]"
        >
          {filteredData.slice(visibleRange.start, visibleRange.end).map((record, index) => (
            <div 
              key={record.id} 
              className="grid grid-cols-9 gap-4 px-6 py-4 border-b hover:bg-gray-50"
            >
              <div className="flex items-center text-gray-600">
                {visibleRange.start + index + 1}
              </div>
              <div className="flex items-center text-gray-600">
                {new Date(record.date).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </div>
              <div className="flex items-center text-gray-700 font-medium">
                {record.name}
              </div>
              <div className="flex items-center text-gray-600">
                {record.studentId}
              </div>
              <div className="flex items-center text-gray-600">
                {record.school}
              </div>
              <div className="flex items-center">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {record.complaints}
                </span>
              </div>
              <div className="flex items-center text-gray-600">
                {record.details}
              </div>
              <div className="flex items-center">
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  {record.consentFrom}
                </span>
              </div>
              <div className="flex items-center text-gray-600">
                {record.treatment}
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {loading && (
            <div className="px-6 py-8 text-center text-gray-500 bg-gray-50 border-b">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
              <div className="mt-2">Loading more items...</div>
            </div>
          )}

          {/* Empty state */}
          {filteredData.length === 0 && (
            <div className="px-6 py-12 text-center">
              <div className="text-gray-400 text-lg mb-2">No records found</div>
              <div className="text-gray-500 text-sm">Try adjusting your search terms</div>
            </div>
          )}
        </div>
      </div>

      {/* Pagination info */}
      <div className="mt-4 px-2 text-sm text-gray-600 flex items-center justify-between">
        <div>
          Showing {visibleRange.start + 1} to {Math.min(visibleRange.end, filteredData.length)} of {filteredData.length} entries
        </div>
        {hasMore && (
          <div className="text-gray-500">
            Scroll down to load more
          </div>
        )}
      </div>

      {/* Filters Modal */}
      <ReportFilters
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
      />
    </div>
  )
}

const Ahana = () => {
  const [activeTab, setActiveTab] = useState('students')

  const tabs = [
    { id: 'students', label: 'My Students' },
    { id: 'assessment', label: 'Assessment Report' },
    { id: 'infirmary', label: 'Infirmary' },
    { id: 'report', label: 'Report' }
  ]

  return (
    <div className="w-full h-full">
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
        {activeTab === 'students' && <AllStudents />}
        {activeTab === 'assessment' && <AssessmentReport />}
        {activeTab === 'infirmary' && <Infirmary />}
        {activeTab === 'report' && <Report />}
      </div>
    </div>
  )
}

export default Ahana