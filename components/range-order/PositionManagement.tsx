// components/range-order/PositionManagement.tsx
'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Position } from '@/lib/mock/range-order-mock-data'

interface PositionManagementProps {
  position: Position
  onClose: () => void
  onOperationSelected: (operation: string) => void
}

export default function PositionManagement({
  position,
  onClose,
  onOperationSelected
}: PositionManagementProps) {
  const isLendPosition = position.orderType === 'Lend'
  const isBorrowPosition = position.orderType === 'Borrow'
  const isTwoWayPosition = position.orderType === 'Two Way'

  return (
    <div className="bg-[#0c1624] border border-[#1e2c3b] rounded-lg">
      {/* Header */}
      <div className="border-b border-[#1e2c3b] p-4">
        <button
          onClick={onClose}
          className="text-white font-medium hover:text-[#5FBDE9] transition-colors"
        >
          Back
        </button>
      </div>

      {/* Main Operations Button */}
      <div className="p-4 border-b border-[#1e2c3b]">
        <Button
          className="w-full bg-[#5FBDE9] hover:bg-[#3ba7d9] text-white"
          onClick={() => onOperationSelected('manage')}
        >
          Manage Order
        </Button>
      </div>

      {/* Quick Operations Section */}
      <div className="p-4">
        <h3 className="text-white font-medium mb-3">Quick Operations</h3>

        {/* Borrower Operations */}
        {(isBorrowPosition || isTwoWayPosition) && (
          <>
            <h4 className="text-gray-400 text-sm mb-2">Borrower</h4>
            <div className="space-y-2 mb-4">
              <Button
                variant="outline"
                className="w-full text-left justify-start border-[#1e2c3b] text-white hover:bg-[#0a1525] hover:border-[#3182CE]/50"
                onClick={() => onOperationSelected('withdrawBorrowed')}
              >
                Withdraw Borrowed Token
              </Button>
              <Button
                variant="outline"
                className="w-full text-left justify-start border-[#1e2c3b] text-white hover:bg-[#0a1525] hover:border-[#3182CE]/50"
                onClick={() => onOperationSelected('addCollateral')}
              >
                Add Collateral
              </Button>
              <Button
                variant="outline"
                className="w-full text-left justify-start border-[#1e2c3b] text-white hover:bg-[#0a1525] hover:border-[#3182CE]/50"
                onClick={() => onOperationSelected('removeCollateral')}
              >
                Remove Collateral
              </Button>
              <Button
                variant="outline"
                className="w-full text-left justify-start border-[#1e2c3b] text-white hover:bg-[#0a1525] hover:border-[#3182CE]/50"
                onClick={() => onOperationSelected('repay')}
              >
                Repay
              </Button>
            </div>
          </>
        )}

        {/* Lender Operations */}
        {(isLendPosition || isTwoWayPosition) && (
          <>
            <h4 className="text-gray-400 text-sm mb-2">Lender</h4>
            <div className="space-y-2 mb-4">
              <Button
                variant="outline"
                className="w-full text-left justify-start border-[#1e2c3b] text-white hover:bg-[#0a1525] hover:border-[#3182CE]/50"
                onClick={() => onOperationSelected('supplyMore')}
              >
                Supply to Lend More
              </Button>
              <Button
                variant="outline"
                className="w-full text-left justify-start border-[#1e2c3b] text-white hover:bg-[#0a1525] hover:border-[#3182CE]/50"
                onClick={() => onOperationSelected('withdrawLend')}
              >
                Withdraw to Lend Less
              </Button>
            </div>
          </>
        )}

        {/* General Operations - Only available for Two-Way positions */}
        {isTwoWayPosition && (
          <>
            <h4 className="text-gray-400 text-sm mb-2">General</h4>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full text-left justify-start border-[#1e2c3b] text-white hover:bg-[#0a1525] hover:border-[#3182CE]/50"
                onClick={() => onOperationSelected('depositXT')}
              >
                Deposit XT Into Order
              </Button>
              <Button
                variant="outline"
                className="w-full text-left justify-start border-[#1e2c3b] text-white hover:bg-[#0a1525] hover:border-[#3182CE]/50"
                onClick={() => onOperationSelected('depositFT')}
              >
                Deposit FT Into Order
              </Button>
              <Button
                variant="outline"
                className="w-full text-left justify-start border-[#1e2c3b] text-white hover:bg-[#0a1525] hover:border-[#3182CE]/50"
                onClick={() => onOperationSelected('withdrawXT')}
              >
                Withdraw XT from Order
              </Button>
              <Button
                variant="outline"
                className="w-full text-left justify-start border-[#1e2c3b] text-white hover:bg-[#0a1525] hover:border-[#3182CE]/50"
                onClick={() => onOperationSelected('withdrawFT')}
              >
                Withdraw FT from Order
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}