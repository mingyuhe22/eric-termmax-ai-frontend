// components/borrow/BorrowHeader.tsx
import React from 'react';
import { X } from 'lucide-react';
import { Market } from '@/types/borrow';

interface BorrowHeaderProps {
  market: Market;
  onClose: () => void;
}

const BorrowHeader: React.FC<BorrowHeaderProps> = ({ market, onClose }) => {
  return (
    <div className="sticky top-0 z-10 bg-[#0a1525] flex items-center justify-between border-b border-[#1e2c3b] p-6">
      <div className="flex items-center gap-5">
        <div className="h-10 w-10 rounded-full bg-[#47A6E5]/20 p-0.5 flex items-center justify-center">
          <div className="h-full w-full rounded-full bg-[#061020] flex items-center justify-center">
            <span className="font-semibold text-xl text-[#47A6E5]">p</span>
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white">Borrow</h2>
            <div className="px-2 py-0.5 bg-[#47A6E5]/10 text-[#47A6E5] rounded-md text-xs inline-block border border-[#47A6E5]/20">
              Fixed Rate
            </div>
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {market.collateral} / {market.debtToken} · {market.days} Days
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
  );
};

export default BorrowHeader;