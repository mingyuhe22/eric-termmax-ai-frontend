// components/curator/rebalance/RebalanceInterface.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { MetricsPanel } from './MetricsPanel'
import { FundsAdjustmentPanel } from './FundsAdjustmentPanel'
import { OrderAllocationItem } from './OrderAllocationItem'
import { VaultOrder, RebalanceMetrics } from '@/types/curator'

interface RebalanceInterfaceProps {
  vaultOrders: VaultOrder[]
  metrics: RebalanceMetrics
  onSaveRebalance: (orders: VaultOrder[], deposit?: number, withdraw?: number) => void
  onCancelRebalance: () => void
}

export const RebalanceInterface: React.FC<RebalanceInterfaceProps> = ({
  vaultOrders,
  metrics,
  onSaveRebalance,
  onCancelRebalance
}) => {
  // State for managing orders with allocation percentages
  const [orders, setOrders] = useState<VaultOrder[]>([])
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null)
  const [depositAmount, setDepositAmount] = useState<string>('')
  const [withdrawAmount, setWithdrawAmount] = useState<string>('')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [vaultMetrics, setVaultMetrics] = useState(metrics)
  
  // Mock wallet data for demo
  const walletBalance = 10000
  const tokenSymbol = 'USDC'

  // Initialize orders with the provided vaultOrders
  useEffect(() => {
    if (vaultOrders) {
      setOrders([...vaultOrders])
    }
  }, [vaultOrders])

  // Update metrics when orders or deposit/withdraw amounts change
  useEffect(() => {
    const depositValue = parseFloat(depositAmount) || 0
    const withdrawValue = parseFloat(withdrawAmount) || 0
    
    // Calculate new total value
    const newTotalValue = metrics.totalVaultValue + depositValue - withdrawValue
    
    // Calculate new unallocated value
    const newUnallocatedValue = metrics.unallocatedValue + depositValue - withdrawValue
    
    // Calculate new average APY based on allocations
    const totalWeightedApy = orders.reduce((acc, order) => {
      const apy = order.orderType === 'Borrow' 
        ? order.borrowAPRRaw || 0 
        : order.orderType === 'Lend' 
          ? order.lendAPRRaw || 0 
          : ((order.lendAPRRaw || 0) + (order.borrowAPRRaw || 0)) / 2
      
      return acc + (apy * order.allocationPercentage / 100)
    }, 0)
    
    setVaultMetrics({
      totalVaultValue: newTotalValue,
      unallocatedValue: newUnallocatedValue,
      allocatedValue: metrics.allocatedValue,
      averageAPY: totalWeightedApy
    })
  }, [orders, depositAmount, withdrawAmount, metrics])

  // Handle order expansion
  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId)
  }

  // Handle allocation percentage change for an order
  const handleAllocationChange = (orderId: string, percentage: number) => {
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          allocationPercentage: percentage,
          allocatedAmount: calculateAllocationAmount(percentage, metrics.totalVaultValue)
        }
      }
      return order
    })
    
    // Calculate total allocation percentage
    const totalPercentage = updatedOrders.reduce((total, order) => total + order.allocationPercentage, 0)
    
    // If total exceeds 100%, adjust other orders proportionally
    if (totalPercentage > 100) {
      const excessPercentage = totalPercentage - 100
      const otherOrders = updatedOrders.filter(o => o.id !== orderId)
      const totalOtherPercentage = otherOrders.reduce((total, order) => total + order.allocationPercentage, 0)
      
      // Adjust other orders proportionally
      updatedOrders.forEach(order => {
        if (order.id !== orderId && totalOtherPercentage > 0) {
          const reductionFactor = excessPercentage / totalOtherPercentage
          const newPercentage = Math.max(0, order.allocationPercentage - (order.allocationPercentage * reductionFactor))
          order.allocationPercentage = newPercentage
          order.allocatedAmount = calculateAllocationAmount(newPercentage, metrics.totalVaultValue)
        }
      })
    }
    
    setOrders(updatedOrders)
  }

  // Calculate allocation amount based on percentage and total value
  const calculateAllocationAmount = (percentage: number, totalValue: number): number => {
    return (percentage / 100) * totalValue
  }

  // Calculate total allocation percentage
  const getTotalAllocationPercentage = (): number => {
    return orders.reduce((total, order) => total + order.allocationPercentage, 0)
  }

  // Handle saving the rebalance
  const handleSaveRebalance = () => {
    const depositValue = parseFloat(depositAmount) || 0
    const withdrawValue = parseFloat(withdrawAmount) || 0
    
    onSaveRebalance(orders, depositValue, withdrawValue)
  }

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <MetricsPanel metrics={vaultMetrics} />
      
      {/* Deposit/Withdraw Controls */}
      <FundsAdjustmentPanel 
        depositAmount={depositAmount}
        withdrawAmount={withdrawAmount}
        onDepositChange={setDepositAmount}
        onWithdrawChange={setWithdrawAmount}
        walletBalance={walletBalance}
        vaultBalance={metrics.totalVaultValue}
        tokenSymbol={tokenSymbol}
      />
      
      {/* Orders Rebalance Controls */}
      <div className="bg-[#0c1624] border border-[#1e2c3b] rounded-lg overflow-hidden shadow-lg">
        <div className="border-b border-[#1e2c3b] p-4 flex justify-between items-center">
          <h3 className="text-lg font-medium text-white">Market Orders Allocation</h3>
          
          <div className="flex items-center gap-2">
            <div className="text-xs text-gray-400 mr-2">Advanced Mode</div>
            <Switch
              checked={showAdvanced}
              onCheckedChange={setShowAdvanced}
            />
          </div>
        </div>
        
        <div className="p-4">
          {/* Total allocation indicator */}
          <div className="mb-6 bg-[#081020] p-4 rounded-lg border border-[#1e2c3b]">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-400">Total Allocation</span>
              <span className={`text-lg font-medium ${getTotalAllocationPercentage() > 100 ? 'text-red-400' : 'text-[#5FBDE9]'}`}>
                {getTotalAllocationPercentage().toFixed(1)}%
              </span>
            </div>
            
            <div className="w-full bg-[#0a1525] rounded-full h-2 mb-1">
              <div 
                className={`h-2 rounded-full ${getTotalAllocationPercentage() > 100 ? 'bg-red-400' : 'bg-[#5FBDE9]'}`}
                style={{ width: `${Math.min(getTotalAllocationPercentage(), 100)}%` }}
              ></div>
            </div>
            
            {getTotalAllocationPercentage() > 100 && (
              <div className="flex items-center text-xs text-red-400 mt-2">
                <AlertCircle className="h-3.5 w-3.5 mr-1" />
                <span>Total allocation exceeds 100%. Please adjust your allocations.</span>
              </div>
            )}
          </div>
          
          {/* Orders list */}
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderAllocationItem
                key={order.id}
                order={order}
                isExpanded={expandedOrderId === order.id}
                showAdvanced={showAdvanced}
                onToggleExpansion={() => toggleOrderExpansion(order.id)}
                onAllocationChange={(percentage) => handleAllocationChange(order.id, percentage)}
                totalVaultValue={metrics.totalVaultValue}
              />
            ))}
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="border-t border-[#1e2c3b] p-4 flex justify-end gap-3">
          <Button 
            variant="outline" 
            className="border-[#1e2c3b] text-gray-400 hover:text-white"
            onClick={onCancelRebalance}
          >
            Cancel
          </Button>
          <Button 
            className="bg-[#2a4365] hover:bg-[#2c5282] text-white border-[#3182CE]/30"
            onClick={handleSaveRebalance}
            disabled={getTotalAllocationPercentage() > 100}
          >
            Save Allocation
          </Button>
        </div>
      </div>
    </div>
  )
}

export default RebalanceInterface