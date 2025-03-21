'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Info } from 'lucide-react'

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
}

interface LendingFormProps {
  market: Market
  activeTab: 'market' | 'limit'
}

const LendingForm: React.FC<LendingFormProps> = ({
  market,
  activeTab
}) => {
  const [amount, setAmount] = useState('')
  const [walletBalance] = useState(5000) // Mock wallet balance
  
  // Calculate expected yield based on APR
  const calculateExpectedYield = () => {
    if (!amount || isNaN(parseFloat(amount))) return '0.00'
    const principal = parseFloat(amount)
    const yield1Day = principal * (market.lendAPR / 100) / 365
    const yieldTillMaturity = yield1Day * market.days
    return yieldTillMaturity.toFixed(2)
  }
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(`Lending ${amount} ${market.lendToken} at ${market.lendAPR}% APR`)
    // Logic to handle lending would go here
  }
  
  return (
    <motion.div
      className="mx-6 mb-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.3 }}
    >
      <div className="bg-[#0c1624] border border-[#1e2c3b] rounded-lg p-6">
        <form onSubmit={handleSubmit}>
          {/* Amount Input */}
          <div className="mb-4">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">
              Amount
            </label>
            <div className="relative">
              <input
                type="text"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-[#0a1020] border border-[#1e2c3b] rounded-lg py-3 px-4 text-white focus:ring-[#5FBDE9] focus:border-[#5FBDE9] focus:outline-none transition-colors duration-200"
              />
              <div className="absolute right-0 top-0 bottom-0 flex items-center px-3">
                <span className="text-gray-400">{market.lendToken}</span>
              </div>
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-400">
              <span>Available: {walletBalance.toLocaleString()} {market.lendToken}</span>
              <button 
                type="button"
                className="text-[#5FBDE9]"
                onClick={() => setAmount(walletBalance.toString())}
              >
                MAX
              </button>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="bg-[#081020] rounded-lg p-4 mb-4 border border-[#1e2c3b]">
            <h4 className="text-sm font-medium text-white mb-2">Order Summary</h4>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">APR:</span>
                <span className="text-white">{market.lendAPR.toFixed(2)}%</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">Maturity Date:</span>
                <span className="text-white">{market.maturity}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">Expected Yield:</span>
                <span className="text-[#5FBDE9]">${calculateExpectedYield()}</span>
              </div>
              
              {activeTab === 'limit' && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Minimum APR:</span>
                  <span className="text-white">{(market.lendAPR * 0.95).toFixed(2)}%</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Info Message */}
          <div className="flex items-start mb-6">
            <Info className="h-5 w-5 text-[#5FBDE9] shrink-0 mt-0.5 mr-2" />
            <p className="text-xs text-gray-400">
              By lending {market.lendToken}, you&apos;ll receive {market.ftSymbol} tokens that represent your deposit plus interest at maturity.
              {activeTab === 'limit' && " Your order will be matched when the APR criteria is met."}
            </p>
          </div>
          
          {/* Submit Button */}
          <button
            type="submit"
            disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > walletBalance}
            className="w-full bg-[#5FBDE9] hover:bg-[#3ba7d9] disabled:bg-[#5FBDE9]/50 disabled:cursor-not-allowed text-white rounded-lg py-3 font-medium transition-colors duration-200"
          >
            {activeTab === 'market' ? 'Lend Now' : 'Create Limit Order'}
          </button>
        </form>
      </div>
    </motion.div>
  )
}

export default LendingForm