import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
import ReportFilters from './ReportFilters';
import ReportList from './ReportList';
import { getAllInfirmaryRecords } from '../../../services/infirmaryService';
import { useOutletContext } from 'react-router-dom';

const Report = () => {
  const { schoolId } = useOutletContext();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    class: '',
    section: '',
    studentId: '',
    name: '',
    fromDate: '',
    toDate: ''
  });
  const [activeFilters, setActiveFilters] = useState({
    class: '',
    section: '',
    studentId: '',
    name: '',
    fromDate: '',
    toDate: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSearchTerm, setActiveSearchTerm] = useState('');
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 20 });
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [reports, setReports] = useState([]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const params = {
        schoolId: schoolId,
        search: activeSearchTerm || undefined,
        class: activeFilters.class || undefined,
        section: activeFilters.section || undefined,
        studentId: activeFilters.studentId || undefined,
        name: activeFilters.name || undefined,
        fromDate: activeFilters.fromDate || undefined,
        toDate: activeFilters.toDate || undefined,
        page: 1,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      };
      
      console.log('Fetching reports with params:', params);
      const response = await getAllInfirmaryRecords(params);
      if (response.data) {
        const formattedReports = response.data.map(record => ({
          id: record._id,
          date: record.date,
          type: 'Infirmary',
          details: {
            name: record.studentId?.name || 'N/A',
            studentId: record.studentId?.memberId || 'N/A',
            school: record.schoolId?.name || 'N/A',
            complaints: record.complaints || 'N/A',
            details: record.details || 'N/A',
            consentFrom: record.consentFrom || 'N/A',
            treatment: record.treatmentGiven || record.treatment || 'N/A'
          }
        }));
        setReports(formattedReports);
        setHasMore(false); // Since we're getting all records at once
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (schoolId) {
      fetchReports();
    }
  }, [schoolId, activeSearchTerm, activeFilters]);

  const handleSearch = () => {
    setActiveSearchTerm(searchTerm);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setActiveSearchTerm('');
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApplyFilters = () => {
    setActiveFilters(filters);
    setShowFilters(false);
  };

  const handleResetFilters = () => {
    const resetFilters = {
      class: '',
      section: '',
      studentId: '',
      name: '',
      fromDate: '',
      toDate: ''
    };
    setFilters(resetFilters);
    setActiveFilters(resetFilters);
  };

  const loadMoreItems = () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setTimeout(() => {
      setVisibleRange(prev => ({
        start: prev.start,
        end: Math.min(prev.end + 10, reports.length)
      }));
      setHasMore(visibleRange.end + 10 < reports.length);
      setLoading(false);
    }, 500);
  };

  return (
    <div className="flex flex-col h-full bg-white p-6">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative flex gap-4">
          <div className="flex-1 sm:flex-none">
            <div className="relative flex items-center">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10 pr-10"
                />
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                {searchTerm && (
                  <button
                    onClick={handleClearSearch}
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
          <button
            onClick={() => setShowFilters(true)}
            className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center space-x-2"
          >
            <FaFilter className="w-4 h-4" />
            <span>Filter</span>
          </button>
        </div>

        {/* Active Filters Display */}
        {Object.values(activeFilters).some(value => value) && (
          <div className="mt-3 flex flex-wrap gap-2">
            {Object.entries(activeFilters).map(([key, value]) => {
              if (!value) return null;
              return (
                <div key={key} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  <span>{key}: {value}</span>
                  <button
                    onClick={() => {
                      handleFilterChange(key, '');
                      setActiveFilters(prev => ({ ...prev, [key]: '' }));
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FaTimes className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
            <button
              onClick={handleResetFilters}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Report List */}
      <ReportList
        reports={reports}
        loading={loading}
        onLoadMore={loadMoreItems}
        hasMore={hasMore}
      />

      {/* Filters Modal */}
      <ReportFilters
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
        onApply={handleApplyFilters}
        isLoading={loading}
      />
    </div>
  );
};

export default Report; 