// components/vaults/TransactionHistory.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

interface Transaction {
  timestamp: Date;
  type: string;
  amount: number;
  displayAmount: string;
  user: string;
  hash: string;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions,
  currentPage,
  totalPages,
  onPageChange
}) => {
  return (
    <motion.div
      className="bg-[#0c1624] border border-[#1e2c3b] rounded-lg p-6 mt-6 shadow-lg"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4 }}
    >
      <h3 className="text-base font-medium text-white mb-4 flex items-center">
        <svg 
          className="h-5 w-5 mr-2 text-[#5FBDE9]" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" 
          />
        </svg>
        Recent Transactions
      </h3>

      <div className="rounded-lg overflow-hidden border border-[#1e2c3b]">
        <table className="w-full border-collapse">
          <thead className="text-sm text-gray-400 border-b border-[#1e2c3b] bg-[#081020]">
            <tr>
              <th className="text-left py-3 px-4 font-medium">Time</th>
              <th className="text-left py-3 px-4 font-medium">Type</th>
              <th className="text-right py-3 px-4 font-medium">Amount</th>
              <th className="text-right py-3 px-4 font-medium">User</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e2c3b]">
            {transactions.map((tx, idx) => (
              <motion.tr
                key={idx}
                className="text-sm hover:bg-[#0a1525] transition-colors duration-150"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx }}
              >
                <td className="py-3 px-4 text-gray-300">
                  {new Date(tx.timestamp).toLocaleString(undefined, {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </td>
                <td className="py-3 px-4">
                  <span 
                    className={`rounded-full px-2 py-1 text-xs ${
                      tx.type === 'Withdraw'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : tx.type === 'Deposit'
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'bg-[#5FBDE9]/20 text-[#5FBDE9] border border-[#5FBDE9]/30'
                    }`}
                  >
                    {tx.type}
                  </span>
                </td>
                <td className="py-3 px-4 text-right text-white font-medium">
                  {tx.displayAmount}
                </td>
                <td className="py-3 px-4 text-right">
                  <a
                    href={`https://etherscan.io/tx/${tx.hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[#5FBDE9] hover:text-[#78bdec] flex items-center justify-end group transition-colors duration-200"
                  >
                    {tx.user}
                    <ExternalLink className="ml-1 h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                  </a>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="flex justify-center items-center py-3 border-t border-[#1e2c3b] bg-[#081020]">
            <button
              className="p-1 text-gray-400 hover:text-white disabled:opacity-50 transition-colors duration-200"
              onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={20} />
            </button>
            <span className="mx-4 text-sm text-gray-400">
              {currentPage} of {totalPages}
            </span>
            <button
              className="p-1 text-gray-400 hover:text-white disabled:opacity-50 transition-colors duration-200"
              onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TransactionHistory;