// components/range-order/MarketSummary.tsx
'use client'

import React from 'react'
import { Info } from 'lucide-react'

interface MarketSummaryProps {
  bestLendAPR: string
  bestBorrowAPR: string
  totalLiquidity: string
  utilization: string
}

export default function MarketSummary({
  bestLendAPR = "45.00%",
  bestBorrowAPR = "10.00%",
  totalLiquidity = "$4.3M",
  utilization = "76.5%"
}: MarketSummaryProps) {
  // Color constants for consistency across components
  const lendColor = "text-[#5FBDE9]";
  const borrowColor = "text-[#3182CE]"; // Darker blue for borrow

  return (
    <div className="col-span-3 bg-[#0c1624] border border-[#1e2c3b] rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        <Info className="h-4 w-4 text-[#5FBDE9]" />
        <span className="text-sm font-medium text-white">Market Summary</span>
      </div>
      
      <div className="grid grid-cols-4 gap-x-4 gap-y-2 text-sm">
        <div>
          <div className="text-gray-400 text-xs">Best Lend APR</div>
          <div className={lendColor}>{bestLendAPR}</div>
        </div>
        <div>
          <div className="text-gray-400 text-xs">Best Borrow APR</div>
          <div className={borrowColor}>{bestBorrowAPR}</div>
        </div>
        <div>
          <div className="text-gray-400 text-xs">Total Liquidity</div>
          <div className="text-white">{totalLiquidity}</div>
        </div>
        <div>
          <div className="text-gray-400 text-xs">Utilization</div>
          <div className="text-white">{utilization}</div>
        </div>
      </div>
    </div>
  );
}