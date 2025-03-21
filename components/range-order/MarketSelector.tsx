// components/range-order/MarketSelector.tsx
'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Market } from '@/lib/range-order/types'

interface MarketSelectorProps {
  selectedMarket: Market
  markets: Market[]
  onSelectMarket: (market: Market) => void
}

export default function MarketSelector({ 
  selectedMarket, 
  markets, 
  onSelectMarket 
}: MarketSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Color constants for consistency across components
  const lltvColor = "text-[#5FBDE9]"; // Lighter blue for LLTV
  const maxLtvColor = "text-[#3182CE]"; // Darker blue for Max-LTV

  // Updated badge styles
  const lltvBadgeStyle = "text-xs border-[#5FBDE9]/30 bg-[#5FBDE9]/10";
  const maxLtvBadgeStyle = "text-xs border-[#3182CE]/30 bg-[#3182CE]/10";

  return (
    <div 
      className="relative col-span-2 bg-[#0c1624] border border-[#1e2c3b] rounded-lg p-4 flex items-center justify-between cursor-pointer"
      onClick={() => setIsOpen(!isOpen)}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div className="flex items-center space-x-3">
        <div className="h-10 w-10 rounded-full bg-[#5FBDE9]/20 p-0.5 flex items-center justify-center">
          <div className="h-full w-full rounded-full bg-[#061020] flex items-center justify-center">
            {selectedMarket.icon}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-medium text-white">
            {`${selectedMarket.debtToken}/${selectedMarket.collateral}-${selectedMarket.maturity}`}
          </h2>
          <div className="flex space-x-2 mt-1">
            <Badge variant="outline" className={`${lltvBadgeStyle} ${lltvColor}`}>
              LLTV: {selectedMarket.lltv}
            </Badge>
            <Badge variant="outline" className={`${maxLtvBadgeStyle} ${maxLtvColor}`}>
              Max-LTV: {selectedMarket.maxLtv}
            </Badge>
          </div>
        </div>
      </div>
      <ChevronDown className={`h-4 w-4 text-white transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-[#0c1624] border border-[#1e2c3b] rounded-lg shadow-lg z-50 overflow-hidden"
          >
            <div className="max-h-60 overflow-y-auto">
              {markets.map((market) => (
                <div 
                  key={market.id}
                  className={`p-4 hover:bg-[#0a1525] cursor-pointer transition-colors duration-150 border-b border-[#1e2c3b] last:border-0 ${
                    selectedMarket.id === market.id ? 'bg-[#0a1525]' : ''
                  }`}
                  onClick={() => {
                    onSelectMarket(market)
                    setIsOpen(false)
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-full bg-[#5FBDE9]/20 p-0.5 flex items-center justify-center">
                      <div className="h-full w-full rounded-full bg-[#061020] flex items-center justify-center">
                        {market.icon}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-white font-medium">
                        {`${market.debtToken}/${market.collateral}-${market.maturity}`}
                      </h3>
                      <div className="flex space-x-2 mt-0.5 text-xs">
                        <span className={lltvColor}>LLTV: {market.lltv}</span>
                        <span className={maxLtvColor}>Max-LTV: {market.maxLtv}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}