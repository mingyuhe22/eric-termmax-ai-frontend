// components/range-order/PositionList/LendPositionList.tsx
'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Position } from '@/lib/mock/range-order-mock-data'
import PositionTable from './PositionTable'

interface LendPositionListProps {
  positions: Position[]
  onSelectPosition: (position: Position) => void
}

export default function LendPositionList({
  positions,
  onSelectPosition
}: LendPositionListProps) {
  const renderActions = (position: Position) => (
    <div className="flex justify-end gap-1">
      <Button
        size="sm"
        variant="outline"
        className="text-xs bg-[#2a4365] hover:bg-[#2c5282] text-white border-[#3182CE]/30"
        onClick={(e) => {
          e.stopPropagation()
          onSelectPosition(position)
        }}
      >
        Edit
      </Button>
    </div>
  )

  return (
    <PositionTable 
      positions={positions} 
      showBorrowColumns={false}
      showLendColumns={true}
      onSelectPosition={onSelectPosition}
      renderActions={renderActions}
    />
  )
}