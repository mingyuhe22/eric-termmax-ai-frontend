'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatPercentage } from '@/lib/utils/format'
import { PortfolioStats } from '@/lib/mock/dashboard-mock-data'

interface PortfolioOverviewProps {
  portfolio: PortfolioStats
}

const PortfolioOverview: React.FC<PortfolioOverviewProps> = ({ portfolio }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <motion.div 
        className="bg-[#0c1624] border border-[#1e2c3b] rounded-lg p-5 col-span-1"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="text-sm text-gray-400 mb-1">Total Position Value</div>
        <div className="text-2xl font-bold text-[#5FBDE9]">
          {formatCurrency(portfolio.totalValue)}
        </div>
        <div className="flex justify-between mt-4 text-sm">
          <div className="text-gray-400">Net APY</div>
          <div className="text-white">{formatPercentage(portfolio.netApy)}</div>
        </div>
      </motion.div>
      
      <motion.div 
        className="bg-[#0c1624] border border-[#1e2c3b] rounded-lg p-5 col-span-1"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="text-sm text-gray-400 flex justify-between">
          <span>Lending Value</span>
          <Link href="/earn" className="text-[#5FBDE9] hover:underline flex items-center text-xs">
            <span>View All</span>
            <ArrowRight className="h-3 w-3 ml-1" />
          </Link>
        </div>
        <div className="text-2xl font-bold text-white">
          {formatCurrency(portfolio.totalLendValue)}
        </div>
        <div className="mt-4 flex items-center">
          {portfolio.maturedPositions > 0 && (
            <Badge className="bg-[#5FBDE9]/10 text-[#5FBDE9] border border-[#5FBDE9]/30">
              {portfolio.maturedPositions} Matured
            </Badge>
          )}
        </div>
      </motion.div>
      
      <motion.div 
        className="bg-[#0c1624] border border-[#1e2c3b] rounded-lg p-5 col-span-1"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <div className="text-sm text-gray-400 flex justify-between">
          <span>Borrowing Value</span>
          <Link href="/borrow" className="text-[#5FBDE9] hover:underline flex items-center text-xs">
            <span>View All</span>
            <ArrowRight className="h-3 w-3 ml-1" />
          </Link>
        </div>
        <div className="text-2xl font-bold text-white">
          {formatCurrency(portfolio.totalBorrowValue)}
        </div>
        <div className="mt-4 flex items-center">
          {portfolio.atRiskPositions > 0 && (
            <Badge className="bg-red-500/20 text-red-400 border border-red-500/30">
              {portfolio.atRiskPositions} At Risk
            </Badge>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default PortfolioOverview