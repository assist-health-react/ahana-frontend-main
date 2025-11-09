import { useState, useEffect } from 'react';
import { membersService } from '../../../services/membersService';
import { FaPlus, FaEye } from 'react-icons/fa';
import AddAssessmentForm from './AddAssessmentForm';

const AssessmentList = ({ onViewDetails, onAddAssessment, loading: parentLoading, searchTerm, filters, schoolId }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const params = {
          isStudent: true,
          page: 1,
          limit: 100,
          sortBy: 'createdAt',
          sortOrder: 'desc',
          schoolId: schoolId || undefined,
          search: searchTerm || undefined,
          grade: filters.grade || undefined,
          section: filters.section || undefined
        };

        console.log('Fetching students with params:', params);
        const response = await membersService.getMembers(params);
        
        if (response.status === 'success' && response.data) {
          const formattedStudents = response.data.map(student => ({
            id: student._id,
            memberId: student.memberId,
            studentDetails: {
              schoolId: student.studentDetails?.schoolId,
              grade: student.studentDetails?.grade,
              section: student.studentDetails?.section
            },
            name: student.name,
            phone: student.phone,
            gender: student.gender,
            class: student.studentDetails?.grade || 'N/A',
            section: student.studentDetails?.section || 'N/A'
          }));

          setStudents(formattedStudents);
        }
      } catch (err) {
        setError('Failed to fetch students');
        console.error('Error fetching students:', err);
      } finally {
        setLoading(false);
      }
    };

    if (schoolId) {
      fetchStudents();
    }
  }, [searchTerm, filters, schoolId]); // This effect will run when activeSearchTerm changes

  const handleAddAssessment = (student) => {
    setSelectedStudent(student);
    setShowAddForm(true);
  };

  const handleFormClose = () => {
    setShowAddForm(false);
    setSelectedStudent(null);
  };

  const handleFormSuccess = (newAssessment) => {
    // Call the parent's onAddAssessment if provided
    if (onAddAssessment) {
      onAddAssessment(newAssessment);
    }
    handleFormClose();
  };

  return (
    <>
    <div className="flex-1 border rounded-lg overflow-hidden shadow-lg bg-white">
      {/* Table Header */}
      <div className="grid grid-cols-8 gap-4 px-6 py-4 bg-gray-50 border-b sticky top-0">
        <div className="text-sm font-semibold text-gray-700">Sl.No</div>
        <div className="text-sm font-semibold text-gray-700">Student ID</div>
        <div className="text-sm font-semibold text-gray-700">Name</div>
        <div className="text-sm font-semibold text-gray-700">Mobile Number</div>
        <div className="text-sm font-semibold text-gray-700">Gender</div>
        <div className="text-sm font-semibold text-gray-700">Grade</div>
        <div className="text-sm font-semibold text-gray-700 text-center">Action</div>
        <div className="text-sm font-semibold text-gray-700 text-center">Assessment</div>
      </div>

      {/* Table Body */}
      <div className="overflow-y-auto max-h-[calc(100vh-300px)]">
        {(loading || parentLoading) ? (
          <div className="px-6 py-8 text-center text-gray-500 bg-gray-50 border-b">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
            <div className="mt-2">Loading students...</div>
          </div>
        ) : students.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <div className="text-gray-400 text-lg mb-2">No students found</div>
            <div className="text-gray-500 text-sm">Try adjusting your search terms or filters</div>
          </div>
        ) : (
          students.map((student, index) => (
            <div 
              key={student.id} 
              className="grid grid-cols-8 gap-4 px-6 py-4 border-b hover:bg-gray-50"
            >
              <div className="flex items-center text-gray-600">
                {index + 1}
              </div>
              <div className="flex items-center text-gray-600">
                {student.memberId}
              </div>
              <div className="flex items-center text-gray-700 font-medium">
                {student.name}
              </div>
              <div className="flex items-center text-gray-600">
                {student.phone}
              </div>
              <div className="flex items-center text-gray-600">
                {student.gender}
              </div>
              <div className="flex items-center text-gray-600">
                {student.class} - {student.section}
              </div>
              <div className="flex items-center justify-center">
                <button
                  onClick={() => onViewDetails(student)}
                  className="text-blue-600 hover:text-blue-800 px-3 py-1 rounded hover:bg-blue-50"
                  title="View Assessment History"
                >
                  <FaEye />
                </button>
              </div>
              <div className="flex items-center justify-center">
                <button
                    onClick={() => handleAddAssessment(student)}
                  className="text-green-600 hover:text-green-800 p-2 rounded-full hover:bg-green-50"
                  title="Add Assessment"
                >
                  <FaPlus />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {error && (
        <div className="p-4 text-center text-red-600 bg-red-50 border-t">
          <p>{error}</p>
        </div>
      )}
    </div>

      {/* Add Assessment Form Modal */}
      <AddAssessmentForm
        isOpen={showAddForm}
        onClose={handleFormClose}
        student={selectedStudent}
        onSuccess={handleFormSuccess}
        schoolId={schoolId}
      />
    </>
  );
};

export default AssessmentList; 