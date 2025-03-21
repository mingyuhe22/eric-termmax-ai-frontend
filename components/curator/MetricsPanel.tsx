// components/curator/MetricsPanel.tsx
'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart2, 
  TrendingUp, 
  Database, 
  DollarSign
} from 'lucide-react'

interface MetricsPanelProps {
  tvl: number
  averageApy: number
  vaultsCount: number
  accFee: number
}

export default function MetricsPanel({
  tvl = 16600000,
  averageApy = 10.7,
  vaultsCount = 8,
  accFee = 32500
}: MetricsPanelProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <motion.div
        className="bg-[#0c1624] border border-[#1e2c3b] rounded-lg p-5 shadow-lg"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-[#5FBDE9]/20 flex items-center justify-center">
            <BarChart2 className="h-5 w-5 text-[#5FBDE9]" />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Total Value Locked</p>
            <h3 className="text-2xl font-bold text-white">${(tvl / 1000000).toFixed(1)}M</h3>
          </div>
        </div>
      </motion.div>
      
      <motion.div
        className="bg-[#0c1624] border border-[#1e2c3b] rounded-lg p-5 shadow-lg"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-[#5FBDE9]/20 flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-[#5FBDE9]" />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Average APY</p>
            <h3 className="text-2xl font-bold text-[#5FBDE9]">{averageApy.toFixed(1)}%</h3>
          </div>
        </div>
      </motion.div>
      
      <motion.div
        className="bg-[#0c1624] border border-[#1e2c3b] rounded-lg p-5 shadow-lg"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-[#5FBDE9]/20 flex items-center justify-center">
            <Database className="h-5 w-5 text-[#5FBDE9]" />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Vaults Number</p>
            <h3 className="text-2xl font-bold text-white">{vaultsCount}</h3>
          </div>
        </div>
      </motion.div>
      
      <motion.div
        className="bg-[#0c1624] border border-[#1e2c3b] rounded-lg p-5 shadow-lg"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-[#5FBDE9]/20 flex items-center justify-center">
            <DollarSign className="h-5 w-5 text-[#5FBDE9]" />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Acc. Fee</p>
            <h3 className="text-2xl font-bold text-white">${(accFee / 1000).toFixed(1)}K</h3>
          </div>
        </div>
      </motion.div>
    </div>
  )
}