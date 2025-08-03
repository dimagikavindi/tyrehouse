import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Plus, Search, Edit, Trash2, Package, Scan } from 'lucide-react';
import AddItemModal from './AddItemModal';
import EditItemModal from './EditItemModal';
import BarcodeScanner from './BarcodeScanner';
import AdminPasswordModal from '../Common/AdminPasswordModal';

const Inventory = () => {
  const { state, dispatch } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [actionType, setActionType] = useState('');

  const categories = ['නව ටයර්', 'ප්‍රතිනිර්මාණ ටයර්', 'තෙල්', 'Tube', 'Collar', 'අනෙකුත්'];
  
  const filteredInventory = state.inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.barcode.includes(searchTerm) ||
                         item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.tireSize && item.tireSize.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === '' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleEdit = (item) => {
    setSelectedItem(item);
    setActionType('edit');
    setShowPasswordModal(true);
  };

  const handleDelete = (item) => {
    setSelectedItem(item);
    setActionType('delete');
    setShowPasswordModal(true);
  };

  const handlePasswordSuccess = () => {
    if (actionType === 'edit') {
      setShowEditModal(true);
    } else if (actionType === 'delete') {
      dispatch({ type: 'DELETE_ITEM', payload: selectedItem.id });
    }
    setShowPasswordModal(false);
  };

  const handleBarcodeDetected = (barcode) => {
    const item = state.inventory.find(item => item.barcode === barcode);
    if (item) {
      setSelectedItem(item);
      setShowEditModal(true);
    } else {
      alert('එම බාර්කෝඩ් සහිත අයිතමයක් නොමැත');
    }
    setShowScanner(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">ඉන්වෙන්ටරි කළමනාකරණය</h2>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowScanner(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Scan size={18} />
            <span>බාර්කෝඩ් ස්කෑන්</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} />
            <span>නව අයිතම</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="නම, බාර්කෝඩ්, බ්‍රෑන්‍ඩ් හෝ ටයර් ප්‍රමාණය වලින් සොයන්න..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">සියලු කාණ්ඩ</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <div className="text-right">
            <span className="text-sm text-gray-600">මුළු අයිතම: {filteredInventory.length}</span>
          </div>
        </div>
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredInventory.map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Package className="text-blue-600" size={20} />
                <span className="text-sm font-medium text-blue-600">{item.category}</span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(item)}
                  className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            
            <h3 className="font-bold text-lg text-gray-900 mb-2">{item.name}</h3>
            <p className="text-sm text-gray-600 mb-1">බ්‍රෑන්‍ඩ්: {item.brand}</p>
            <p className="text-sm text-gray-600 mb-1">කේතය: {item.barcode}</p>
            {item.tireSize && (
              <p className="text-sm text-gray-600 mb-1">ටයර් ප්‍රමාණය: {item.tireSize}</p>
            )}
            <p className="text-sm text-gray-600 mb-3">උප කාණ්ඩය: {item.subCategory}</p>
            
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
              <div>
                <p className="text-lg font-bold text-green-600">Rs. {item.price.toLocaleString()}</p>
                <p className={`text-sm font-medium ${item.quantity <= 5 ? 'text-red-600' : 'text-gray-600'}`}>
                  තොගය: {item.quantity}
                </p>
              </div>
              {item.quantity <= 5 && (
                <div className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                  අඩු තොගය
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredInventory.length === 0 && (
        <div className="text-center py-12">
          <Package className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-500 text-lg">අයිතම නොමැත</p>
        </div>
      )}

      {/* Modals */}
      {showAddModal && <AddItemModal onClose={() => setShowAddModal(false)} />}
      {showEditModal && selectedItem && (
        <EditItemModal 
          item={selectedItem} 
          onClose={() => {
            setShowEditModal(false);
            setSelectedItem(null);
          }} 
        />
      )}
      {showScanner && (
        <BarcodeScanner 
          onDetected={handleBarcodeDetected}
          onClose={() => setShowScanner(false)}
        />
      )}
      {showPasswordModal && (
        <AdminPasswordModal
          onSuccess={handlePasswordSuccess}
          onClose={() => {
            setShowPasswordModal(false);
            setSelectedItem(null);
            setActionType('');
          }}
        />
      )}
    </div>
  );
};

export default Inventory;