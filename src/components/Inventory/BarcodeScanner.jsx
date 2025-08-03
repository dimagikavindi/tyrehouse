import React, { useState, useEffect } from 'react';
import { X, Scan } from 'lucide-react';

const BarcodeScanner = ({ onDetected, onClose }) => {
  const [scannedCode, setScannedCode] = useState('');
  const [isListening, setIsListening] = useState(true);

  useEffect(() => {
    let barcodeBuffer = '';
    let timeout;

    const handleKeyPress = (event) => {
      if (!isListening) return;

      // Prevent default behavior to avoid typing in other inputs
      event.preventDefault();
      
      const char = event.key;
      
      // Clear timeout on each keypress
      if (timeout) {
        clearTimeout(timeout);
      }
      
      // If Enter key is pressed, process the barcode
      if (char === 'Enter') {
        if (barcodeBuffer.length > 0) {
          setScannedCode(barcodeBuffer);
          onDetected(barcodeBuffer);
          barcodeBuffer = '';
        }
        return;
      }
      
      // Add character to buffer if it's not a control key
      if (char.length === 1) {
        barcodeBuffer += char;
        setScannedCode(barcodeBuffer);
        
        // Set timeout to clear buffer if no more input (in case Enter is not sent)
        timeout = setTimeout(() => {
          if (barcodeBuffer.length > 5) { // Minimum barcode length
            setScannedCode(barcodeBuffer);
            onDetected(barcodeBuffer);
          }
          barcodeBuffer = '';
        }, 100); // 100ms timeout
      }
    };

    // Add event listener
    document.addEventListener('keypress', handleKeyPress);
    
    // Focus the window to ensure we capture keypress events
    window.focus();

    // Cleanup
    return () => {
      document.removeEventListener('keypress', handleKeyPress);
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [isListening, onDetected]);

  const handleManualSubmit = () => {
    if (scannedCode.trim()) {
      onDetected(scannedCode.trim());
    }
  };

  const handleClose = () => {
    setIsListening(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Scan className="text-purple-600" size={24} />
            <h3 className="text-xl font-bold text-gray-900">බාර්කෝඩ් ස්කෑන් කරන්න</h3>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="වසන්න"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="bg-purple-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <Scan className="text-purple-600" size={40} />
            </div>
            <p className="text-lg font-medium text-gray-900 mb-2">
              බාර්කෝඩ් රීඩරය සූදානම්
            </p>
            <p className="text-sm text-gray-600">
              බාර්කෝඩ් රීඩරය භාවිතා කර බාර්කෝඩ් ස්කෑන් කරන්න
            </p>
          </div>

          {/* Display scanned code */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ස්කෑන් කළ කේතය:
            </label>
            <input
              type="text"
              value={scannedCode}
              onChange={(e) => setScannedCode(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="බාර්කෝඩ් මෙහි දිස්වේ..."
              autoFocus
            />
          </div>

          {/* Status indicator */}
          <div className="flex items-center justify-center mb-6">
            <div className={`w-3 h-3 rounded-full mr-2 ${isListening ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            <span className="text-sm text-gray-600">
              {isListening ? 'ස්කෑන් කිරීමට සූදානම්' : 'අක්‍රිය'}
            </span>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-blue-900 mb-2">උපදෙස්:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• බාර්කෝඩ් රීඩරය භාවිතා කර ස්කෑන් කරන්න</li>
              <li>• ස්කෑන් කළ කේතය ස්වයංක්‍රීයව ඇතුළත් වේ</li>
              <li>• අවශ්‍ය නම් අතින් ටයිප් කළ හැක</li>
            </ul>
          </div>

          {/* Action buttons */}
          <div className="flex space-x-3">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              අවලංගු කරන්න
            </button>
            <button
              onClick={handleManualSubmit}
              disabled={!scannedCode.trim()}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              තහවුරු කරන්න
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarcodeScanner;