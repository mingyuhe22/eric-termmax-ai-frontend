'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import PositionRow from './PositionRow'
import { Position } from '@/lib/mock/dashboard-mock-data'

interface PositionsTableProps {
  positions: Position[]
  activeTab: 'lend' | 'borrow'
  squeezeMode: boolean
  selectedPositions: string[]
  onToggleExpand: (id: string) => void
  onToggleSelection: (id: string) => void
}

const PositionsTable: React.FC<PositionsTableProps> = ({
  positions,
  activeTab,
  squeezeMode,
  selectedPositions,
  onToggleExpand,
  onToggleSelection
}) => {
  // Filter positions for "at risk" section
  const atRiskPositions = positions.filter(p => p.healthFactor?.status === 'critical')
  
  // Filter positions for "matured" section
  const maturedPositions = positions.filter(p => p.maturity.status === 'expired')

  return (
    <>
      {/* Position headers */}
      <div className="grid grid-cols-6 gap-4 px-4 py-2 bg-[#0a1525] rounded-t-lg border-x border-t border-[#1e2c3b] text-sm text-gray-400">
        {activeTab === 'lend' ? (
          <>
            <div className="col-span-1">Asset</div>
            <div className="col-span-1">Collateral</div>
            <div className="col-span-1 text-center">Maturity</div>
            <div className="col-span-1 text-center">Value at Maturity</div>
            <div className="col-span-2 text-right">Actions</div>
          </>
        ) : (
          <>
            <div className="col-span-1">Debt</div>
            <div className="col-span-1">Collateral</div>
            <div className="col-span-1 text-center">Maturity</div>
            <div className="col-span-1 text-center">Health Factor</div>
            <div className="col-span-1 text-center">Value</div>
            <div className="col-span-1 text-right">Actions</div>
          </>
        )}
      </div>
      
      {/* Position rows */}
      <div className="border border-[#1e2c3b] rounded-b-lg overflow-hidden mb-6">
        {positions.length > 0 ? (
          positions.map((position) => (
            <PositionRow
              key={position.id}
              position={position}
              isSelected={selectedPositions.includes(position.id)}
              squeezeMode={squeezeMode}
              activeTab={activeTab}
              onToggleExpand={onToggleExpand}
              onToggleSelection={onToggleSelection}
            />
          ))
        ) : (
          <div className="py-8 text-center text-gray-400">
            <div className="mb-2">No {activeTab === 'lend' ? 'lending' : 'borrowing'} positions found.</div>
            <Link href={activeTab === 'lend' ? '/earn' : '/borrow'}>
              <Button variant="outline" className="border-[#1e2c3b] text-[#5FBDE9] hover:text-white">
                {activeTab === 'lend' ? 'Browse Lending Markets' : 'Browse Borrowing Markets'}
              </Button>
            </Link>
          </div>
        )}
      </div>
      
      {/* Matured Positions Section - Only if there are any */}
      {activeTab === 'lend' && maturedPositions.length > 0 && (
        <div className="border border-[#1e2c3b] rounded-lg overflow-hidden mb-6">
          <div className="py-3 px-4 bg-[#0a1525] border-b border-[#1e2c3b]">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-medium">Matured Positions</h3>
              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                {maturedPositions.length} Ready to Redeem
              </Badge>
            </div>
          </div>
          <div className="divide-y divide-[#1e2c3b]">
            {maturedPositions.map(position => (
              <PositionRow
                key={`matured-${position.id}`}
                position={position}
                isSelected={selectedPositions.includes(position.id)}
                squeezeMode={squeezeMode}
                activeTab={activeTab}
                onToggleExpand={onToggleExpand}
                onToggleSelection={onToggleSelection}
              />
            ))}
          </div>
        </div>
      )}
      
      {/* At Risk Positions Section - Only if there are any */}
      {activeTab === 'borrow' && atRiskPositions.length > 0 && (
        <div className="border border-[#1e2c3b] rounded-lg overflow-hidden">
          <div className="py-3 px-4 bg-[#0a1525] border-b border-[#1e2c3b]">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-medium">At Risk Positions</h3>
              <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                {atRiskPositions.length} Positions
              </Badge>
            </div>
          </div>
          <div className="divide-y divide-[#1e2c3b]">
            {atRiskPositions.map(position => (
              <PositionRow
                key={`risk-${position.id}`}
                position={position}
                isSelected={selectedPositions.includes(position.id)}
                squeezeMode={squeezeMode}
                activeTab={activeTab}
                onToggleExpand={onToggleExpand}
                onToggleSelection={onToggleSelection}
              />
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export default PositionsTable