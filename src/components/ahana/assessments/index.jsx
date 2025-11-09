import { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
import AssessmentList from './AssessmentList';
import AssessmentFilters from './AssessmentFilters';
import { useOutletContext } from 'react-router-dom';

const Assessments = () => {
  const { schoolId } = useOutletContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSearchTerm, setActiveSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    grade: '',
    section: ''
  });
  const [activeFilters, setActiveFilters] = useState({
    grade: '',
    section: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSearch = () => {
    setActiveSearchTerm(searchTerm);
    setLoading(true);
    setTimeout(() => setLoading(false), 500);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setActiveSearchTerm('');
    setLoading(true);
    setTimeout(() => setLoading(false), 500);
  };

  const handleApplyFilters = () => {
    setActiveFilters(filters); // Only update active filters when Apply is clicked
    setShowFilters(false);
    setLoading(true);
    setTimeout(() => setLoading(false), 500);
  };

  const handleResetFilters = () => {
    const resetFilters = {
      grade: '',
      section: ''
    };
    setFilters(resetFilters);
    setActiveFilters(resetFilters); // Also reset active filters
    setLoading(true);
    setTimeout(() => setLoading(false), 500);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <h1 className="text-2xl font-bold text-gray-800">Assessments</h1>
          
          {/* Search and Filter Section */}
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

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(true)}
              className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center space-x-2"
            >
              <FaFilter className="w-4 h-4" />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* Assessment List */}
        <AssessmentList
          searchTerm={activeSearchTerm}
          filters={activeFilters}
          loading={loading}
          schoolId={schoolId}
        />
      </div>

      {/* Filters Modal */}
      <AssessmentFilters
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onFilterChange={(key, value) => setFilters(prev => ({ ...prev, [key]: value }))}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
      />
    </div>
  );
};

export default Assessments; 