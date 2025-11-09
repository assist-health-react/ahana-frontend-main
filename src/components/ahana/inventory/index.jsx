import { useState, useEffect } from 'react';
import { FaPlus, FaSearch, FaTimes, FaFilter } from 'react-icons/fa';
import AddItemModal from './AddItemModal';
import ViewMedicineDetails from './ViewMedicineDetails';
import InventoryFilters from './InventoryFilters';
import { useOutletContext } from 'react-router-dom';
import { getAllInventoryItems, getInventoryItemById, deleteInventoryItem } from '../../../services/inventoryService';

const Inventory = () => {
  const { school } = useOutletContext() || {};
  const schoolMongoId = school?._id;
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSearchTerm, setActiveSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [activeFilters, setActiveFilters] = useState({});

  useEffect(() => {
    fetchInventoryItems();
  }, [schoolMongoId, activeSearchTerm, activeFilters]);

  const fetchInventoryItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllInventoryItems({ 
        schoolId: schoolMongoId,
        search: activeSearchTerm || undefined,
        ...activeFilters
      });
      if (response.data) {
        setItems(response.data);
      }
    } catch (err) {
      setError('Failed to fetch inventory items');
      console.error('Error fetching inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setActiveSearchTerm(searchTerm);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setActiveSearchTerm('');
  };

  const handleApplyFilters = (appliedFilters) => {
    setActiveFilters(appliedFilters);
  };

  const handleViewItem = async (item) => {
    try {
      const response = await getInventoryItemById(item._id);
      if (response.data) {
        setSelectedItem(response.data);
        setShowDetails(true);
      }
    } catch (err) {
      console.error('Error fetching item details:', err);
      // Show error in a toast or alert
    }
  };

  const handleEditItem = (item) => {
    console.log('Edit item:', item); // Debug log
    setShowDetails(false); // First close the details modal
    setTimeout(() => {    // Then set the selected item and open edit modal
      setSelectedItem(item);
      setShowAddModal(true);
    }, 100);
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      try {
        await deleteInventoryItem(itemId);
        fetchInventoryItems();
        setShowDetails(false);
        setSelectedItem(null);
        // Show success message
      } catch (err) {
        console.error('Error deleting item:', err);
        // Show error message
      }
    }
  };

  const handleAddSuccess = () => {
    fetchInventoryItems();
    setShowAddModal(false);
    setSelectedItem(null);
  };

  return (
    <div className="flex flex-col h-full bg-white p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Inventory Management</h1>
        <button
          onClick={() => {
            setSelectedItem(null);
            setShowAddModal(true);
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
        >
          <FaPlus className="w-4 h-4" />
          Add Item
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="flex gap-2">
          <div className="flex-1">
            <div className="relative flex items-center">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search items..."
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
        {Object.keys(activeFilters).length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {Object.entries(activeFilters).map(([key, value]) => (
              <div key={key} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                <span>{key}: {value}</span>
                <button
                  onClick={() => {
                    const newFilters = { ...activeFilters };
                    delete newFilters[key];
                    setActiveFilters(newFilters);
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <FaTimes className="w-3 h-3" />
                </button>
              </div>
            ))}
            <button
              onClick={() => setActiveFilters({})}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Items List */}
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-600">
            <p>{error}</p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No items found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <div
                key={item._id}
                className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleViewItem(item)}
              >
                <h3 className="text-lg font-semibold text-gray-800">{item.item_name}</h3>
                <p className="text-sm text-gray-600 mt-1">Quantity: {item.current_stock}</p>
                <div className="mt-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.current_stock > 10 ? 'bg-green-100 text-green-800' :
                    item.current_stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {item.current_stock > 10 ? 'In Stock' :
                     item.current_stock > 0 ? 'Low Stock' :
                     'Out of Stock'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Item Modal */}
      <AddItemModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setSelectedItem(null);
        }}
        onSuccess={handleAddSuccess}
        schoolId={schoolMongoId}
        editItem={selectedItem}
      />

      {/* View Details Modal */}
      <ViewMedicineDetails
        isOpen={showDetails}
        onClose={() => {
          setShowDetails(false);
          setSelectedItem(null);
        }}
        item={selectedItem}
        onEdit={handleEditItem}
        onDelete={handleDeleteItem}
      />

      {/* Filters Modal */}
      <InventoryFilters
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        onApply={handleApplyFilters}
        initialFilters={filters}
      />
    </div>
  );
};

export default Inventory; 