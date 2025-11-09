import { useState, useEffect } from 'react';
import { membersService } from '../../../services/membersService';

const InfirmaryList = ({ searchTerm, filters, loading: parentLoading, schoolId }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!schoolId) return;

      try {
        setLoading(true);
        setError(null);
        
        const params = {
          isStudent: true,
          page: 1,
          limit: 100,
          sortBy: 'createdAt',
          sortOrder: 'desc',
          schoolId: schoolId,
          search: filters.name || searchTerm || undefined,
          grade: filters.grade || undefined,
          section: filters.section || undefined
        };

        console.log('Fetching students with params:', params);
        const response = await membersService.getMembers(params);
        
        if (response.status === 'success' && response.data) {
          const formattedStudents = response.data.map(student => ({
            id: student._id,
            memberId: student.memberId,
            name: student.name,
            phone: student.phone,
            gender: student.gender,
            class: student.studentDetails?.grade || 'N/A',
            section: student.studentDetails?.section || 'N/A',
            email: student.email
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

    fetchStudents();
  }, [searchTerm, filters, schoolId]);

  const isLoading = loading || parentLoading;

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mobile
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Class
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Section
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Gender
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    <span className="ml-2">Loading...</span>
                  </div>
                </td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                  <p className="text-lg font-medium">No records found</p>
                  <p className="text-sm mt-1">
                    {searchTerm || (filters.grade || filters.section || filters.name) ? 
                      'Try adjusting your search or filters' : 
                      'Add records using the button above'
                    }
                  </p>
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.memberId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.class}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.section}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.gender}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.email}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {error && (
        <div className="p-4 text-center text-red-600 bg-red-50">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default InfirmaryList; 