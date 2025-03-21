// components/curator/CuratorEducationPanel.tsx
'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Info, TrendingUp, Lightbulb, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface CuratorEducationPanelProps {
  onCreateVault?: () => void
}

export const CuratorEducationPanel: React.FC<CuratorEducationPanelProps> = ({ onCreateVault }) => {
  return (
    <motion.div
      className="bg-[#0c1624] border border-[#1e2c3b] rounded-lg p-6 mb-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-full bg-[#5FBDE9]/20 flex items-center justify-center flex-shrink-0">
          <Lightbulb className="h-6 w-6 text-[#5FBDE9]" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white mb-3">Welcome to TermMax Curator</h3>
          <p className="text-gray-300 mb-4">
            As a curator, you can create and manage yield-generating vaults with custom strategies.
            Allocate funds across different markets, set parameters, and earn performance fees when 
            your strategies perform well.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-[#081020] rounded-lg p-4 border border-[#1e2c3b]">
              <div className="flex items-center mb-2">
                <TrendingUp className="h-5 w-5 text-[#5FBDE9] mr-2" />
                <h4 className="text-white font-medium">Optimize Yield</h4>
              </div>
              <p className="text-gray-400 text-sm">
                Design custom strategies that optimize yield across multiple DeFi protocols and markets.
              </p>
            </div>
            
            <div className="bg-[#081020] rounded-lg p-4 border border-[#1e2c3b]">
              <div className="flex items-center mb-2">
                <HelpCircle className="h-5 w-5 text-[#5FBDE9] mr-2" />
                <h4 className="text-white font-medium">Manage Risk</h4>
              </div>
              <p className="text-gray-400 text-sm">
                Set risk parameters, rebalance allocations, and manage exposure to different markets.
              </p>
            </div>
            
            <div className="bg-[#081020] rounded-lg p-4 border border-[#1e2c3b]">
              <div className="flex items-center mb-2">
                <Info className="h-5 w-5 text-[#5FBDE9] mr-2" />
                <h4 className="text-white font-medium">Earn Fees</h4>
              </div>
              <p className="text-gray-400 text-sm">
                Collect performance fees from users who deposit into your vaults.
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <Link href="https://docs.example.com/curator" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="border-[#1e2c3b] text-gray-400 hover:text-white">
                Learn More
              </Button>
            </Link>
            
            {onCreateVault && (
              <Button 
                className="bg-[#2a4365] hover:bg-[#2c5282] text-white border-[#3182CE]/30"
                onClick={onCreateVault}
              >
                Create Your First Vault
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default CuratorEducationPanel