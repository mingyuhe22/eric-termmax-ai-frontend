'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, ChevronDown, ChevronUp } from 'lucide-react'
import { formatTimeAgo } from '@/lib/utils/format'

interface Transaction {
  timestamp: Date
  type: string
  amount: number
  displayAmount: string
  user: string
  hash: string
}

interface TransactionHistoryProps {
  transactions: Transaction[]
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions
}) => {
  const [isExpanded, setIsExpanded] = useState(true)
  
  // Get style for transaction type
  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'Lend':
        return 'bg-green-500/20 text-green-400 border border-green-500/30'
      case 'Withdraw':
        return 'bg-red-500/20 text-red-400 border border-red-500/30'
      default:
        return 'bg-[#5FBDE9]/20 text-[#5FBDE9] border border-[#5FBDE9]/30'
    }
  }
  
  return (
    <motion.div
      className="px-6 pt-4 pb-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.3 }}
    >
      <div className="border-t border-[#1e2c3b] pt-4">
        <div 
          className="flex items-center justify-between mb-3 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <h3 className="text-base font-medium text-white">Recent Transactions</h3>
          <button className="text-gray-400 hover:text-white">
            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
        
        {isExpanded && (
          <div className="bg-[#0c1624] border border-[#1e2c3b] rounded-lg overflow-hidden">
            <table className="w-full border-collapse">
              <thead className="text-xs text-gray-400 bg-[#0a1525]">
                <tr>
                  <th className="text-left p-3 font-medium">Time</th>
                  <th className="text-left p-3 font-medium">Type</th>
                  <th className="text-right p-3 font-medium">Amount</th>
                  <th className="text-right p-3 font-medium">User</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {transactions.length > 0 ? (
                  transactions.map((tx, index) => (
                    <tr 
                      key={index} 
                      className={index < transactions.length - 1 ? "border-b border-[#1e2c3b]" : ""}
                    >
                      <td className="p-3 text-gray-400">{formatTimeAgo(tx.timestamp)}</td>
                      <td className="p-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getTypeStyle(tx.type)}`}>
                          {tx.type}
                        </span>
                      </td>
                      <td className="p-3 text-right text-white">{tx.displayAmount}</td>
                      <td className="p-3 text-right">
                        <a
                          href={`https://etherscan.io/tx/${tx.hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-[#5FBDE9] hover:text-[#78bdec] flex items-center justify-end group transition-colors duration-200"
                        >
                          {tx.user}
                          <ExternalLink className="ml-1 h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                        </a>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-gray-400">
                      No transactions yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default TransactionHistory