// components/borrow/TransactionHistory.tsx
import React from 'react';

export interface Transaction {
  time: string;
  type: 'Borrow' | 'Repay' | 'Collateral';
  amount: string;
}

const TransactionHistory: React.FC = () => {
  // Mock transaction data
  const transactions: Transaction[] = [
    { time: '10:24 AM', type: 'Borrow', amount: '3.5 pufETH' },
    { time: 'Yesterday', type: 'Repay', amount: '1.2 pufETH' },
    { time: 'Mar 18', type: 'Collateral', amount: '5.0 PT-pufETH' }
  ];

  // Apply appropriate styling based on transaction type
  const getTypeStyle = (type: Transaction['type']) => {
    switch (type) {
      case 'Borrow':
        return 'bg-red-500/20 text-red-400 border border-red-500/30';
      case 'Repay':
        return 'bg-green-500/20 text-green-400 border border-green-500/30';
      case 'Collateral':
        return 'bg-[#47A6E5]/20 text-[#47A6E5] border border-[#47A6E5]/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
    }
  };

  return (
    <div className="px-6 pt-4 pb-6">
      <div className="border-t border-[#1e2c3b] pt-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-medium text-white">Recent Transactions</h3>
        </div>
        <div className="bg-[#0c1624] border border-[#1e2c3b] rounded-lg overflow-hidden">
          <table className="w-full border-collapse">
            <thead className="text-xs text-gray-400 bg-[#0a1525]">
              <tr>
                <th className="text-left p-3 font-medium">Time</th>
                <th className="text-left p-3 font-medium">Type</th>
                <th className="text-right p-3 font-medium">Amount</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {transactions.map((tx, index) => (
                <tr 
                  key={index} 
                  className={index < transactions.length - 1 ? "border-b border-[#1e2c3b]" : ""}
                >
                  <td className="p-3 text-gray-400">{tx.time}</td>
                  <td className="p-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getTypeStyle(tx.type)}`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className="p-3 text-right text-white">{tx.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;