// components/vaults/MarketAllocationTable.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MarketAllocation {
  market: string;
  allocation: number;
  supply: number;
  cap: number;
  apy: number;
}

interface MarketAllocationTableProps {
  markets: MarketAllocation[];
  ltv?: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const MarketAllocationTable: React.FC<MarketAllocationTableProps> = ({
  markets,
  ltv = 75,
  currentPage,
  totalPages,
  onPageChange
}) => {
  return (
    <motion.div
      className="bg-[#0c1624] border border-[#1e2c3b] rounded-lg p-6 mt-6 shadow-lg"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      <h3 className="text-base font-medium text-white mb-4 flex items-center">
        <svg className="h-5 w-5 mr-2 text-[#5FBDE9]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
        Market Allocation
      </h3>

      <div className="rounded-lg overflow-hidden border border-[#1e2c3b]">
        <table className="w-full border-collapse">
          <thead className="text-sm text-gray-400 border-b border-[#1e2c3b] bg-[#081020]">
            <tr>
              <th className="text-left py-3 px-4 font-medium">Market</th>
              <th className="text-right py-3 px-4 font-medium">Allocation</th>
              <th className="text-right py-3 px-4 font-medium">LTV</th>
              <th className="text-right py-3 px-4 font-medium">APY</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e2c3b]">
            {markets.map((market, idx) => (
              <motion.tr
                key={idx}
                className="text-sm hover:bg-[#0a1525] transition-colors duration-150"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx }}
              >
                <td className="py-3 px-4 text-white font-medium">{market.market}</td>
                <td className="py-3 px-4 text-right text-gray-300">{market.allocation.toFixed(2)}%</td>
                <td className="py-3 px-4 text-right text-white">{(ltv - (idx * 5))}%</td>
                <td className="py-3 px-4 text-right text-[#5FBDE9] font-medium">{market.apy.toFixed(2)}%</td>
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

export default MarketAllocationTable;