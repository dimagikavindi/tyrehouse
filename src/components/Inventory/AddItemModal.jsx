import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { X, Scan } from 'lucide-react';
import BarcodeScanner from './BarcodeScanner';

const AddItemModal = ({ onClose }) => {
  const { dispatch } = useApp();
  const [showScanner, setShowScanner] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    barcode: '',
    category: '',
    subCategory: '',
    tireSize: '',
    price: '',
    quantity: '',
    minStock: 5,
    description: ''
  });

  const categories = ['නව ටයර්', 'ප්‍රතිනිර්මාණ ටයර්', 'තෙල්', 'Tube', 'Collar', 'අනෙකුත්'];
  const tireSubCategories = ['කාර්', 'බස්', 'යතුරුපැදි'];
  const otherSubCategories = ['සාමාන්‍ය', 'විශේෂ'];

  const isTireCategory = formData.category === 'නව ටයර්' || formData.category === 'ප්‍රතිනිර්මාණ ටයර්';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBarcodeDetected = (barcode) => {
    setFormData(prev => ({ ...prev, barcode }));
    setShowScanner(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.barcode || !formData.category || !formData.price || !formData.quantity) {
      alert('කරුණාකර සියලු අනිවාර්ය ක්ෂේත්‍ර සම්පුර්ණ කරන්න');
      return;
    }

    if ((isTireCategory || formData.category === 'Tube' || formData.category === 'Collar') && !formData.tireSize) {
      alert('කරුණාකර ප්‍රමාණය ඇතුළත් කරන්න');
      return;
    }
    const newItem = {
      ...formData,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity),
      minStock: parseInt(formData.minStock),
      dateAdded: new Date().toISOString()
    };

    dispatch({ type: 'ADD_ITEM', payload: newItem });
    onClose();
  };

  const getSubCategories = () => {
    if (formData.category === 'නව ටයර්' || formData.category === 'ප්‍රතිනිර්මාණ ටයර්') {
      return tireSubCategories;
    }
    return otherSubCategories;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900">නව අයිතම එකතු කරන්න</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                නම *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                බ්‍රෑන්‍ඩ්
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                බාර්කෝඩ් *
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  name="barcode"
                  value={formData.barcode}
                  onChange={handleInputChange}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowScanner(true)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Scan size={18} />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                කාණ්ඩය *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">කාණ්ඩයක් තෝරන්න</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                උප කාණ්ඩය
              </label>
              <select
                name="subCategory"
                value={formData.subCategory}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={!formData.category}
              >
                <option value="">උප කාණ්ඩයක් තෝරන්න</option>
                {getSubCategories().map(subCat => (
                  <option key={subCat} value={subCat}>{subCat}</option>
                ))}
              </select>
            </div>

            {isTireCategory && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ටයර් ප්‍රමාණය *
                </label>
                <input
                  type="text"
                  name="tireSize"
                  value={formData.tireSize}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="උදා: 185/65R15, 195/55R16"
                  required={isTireCategory}
                />
              </div>
            )}

            {(formData.category === 'Tube' || formData.category === 'Collar') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Size *
                </label>
                <input
                  type="text"
                  name="tireSize"
                  value={formData.tireSize}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g: 18, 20, 22"
                  required={formData.category === 'Tube' || formData.category === 'Collar'}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                මිල (රු.) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ප්‍රමාණය *
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                min="0"
               step="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                අවම තොගය
              </label>
              <input
                type="number"
                name="minStock"
                value={formData.minStock}
                onChange={handleInputChange}
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              විස්තරය
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              අවලංගු කරන්න
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              එකතු කරන්න
            </button>
          </div>
        </form>

        {showScanner && (
          <BarcodeScanner
            onDetected={handleBarcodeDetected}
            onClose={() => setShowScanner(false)}
          />
        )}
      </div>
    </div>
  );
};

export default AddItemModal;