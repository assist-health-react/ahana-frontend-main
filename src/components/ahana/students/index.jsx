import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { FaSearch, FaFilter, FaUserPlus, FaEye, FaTimes } from 'react-icons/fa';
import { membersService } from '../../../services/membersService';
import { getSchoolById } from '../../../services/schoolsService';
import StudentList from './StudentList';
import StudentFilters from './StudentFilters';
import AddStudentForm from './AddStudentForm';
import AddAssessmentForm from './AddAssessmentForm';
import ViewStudentDetails from './ViewStudentDetails';
import { useOutletContext } from 'react-router-dom';

const AllStudents = () => {
  const { schoolId, schoolData, isLoading: isLoadingSchool } = useOutletContext() || {};
  console.log('AllStudents rendered with schoolId:', schoolId);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [students, setStudents] = useState([]);
  const [showAddStudentForm, setShowAddStudentForm] = useState(false);
  const [showAssessmentForm, setShowAssessmentForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showViewDetails, setShowViewDetails] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    name: '',
    grade: '',
    section: ''
  });
  const tableRef = useRef(null);
  const itemsPerPage = 10;
  const [shouldFetch, setShouldFetch] = useState(false);
  const isInitialMount = useRef(true);

  const fetchStudents = useCallback(async () => {
    if (!schoolId) {
      console.log('No school ID provided to students component');
      setError('No school selected');
      return;
    }

    try {
      console.log('Making API call to fetch students for school:', schoolId);
      setError(null);
      setLoading(true);
      
      const currentSearch = searchTerm || filters.name || '';
      
      const params = {
        isStudent: true,
        schoolId: schoolId,
        page: currentPage,
        limit: itemsPerPage,
        search: currentSearch,
        sortBy: 'createdAt',
        sortOrder: 'asc'
      };

      // Add grade and section filters directly to params
      if (filters.grade) {
        params.grade = filters.grade;
      }
      if (filters.section) {
        params.section = filters.section;
      }
      
      console.log('Sending params to API:', params);

      const response = await membersService.getMembers(params);

      console.log('API Response received:', response);

      if (!response || !response.data) {
        throw new Error('No data in API response');
      }

      const studentsList = response.data.map(student => ({
        id: student._id,
        studentId: student.memberId,
        name: student.name,
        mobile: student.phone,
        school: student.address?.region || '',
        class: student.studentDetails?.grade || '',
        section: student.studentDetails?.section || '',
        gender: student.gender || '',
        email: student.email,
        dob: student.dob,
        bloodGroup: student.bloodGroup,
        profilePic: student.profilePic || '',
        addressDescription: student.address?.description || '',
        addressPinCode: student.address?.pinCode || '',
        addressRegion: student.address?.region || '',
        addressLandmark: student.address?.landmark || '',
        addressState: student.address?.state || '',
        addressCountry: student.address?.country || '',
        emergencyContactName: student.emergencyContact?.name || '',
        emergencyContactRelation: student.emergencyContact?.relation || '',
        emergencyContactPhone: student.emergencyContact?.phone || ''
      }));

      console.log('Processed students data:', studentsList);
      setStudents(prev => currentPage === 1 ? studentsList : [...prev, ...studentsList]);
      setHasMore(studentsList.length === itemsPerPage);
    } catch (error) {
      console.error('API call failed:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      setError(
        `Failed to fetch students: ${error.response?.data?.message || error.message}`
      );
      setHasMore(false);
    } finally {
      setLoading(false);
      setShouldFetch(false);
    }
  }, [schoolId, currentPage, itemsPerPage, searchTerm, filters]);

  // Effect to handle initial mount and schoolId changes
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      if (schoolId) {
        setShouldFetch(true);
      }
    }
  }, [schoolId]);

  // Effect to handle data fetching
  useEffect(() => {
    if (shouldFetch && !isLoadingSchool) {
      fetchStudents();
    }
  }, [shouldFetch, isLoadingSchool, fetchStudents]);

  const handleFilterChange = (filterName, value) => {
    console.log('Filter changed:', filterName, value);
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const handleApplyFilters = () => {
    console.log('Applying filters:', filters);
    if (schoolId) {
      setCurrentPage(1);
      setStudents([]);
      setShouldFetch(true);
    }
  };

  const handleSearch = () => {
    if (schoolId) {
      setCurrentPage(1);
      setStudents([]);
      setShouldFetch(true);
    }
  };

  const handleViewStudent = async (student) => {
    console.log('Viewing student:', student);
    setSelectedStudent(student);
    setShowViewDetails(true);
  };

  const handleEditStudent = (studentData) => {
    console.log('Editing student with data:', studentData);
    setSelectedStudent(studentData);
    setShowViewDetails(false);
        setShowAddStudentForm(true);
  };

  const filteredStudents = useMemo(() => {
    console.log('Filtering students:', students);
    return students;
  }, [students]);

  console.log('Rendering AllStudents with:', {
    loading,
    studentsCount: students.length,
    filteredCount: filteredStudents.length,
    error
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-4">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <h1 className="text-2xl font-bold text-gray-800">Students</h1>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full md:w-auto">
            {/* Search Bar */}
            <div className="flex-1 sm:flex-none">
              <div className="relative flex items-center">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10 pr-10"
                  />
                  <FaSearch className="absolute left-3 top-3 text-gray-400" />
                  {searchTerm && (
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setCurrentPage(1);
                        setStudents([]);
                        setShouldFetch(true);
                      }}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      title="Clear search"
                    >
                      <FaTimes className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <button
                  onClick={handleSearch}
                  className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-shrink-0"
                >
                  Search
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
          <button
            onClick={() => setShowFilters(true)}
                className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center space-x-2"
          >
            <FaFilter className="w-4 h-4" />
                <span>Filter</span>
          </button>
          <button
                onClick={() => {
                  setSelectedStudent(null);
                  setShowAddStudentForm(true);
                }}
                className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center space-x-2"
          >
                <FaUserPlus className="w-4 h-4" />
            <span>Add Student</span>
          </button>
        </div>
      </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Student List */}
          <StudentList
            students={filteredStudents}
            onViewDetails={handleViewStudent}
            loading={loading}
            hasMore={hasMore}
            loadMore={() => setCurrentPage(prev => prev + 1)}
            tableRef={tableRef}
            searchTerm={searchTerm}
          />
      </div>

      {/* Modals */}
      {showAddStudentForm && (
        <AddStudentForm
          isOpen={showAddStudentForm}
          onClose={() => {
            setShowAddStudentForm(false);
            setSelectedStudent(null);
          }}
          onSuccess={() => {
            setShowAddStudentForm(false);
            setSelectedStudent(null);
            setCurrentPage(1);
            setStudents([]);
            setShouldFetch(true);
          }}
          schoolId={schoolId}
          initialData={selectedStudent}
          isEditing={!!selectedStudent}
        />
      )}

      {showAssessmentForm && selectedStudent && (
        <AddAssessmentForm
          isOpen={showAssessmentForm}
          onClose={() => {
            setShowAssessmentForm(false);
            setSelectedStudent(null);
          }}
          onSuccess={() => {
            setShowAssessmentForm(false);
            setSelectedStudent(null);
          }}
          student={selectedStudent}
        />
      )}

      {showViewDetails && selectedStudent && (
        <ViewStudentDetails
          isOpen={showViewDetails}
          onClose={() => {
            setShowViewDetails(false);
            setSelectedStudent(null);
          }}
          studentId={selectedStudent}
          onEdit={handleEditStudent}
        />
      )}

      {showFilters && (
      <StudentFilters
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
          onApply={() => {
            setShowFilters(false);
            handleApplyFilters();
        }}
      />
      )}
    </div>
  );
};

export default AllStudents; 