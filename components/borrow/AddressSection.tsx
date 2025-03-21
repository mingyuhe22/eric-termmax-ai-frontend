'use client'

import React, { useState } from 'react'
import { Copy, ChevronDown, ChevronUp } from 'lucide-react'

interface AddressSectionProps {
  addresses: {
    market: string
    ft: string
    xt: string
    collateral: string
    router: string
  }
}

const AddressSection: React.FC<AddressSectionProps> = ({
  addresses
}) => {
  const [showAllAddresses, setShowAllAddresses] = useState(false)
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null)
  
  // Copy to clipboard function
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedAddress(text)
    setTimeout(() => setCopiedAddress(null), 2000)
  }
  
  return (
    <div className="p-6 pb-2">
      <div className="bg-[#0c1624] border border-[#1e2c3b] rounded-lg p-4 shadow-lg mb-2">
        <div className="text-sm text-gray-400 mb-1">Market Address</div>
        <div className="flex items-center justify-between">
          <span className="text-white font-mono text-xs">{addresses.market}</span>
          <button 
            className="text-gray-400 hover:text-[#5FBDE9] transition-colors duration-200"
            onClick={() => copyToClipboard(addresses.market)}
          >
            {copiedAddress === addresses.market ? (
              <span className="text-[#5FBDE9]">Copied!</span>
            ) : (
              <Copy size={16} />
            )}
          </button>
        </div>
      </div>
      
      {/* Toggle to show all addresses */}
      <button 
        className="flex items-center justify-center w-full text-xs text-gray-400 hover:text-white py-2 transition-colors"
        onClick={() => setShowAllAddresses(!showAllAddresses)}
      >
        {showAllAddresses ? 'Hide' : 'Show All'} Addresses
        {showAllAddresses ? <ChevronUp size={14} className="ml-1" /> : <ChevronDown size={14} className="ml-1" />}
      </button>
      
      {/* Additional Addresses */}
      {showAllAddresses && (
        <div className="grid grid-cols-1 gap-2 mb-2">
          {Object.entries(addresses).slice(1).map(([key, value]) => (
            <div key={key} className="bg-[#0c1624] border border-[#1e2c3b] rounded-lg p-3 shadow-lg">
              <div className="text-xs text-gray-400 mb-1">{key.charAt(0).toUpperCase() + key.slice(1)} Address</div>
              <div className="flex items-center justify-between">
                <span className="text-white font-mono text-xs">{value}</span>
                <button 
                  className="text-gray-400 hover:text-[#5FBDE9] transition-colors duration-200"
                  onClick={() => copyToClipboard(value)}
                >
                  {copiedAddress === value ? (
                    <span className="text-[#5FBDE9] text-xs">Copied!</span>
                  ) : (
                    <Copy size={14} />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AddressSection