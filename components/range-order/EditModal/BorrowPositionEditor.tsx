// components/range-order/EditModal/BorrowPositionEditor.tsx
'use client'

import React, { useState } from 'react'
import { Position } from '@/lib/mock/range-order-mock-data'
import ActionPanel from './ActionPanel'
import OrderChart from './OrderChart'
import CalculationSummary from './CalculationSummary'

interface BorrowPositionEditorProps {
  position: Position
}

export default function BorrowPositionEditor({ position }: BorrowPositionEditorProps) {
  const [zoomLevel, setZoomLevel] = useState(1)
  const [updateData, setUpdateData] = useState<{
    action: string;
    amount: number;
    positionId: string;
  } | null>(null)
  
  // State for modified curves (would be calculated based on update data)
  const [modifiedBorrowPoints, setModifiedBorrowPoints] = useState(position.borrowPoints)
  
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
    if (position.borrowPoints && data.action && data.amount > 0) {
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
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left side - Action panel */}
      <div className="lg:col-span-1">
        <ActionPanel 
          position={position} 
          positionType="borrow"
          onUpdate={handleUpdate}
        />
      </div>
      
      {/* Right side - Chart and calculation summary */}
      <div className="lg:col-span-2">
        <OrderChart
          originalBorrowPoints={position.borrowPoints}
          modifiedBorrowPoints={updateData ? modifiedBorrowPoints : undefined}
          zoomLevel={zoomLevel}
          setZoomLevel={setZoomLevel}
          showLendCurve={false}
          showBorrowCurve={true}
        />
        
        {updateData && (
          <CalculationSummary 
            position={position}
            action={updateData.action}
            amount={updateData.amount}
            positionType="borrow"
          />
        )}
      </div>
    </div>
  )
}