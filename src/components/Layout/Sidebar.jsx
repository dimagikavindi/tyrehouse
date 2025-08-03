import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  FileText, 
  Settings,
  TrendingUp
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { id: 'dashboard', label: 'මුල් පිටුව', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'inventory', label: 'ඉන්වෙන්ටරි', icon: Package, path: '/inventory' },
    { id: 'sales', label: 'විකුණුම්', icon: ShoppingCart, path: '/sales' },
    { id: 'reports', label: 'වාර්තා', icon: FileText, path: '/reports' },
    { id: 'analytics', label: 'විශ්ලේෂණ', icon: TrendingUp, path: '/analytics' },
    { id: 'settings', label: 'සැකසුම්', icon: Settings, path: '/settings' }
  ];

  const isActive = (path) => {
    if (path === '/dashboard' && location.pathname === '/') return true;
    return location.pathname === path;
  };

  return (
    <aside className="bg-gray-900 text-white w-64 min-h-screen shadow-lg">
      <div className="p-6">
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive(item.path)
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;