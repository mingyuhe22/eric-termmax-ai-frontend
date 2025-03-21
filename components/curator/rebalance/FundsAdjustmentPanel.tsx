// components/curator/rebalance/FundsAdjustmentPanel.tsx
'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface FundsAdjustmentPanelProps {
  depositAmount: string
  withdrawAmount: string
  onDepositChange: (value: string) => void
  onWithdrawChange: (value: string) => void
  walletBalance?: number // Added wallet balance
  vaultBalance?: number // Added vault balance
  tokenSymbol?: string // Added token symbol
}

export const FundsAdjustmentPanel: React.FC<FundsAdjustmentPanelProps> = ({
  depositAmount,
  withdrawAmount,
  onDepositChange,
  onWithdrawChange,
  walletBalance = 10000, // Default wallet balance for demo
  vaultBalance = 4700000, // Default vault balance for demo
  tokenSymbol = 'USDC' // Default token symbol
}) => {
  // Set max deposit/withdraw
  const handleMaxDeposit = () => {
    onDepositChange(walletBalance.toString())
  }

  const handleMaxWithdraw = () => {
    onWithdrawChange(vaultBalance.toString())
  }

  return (
    <div className="bg-[#0c1624] border border-[#1e2c3b] rounded-lg p-5 shadow-lg">
      <h3 className="text-lg font-medium text-white mb-4">Adjust Vault Funds</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#081020] border border-[#1e2c3b] rounded-lg p-4">
          <div className="text-white font-medium mb-2">Deposit Funds</div>
          <div className="text-xs text-gray-400 mb-4">
            Add funds to the vault to increase capacity
          </div>
          
          <div className="flex gap-2">
            <div className="relative flex-grow">
              <Input
                type="number"
                placeholder="0.00"
                className="bg-[#0a1525] border-[#1e2c3b] pr-16"
                value={depositAmount}
                onChange={(e) => onDepositChange(e.target.value)}
              />
              <Button
                type="button"
                variant="ghost"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-6 text-xs text-[#5FBDE9]"
                onClick={handleMaxDeposit}
              >
                MAX
              </Button>
            </div>
            <Button className="bg-[#2a4365] hover:bg-[#2c5282] text-white border-[#3182CE]/30 whitespace-nowrap">
              Deposit
            </Button>
          </div>
          
          <div className="mt-2 text-xs text-gray-400">
            Wallet Balance: <span className="text-white">{walletBalance.toLocaleString()} {tokenSymbol}</span>
          </div>
        </div>
        
        <div className="bg-[#081020] border border-[#1e2c3b] rounded-lg p-4">
          <div className="text-white font-medium mb-2">Withdraw Funds</div>
          <div className="text-xs text-gray-400 mb-4">
            Remove funds from the vault
          </div>
          
          <div className="flex gap-2">
            <div className="relative flex-grow">
              <Input
                type="number"
                placeholder="0.00"
                className="bg-[#0a1525] border-[#1e2c3b] pr-16"
                value={withdrawAmount}
                onChange={(e) => onWithdrawChange(e.target.value)}
              />
              <Button
                type="button"
                variant="ghost"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-6 text-xs text-[#5FBDE9]"
                onClick={handleMaxWithdraw}
              >
                MAX
              </Button>
            </div>
            <Button variant="outline" className="border-[#1e2c3b] text-white hover:bg-[#0a1525] whitespace-nowrap">
              Withdraw
            </Button>
          </div>
          
          <div className="mt-2 text-xs text-gray-400">
            Available to Withdraw: <span className="text-white">{vaultBalance.toLocaleString()} {tokenSymbol}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FundsAdjustmentPanel