'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils/utils'
import CountUp from '@/components/shared/CountUp'

interface Market {
  id: string
  lendToken: string
  collateral: string
  maturity: string
  days: number
  ftSymbol: string
  lendAPR: number
  supportsLeverage: boolean
  lendingCapacity: string
  chain: string
  userPosition: number
  addresses: {
    market: string
    ft: string
    xt: string
    collateral: string
    router: string
  }
  yieldBreakdown: {
    nativeYield: number
    incentiveYield: number
    totalYield: number
  }
}

interface MarketCardProps {
  market: Market
  isSelected?: boolean
  onClick: () => void
  index: number
}

const MarketCard: React.FC<MarketCardProps> = ({
  market,
  isSelected = false,
  onClick,
  index,
}) => {
  // Get chain icon
  const getChainIcon = () => {
    switch(market.chain) {
      case 'ethereum':
        return 'Ξ'
      case 'arbitrum':
        return '🔷'
      case 'base':
        return '🅱️'
      default:
        return ''
    }
  }

  const hasUserPosition = market.userPosition > 0;

  return (
    <motion.div
      className={cn(
        'px-6 py-4 border-b border-[#1e2c3b]/5 grid grid-cols-5 items-center cursor-pointer transition-all duration-200',
        isSelected ? 'bg-[#0d111d]' : '',
        hasUserPosition 
          ? 'bg-[#5FBDE9]/10 border-l-2 border-l-[#5FBDE9]' 
          : '',
        'hover:bg-[#0c1020]'
      )}
      onClick={onClick}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.05 * (index % 5) }}
      whileHover={{ 
        scale: 1.001, 
        transition: { duration: 0.2 } 
      }}
    >
      {/* Market Name */}
      <div className="flex items-center space-x-3">
        <div className="h-10 w-10 rounded-full bg-[#0c1624] flex items-center justify-center text-white font-medium">
          {market.lendToken.charAt(0)}
        </div>
        <div>
          <div className="text-[#ffffff] font-medium text-sm md:text-base">
            {market.lendToken} / {market.collateral}
          </div>
          <div className="text-xs text-[#9ca3af] mt-0.5 flex items-center">
            <span>{market.ftSymbol}</span>
            <span className="mx-1">•</span>
            <span className="flex items-center">
              <span className="mr-1">{getChainIcon()}</span>
              <span>{market.chain}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Maturity */}
      <div className="text-center">
        <div className="text-[#ffffff] text-sm md:text-base">{market.maturity}</div>
        <div className="text-xs text-[#9ca3af] mt-0.5">{market.days} days</div>
      </div>

      {/* APR */}
      <div className="relative text-center">
        <div className="flex items-center justify-center">
          <motion.div
            className="inline-flex items-center justify-center relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            key={`${market.id}-${market.lendAPR}`}
          >
            <span className="text-[#5FBDE9] font-medium text-sm md:text-base group">
              <CountUp value={market.lendAPR} decimals={2} suffix="%" />
              <div className="absolute -top-1 -right-5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Star className="h-3.5 w-3.5 text-yellow-400" />
              </div>
              <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-14 bg-[#081020] border border-[#1e2c3b] text-[#ffffff] text-xs py-2 px-2 rounded shadow-lg w-32 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                <div className="flex justify-between items-center mb-1">
                  <span>Native:</span>
                  <span>{market.yieldBreakdown.nativeYield.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Incentive:</span>
                  <span>{market.yieldBreakdown.incentiveYield.toFixed(2)}%</span>
                </div>
                <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[5px] border-b-[#1e2c3b] absolute -top-[5px] left-1/2 transform -translate-x-1/2"></div>
              </div>
            </span>
          </motion.div>
        </div>
      </div>

      {/* Lending Capacity */}
      <div className="text-right text-[#ffffff] text-sm md:text-base">
        {market.lendingCapacity}
      </div>

      {/* Your Position */}
      <div className="text-right text-sm md:text-base">
        <span className={hasUserPosition ? "text-[#ffffff] font-medium" : "text-[#6b7280]"}>
          {hasUserPosition ? `$${market.userPosition.toLocaleString()}` : '-'}
        </span>
      </div>
    </motion.div>
  );
};

export default MarketCard;