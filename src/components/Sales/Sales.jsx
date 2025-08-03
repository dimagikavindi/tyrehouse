import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Plus, Search, Scan, Minus, ShoppingCart, Printer, X } from 'lucide-react';
import BarcodeScanner from '../Inventory/BarcodeScanner';
import BillPreview from './BillPreview';

const Sales = () => {
  const { state, dispatch } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [showScanner, setShowScanner] = useState(false);
  const [showBillPreview, setShowBillPreview] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [repairFee, setRepairFee] = useState('');
  const [repairDescription, setRepairDescription] = useState('');

  const filteredInventory = state.inventory.filter(item =>
    item.quantity > 0 && (
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.barcode.includes(searchTerm) ||
      item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.tireSize && item.tireSize.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  );

  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      if (existingItem.quantity < item.quantity) {
        setCart(cart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        ));
      } else {
        alert('ප්‍රමාණවත් තොගයක් නැත');
      }
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const updateCartQuantity = (itemId, newQuantity) => {
    const item = state.inventory.find(inv => inv.id === itemId);
    if (newQuantity > item.quantity) {
      alert('ප්‍රමාණවත් තොගයක් නැත');
      return;
    }
    
    if (newQuantity <= 0) {
      setCart(cart.filter(cartItem => cartItem.id !== itemId));
    } else {
      setCart(cart.map(cartItem =>
        cartItem.id === itemId
          ? { ...cartItem, quantity: newQuantity }
          : cartItem
      ));
    }
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter(cartItem => cartItem.id !== itemId));
  };

  const getTotalAmount = () => {
    const itemsTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const repairAmount = parseFloat(repairFee) || 0;
    return itemsTotal + repairAmount;
  };

  const handleBarcodeDetected = (barcode) => {
    const item = state.inventory.find(item => item.barcode === barcode && item.quantity > 0);
    if (item) {
      addToCart(item);
    } else {
      alert('එම බාර්කෝඩ් සහිත අයිතමයක් නොමැත හෝ තොගයක් නැත');
    }
    setShowScanner(false);
  };

  const handleCheckout = () => {
    if (cart.length === 0 && !repairFee) {
      alert('කරුණාකර අයිතම එකතු කරන්න හෝ අලුත්වැඩියා ගාස්තුවක් ඇතුළත් කරන්න');
      return;
    }
    setShowBillPreview(true);
  };

  const confirmSale = () => {
    const billNumber = 'BILL' + Date.now();
    const sale = {
      billNumber,
      items: cart,
      repairFee: parseFloat(repairFee) || 0,
      repairDescription: repairDescription || '',
      total: getTotalAmount(),
      customerName: customerName || 'Walk-in Customer',
      customerPhone: customerPhone || '',
      date: new Date().toISOString(),
      cashier: 'Admin'
    };

    dispatch({ type: 'ADD_SALE', payload: sale });
    
    // Reset form
    setCart([]);
    setRepairFee('');
    setRepairDescription('');
    setCustomerName('');
    setCustomerPhone('');
    setShowBillPreview(false);
    
    alert('විකුණුම සාර්ථකයි!');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">විකුණුම් කළමනාකරණය</h2>
        <button
          onClick={() => setShowScanner(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Scan size={18} />
          <span>බාර්කෝඩ් ස්කෑන්</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Selection */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
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
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredInventory.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-lg p-4 border border-gray-100 hover:shadow-xl transition-shadow">
                <h4 className="font-bold text-lg text-gray-900 mb-2">{item.name}</h4>
                <p className="text-sm text-gray-600 mb-1">බ්‍රෑන්‍ඩ්: {item.brand}</p>
                <p className="text-sm text-gray-600 mb-1">කේතය: {item.barcode}</p>
                {item.tireSize && (
                  <p className="text-sm text-gray-600 mb-1">ටයර් ප්‍රමාණය: {item.tireSize}</p>
                )}
                <p className="text-sm text-gray-600 mb-2">තොගය: {item.quantity}</p>
                
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-green-600">Rs. {item.price.toLocaleString()}</span>
                  <button
                    onClick={() => addToCart(item)}
                    className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus size={16} />
                    <span>එකතු කරන්න</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shopping Cart */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 h-fit">
          <div className="flex items-center space-x-2 mb-4">
            <ShoppingCart className="text-blue-600" size={24} />
            <h3 className="text-xl font-semibold text-gray-900">විකුණුම් කරත්තය</h3>
          </div>

          {/* Customer Info */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">පාරිභෝගික තොරතුරු</h4>
            <div className="grid grid-cols-1 gap-4">
              <input
                type="text"
                placeholder="පාරිභෝගික නම"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="දුරකථන අංකය"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Repair Fee */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">අලුත්වැඩියා ගාස්තු</h4>
            <div className="grid grid-cols-1 gap-4 mb-4">
              <input
                type="text"
                placeholder="අලුත්වැඩියා විස්තරය"
                value={repairDescription}
                onChange={(e) => setRepairDescription(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="number"
                placeholder="ගාස්තුව (+ හෝ - භාවිතා කරන්න)"
                value={repairFee}
                onChange={(e) => setRepairFee(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <p className="text-sm text-gray-600 mb-4">
              උදාහරණ: +500 (ගාස්තු එකතු කිරීම), -200 (වට්ටම් දීම)
            </p>
          </div>

          {/* Cart Items */}
          <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
            {cart.length === 0 ? (
              <p className="text-gray-500 text-center py-8">කරත්තය හිස්</p>
            ) : (
              <>
                {cart.map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-medium text-gray-900">{item.name}</h5>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600 hover:bg-red-100 p-1 rounded"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">Rs. {item.price.toLocaleString()}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <span className="font-bold text-green-600">
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          <div className="border-t border-gray-200 pt-4 space-y-4">
            {/* Show repair fee if entered */}
            {repairFee && (
              <div className="flex justify-between items-center">
                <span>අලුත්වැඩියා ගාස්තු:</span>
                <span className={`font-bold ${parseFloat(repairFee) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {parseFloat(repairFee) >= 0 ? '+' : ''}Rs. {parseFloat(repairFee).toLocaleString()}
                </span>
              </div>
            )}
            
            <div className="flex justify-between items-center text-xl font-bold">
              <span>මුළු එකතුව:</span>
              <span className="text-green-600">Rs. {getTotalAmount().toLocaleString()}</span>
            </div>
            
            <button
              onClick={handleCheckout}
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Printer size={18} />
              <span>බිල් හදන්න</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showScanner && (
        <BarcodeScanner
          onDetected={handleBarcodeDetected}
          onClose={() => setShowScanner(false)}
        />
      )}

      {showBillPreview && (
        <BillPreview
          cart={cart}
          repairFee={parseFloat(repairFee) || 0}
          repairDescription={repairDescription}
          repairFee={parseFloat(repairFee) || 0}
          repairDescription={repairDescription}
          total={getTotalAmount()}
          customerName={customerName}
          customerPhone={customerPhone}
          onConfirm={confirmSale}
          onClose={() => setShowBillPreview(false)}
        />
      )}
    </div>
  );
};

export default Sales;