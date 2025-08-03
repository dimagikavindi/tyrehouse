import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { FileText, Download, Calendar, TrendingUp } from 'lucide-react';
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Reports = () => {
  const { state } = useApp();
  const [reportType, setReportType] = useState('daily');
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const getDateRange = () => {
    const date = new Date(selectedDate);
    
    switch (reportType) {
      case 'daily':
        return {
          start: startOfDay(date),
          end: endOfDay(date)
        };
      case 'weekly':
        return {
          start: startOfWeek(date),
          end: endOfWeek(date)
        };
      case 'monthly':
        return {
          start: startOfMonth(date),
          end: endOfMonth(date)
        };
      default:
        return {
          start: startOfDay(date),
          end: endOfDay(date)
        };
    }
  };

  const getFilteredSales = () => {
    const { start, end } = getDateRange();
    return state.sales.filter(sale => {
      const saleDate = new Date(sale.date);
      return saleDate >= start && saleDate <= end;
    });
  };

  const generateSalesReport = () => {
    const filteredSales = getFilteredSales();
    const { start, end } = getDateRange();
    
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.text('Sampath Tire House', 105, 15, { align: 'center' });
    doc.setFontSize(16);
    doc.text('Sales Report', 105, 25, { align: 'center' });
    
    // Date range
    doc.setFontSize(12);
    const dateRangeText = `From ${format(start, 'yyyy-MM-dd')} to ${format(end, 'yyyy-MM-dd')}`;
    doc.text(dateRangeText, 105, 35, { align: 'center' });
    
    // Summary
    const totalSales = filteredSales.length;
    const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
    const avgSale = totalSales > 0 ? totalRevenue / totalSales : 0;
    
    doc.text(`Total Sales: ${totalSales}`, 20, 50);
    doc.text(`Total Revenue: Rs. ${totalRevenue.toLocaleString()}`, 20, 60);
    doc.text(`Average Sale: Rs. ${avgSale.toFixed(2)}`, 20, 70);
    
    // Sales table
    const tableData = filteredSales.map(sale => [
      sale.billNumber,
      format(new Date(sale.date), 'yyyy-MM-dd HH:mm'),
      sale.customerName,
      sale.items.length.toString(),
      `Rs. ${sale.total.toLocaleString()}`
    ]);
    
    doc.autoTable({
      head: [['Bill No', 'Date/Time', 'Customer', 'Items', 'Total']],
      body: tableData,
      startY: 80,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] },
      styles: { fontSize: 8 }
    });
    
    doc.save(`sales-report-${reportType}-${selectedDate}.pdf`);
  };

  const generateStockReport = () => {
    const doc = new jsPDF();
    
    // Category translation mapping
    const categoryTranslation = {
      'නව ටයර්': 'New Tires',
      'ප්‍රතිනිර්මාණ ටයර්': 'Retreaded Tires',
      'තෙල්': 'Oil',
      'Tube': 'Tube',
      'Collar': 'Collar',
      'අනෙකුත්': 'Others'
    };
    
    // Header
    doc.setFontSize(20);
    doc.text('Sampath Tire House', 105, 15, { align: 'center' });
    doc.setFontSize(16);
    doc.text('Stock Report', 105, 25, { align: 'center' });
    
    // Date
    doc.setFontSize(12);
    doc.text(`Date: ${format(new Date(), 'yyyy-MM-dd')}`, 105, 35, { align: 'center' });
    
    // Summary
    const totalItems = state.inventory.length;
    const totalQuantity = state.inventory.reduce((sum, item) => sum + item.quantity, 0);
    const lowStockItems = state.inventory.filter(item => item.quantity <= 5).length;
    const totalValue = state.inventory.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    doc.text(`Total Item Types: ${totalItems}`, 20, 50);
    doc.text(`Total Quantity: ${totalQuantity}`, 20, 60);
    doc.text(`Low Stock Items: ${lowStockItems}`, 20, 70);
    doc.text(`Total Value: Rs. ${totalValue.toLocaleString()}`, 20, 80);
    
    // Stock table
    const tableData = state.inventory.map(item => [
      item.name,
      item.brand,
      categoryTranslation[item.category] || item.category,
      item.quantity.toString(),
      `Rs. ${item.price.toLocaleString()}`,
      `Rs. ${(item.price * item.quantity).toLocaleString()}`,
      item.quantity <= 5 ? 'Low' : 'Sufficient'
    ]);
    
    doc.autoTable({
      head: [['Name', 'Brand', 'Category', 'Quantity', 'Price', 'Value', 'Status']],
      body: tableData,
      startY: 90,
      theme: 'grid',
      headStyles: { fillColor: [34, 197, 94] },
      styles: { fontSize: 8 }
    });
    
    doc.save(`stock-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
  };

  const filteredSales = getFilteredSales();
  const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.total, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">Reports</h2>
      </div>

      {/* Report Controls */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Type
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-end space-x-2">
            <button
              onClick={generateSalesReport}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download size={18} />
              <span>Sales Report</span>
            </button>
            <button
              onClick={generateStockReport}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download size={18} />
              <span>Stock Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Report Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-3 rounded-lg">
              <FileText className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Sales</p>
              <p className="text-2xl font-bold text-blue-600">{filteredSales.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-3 rounded-lg">
              <TrendingUp className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">Rs. {totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Calendar className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Average Sale</p>
              <p className="text-2xl font-bold text-purple-600">
                Rs. {filteredSales.length > 0 ? (totalRevenue / filteredSales.length).toFixed(2) : '0'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Sales Table */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Sales</h3>
        
        {filteredSales.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4">Bill No</th>
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Customer</th>
                  <th className="text-center py-3 px-4">Items</th>
                  <th className="text-right py-3 px-4">Total</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.slice(-10).reverse().map((sale) => (
                  <tr key={sale.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{sale.billNumber}</td>
                    <td className="py-3 px-4">{format(new Date(sale.date), 'yyyy-MM-dd HH:mm')}</td>
                    <td className="py-3 px-4">{sale.customerName}</td>
                    <td className="py-3 px-4 text-center">{sale.items.length}</td>
                    <td className="py-3 px-4 text-right font-bold text-green-600">
                      Rs. {sale.total.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No sales found for the selected period</p>
        )}
      </div>
    </div>
  );
};

export default Reports;