// components/range-order/EditModal/LendPositionEditor.tsx
'use client'

import React, { useState } from 'react'
import { Position } from '@/lib/mock/range-order-mock-data'
import ActionPanel from './ActionPanel'
import OrderChart from './OrderChart'
import CalculationSummary from './CalculationSummary'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

interface LendPositionEditorProps {
  position: Position
}

export default function LendPositionEditor({ position }: LendPositionEditorProps) {
  const [zoomLevel, setZoomLevel] = useState(1)
  const [updateData, setUpdateData] = useState<{
    action: string;
    amount: number;
    positionId: string;
  } | null>(null)
  
  // State for modified curves (would be calculated based on update data)
  const [modifiedLendPoints, setModifiedLendPoints] = useState(position.lendPoints)
  
  // Check if the position is expired
  const isExpired = position.isActive === false
  
  // Handle the redeem action for expired positions
  const handleRedeem = () => {
    // In a real implementation, this would call the contract to redeem funds
    alert(`Redeeming ${position.redeemable?.toLocaleString() || 0} tokens from expired position`)
  }
  
  // Handle updates from the action panel
  interface UpdateData {
    action: string;
    amount: number;
    positionId: string;
  }

  const handleUpdate = (data: UpdateData) => {
    setUpdateData(data)
    
    // In a real implementation, we would modify the curve based on the action
    // For demo purposes, we'll just slightly adjust the points
    if (position.lendPoints && data.action && data.amount > 0) {
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
  
  // Render the expired position view
  if (isExpired) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6 max-w-md text-center">
          <AlertCircle className="h-10 w-10 text-yellow-400 mx-auto mb-2" />
          <h3 className="text-lg font-medium text-white mb-2">This position has expired</h3>
          <p className="text-gray-300 mb-4">
            This lend position has reached its maturity date. You can now redeem your funds.
          </p>
          
          {position.redeemable && position.redeemable > 0 ? (
            <div className="flex flex-col items-center">
              <div className="bg-[#122136] p-3 rounded-lg mb-4 w-full">
                <div className="text-sm text-gray-400 mb-1">Redeemable Amount</div>
                <div className="text-2xl font-bold text-green-400">
                  {position.redeemable.toLocaleString()}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Includes principal and accrued interest
                </div>
              </div>
              <Button 
                onClick={handleRedeem}
                className="bg-green-500 hover:bg-green-600 text-white px-6"
              >
                Redeem Funds
              </Button>
            </div>
          ) : (
            <div className="text-gray-400">
              No funds available to redeem
            </div>
          )}
        </div>
        
        {/* Show historical chart for reference */}
        <div className="w-full">
          <h3 className="text-lg font-medium text-white mb-3">Position History</h3>
          <OrderChart
            originalLendPoints={position.lendPoints}
            zoomLevel={zoomLevel}
            setZoomLevel={setZoomLevel}
            showLendCurve={true}
            showBorrowCurve={false}
            readOnly={true}
          />
        </div>
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
          positionType="lend"
          onUpdate={handleUpdate}
        />
      </div>
      
      {/* Right side - Chart and calculation summary */}
      <div className="lg:col-span-2">
        <OrderChart
          originalLendPoints={position.lendPoints}
          modifiedLendPoints={updateData ? modifiedLendPoints : undefined}
          zoomLevel={zoomLevel}
          setZoomLevel={setZoomLevel}
          showLendCurve={true}
          showBorrowCurve={false}
        />
        
        {updateData && (
          <CalculationSummary 
            position={position}
            action={updateData.action}
            amount={updateData.amount}
            positionType="lend"
          />
        )}
      </div>
    </div>
  )
}