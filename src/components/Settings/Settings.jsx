import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Settings as SettingsIcon, Lock, Store, Save } from 'lucide-react';
import AdminPasswordModal from '../Common/AdminPasswordModal';

const Settings = () => {
  const { state, dispatch } = useApp();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [formData, setFormData] = useState({
    shopName: state.settings.shopName,
    adminPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setMessage('');
  };

  const handlePasswordSuccess = () => {
    setShowPasswordModal(false);
    // Allow settings changes
  };

  const handleSaveSettings = () => {
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setMessage('නව මුරපද නොගැලපේ');
      return;
    }

    if (formData.newPassword && formData.newPassword.length < 6) {
      setMessage('මුරපදය අවම වශයෙන් අක්ෂර 6ක් විය යුතුය');
      return;
    }

    const updatedSettings = {
      ...state.settings,
      shopName: formData.shopName
    };

    if (formData.newPassword) {
      updatedSettings.adminPassword = formData.newPassword;
    }

    dispatch({ type: 'UPDATE_SETTINGS', payload: updatedSettings });
    
    setFormData({
      ...formData,
      adminPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    
    setMessage('සැකසුම් සාර්ථකව යාවත්කාලීන කරන ලදී');
  };

  const stats = [
    {
      title: 'මුළු අයිතම',
      value: state.inventory.length,
      icon: Store,
      color: 'bg-blue-500'
    },
    {
      title: 'මුළු විකුණුම්',
      value: state.sales.length,
      icon: SettingsIcon,
      color: 'bg-green-500'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">සැකසුම්</h2>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="text-white" size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Settings Form */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center space-x-2 mb-6">
          <SettingsIcon className="text-blue-600" size={24} />
          <h3 className="text-xl font-semibold text-gray-900">පද්ධති සැකසුම්</h3>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              සාප්පුවේ නම
            </label>
            <input
              type="text"
              name="shopName"
              value={formData.shopName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center space-x-2">
              <Lock size={20} />
              <span>මුරපද වෙනස් කරන්න</span>
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  නව මුරපදය
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="නව මුරපදය ඇතුළත් කරන්න"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  මුරපදය තහවුරු කරන්න
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="මුරපදය නැවත ඇතුළත් කරන්න"
                />
              </div>
            </div>
          </div>

          {message && (
            <div className={`p-4 rounded-lg ${message.includes('සාර්ථක') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message}
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={() => setShowPasswordModal(true)}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save size={18} />
              <span>සුරකින්න</span>
            </button>
          </div>
        </div>
      </div>

      {/* System Information */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">පද්ධති තොරතුරු</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">අනුවාදය: 1.0.0</p>
            <p className="text-gray-600">අවසන් යාවත්කාලීනය: 2024-01-15</p>
          </div>
          <div>
            <p className="text-gray-600">සංවර්ධකයා: Sampath Tire House</p>
            <p className="text-gray-600">සහාය: support@sampathtyres.lk</p>
          </div>
        </div>
      </div>

      {showPasswordModal && (
        <AdminPasswordModal
          onSuccess={handlePasswordSuccess}
          onClose={() => setShowPasswordModal(false)}
        />
      )}
    </div>
  );
};

export default Settings;