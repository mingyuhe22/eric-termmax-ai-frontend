'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { LendingMarket, generateMockLendingTransactions } from '@/lib/mock/lend-mock-data'
import LendingHeader from './LendingHeader'
import AddressSection from './AddressSection'
import MarketStats from './MarketStats'
import RateCharts from './RateCharts'
import OrderTabs from './OrderTabs'
import LendingForm from './LendingForm'
import TransactionHistory from './TransactionHistory'

interface FixedRateLendingModalProps {
  market: LendingMarket
  onClose: () => void
}

const FixedRateLendingModal: React.FC<FixedRateLendingModalProps> = ({
  market,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [activeTab, setActiveTab] = useState<'market' | 'limit'>('market')
  const [transactions] = useState(generateMockLendingTransactions())
  
  useEffect(() => {
    // Trigger animation after component mounts
    setIsVisible(true)
  }, [])
  
  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }
  
  return (
    <>
      {/* Backdrop overlay with blur effect */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[99] transition-opacity duration-300"
        style={{ opacity: isVisible ? 1 : 0 }}
        onClick={handleBackdropClick}
      />

      {/* Paper-like sidebar */}
      <motion.div
        className="fixed right-0 top-0 bottom-0 w-full sm:w-2/3 md:w-2/3 lg:w-2/3 bg-[#0a1525] text-white z-[100] overflow-y-auto shadow-2xl border-l border-[#1e2c3b]"
        initial={{ x: '100%', opacity: 0, boxShadow: '0 0 0 rgba(0,0,0,0)' }}
        animate={{
          x: isVisible ? 0 : '100%',
          opacity: isVisible ? 1 : 0,
          boxShadow: isVisible ? '-10px 0 30px rgba(0,0,0,0.5)' : '0 0 0 rgba(0,0,0,0)'
        }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      >
        {/* Header */}
        <LendingHeader
          market={market}
          onClose={onClose}
        />
        
        {/* Address Section */}
        <AddressSection
          addresses={market.addresses}
        />
        
        {/* Market Stats */}
        <MarketStats
          lendAPR={market.lendAPR}
          nativeYield={market.yieldBreakdown.nativeYield}
          incentiveYield={market.yieldBreakdown.incentiveYield}
          lendingCapacity={market.lendingCapacity}
        />
        
        {/* Rate Charts */}
        <RateCharts
          lendAPR={market.lendAPR}
        />
        
        {/* Order Tabs */}
        <OrderTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        
        {/* Lending Form */}
        <LendingForm
          market={market}
          activeTab={activeTab}
        />
        
        {/* Transaction History */}
        <TransactionHistory
          transactions={transactions}
        />
      </motion.div>
    </>
  )
}

export default FixedRateLendingModal