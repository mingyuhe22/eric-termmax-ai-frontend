'use client'

import React from 'react'
import { motion } from 'framer-motion'
import CountUp from '@/components/shared/CountUp'

interface MarketStatsProps {
  lendAPR: number
  nativeYield: number
  incentiveYield: number
  lendingCapacity: string
}

// Generate random market statistics (these would come from API in a real app)
const generateMarketStats = () => ({
  liquidity: { value: 5.93, change: -8.77 },
  volume24h: { value: 0.61, change: 488 },
  totalLent: { value: 3.72, change: 12.3 }
})

const MarketStats: React.FC<MarketStatsProps> = ({
  lendAPR,
  nativeYield,
  incentiveYield,
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
      {/* APY Breakdown */}
      <div>
        <div className="text-xs text-gray-400 mb-1">APY</div>
        <div className="text-sm font-medium text-[#5FBDE9]">
          <CountUp value={lendAPR} decimals={2} suffix="%" />
        </div>
        <div className="flex justify-between text-xs mt-0.5 px-1">
          <span className="text-gray-400">Base:</span>
          <span className="text-white">{nativeYield.toFixed(2)}%</span>
        </div>
        <div className="flex justify-between text-xs px-1">
          <span className="text-gray-400">Incentive:</span>
          <span className="text-white">{incentiveYield.toFixed(2)}%</span>
        </div>
      </div>
      
      {/* Liquidity */}
      <div>
        <div className="text-xs text-gray-400 mb-1">Liquidity</div>
        <div className="text-sm font-medium text-white">${marketInfo.liquidity.value}M</div>
        <div className={`text-xs ${marketInfo.liquidity.change < 0 ? 'text-red-400' : 'text-green-400'}`}>
          {marketInfo.liquidity.change > 0 ? '+' : ''}{marketInfo.liquidity.change.toFixed(2)}%
        </div>
      </div>
      
      {/* 24h Volume */}
      <div>
        <div className="text-xs text-gray-400 mb-1">24h Volume</div>
        <div className="text-sm font-medium text-white">${marketInfo.volume24h.value}M</div>
        <div className={`text-xs ${marketInfo.volume24h.change < 0 ? 'text-red-400' : 'text-green-400'}`}>
          {marketInfo.volume24h.change > 0 ? '+' : ''}{marketInfo.volume24h.change.toFixed(0)}%
        </div>
      </div>
      
      {/* Total Lent */}
      <div>
        <div className="text-xs text-gray-400 mb-1">Total Lent</div>
        <div className="text-sm font-medium text-white">${marketInfo.totalLent.value}M</div>
        <div className={`text-xs ${marketInfo.totalLent.change < 0 ? 'text-red-400' : 'text-green-400'}`}>
          {marketInfo.totalLent.change > 0 ? '+' : ''}{marketInfo.totalLent.change.toFixed(1)}%
        </div>
      </div>
    </motion.div>
  )
}

export default MarketStats