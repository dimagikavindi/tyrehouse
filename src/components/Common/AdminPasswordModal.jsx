import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { X, Lock } from 'lucide-react';

const AdminPasswordModal = ({ onSuccess, onClose }) => {
  const { state } = useApp();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (password === state.settings.adminPassword) {
      onSuccess();
    } else {
      setError('වැරදි මුරපදයක්');
      setPassword('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Lock className="text-red-600" size={24} />
            <h3 className="text-xl font-bold text-gray-900">පරිපාලක සත්‍යාපනය</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              පරිපාලක මුරපදය
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="මුරපදය ඇතුළත් කරන්න"
              autoFocus
              required
            />
            {error && (
              <p className="text-red-600 text-sm mt-2">{error}</p>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              අවලංගු කරන්න
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              සත්‍යාපනය කරන්න
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminPasswordModal;