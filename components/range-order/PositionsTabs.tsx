// components/range-order/PositionsTabs.tsx
'use client'

import React, { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Position } from '@/lib/mock/range-order-mock-data'
import UnifiedPositionTable from './PositionList/UnifiedPositionTable'

interface PositionsTabsProps {
  lendPositions: Position[]
  borrowPositions: Position[]
  twoWayPositions: Position[]
  onSelectPosition: (position: Position) => void
}

export default function PositionsTabs({
  lendPositions,
  borrowPositions,
  twoWayPositions,
  onSelectPosition
}: PositionsTabsProps) {
  const [activeTab, setActiveTab] = useState('all')
  
  // Combine all positions for the "all" tab
  const allPositions = [...lendPositions, ...borrowPositions, ...twoWayPositions];
  
  return (
    <div className="bg-[#0c1624] border border-[#1e2c3b] rounded-lg overflow-hidden shadow-lg mt-8">
      {/* Header with tabs */}
      <div className="border-b border-[#1e2c3b] p-4">
        <Tabs 
          defaultValue="all" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="bg-[#0a1525] p-1 border border-[#1e2c3b] inline-flex w-auto">
            <TabsTrigger 
              value="all" 
              className="data-[state=active]:bg-[#2a4365] data-[state=active]:text-white text-gray-400"
            >
              All Positions ({allPositions.length})
            </TabsTrigger>
            <TabsTrigger 
              value="lend" 
              className="data-[state=active]:bg-[#2a4365] data-[state=active]:text-white text-gray-400"
            >
              Lend ({lendPositions.length})
            </TabsTrigger>
            <TabsTrigger 
              value="borrow" 
              className="data-[state=active]:bg-[#2a4365] data-[state=active]:text-white text-gray-400"
            >
              Borrow ({borrowPositions.length})
            </TabsTrigger>
            <TabsTrigger 
              value="two-way" 
              className="data-[state=active]:bg-[#2a4365] data-[state=active]:text-white text-gray-400"
            >
              Two-Way ({twoWayPositions.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <UnifiedPositionTable 
              positions={allPositions}
              onSelectPosition={onSelectPosition}
              filterType="all"
            />
          </TabsContent>

          <TabsContent value="lend">
            <UnifiedPositionTable 
              positions={lendPositions}
              onSelectPosition={onSelectPosition}
              filterType="lend"
            />
          </TabsContent>

          <TabsContent value="borrow">
            <UnifiedPositionTable 
              positions={borrowPositions}
              onSelectPosition={onSelectPosition}
              filterType="borrow"
            />
          </TabsContent>

          <TabsContent value="two-way">
            <UnifiedPositionTable 
              positions={twoWayPositions}
              onSelectPosition={onSelectPosition}
              filterType="two-way"
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}