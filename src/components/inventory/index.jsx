import { useState } from 'react';
import { FaSearch, FaPlus, FaEye } from 'react-icons/fa';
import AddItemModal from './AddItemModal';
import ViewMedicineDetails from './ViewMedicineDetails';

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddItem, setShowAddItem] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);

  const [inventoryItems, setInventoryItems] = useState([
    {
      id: 1,
      name: 'Tab Paracetamol 500mg',
      currentStock: 250,
      expiryDate: '2026-04',
      unit: 'tablets'
    },
    {
      id: 2,
      name: 'Tab Cetirizine 10mg',
      currentStock: 180,
      expiryDate: '2026-06',
      unit: 'tablets'
    },
    // Add more items as needed
  ]);

  const handleAddItem = (newItem) => {
    setInventoryItems(prev => [...prev, newItem]);
  };

  const handleView = (id) => {
    const medicine = inventoryItems.find(item => item.id === id);
    setSelectedMedicine(medicine);
  };

  const filteredItems = inventoryItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-white p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Inventory Management
        </h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search inventory..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 px-4 py-2 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <button
            onClick={() => setShowAddItem(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
          >
            <FaPlus /> Add Item
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="flex-1 overflow-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Medicine Name
              </th>
              <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Expiry Date
              </th>
              <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                In Stock
              </th>
              <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredItems.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{item.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{item.expiryDate}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {item.currentStock} {item.unit}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleView(item.id)}
                    className="text-blue-600 hover:text-blue-800"
                    title="View Details"
                  >
                    <FaEye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Item Modal */}
      <AddItemModal
        isOpen={showAddItem}
        onClose={() => setShowAddItem(false)}
        onSubmit={handleAddItem}
      />

      {/* View Medicine Details Modal */}
      <ViewMedicineDetails
        isOpen={selectedMedicine !== null}
        onClose={() => setSelectedMedicine(null)}
        medicine={selectedMedicine}
      />
    </div>
  );
};

export default Inventory; 