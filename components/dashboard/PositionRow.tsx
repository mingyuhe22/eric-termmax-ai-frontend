'use client'

import React, { useState } from 'react'
import { 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  Minus, 
  CheckCircle 
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatPercentage, formatCurrency } from '@/lib/utils/format'
import { truncateMiddle } from '@/lib/utils/utils'
import { Position } from '@/lib/mock/dashboard-mock-data'
import PositionActionModal from './PositionActionModal'

interface PositionRowProps {
  position: Position
  isSelected: boolean
  squeezeMode: boolean
  activeTab: 'lend' | 'borrow'
  onToggleExpand: (id: string) => void
  onToggleSelection: (id: string) => void
}

const PositionRow: React.FC<PositionRowProps> = ({
  position,
  isSelected,
  squeezeMode,
  onToggleExpand,
  onToggleSelection
}) => {
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [actionType, setActionType] = useState<'sell' | 'redeem' | 'repay' | 'close'>('sell')
  
  // Get health factor badge
  const getHealthFactorBadge = (status: 'safe' | 'warning' | 'critical' | undefined) => {
    if (!status) return null

    switch (status) {
      case 'safe':
        return <Badge variant="success">SAFE</Badge>
      case 'warning':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">WARNING</Badge>
      case 'critical':
        return <Badge className="bg-red-500/20 text-red-400 border border-red-500/30">CRITICAL</Badge>
    }
  }

  // Get health factor text color
  const getHealthFactorColor = (status: 'safe' | 'warning' | 'critical' | undefined) => {
    if (!status) return 'text-white'

    switch (status) {
      case 'safe':
        return 'text-green-400'
      case 'warning':
        return 'text-yellow-400'
      case 'critical':
        return 'text-red-400'
    }
  }
  
  // Handle action buttons
  const handleActionClick = (type: 'sell' | 'redeem' | 'repay' | 'close') => {
    setActionType(type)
    setIsModalOpen(true)
  }
  
  // Handle action confirmation
  const handleConfirmAction = (amount: number) => {
    console.log(`Confirmed ${actionType} action for position ${position.id} with amount ${amount}`)
    // Here you would typically call an API or send a transaction
    
    // Mock success notification
    alert(`Successfully ${actionType === 'sell' ? 'sold' : 
            actionType === 'redeem' ? 'redeemed' : 
            actionType === 'repay' ? 'repaid' : 
            'closed'} ${amount} ${position.asset.symbol}`)
  }

  return (
    <>
      <div className="border-b border-[#1e2c3b] last:border-b-0">
        {/* Main row */}
        <div 
          className={`grid grid-cols-6 gap-4 items-center px-4 py-3 ${position.type === 'borrow' && squeezeMode ? 'cursor-pointer hover:bg-[#0a1525]' : ''} ${isSelected ? 'bg-[#0a1525]' : ''}`}
          onClick={() => {
            if (position.type === 'borrow' && squeezeMode) {
              onToggleSelection(position.id)
            }
          }}
        >
          {/* Asset or Debt */}
          <div className="col-span-1">
            <div className="flex items-center">
              {squeezeMode && position.type === 'borrow' && (
                <div className="mr-2">
                  <div className={`w-4 h-4 rounded border ${isSelected ? 'bg-[#5FBDE9] border-[#5FBDE9]' : 'border-gray-500'}`}>
                    {isSelected && (
                      <CheckCircle className="h-3 w-3 text-white" />
                    )}
                  </div>
                </div>
              )}
              <div>
                <div className="text-white font-medium">
                  {position.asset.amount} {position.asset.symbol}
                </div>
                <div className="text-xs text-gray-400">{position.asset.formattedValue}</div>
              </div>
            </div>
          </div>
          
          {/* Collateral */}
          <div className="col-span-1">
            <div className="flex items-center">
              <div>
                <div className="text-white font-medium">
                  {position.collateral.amount} {position.collateral.symbol}
                </div>
                <div className="text-xs text-gray-400">{position.collateral.formattedValue}</div>
              </div>
              {position.type === 'borrow' && !squeezeMode && (
                <div className="ml-2 flex">
                  <button className="text-gray-400 hover:text-[#5FBDE9]">
                    <Plus className="h-4 w-4" />
                  </button>
                  <button className="text-gray-400 hover:text-[#5FBDE9] ml-1">
                    <Minus className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Maturity */}
          <div className="col-span-1 text-center">
            <div className="flex flex-col items-center">
              <div className="text-white">{position.maturity.date}</div>
              <div className="flex items-center text-xs">
                {position.maturity.status === 'active' && (
                  <Badge className="bg-[#5FBDE9]/10 text-[#5FBDE9] border-[#5FBDE9]/30 text-xs">
                    {position.maturity.days} days
                  </Badge>
                )}
                {position.maturity.status === 'expired' && (
                  <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">
                    Matured
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          {/* Health Factor or Value at Maturity */}
          {position.type === 'lend' ? (
            <div className="col-span-1 text-center">
              <div className="text-white">{position.formattedValue}</div>
            </div>
          ) : (
            <div className="col-span-1 text-center">
              <div className="flex flex-col items-center">
                <div className={getHealthFactorColor(position.healthFactor?.status)}>
                  {position.healthFactor?.value.toFixed(2)}
                </div>
                <div className="text-xs text-gray-400">
                  {getHealthFactorBadge(position.healthFactor?.status)}
                </div>
                {position.leverage && (
                  <div className="text-xs text-yellow-400 mt-1">
                    {position.leverage}x Leverage
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Value */}
          {position.type === 'borrow' && (
            <div className="col-span-1 text-center">
              <div className="text-white">{position.formattedValue}</div>
            </div>
          )}
          
          {/* Actions */}
          <div className={`${position.type === 'lend' ? 'col-span-2' : 'col-span-1'} text-right`}>
            <div className="flex justify-end gap-2">
              {position.type === 'lend' && position.maturity.status === 'expired' && (
                <Button 
                  size="sm" 
                  className="bg-[#2a4365] text-white"
                  onClick={() => handleActionClick('redeem')}
                >
                  Redeem
                </Button>
              )}
              {position.type === 'lend' && position.maturity.status === 'active' && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="border-[#1e2c3b] text-gray-400 hover:text-white"
                  onClick={() => handleActionClick('sell')}
                >
                  Sell
                </Button>
              )}
              {position.type === 'borrow' && !squeezeMode && (
                <>
                  {position.leverage ? (
                    <Button 
                      size="sm" 
                      className="bg-[#2a4365] text-white"
                      onClick={() => handleActionClick('close')}
                    >
                      Close
                    </Button>
                  ) : (
                    <Button 
                      size="sm" 
                      className="bg-[#2a4365] text-white"
                      onClick={() => handleActionClick('repay')}
                    >
                      Repay
                    </Button>
                  )}
                </>
              )}
              <button 
                className="text-gray-400 hover:text-white"
                onClick={(e) => {
                  e.stopPropagation()
                  onToggleExpand(position.id)
                }}
              >
                {position.isExpanded ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Expanded details */}
        {position.isExpanded && (
          <div className="bg-[#0a1525] px-4 py-3 border-t border-[#1e2c3b]">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-gray-400 mb-1">Contract Address</div>
                <div className="text-sm text-white font-mono">{truncateMiddle('0x83a2E5a23a38D7e7964f38f5988C9B127d65Df3F', 10, 8)}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Transaction Hash</div>
                <div className="text-sm text-white font-mono">{truncateMiddle('0x51a9F2fe5A7B98b8fc8E2e52E987982f7A7E632D', 10, 8)}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Created</div>
                <div className="text-sm text-white">March 15, 2025</div>
              </div>
              
              {position.type === 'borrow' && (
                <>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">LTV</div>
                    <div className="text-sm text-white">{formatPercentage(position.healthFactor?.ltv ? position.healthFactor.ltv * 100 : 0)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Liquidation Price</div>
                    <div className="text-sm text-white">{formatCurrency(4360.50)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Interest Accrued</div>
                    <div className="text-sm text-white">{formatCurrency(123.45)}</div>
                  </div>
                </>
              )}
              
              {position.type === 'lend' && (
                <>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">APY</div>
                    <div className="text-sm text-white">{formatPercentage(5.78)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Interest Earned</div>
                    <div className="text-sm text-white">{formatCurrency(342.18)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Days to Maturity</div>
                    <div className="text-sm text-white">{position.maturity.days}</div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Action Modal */}
      <PositionActionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        position={position}
        actionType={actionType}
        onConfirm={handleConfirmAction}
      />
    </>
  )
}

export default PositionRow