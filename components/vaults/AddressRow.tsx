// components/vaults/AddressRow.tsx
import React from 'react';
import { Copy } from 'lucide-react';
import { truncateMiddle } from '@/lib/utils/utils';

interface AddressRowProps {
  label: string;
  address: string;
  copyToClipboard: (text: string) => void;
  copiedAddress: string | null;
}

const AddressRow: React.FC<AddressRowProps> = ({ 
  label, 
  address, 
  copyToClipboard, 
  copiedAddress 
}) => (
  <div className="bg-[#0c1624] border border-[#1e2c3b] rounded-lg p-4 shadow-lg">
    <div className="text-sm text-gray-400 mb-1">{label}</div>
    <div className="flex items-center justify-between">
      <span className="text-white font-mono text-xs">{truncateMiddle(address)}</span>
      <button
        onClick={() => copyToClipboard(address)}
        className="text-gray-400 hover:text-[#5FBDE9] transition-colors duration-200"
      >
        {copiedAddress === address ? (
          <span className="text-[#5FBDE9]">Copied!</span>
        ) : (
          <Copy size={16} />
        )}
      </button>
    </div>
  </div>
);

export default AddressRow;