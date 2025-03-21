'use client'

import React from 'react'
import { X } from 'lucide-react'
import { LendingMarket } from '@/lib/mock/lend-mock-data'

interface LendingHeaderProps {
  market: LendingMarket
  onClose: () => void
}

const LendingHeader: React.FC<LendingHeaderProps> = ({
  market,
  onClose
}) => {
  return (
    <div className="sticky top-0 z-[101] bg-[#0a1525] flex items-center justify-between border-b border-[#1e2c3b] p-6">
      <div className="flex items-center gap-5">
        <div className="h-10 w-10 rounded-full bg-[#5FBDE9]/20 p-0.5 flex items-center justify-center">
          <div className="h-full w-full rounded-full bg-[#061020] flex items-center justify-center">
            <span className="font-semibold text-xl text-[#5FBDE9]">{market.lendToken.charAt(0)}</span>
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white">Lend</h2>
            <div className="px-2 py-0.5 bg-[#5FBDE9]/10 text-[#5FBDE9] rounded-md text-xs inline-block border border-[#5FBDE9]/20">
              Fixed Rate
            </div>
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {market.lendToken} / {market.collateral} · {market.days} Days
          </div>
        </div>
      </div>
      <button
        onClick={onClose}
        className="rounded-full p-2 text-gray-400 hover:bg-[#1e2c3b]/40 hover:text-white transition-colors duration-200"
      >
        <X size={24} />
      </button>
    </div>
  )
}

export default LendingHeader