// components/borrow/MarketCard.tsx
'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Market } from '@/types/borrow'

interface MarketCardProps {
  market: Market
  index: number
  onClick: () => void
}

const MarketCard: React.FC<MarketCardProps> = ({ market, index, onClick }) => {
  // Get the first letter for token icon
  const tokenLetter = market.debtToken.charAt(0)
  
  // Generate chain icon - using a default value if chain property doesn't exist
  const getChainIcon = () => {
    // Default to ethereum if chain isn't specified
    const chain = (market.chain as string) || 'ethereum';
    
    switch(chain) {
      case 'ethereum':
        return <span className="ml-1">Ξ</span>
      case 'arbitrum':
        return <span className="ml-1">🔷</span>
      case 'base':
        return <span className="ml-1">🅱️</span>
      default:
        return null
    }
  }
  
  // Calculate leverage APY if not provided
  const calculateLeveragedAPY = () => {
    if (market.leverageAPY) {
      return market.leverageAPY;
    }
    // Simple calculation for demo purposes
    return market.borrowAPR * market.maxLeverage * 0.85;
  }
  
  return (
    <motion.div
      className="px-6 py-5 border-b border-[#1e2c3b]/10 grid grid-cols-6 items-center cursor-pointer hover:bg-[#0a1525] transition-colors"
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: 0.05 * (index % 10) }}
      whileHover={{ scale: 1.002, transition: { duration: 0.2 } }}
      onClick={onClick}
    >
      {/* Token Circle with Letter */}
      <div className="flex items-center justify-center">
        <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-medium bg-[#0c1624]">
          {tokenLetter}
        </div>
      </div>
      
      {/* Debt/Collateral */}
      <div className="col-span-1 -ml-2">
        <div className="text-white font-medium">{market.debtToken}</div>
        <div className="flex items-center text-xs text-blue-400 mt-1">
          <span>Collateral: {market.collateral}</span>
          {getChainIcon()}
        </div>
      </div>
      
      {/* Maturity */}
      <div className="text-center">
        <div className="text-white">{market.maturity}</div>
        <div className="text-xs text-gray-400 mt-1">{market.days} days</div>
      </div>
      
      {/* Borrow Rate and LTV */}
      <div className="text-center">
        <div className="text-[#5FBDE9] font-medium">{market.borrowAPR.toFixed(2)}%</div>
        <div className="text-xs text-gray-400 mt-1">LTV: {(market.ltv * 100).toFixed(0)}%</div>
      </div>
      
      {/* Borrowing Capacity */}
      <div className="text-right text-white">
        {/* Use a fallback value if borrowingCapacity doesn't exist */}
        {market.borrowingCapacity || '$5,000,000'}
      </div>
      
      {/* Leverage */}
      <div className="text-right">
        {market.supportsLeverage ? (
          <div>
            <Badge 
              className="font-medium bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
            >
              Up to {market.maxLeverage.toFixed(1)}x
            </Badge>
            <div className="text-xs text-yellow-400 mt-1">APY: {calculateLeveragedAPY().toFixed(2)}%</div>
          </div>
        ) : (
          <Badge 
            variant="outline" 
            className="text-gray-400 border-gray-500/30"
          >
            No Leverage
          </Badge>
        )}
      </div>
    </motion.div>
  )
}

export default MarketCard