import { useState, useEffect } from 'react';
import { IoMdClose } from 'react-icons/io';
import Select from 'react-select';
import { getAllInventoryItems } from '../../../services/inventoryService';
import { createInfirmaryRecord, validateMedicineQuantity } from '../../../services/infirmaryService';
import { toast } from 'react-hot-toast';
import { useOutletContext } from 'react-router-dom';

const customStyles = {
  control: (provided) => ({
    ...provided,
    minHeight: '42px',
    borderRadius: '0.5rem',
    borderColor: '#D1D5DB',
    '&:hover': {
      borderColor: '#D1D5DB'
    }
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 9999,
    borderRadius: '0.5rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    marginTop: '4px',
    position: 'absolute',
    width: '100%',
    backgroundColor: 'white'
  }),
  menuList: (provided) => ({
    ...provided,
    maxHeight: '200px',
    overflowY: 'auto',
    padding: '4px',
    '::-webkit-scrollbar': {
      width: '8px',
      height: '0px',
    },
    '::-webkit-scrollbar-track': {
      background: '#f1f1f1',
      borderRadius: '4px'
    },
    '::-webkit-scrollbar-thumb': {
      background: '#888',
      borderRadius: '4px',
      '&:hover': {
      background: '#555'
      }
    }
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? '#3B82F6' : state.isFocused ? '#EFF6FF' : 'white',
    color: state.isSelected ? 'white' : '#1F2937',
    padding: '10px 12px',
    borderRadius: '0.375rem',
    cursor: 'pointer',
    '&:active': {
      backgroundColor: state.isSelected ? '#3B82F6' : '#DBEAFE'
    }
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: '2px 12px'
  }),
  singleValue: (provided) => ({
    ...provided,
    color: '#1F2937'
  }),
  placeholder: (provided) => ({
    ...provided,
    color: '#6B7280'
  }),
  indicatorSeparator: () => ({
    display: 'none'
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    color: '#6B7280',
    '&:hover': {
      color: '#374151'
    }
  })
};

const AddInfirmaryRecord = ({ isOpen, onClose, student, onSuccess }) => {
  const { school } = useOutletContext() || {};
  const [formData, setFormData] = useState({
    consentFrom: '',
    consentDate: new Date().toISOString().split('T')[0],
    consentTime: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
    complaints: '',
    otherComplaint: '',
    details: '',
    treatment: '',
    tablet: null,
    quantity: ''
  });

  const [tablets, setTablets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchTablets = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getAllInventoryItems({ schoolId: school?._id });
        if (response.data) {
          const tabletOptions = response.data
            .filter(item => item.current_stock > 0) // Only show items with stock
            .map(item => ({
              value: item._id,
              label: `${item.item_name} (Stock: ${item.current_stock})`,
              stock: item.current_stock
            }));
          setTablets(tabletOptions);
        }
      } catch (error) {
        console.error('Error fetching tablets:', error);
        setError('Failed to fetch tablets');
        toast.error('Failed to fetch tablets');
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && school?._id) {
      fetchTablets();
    }
  }, [school?._id, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError(null);
  };

  const validateForm = () => {
    if (!formData.consentFrom) {
      setError('Please select who provided consent');
      return false;
    }
    if (!formData.complaints && !formData.otherComplaint) {
      setError('Please specify the complaints');
      return false;
    }
    if (formData.tablet && !formData.quantity) {
      setError('Please specify the quantity of tablets');
      return false;
    }
    if (formData.quantity && !formData.tablet) {
      setError('Please select a tablet');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      setError(null);

      // Validate medicine quantity if medicine is selected
      if (formData.tablet && formData.quantity) {
        await validateMedicineQuantity(formData.tablet.value, parseInt(formData.quantity, 10));
      }

      const recordData = {
        studentId: student.id,
        schoolId: school?._id,
        nurseId: "681314882d74c3b90f8faa72", // TODO: Get from context
        date: formData.consentDate,
        time: formData.consentTime,
        consentFrom: formData.consentFrom.toLowerCase(),
        complaints: formData.complaints === 'Others' ? formData.otherComplaint : formData.complaints,
        details: formData.details,
        treatmentGiven: formData.treatment,
        medicineProvided: formData.tablet && formData.quantity ? {
          inventoryId: formData.tablet.value,
          quantity: parseInt(formData.quantity, 10)
        } : undefined
      };

      const response = await createInfirmaryRecord(recordData);
      
      if (response.data) {
        toast.success('Record added successfully');
        if (onSuccess) {
          await onSuccess();
        }
        if (onClose) {
          onClose();
        }
      } else {
        throw new Error(response.message || 'Failed to add record');
      }
    } catch (error) {
      console.error('Error creating infirmary record:', error);
      setError(error.message || 'Failed to add record');
      toast.error(error.message || 'Failed to add record');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          {/* Header */}
          <div className="px-6 py-4 border-b flex justify-between items-center bg-white z-10">
            <h2 className="text-xl font-semibold text-gray-800">Add Infirmary Record</h2>
            <button 
              type="button" 
              onClick={onClose} 
              className="text-gray-500 hover:text-gray-700"
            >
              <IoMdClose className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 flex-1 overflow-y-auto">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}

            {/* Student Info Section */}
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600">Student Name</label>
                  <p className="text-gray-900 font-medium">{student?.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Class & Section</label>
                  <p className="text-gray-900 font-medium">{student?.class} - {student?.section}</p>
                </div>
              </div>
            </div>

            {/* Record Form */}
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Consent From *
                      </label>
                      <select
                    value={formData.consentFrom}
                    onChange={(e) => handleInputChange('consentFrom', e.target.value)}
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
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date *
                      </label>
                      <input
                        type="date"
                    value={formData.consentDate}
                    onChange={(e) => handleInputChange('consentDate', e.target.value)}
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
                    value={formData.consentTime}
                    onChange={(e) => handleInputChange('consentTime', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

              <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Complaints *
                      </label>
                      <select
                  value={formData.complaints}
                  onChange={(e) => handleInputChange('complaints', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Select Complaint</option>
                        <option value="Fever">Fever</option>
                        <option value="Headache">Headache</option>
                        <option value="Stomach Pain">Stomach Pain</option>
                  <option value="Nausea">Nausea</option>
                        <option value="Others">Others</option>
                      </select>
                {formData.complaints === 'Others' && (
                        <input
                          type="text"
                    value={formData.otherComplaint}
                    onChange={(e) => handleInputChange('otherComplaint', e.target.value)}
                    placeholder="Specify other complaint"
                    className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                  Details
                      </label>
                <textarea
                  value={formData.details}
                  onChange={(e) => handleInputChange('details', e.target.value)}
                  placeholder="Enter additional details about the complaint"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                  Treatment Given
                      </label>
                <textarea
                  value={formData.treatment}
                  onChange={(e) => handleInputChange('treatment', e.target.value)}
                  placeholder="Enter treatment details"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                      />
                  </div>

              <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                    Medicine
                      </label>
                      <Select
                    value={formData.tablet}
                    onChange={(option) => handleInputChange('tablet', option)}
                        options={tablets}
                    isLoading={loading}
                        isClearable
                    placeholder="Select medicine"
                        styles={customStyles}
                    noOptionsMessage={() => "No medicines available"}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quantity
                      </label>
                      <input
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={(e) => handleInputChange('quantity', e.target.value)}
                    placeholder="Enter quantity"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={!formData.tablet}
                      />
                    </div>
                  </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t bg-gray-50 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center space-x-2"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Adding...</span>
                </>
              ) : (
                <span>Add Record</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddInfirmaryRecord; 