import { IoMdClose } from 'react-icons/io';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { getInfirmaryRecordById, deleteInfirmaryRecord } from '../../../services/infirmaryService';
import { toast } from 'react-hot-toast';

const ViewInfirmaryDetails = ({ isOpen, onClose, recordId, student, onEdit, onDelete }) => {
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchRecordDetails = async () => {
      if (!isOpen || !recordId) return;

      try {
        setLoading(true);
        setError(null);
        const response = await getInfirmaryRecordById(recordId);
        if (response.data) {
          setRecord(response.data);
        }
      } catch (err) {
        setError('Failed to fetch record details');
        console.error('Error fetching record details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecordDetails();
  }, [isOpen, recordId]);

  const handleEdit = () => {
    if (record) {
      onEdit({
        ...record,
        treatmentGiven: record.treatmentGiven || record.treatment,
        date: record.date,
        time: record.time,
        medicineProvided: record.medicineProvided ? {
          inventoryId: record.medicineProvided.inventoryId,
          quantity: record.medicineProvided.quantity
        } : null
      });
      onClose();
    }
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!record) return;
    
    try {
      setIsDeleting(true);
      await deleteInfirmaryRecord(record._id); // 204 status code means success
      toast.success('Record deleted successfully');
      setShowDeleteConfirm(false);
      onClose(); // Close the details modal after successful deletion
      if (onDelete) {
        await onDelete(record._id); // Call the parent's onDelete handler
      }
    } catch (error) {
      console.error('Error deleting record:', error);
      toast.error(error.message || 'Failed to delete record');
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (date, time) => {
    if (!date || !time) return '';
    return `${formatDate(date)} ${time}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      {/* Main Content */}
      {loading ? (
        <div className="relative top-20 mx-auto p-5 border max-w-2xl shadow-lg rounded-md bg-white">
          <div className="flex justify-center items-center py-8">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      ) : error ? (
        <div className="relative top-20 mx-auto p-5 border max-w-2xl shadow-lg rounded-md bg-white">
          <div className="text-center py-8 text-red-600">
            <p>{error}</p>
            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Close
            </button>
          </div>
        </div>
      ) : record && (
        <div className="relative top-20 mx-auto p-5 border max-w-2xl shadow-lg rounded-md bg-white">
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Infirmary Record Details</h2>
              <p className="text-sm text-gray-500 mt-1">Created: {formatDate(record.createdAt)}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleEdit}
                className="text-blue-600 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-full transition-colors"
                title="Edit Record"
              >
                <FaEdit className="h-5 w-5" />
              </button>
              <button
                onClick={handleDelete}
                className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-full transition-colors"
                title="Delete Record"
              >
                <FaTrash className="h-5 w-5" />
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <IoMdClose className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="px-6 py-4 space-y-6">
            {/* Visit Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Visit Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Visit Date & Time</label>
                  <div className="mt-1 text-sm text-gray-900">
                    {formatDateTime(record.date, record.time)}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Consent From</label>
                  <div className="mt-1 text-sm text-gray-900 capitalize">{record.consentFrom}</div>
                </div>
              </div>
            </div>

            {/* Medical Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Medical Information</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Complaints</label>
                  <div className="mt-1 text-sm text-gray-900">{record.complaints}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Details</label>
                  <div className="mt-1 text-sm text-gray-900">{record.details}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Treatment Given</label>
                  <div className="mt-1 text-sm text-gray-900">{record.treatmentGiven}</div>
                </div>
              </div>
            </div>

            {/* Medicine Information */}
            {record.medicineProvided && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Medicine Provided</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Medicine Name</label>
                    <div className="mt-1 text-sm text-gray-900">{record.medicineProvided.inventoryId.item_name}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Quantity</label>
                    <div className="mt-1 text-sm text-gray-900">{record.medicineProvided.quantity}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Timestamps */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Record Timeline</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Created At</label>
                  <div className="mt-1 text-sm text-gray-900">{formatDate(record.createdAt)}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Last Updated</label>
                  <div className="mt-1 text-sm text-gray-900">{formatDate(record.updatedAt)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t">
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal - Positioned on top */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-[60]">
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="relative bg-white rounded-lg p-6 max-w-sm mx-4 shadow-xl">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-sm text-gray-500 mb-4">
              Are you sure you want to delete this infirmary record? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewInfirmaryDetails; 