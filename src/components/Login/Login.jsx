import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Lock, User } from 'lucide-react';

const Login = () => {
  const { state, dispatch } = useApp();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (password === state.settings.adminPassword) {
      dispatch({ type: 'LOGIN' });
    } else {
      setError('වැරදි මුරපදයක්');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8">
        <div className="text-center mb-8">
          <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <User className="text-blue-600" size={40} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 sinhala-title">සම්පත් ටයර් හවුස්</h1>
          <p className="text-gray-600 mt-2">ටයර් කළමනාකරණ පද්ධතිය</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              පරිපාලක මුරපදය
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="මුරපදය ඇතුළත් කරන්න"
                required
              />
            </div>
            {error && (
              <p className="text-red-600 text-sm mt-2">{error}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            පිවිසෙන්න
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>පෙරනිමි මුරපදය: 12345</p>
        </div>
      </div>
    </div>
  );
};

export default Login;