import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { Package, ShoppingCart, AlertTriangle, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

const Dashboard = () => {
  const { state } = useApp();
  
  const totalItems = state.inventory.reduce((sum, item) => sum + item.quantity, 0);
  const lowStockItems = state.inventory.filter(item => item.quantity <= item.minStock || 5);
  const todaySales = state.sales.filter(sale => 
    format(new Date(sale.date), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
  );
  const todayRevenue = todaySales.reduce((sum, sale) => sum + sale.total, 0);
  
  const recentSales = state.sales.slice(-5).reverse();

  const stats = [
    {
      title: 'මුළු තොගය',
      value: totalItems,
      icon: Package,
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      title: 'අද විකුණුම්',
      value: todaySales.length,
      icon: ShoppingCart,
      color: 'bg-green-500',
      textColor: 'text-green-600'
    },
    {
      title: 'අද ආදායම',
      value: `Rs. ${todayRevenue.toLocaleString()}`,
      icon: TrendingUp,
      color: 'bg-purple-500',
      textColor: 'text-purple-600'
    },
    {
      title: 'අඩු තොගය',
      value: lowStockItems.length,
      icon: AlertTriangle,
      color: 'bg-red-500',
      textColor: 'text-red-600'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">මුල් පිටුව</h2>
        <p className="text-gray-600">{format(new Date(), 'yyyy MMMM dd, EEEE')}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className={`text-2xl font-bold ${stat.textColor} mt-1`}>{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="text-white" size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Sales */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">නවතම විකුණුම්</h3>
          <div className="space-y-3">
            {recentSales.length > 0 ? (
              recentSales.map((sale) => (
                <div key={sale.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">බිල් අංක: {sale.billNumber}</p>
                    <p className="text-sm text-gray-600">{format(new Date(sale.date), 'HH:mm')}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">Rs. {sale.total.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">{sale.items.length} අයිතම</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">අද විකුණුම් නැත</p>
            )}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">අඩු තොගය</h3>
          <div className="space-y-3">
            {lowStockItems.length > 0 ? (
              lowStockItems.slice(0, 5).map((item) => (
                <div key={item.id} className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-200">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">{item.category} - {item.subCategory}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-red-600">{item.quantity} ඉතිරි</p>
                    <p className="text-sm text-gray-600">කේතය: {item.barcode}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">අඩු තොගයක් නැත</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;