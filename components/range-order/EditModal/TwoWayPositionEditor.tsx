// components/range-order/EditModal/TwoWayPositionEditor.tsx
'use client'

import React, { useState, useCallback } from 'react'
import { Position } from '@/lib/mock/range-order-mock-data'
import ActionPanel from './ActionPanel'
import OrderChart from './OrderChart'
import CalculationSummary from './CalculationSummary'
import { Button } from '@/components/ui/button'
import { AlertCircle, ArrowDown, FileText } from 'lucide-react'

interface TwoWayPositionEditorProps {
  position: Position
}

export default function TwoWayPositionEditor({ position }: TwoWayPositionEditorProps) {
  const [zoomLevel, setZoomLevel] = useState(1)
  const [updateData, setUpdateData] = useState<{
    action: string;
    amount: number;
    positionId: string;
  } | null>(null)
  
  // State for modified curves (would be calculated based on update data)
  const [modifiedLendPoints, setModifiedLendPoints] = useState(position.lendPoints)
  const [modifiedBorrowPoints, setModifiedBorrowPoints] = useState(position.borrowPoints)
  
  // Check if the position is expired
  const isExpired = position.isActive === false
  
  // State for the tabs in expired view
  const [activeTab, setActiveTab] = useState<'summary' | 'history'>('summary')

  // Calculate the total available liquidity
  const lendLiquidity = parseFloat(position.suppliedAmount?.replace(/,/g, '') || '0')
  const borrowLiquidity = parseFloat(position.borrowedAmount?.replace(/,/g, '') || '0')
  const totalLiquidity = lendLiquidity + borrowLiquidity
  
  // Calculate LP profit in dollar value based on percentage
  const lpProfitValue = position.lpProfit 
    ? (totalLiquidity * (position.lpProfit / 100)).toFixed(2) 
    : '0'
  
  // Handle the redeem action for expired positions
  const handleRedeem = () => {
    // In a real implementation, this would call the contract to redeem funds
    alert(`Redeeming ${position.redeemable?.toLocaleString() || 0} tokens from expired position`)
  }
  
  // Handle updates from the action panel - using useCallback to prevent infinite loop
  const handleUpdate = useCallback((data: {
    action: string;
    amount: number;
    positionId: string;
  }) => {
    setUpdateData(data)
    
    // In a real implementation, we would modify the curve based on the action
    if (data.action && data.amount > 0) {
      // Lend side actions
      if (data.action === 'supply' || data.action === 'withdraw') {
        if (position.lendPoints) {
          // Simple modification for demo - in real app this would use proper math
          const adjustedPoints = position.lendPoints.map(point => ({
            ...point,
            apr: data.action === 'supply' 
              ? point.apr * (1 - data.amount / 100000) // Reduce APR when supplying more
              : point.apr * (1 + data.amount / 100000) // Increase APR when withdrawing
          }))
          
          setModifiedLendPoints(adjustedPoints)
        }
      }
      
      // Borrow side actions
      if (data.action === 'add' || data.action === 'remove' || data.action === 'withdraw') {
        if (position.borrowPoints) {
          // Simple modification for demo - in real app this would use proper math
          const adjustedPoints = position.borrowPoints.map(point => ({
            ...point,
            apr: data.action === 'add' || data.action === 'remove'
              ? point.apr * (1 - data.amount / 10000) // Reduce APR when adjusting collateral
              : point.apr * (1 + data.amount / 10000) // Increase APR when withdrawing more
          }))
          
          setModifiedBorrowPoints(adjustedPoints)
        }
      }
    }
  }, [position.borrowPoints, position.lendPoints])
  
  // Render the expired position view
  if (isExpired) {
    return (
      <div className="flex flex-col space-y-6">
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-white font-medium mb-1">This position has expired</h3>
              <p className="text-gray-300 text-sm">
                This two-way position has reached its maturity date. You can now redeem your funds and profits.
              </p>
            </div>
          </div>
        </div>
        
        {/* Tab navigation */}
        <div className="flex border-b border-[#1e2c3b]">
          <button
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'summary' 
                ? 'border-[#5FBDE9] text-[#5FBDE9]' 
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('summary')}
          >
            Position Summary
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'history' 
                ? 'border-[#5FBDE9] text-[#5FBDE9]' 
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('history')}
          >
            Position History
          </button>
        </div>
        
        {activeTab === 'summary' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left side - Position Stats */}
            <div className="space-y-4">
              <div className="bg-[#0a1525] border border-[#1e2c3b] rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-400 mb-3">Position Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Market</div>
                    <div className="text-white font-medium">{position.debtToken}/{position.collateral}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Maturity Date</div>
                    <div className="text-white font-medium">{position.maturity}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Borrow Rate</div>
                    <div className="text-[#3182CE] font-medium">{position.borrowAPR}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Lend Rate</div>
                    <div className="text-[#5FBDE9] font-medium">{position.lendAPR}</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-[#0a1525] border border-[#1e2c3b] rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-400 mb-3">Position Liquidity</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Lend (XT)</div>
                    <div className="text-[#5FBDE9] font-medium">{lendLiquidity.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Borrow (FT)</div>
                    <div className="text-[#3182CE] font-medium">{borrowLiquidity.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Total Liquidity</div>
                    <div className="text-white font-medium">{totalLiquidity.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Match Rate</div>
                    <div className="text-white font-medium">
                      {position.lendMatchedAmt && position.lendTotalAmt 
                        ? Math.round((position.lendMatchedAmt / position.lendTotalAmt) * 100) 
                        : 0}%
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-[#0a1525] border border-[#1e2c3b] rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-400 mb-3">LP Profit</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Profit Rate</div>
                    <div className={`font-medium ${position.lpProfit && position.lpProfit > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {position.lpProfit ? `${position.lpProfit > 0 ? '+' : ''}${position.lpProfit.toFixed(2)}%` : '0%'}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Profit Value</div>
                    <div className={`font-medium ${parseFloat(lpProfitValue) > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {parseFloat(lpProfitValue) > 0 ? '+' : ''}${lpProfitValue}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right side - Redeem Panel */}
            <div className="bg-[#0a1525] border border-[#1e2c3b] rounded-lg p-4 flex flex-col">
              <h4 className="text-sm font-medium text-gray-400 mb-3">Redeemable Amount</h4>
              
              {position.redeemable && position.redeemable > 0 ? (
                <>
                  <div className="bg-[#122136] p-4 rounded-lg mb-auto">
                    <div className="text-sm text-gray-400 mb-1">Total Redeemable</div>
                    <div className="text-3xl font-bold text-green-400 mb-2">
                      {position.redeemable.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-400">
                      Includes principal, interest and LP profits
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center my-4">
                    <ArrowDown className="text-gray-400 h-6 w-6" />
                  </div>
                  
                  <div className="mb-4">
                    <div className="text-sm text-gray-400 mb-2">Redemption Summary</div>
                    <div className="bg-[#081020] rounded-lg p-3 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Principal</span>
                        <span className="text-white">{totalLiquidity.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Interest & Profit</span>
                        <span className={`${parseFloat(lpProfitValue) > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {parseFloat(lpProfitValue) > 0 ? '+' : ''}{lpProfitValue}
                        </span>
                      </div>
                      <div className="border-t border-[#1e2c3b] pt-2 flex justify-between text-sm font-medium">
                        <span className="text-gray-400">Total</span>
                        <span className="text-white">{position.redeemable.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleRedeem}
                    className="w-full bg-green-500 hover:bg-green-600 text-white"
                  >
                    Redeem Funds
                  </Button>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <FileText className="h-12 w-12 text-gray-500 mb-3" />
                  <h3 className="text-lg font-medium text-white mb-2">No funds to redeem</h3>
                  <p className="text-gray-400 max-w-xs">
                    This position does not have any redeemable funds at this time.
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>
            <h3 className="text-lg font-medium text-white mb-3">Position Order History</h3>
            <OrderChart
              originalLendPoints={position.lendPoints}
              originalBorrowPoints={position.borrowPoints}
              zoomLevel={zoomLevel}
              setZoomLevel={setZoomLevel}
              showLendCurve={true}
              showBorrowCurve={true}
              readOnly={true}
            />
          </div>
        )}
      </div>
    )
  }
  
  // Render the active position view (original functionality)
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left side - Action panel */}
      <div className="lg:col-span-1">
        <ActionPanel 
          position={position} 
          positionType="two-way"
          onUpdate={handleUpdate}
        />
      </div>
      
      {/* Right side - Chart and calculation summary */}
      <div className="lg:col-span-2">
        <OrderChart
          originalLendPoints={position.lendPoints}
          originalBorrowPoints={position.borrowPoints}
          modifiedLendPoints={updateData && ['supply', 'withdraw'].includes(updateData.action) ? modifiedLendPoints : undefined}
          modifiedBorrowPoints={updateData && ['add', 'remove', 'withdraw'].includes(updateData.action) ? modifiedBorrowPoints : undefined}
          zoomLevel={zoomLevel}
          setZoomLevel={setZoomLevel}
          showLendCurve={true}
          showBorrowCurve={true}
        />
        
        {updateData && (
          <CalculationSummary 
            position={position}
            action={updateData.action}
            amount={updateData.amount}
            positionType="two-way"
          />
        )}
      </div>
    </div>
  )
}