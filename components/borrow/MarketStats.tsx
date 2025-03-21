'use client'

import React from 'react'
import { motion } from 'framer-motion'
import CountUp from '@/components/shared/CountUp'

// Simplified props - using only what we need
interface MarketStatsProps {
  borrowAPR: number;  // Borrow rate
}

// Generate random market statistics (these would come from API in a real app)
const generateMarketStats = () => ({
  liquidity: { value: 5.93, change: -8.77 },
  tvl: { value: 12.45, change: 3.21 },
  volume24h: { value: 0.61, change: 488 }
})

const MarketStats: React.FC<MarketStatsProps> = ({
  borrowAPR
}) => {
  // Generate mock market data
  const marketInfo = generateMarketStats()
  
  return (
    <motion.div
      className="p-4 mx-6 bg-[#0c1624] border border-[#1e2c3b] rounded-lg grid grid-cols-4 gap-4 text-center mb-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.3 }}
    >
      {/* Liquidity */}
      <div>
        <div className="text-xs text-gray-400 mb-1">Liquidity</div>
        <div className="text-sm font-medium text-white">${marketInfo.liquidity.value}M</div>
        <div className={`text-xs ${marketInfo.liquidity.change < 0 ? 'text-red-400' : 'text-green-400'}`}>
          {marketInfo.liquidity.change > 0 ? '+' : ''}{marketInfo.liquidity.change.toFixed(2)}%
        </div>
      </div>
      
      {/* TVL */}
      <div>
        <div className="text-xs text-gray-400 mb-1">TVL</div>
        <div className="text-sm font-medium text-white">${marketInfo.tvl.value}M</div>
        <div className={`text-xs ${marketInfo.tvl.change < 0 ? 'text-red-400' : 'text-green-400'}`}>
          {marketInfo.tvl.change > 0 ? '+' : ''}{marketInfo.tvl.change.toFixed(2)}%
        </div>
      </div>
      
      {/* Borrow Rate */}
      <div>
        <div className="text-xs text-gray-400 mb-1">Borrow Rate</div>
        <div className="text-sm font-medium text-[#5FBDE9]">
          <CountUp value={borrowAPR} decimals={2} suffix="%" />
        </div>
        <div className="text-xs text-gray-400">Fixed APR</div>
      </div>
      
      {/* 24h Volume */}
      <div>
        <div className="text-xs text-gray-400 mb-1">24h Volume</div>
        <div className="text-sm font-medium text-white">${marketInfo.volume24h.value}M</div>
        <div className={`text-xs ${marketInfo.volume24h.change < 0 ? 'text-red-400' : 'text-green-400'}`}>
          {marketInfo.volume24h.change > 0 ? '+' : ''}{marketInfo.volume24h.change.toFixed(0)}%
        </div>
      </div>
    </motion.div>
  )
}

export default MarketStats