// components/range-order/PositionList/BorrowPositionList.tsx
'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Position } from '@/lib/mock/range-order-mock-data'
import PositionTable from './PositionTable'
import { Plus, Minus, ArrowDown } from 'lucide-react'

interface BorrowPositionListProps {
  positions: Position[]
  onSelectPosition: (position: Position) => void
}

export default function BorrowPositionList({
  positions,
  onSelectPosition
}: BorrowPositionListProps) {
  // Render specific action buttons for borrow positions
  const renderActions = (position: Position) => (
    <div className="flex justify-end gap-1">
      <Button
        size="sm"
        variant="outline"
        title="Add Collateral"
        className="text-xs bg-[#2a4365] hover:bg-[#2c5282] text-white border-[#3182CE]/30 h-7 w-7 p-0"
        onClick={(e) => {
          e.stopPropagation()
          // Handle add collateral action
          onSelectPosition(position)
        }}
      >
        <Plus className="h-3 w-3" />
      </Button>
      <Button
        size="sm"
        variant="outline"
        title="Remove Collateral"
        className="text-xs bg-[#2a4365] hover:bg-[#2c5282] text-white border-[#3182CE]/30 h-7 w-7 p-0"
        onClick={(e) => {
          e.stopPropagation()
          // Handle remove collateral action
          onSelectPosition(position)
        }}
      >
        <Minus className="h-3 w-3" />
      </Button>
      <Button
        size="sm"
        variant="outline"
        title="Withdraw Borrowed"
        className="text-xs bg-[#2a4365] hover:bg-[#2c5282] text-white border-[#3182CE]/30 h-7 w-7 p-0"
        onClick={(e) => {
          e.stopPropagation()
          // Handle withdraw borrowed action
          onSelectPosition(position)
        }}
      >
        <ArrowDown className="h-3 w-3" />
      </Button>
    </div>
  )

  return (
    <PositionTable 
      positions={positions} 
      showBorrowColumns={true}
      showLendColumns={false}
      onSelectPosition={onSelectPosition}
      renderActions={renderActions}
    />
  )
}