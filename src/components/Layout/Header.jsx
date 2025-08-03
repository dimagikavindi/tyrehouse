import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { LogOut, User } from 'lucide-react';

const Header = () => {
  const { state, dispatch } = useApp();

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <header className="bg-white shadow-md border-b-4 border-blue-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-blue-900 sinhala-title">
                {state.settings.shopName}
              </h1>
              <p className="text-sm text-gray-600">ටයර් කළමනාකරණ පද්ධතිය</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-700">
              <User size={20} />
              <span className="font-medium">පරිපාලක</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogOut size={18} />
              <span>ඉවත්වන්න</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;