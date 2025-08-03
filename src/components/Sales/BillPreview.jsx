import React, { useRef } from 'react';
// Print-specific CSS injected for BillPreview
const printStyles = `
  @media print {
    body * {
      visibility: hidden !important;
    }
    .print-content, .print-content * {
      visibility: visible !important;
    }
    .print-content {
      position: absolute !important;
      left: 0;
      top: 0;
      width: 100vw !important;
      margin: 0 !important;
      box-shadow: none !important;
      background: white !important;
      color: black !important;
      padding: 0.5cm !important;
    }
    .footer-section {
      page-break-after: avoid;
    }
    .fixed, .border-t, .border-b, .rounded-xl, .shadow-2xl, .bg-black, .bg-opacity-50, .mx-4, .max-h-[90vh], .overflow-y-auto {
      display: none !important;
    }
    button {
      display: none !important;
    }
  }
`;
import { useReactToPrint } from 'react-to-print';
import { useApp } from '../../contexts/AppContext';
import { X, Printer } from 'lucide-react';
import { format } from 'date-fns';

const BillPreview = ({ cart, repairFee, repairDescription, total, customerName, customerPhone, onConfirm, onClose }) => {
  const { state } = useApp();
  const componentRef = useRef();
  
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onAfterPrint: () => {
      // Add delay to ensure print process completes before confirming sale
      setTimeout(() => {
        onConfirm();
      }, 500);
    }
  });

  const billNumber = 'BILL' + Date.now();
  const currentDate = new Date();

  const handleConfirmAndPrint = () => {
    handlePrint();
  };

  return (
    <>
      {/* Inject print styles */}
      <style>{printStyles}</style>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900">Bill Preview</h3>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <X size={24} />
            </button>
          </div>

          {/* Bill Content - Text Only Format for Thermal Printer */}
            <pre ref={componentRef} className="print-content" style={{ fontFamily: 'monospace', fontSize: '14px', padding: '16px', background: 'white', whiteSpace: 'pre' }}>
{`
SAMPATH TIRE HOUSE
Tire & Service Center
Phone: 077-8473618
Email: info@sampathtyreshouse.com
========================================
Bill No: ${billNumber}
Date: ${format(currentDate, 'yyyy-MM-dd')}
Time: ${format(currentDate, 'HH:mm:ss')}
Customer: ${customerName || 'Walk-in Customer'}
${customerPhone ? `Phone: ${customerPhone}
` : ''}Cashier: Sampath
========================================
Item            Qty   Price      Total
----------------------------------------
${cart.map(item => {
  const name = (item.name || '').padEnd(14);
  const qty = String(item.quantity).padEnd(5);
  const price = ('Rs.' + item.price.toLocaleString()).padEnd(10);
  const total = ('Rs.' + (item.price * item.quantity).toLocaleString()).padEnd(10);
  let details = '';
  if (item.brand || item.barcode || item.tireSize) {
    details = `  ${item.brand || ''}${item.barcode ? ' - ' + item.barcode : ''}${item.tireSize ? ' - ' + item.tireSize : ''}`;
  }
  return `${name}${qty}${price}${total}\n${details ? details + '\n' : ''}`;
}).join('')}${repairFee && repairFee !== 0 ? `
Repair Fee      1     ${repairFee >= 0 ? '+' : ''}Rs.${Math.abs(repairFee).toLocaleString().padEnd(6)} ${repairFee >= 0 ? '+' : ''}Rs.${repairFee.toLocaleString()}
${repairDescription ? `  ${repairDescription}` : '  Repair/Service Fee'}
` : ''}
----------------------------------------
Total Amount: Rs. ${total.toLocaleString()}
========================================
Thank you! Come again!
Please keep the receipt for warranty claims
`}
            </pre>

          <div className="flex justify-end space-x-4 p-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Printer size={18} />
              <span>Print</span>
            </button>
            <button
              onClick={handleConfirmAndPrint}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Confirm & Print
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BillPreview;