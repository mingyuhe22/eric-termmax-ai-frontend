'use client'

import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils/format'
import { Position } from '@/lib/mock/dashboard-mock-data'

interface PositionActionModalProps {
  isOpen: boolean
  onClose: () => void
  position: Position | null
  actionType: 'sell' | 'redeem' | 'repay' | 'close'
  onConfirm: (amount: number) => void
}

const PositionActionModal: React.FC<PositionActionModalProps> = ({
  isOpen,
  onClose,
  position,
  actionType,
  onConfirm
}) => {
  const [amount, setAmount] = useState<string>('')
  const [maxAmount, setMaxAmount] = useState<number>(0)
  
  // Reset amount when modal opens or position changes
  useEffect(() => {
    if (position) {
      setAmount('')
      
      // Set max amount based on action type
      if (actionType === 'sell' || actionType === 'redeem') {
        setMaxAmount(position.asset.amount)
      } else if (actionType === 'repay' || actionType === 'close') {
        setMaxAmount(position.asset.amount)
      }
    }
  }, [position, actionType, isOpen])
  
  // Handle max button click
  const handleMaxClick = () => {
    setAmount(maxAmount.toString())
  }
  
  // Handle confirm action
  const handleConfirm = () => {
    const amountValue = parseFloat(amount)
    if (!isNaN(amountValue) && amountValue > 0 && amountValue <= maxAmount) {
      onConfirm(amountValue)
      onClose()
    }
  }
  
  // Early return if modal is closed or position is null
  if (!isOpen || !position) return null
  
  // Get action title and description
  const getActionDetails = () => {
    switch (actionType) {
      case 'sell':
        return {
          title: 'Sell Position',
          description: 'Sell your lending position before maturity',
          buttonText: 'Sell Position',
          inputLabel: 'Amount to Sell',
          assetSymbol: position.asset.symbol
        }
      case 'redeem':
        return {
          title: 'Redeem Position',
          description: 'Redeem your matured lending position',
          buttonText: 'Redeem Position',
          inputLabel: 'Amount to Redeem',
          assetSymbol: position.asset.symbol
        }
      case 'repay':
        return {
          title: 'Repay Loan',
          description: 'Repay your outstanding loan amount',
          buttonText: 'Repay Loan',
          inputLabel: 'Amount to Repay',
          assetSymbol: position.asset.symbol
        }
      case 'close':
        return {
          title: 'Close Position',
          description: 'Close your leveraged position',
          buttonText: 'Close Position',
          inputLabel: 'Amount to Close',
          assetSymbol: position.asset.symbol
        }
    }
  }
  
  const actionDetails = getActionDetails()
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center">
      <div className="bg-[#0c1624] border border-[#1e2c3b] rounded-lg w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#1e2c3b]">
          <h3 className="text-lg font-medium text-white">{actionDetails.title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-4">
          <p className="text-gray-400 mb-4">{actionDetails.description}</p>
          
          {/* Position Info */}
          <div className="bg-[#081020] border border-[#1e2c3b] rounded-lg p-3 mb-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-gray-400 mb-1">
                  {actionType === 'sell' || actionType === 'redeem' ? 'Lending' : 'Borrowing'} Asset
                </div>
                <div className="text-sm text-white">{position.asset.amount} {position.asset.symbol}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Value</div>
                <div className="text-sm text-white">{formatCurrency(position.value)}</div>
              </div>
              {position.collateral && (
                <>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Collateral</div>
                    <div className="text-sm text-white">{position.collateral.amount} {position.collateral.symbol}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Maturity</div>
                    <div className="text-sm text-white">{position.maturity.date}</div>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Input Amount */}
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-2">{actionDetails.inputLabel}</label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-3 pr-16 bg-[#081020] border-[#1e2c3b] text-white"
                  placeholder="0.0"
                  min="0"
                  max={maxAmount}
                  step="0.000001"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                  {actionDetails.assetSymbol}
                </div>
              </div>
              <Button
                onClick={handleMaxClick}
                size="sm"
                variant="outline"
                className="border-[#1e2c3b] text-[#5FBDE9] hover:text-white"
              >
                Max
              </Button>
            </div>
            <div className="mt-1 text-xs text-gray-400 text-right">
              Available: {maxAmount} {actionDetails.assetSymbol}
            </div>
          </div>
          
          {/* Action button */}
          <Button
            onClick={handleConfirm}
            className="w-full bg-[#2a4365] text-white hover:bg-[#2c5282]"
            disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > maxAmount}
          >
            {actionDetails.buttonText}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default PositionActionModal