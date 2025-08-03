import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { TrendingUp, BarChart3, PieChart, Activity } from 'lucide-react';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';

const Analytics = () => {
  const { state } = useApp();
  
  // Calculate analytics data
  const today = new Date();
  const last7Days = subDays(today, 7);
  const thisMonth = {
    start: startOfMonth(today),
    end: endOfMonth(today)
  };

  const recentSales = state.sales.filter(sale => 
    new Date(sale.date) >= last7Days
  );

  const monthlySales = state.sales.filter(sale => {
    const saleDate = new Date(sale.date);
    return saleDate >= thisMonth.start && saleDate <= thisMonth.end;
  });

  const totalRevenue = state.sales.reduce((sum, sale) => sum + sale.total, 0);
  const monthlyRevenue = monthlySales.reduce((sum, sale) => sum + sale.total, 0);
  const weeklyRevenue = recentSales.reduce((sum, sale) => sum + sale.total, 0);

  // Category analysis
  const categoryStats = state.inventory.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = { count: 0, value: 0 };
    }
    acc[item.category].count += item.quantity;
    acc[item.category].value += item.price * item.quantity;
    return acc;
  }, {});

  // Top selling items (by quantity sold)
  const itemSales = {};
  state.sales.forEach(sale => {
    sale.items.forEach(item => {
      if (!itemSales[item.id]) {
        itemSales[item.id] = { ...item, totalSold: 0, revenue: 0 };
      }
      itemSales[item.id].totalSold += item.quantity;
      itemSales[item.id].revenue += item.price * item.quantity;
    });
  });

  const topSellingItems = Object.values(itemSales)
    .sort((a, b) => b.totalSold - a.totalSold)
    .slice(0, 5);

  const stats = [
    {
      title: 'මුළු ආදායම',
      value: `Rs. ${totalRevenue.toLocaleString()}`,
      icon: TrendingUp,
      color: 'bg-green-500',
      textColor: 'text-green-600'
    },
    {
      title: 'මාසික ආදායම',
      value: `Rs. ${monthlyRevenue.toLocaleString()}`,
      icon: BarChart3,
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      title: 'සතියේ ආදායම',
      value: `Rs. ${weeklyRevenue.toLocaleString()}`,
      icon: PieChart,
      color: 'bg-purple-500',
      textColor: 'text-purple-600'
    },
    {
      title: 'මුළු විකුණුම්',
      value: state.sales.length,
      icon: Activity,
      color: 'bg-orange-500',
      textColor: 'text-orange-600'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">විශ්ලේෂණ</h2>
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
        {/* Category Analysis */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">කාණ්ඩ අනුව විශ්ලේෂණය</h3>
          <div className="space-y-4">
            {Object.entries(categoryStats).map(([category, stats]) => (
              <div key={category} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{category}</p>
                  <p className="text-sm text-gray-600">{stats.count} අයිතම</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">Rs. {stats.value.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">වටිනාකම</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Selling Items */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">වැඩිපුරම විකුණුණු අයිතම</h3>
          <div className="space-y-4">
            {topSellingItems.length > 0 ? (
              topSellingItems.map((item, index) => (
                <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">{item.brand}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-blue-600">{item.totalSold} විකුණුණු</p>
                    <p className="text-sm text-gray-600">Rs. {item.revenue.toLocaleString()}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">විකුණුම් දත්ත නැත</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Sales Trend */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">පසුගිය 7 දිනයේ විකුණුම්</h3>
        <div className="space-y-3">
          {recentSales.length > 0 ? (
            recentSales.slice(-10).reverse().map((sale) => (
              <div key={sale.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">බිල් අංක: {sale.billNumber}</p>
                  <p className="text-sm text-gray-600">{format(new Date(sale.date), 'yyyy-MM-dd HH:mm')}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">Rs. {sale.total.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">{sale.items.length} අයිතම</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">පසුගිය සතියේ විකුණුම් නැත</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;