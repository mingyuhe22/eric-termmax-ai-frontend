// components/curator/rebalance/OrderAllocationItem.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { ChevronRight} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import TokenIcon from '@/components/shared/TokenIcon'
import { VaultOrder } from '@/types/curator'
import { formatCurrency } from '@/lib/utils/format'
import AdvancedOrderSettings from './AdvancedOrderSettings'

interface OrderAllocationItemProps {
  order: VaultOrder
  isExpanded: boolean
  showAdvanced: boolean
  totalVaultValue: number
  onToggleExpansion: () => void
  onAllocationChange: (percentage: number) => void
}

export const OrderAllocationItem: React.FC<OrderAllocationItemProps> = ({
  order,
  isExpanded,
  showAdvanced,
  onToggleExpansion,
  onAllocationChange
}) => {
  // State for handling changes to the order
  const [, setLocalOrder] = useState(order)

  // Update local state when order changes
  useEffect(() => {
    setLocalOrder(order)
  }, [order])

  // Handle slider change
  const handleSliderChange = (value: number[]) => {
    const newPercentage = value[0]
    onAllocationChange(newPercentage)
  }

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value)
    if (!isNaN(value)) {
      onAllocationChange(value)
    }
  }

  // Get badge variant based on order type
  const getBadgeVariant = (orderType: string) => {
    switch (orderType) {
      case 'Lend':
        return 'primary'
      case 'Borrow':
        return 'purple'
      case 'Two Way':
        return 'success'
      default:
        return 'default'
    }
  }

  return (
    <div className="bg-[#081020] border border-[#1e2c3b] rounded-lg p-4 transition-all duration-200">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        {/* Order info */}
        <div className="flex items-center mb-4 md:mb-0">
          <div className="flex items-center space-x-3">
            <div className="flex -space-x-2">
              <TokenIcon symbol={order.debtToken} size="sm" />
              <TokenIcon symbol={order.collateral} size="sm" className="border-2 border-[#081020]" />
            </div>
            <div>
              <div className="text-white font-medium">{order.debtToken}/{order.collateral}</div>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={getBadgeVariant(order.orderType)} className="text-xs">
                  {order.orderType}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  LTV: {order.ltv.toFixed(2)}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {order.maturity}
                </Badge>
              </div>
            </div>
          </div>
        </div>
        
        {/* APR info */}
        <div className="flex flex-wrap gap-4 mb-4 md:mb-0">
          {order.borrowAPR && (
            <div className="text-center">
              <div className="text-xs text-gray-400 mb-1">Borrow APR</div>
              <div className="text-[#3182CE] font-medium">{order.borrowAPR}</div>
            </div>
          )}
          
          {order.lendAPR && (
            <div className="text-center">
              <div className="text-xs text-gray-400 mb-1">Lend APR</div>
              <div className="text-[#5FBDE9] font-medium">{order.lendAPR}</div>
            </div>
          )}
          
          <div className="text-center">
            <div className="text-xs text-gray-400 mb-1">Max Capacity</div>
            <div className="text-white">${formatCurrency(order.maxCapacity)}</div>
          </div>
        </div>
      </div>
      
      {/* Allocation slider */}
      <div className="mt-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">Allocation</span>
          <span className="text-[#5FBDE9] font-medium">{order.allocationPercentage.toFixed(1)}%</span>
        </div>
        
        <div className="flex items-center gap-3">
          <Slider 
            className="flex-grow"
            value={[order.allocationPercentage]}
            min={0}
            max={100}
            step={0.1}
            onValueChange={handleSliderChange}
          />
          <div className="w-20">
            <Input
              type="number"
              className="bg-[#0a1525] border-[#1e2c3b] text-center"
              value={order.allocationPercentage.toFixed(1)}
              onChange={handleInputChange}
            />
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
          <span>${formatCurrency(order.allocatedAmount)}</span>
          {showAdvanced && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-400 hover:text-white p-0 h-6"
              onClick={onToggleExpansion}
            >
              {isExpanded ? 'Hide Advanced' : 'Show Advanced'}
              <ChevronRight className={`ml-1 h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
            </Button>
          )}
        </div>
      </div>
      
      {/* Advanced settings (conditionally rendered) */}
      {showAdvanced && isExpanded && (
        <AdvancedOrderSettings order={order} />
      )}
    </div>
  )
}

export default OrderAllocationItem