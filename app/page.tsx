'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Wallet } from 'lucide-react'
import { useAccount } from 'wagmi'
import ConnectWalletButton from '@/components/layout/ConnectWalletButton'
import PortfolioOverview from '@/components/dashboard/PortfolioOverview'
import QuickAccess from '@/components/dashboard/QuickAccess'
import PositionsTable from '@/components/dashboard/PositionsTable'
import SqueezePreview from '@/components/dashboard/SqueezePreview'
import { 
  getMockLendPositions, 
  getMockBorrowPositions, 
  getMockPortfolioStats,
  calculateSqueezeMetrics,
  Position,
  PortfolioStats
} from '@/lib/mock/dashboard-mock-data'

export default function DashboardPage() {
  // Get wallet connection status from wagmi
  const { isConnected } = useAccount()
  
  // State for active tab
  const [activeTab, setActiveTab] = useState<'lend' | 'borrow'>('lend')
  
  // State for positions
  const [positions, setPositions] = useState<Position[]>([])
  
  // State for portfolio stats
  const [portfolio, setPortfolio] = useState<PortfolioStats>({
    totalValue: 0,
    totalLendValue: 0, 
    totalBorrowValue: 0,
    netApy: 7.82,
    maturedPositions: 0,
    atRiskPositions: 0
  })
  
  // State for squeeze mode
  const [squeezeMode, setSqueezeMode] = useState(false)
  const [selectedPositions, setSelectedPositions] = useState<string[]>([])
  
  // Toggle position expansion
  const togglePositionExpand = (id: string) => {
    setPositions(positions.map(p => 
      p.id === id ? { ...p, isExpanded: !p.isExpanded } : p
    ))
  }
  
  // Load mock data when wallet is connected
  useEffect(() => {
    if (isConnected) {
      const lendPositions = getMockLendPositions()
      const borrowPositions = getMockBorrowPositions()
      
      setPositions([...lendPositions, ...borrowPositions])
      setPortfolio(getMockPortfolioStats(lendPositions, borrowPositions))
    }
  }, [isConnected])
  
  // Toggle squeeze mode
  const toggleSqueezeMode = () => {
    setSqueezeMode(!squeezeMode)
    setSelectedPositions([])
  }
  
  // Toggle position selection for squeeze
  const togglePositionSelection = (id: string) => {
    if (selectedPositions.includes(id)) {
      setSelectedPositions(selectedPositions.filter(pid => pid !== id))
    } else {
      setSelectedPositions([...selectedPositions, id])
    }
  }
  
  // Filter positions based on active tab
  const filteredPositions = positions.filter(p => 
    (activeTab === 'lend' && p.type === 'lend') || 
    (activeTab === 'borrow' && p.type === 'borrow')
  )
  
  // Calculate squeeze metrics
  const squeezeMetrics = squeezeMode && selectedPositions.length > 0 
    ? calculateSqueezeMetrics(positions, selectedPositions) 
    : null
  
  return (
    <div className="min-h-screen bg-[#0a0d19] pb-16">
      <div className="w-full max-w-7xl mx-auto px-4 pt-8">
        {/* Dashboard Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Overview of your positions and portfolio</p>
        </motion.div>
        
        {/* Quick Access - Always visible regardless of connection status */}
        <QuickAccess />
        
        {/* Wallet Connection Status */}
        {!isConnected ? (
          <div className="bg-[#0c1624] border border-[#1e2c3b] rounded-lg p-8 text-center mb-8">
            <div className="flex flex-col items-center justify-center">
              <Wallet className="h-16 w-16 text-[#1e2c3b] mb-4" />
              <h2 className="text-xl font-medium text-white mb-2">Connect Your Wallet</h2>
              <p className="text-gray-400 max-w-md mx-auto mb-6">
                Connect your wallet to view your positions, portfolio stats, and access all features.
              </p>
              <ConnectWalletButton />
            </div>
          </div>
        ) : (
          <>
            {/* Portfolio Overview - Only visible when connected */}
            <PortfolioOverview portfolio={portfolio} />
            
            {/* Positions Section */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Positions</h2>
                <div className="flex gap-2">
                  {activeTab === 'borrow' && (
                    <button
                      className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                        squeezeMode 
                          ? 'bg-[#5FBDE9] text-white' 
                          : 'border border-[#1e2c3b] text-gray-400 hover:text-white'
                      }`}
                      onClick={toggleSqueezeMode}
                    >
                      {squeezeMode ? 'Cancel' : 'Squeeze Loans'}
                    </button>
                  )}
                </div>
              </div>
              
              {/* Tabs */}
              <div className="flex border-b border-[#1e2c3b] mb-4">
                <button 
                  className={`py-2 px-4 font-medium text-sm ${
                    activeTab === 'lend' 
                      ? 'text-[#5FBDE9] border-b-2 border-[#5FBDE9]' 
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                  onClick={() => {
                    setActiveTab('lend')
                    setSqueezeMode(false)
                  }}
                >
                  FT (Lend Positions)
                </button>
                <button 
                  className={`py-2 px-4 font-medium text-sm ${
                    activeTab === 'borrow' 
                      ? 'text-[#5FBDE9] border-b-2 border-[#5FBDE9]' 
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                  onClick={() => setActiveTab('borrow')}
                >
                  GT (Loan Positions)
                </button>
              </div>
              
              {/* Squeeze Mode Preview */}
              {squeezeMode && squeezeMetrics && (
                <SqueezePreview metrics={squeezeMetrics} />
              )}
              
              {/* Positions Table */}
              <PositionsTable 
                positions={filteredPositions} 
                activeTab={activeTab}
                squeezeMode={squeezeMode}
                selectedPositions={selectedPositions}
                onToggleExpand={togglePositionExpand}
                onToggleSelection={togglePositionSelection}
              />
            </motion.div>
          </>
        )}
      </div>
    </div>
  )
}