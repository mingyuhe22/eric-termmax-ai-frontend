// components/curator/VaultSettings.tsx
'use client'

import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'

interface WhitelistedMarket {
  id: string
  market: string
  collateral: string
  debt: string
  maturity: string
  lltv: number
  maxLtv: number
}

interface VaultSettingsProps {
  vaultAddress: string
  currentFeeRate: number
  collectedFees: number
  currencySymbol: string
  currentTimelock: string
  totalVaultCapacity: string
  whitelistedMarkets: WhitelistedMarket[]
  onUpdateFeeRate: (newRate: number) => void
  onUpdateTimelock: (newTimelock: string) => void
  onUpdateCapacity: (newCapacity: string) => void
  onAddWhitelistedMarket: (market: Partial<WhitelistedMarket>) => void
  onRemoveWhitelistedMarket: (marketId: string) => void
}

export default function VaultSettings({
  currentFeeRate,
  collectedFees,
  currencySymbol,
  currentTimelock,
  totalVaultCapacity,
  whitelistedMarkets,
  onUpdateFeeRate,
  onUpdateTimelock,
  onUpdateCapacity,
  onAddWhitelistedMarket,
  onRemoveWhitelistedMarket
}: VaultSettingsProps) {
  // State for editing
  const [newFeeRate, setNewFeeRate] = useState<string>(`${currentFeeRate}`)
  const [newTimelock, setNewTimelock] = useState<string>(currentTimelock)
  const [newCapacity, setNewCapacity] = useState<string>(totalVaultCapacity)
  const [showAddMarketForm, setShowAddMarketForm] = useState(false)
  const [newMarket, setNewMarket] = useState<Partial<WhitelistedMarket>>({
    market: '',
    collateral: '',
    debt: '',
    maturity: '',
    lltv: 0.7,
    maxLtv: 0.6
  })

  // Handle form submissions
  const handleUpdateFeeRate = () => {
    const parsedRate = parseFloat(newFeeRate)
    if (!isNaN(parsedRate) && parsedRate >= 0 && parsedRate <= 100) {
      onUpdateFeeRate(parsedRate)
    }
  }

  const handleUpdateTimelock = () => {
    onUpdateTimelock(newTimelock)
  }

  const handleUpdateCapacity = () => {
    onUpdateCapacity(newCapacity)
  }

  const handleAddMarket = () => {
    onAddWhitelistedMarket(newMarket)
    setNewMarket({
      market: '',
      collateral: '',
      debt: '',
      maturity: '',
      lltv: 0.7,
      maxLtv: 0.6
    })
    setShowAddMarketForm(false)
  }

  return (
    <div className="space-y-8">
      {/* Whitelisted Markets */}
      <div className="bg-[#0c1624] border border-[#1e2c3b] rounded-lg overflow-hidden">
        <div className="p-4 border-b border-[#1e2c3b] flex justify-between items-center">
          <h3 className="text-white font-medium text-lg">Whitelisted Markets</h3>
          <Button 
            className="bg-[#2a4365] hover:bg-[#2c5282] text-white border-[#3182CE]/30 flex items-center gap-1.5"
            onClick={() => setShowAddMarketForm(!showAddMarketForm)}
          >
            <Plus className="h-4 w-4" />
            Add Market
          </Button>
        </div>

        {showAddMarketForm && (
          <div className="p-4 border-b border-[#1e2c3b] bg-[#081020]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Market</label>
                <Input 
                  value={newMarket.market} 
                  onChange={(e) => setNewMarket({...newMarket, market: e.target.value})}
                  placeholder="ARB/USDC-20250425"
                  className="bg-[#0a1525] border-[#1e2c3b]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Collateral</label>
                <Input 
                  value={newMarket.collateral} 
                  onChange={(e) => setNewMarket({...newMarket, collateral: e.target.value})}
                  placeholder="ARB"
                  className="bg-[#0a1525] border-[#1e2c3b]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Debt</label>
                <Input 
                  value={newMarket.debt} 
                  onChange={(e) => setNewMarket({...newMarket, debt: e.target.value})}
                  placeholder="USDC"
                  className="bg-[#0a1525] border-[#1e2c3b]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Maturity</label>
                <Input 
                  value={newMarket.maturity} 
                  onChange={(e) => setNewMarket({...newMarket, maturity: e.target.value})}
                  placeholder="Apr 25, 2025"
                  className="bg-[#0a1525] border-[#1e2c3b]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">LLTV</label>
                <Input 
                  type="number" 
                  step="0.01"
                  min="0" 
                  max="1"
                  value={newMarket.lltv} 
                  onChange={(e) => setNewMarket({...newMarket, lltv: parseFloat(e.target.value)})}
                  placeholder="0.70"
                  className="bg-[#0a1525] border-[#1e2c3b]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Max LTV</label>
                <Input 
                  type="number" 
                  step="0.01"
                  min="0" 
                  max="1"
                  value={newMarket.maxLtv} 
                  onChange={(e) => setNewMarket({...newMarket, maxLtv: parseFloat(e.target.value)})}
                  placeholder="0.60"
                  className="bg-[#0a1525] border-[#1e2c3b]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                className="border-[#1e2c3b] text-gray-400 hover:text-white"
                onClick={() => setShowAddMarketForm(false)}
              >
                Cancel
              </Button>
              <Button 
                className="bg-[#2a4365] hover:bg-[#2c5282] text-white border-[#3182CE]/30"
                onClick={handleAddMarket}
              >
                Add Market
              </Button>
            </div>
          </div>
        )}

        <div className="p-4">
          {whitelistedMarkets.map((market, index) => (
            <div 
              key={market.id}
              className={`p-3 ${index % 2 === 0 ? 'bg-[#081020]' : 'bg-[#0c1624]'} rounded-lg mb-2 flex justify-between items-center`}
            >
              <div className="flex items-center gap-2">
                <div className="flex-shrink-0 bg-[#0a1525] w-6 h-6 rounded-full flex items-center justify-center text-xs text-[#5FBDE9] border border-[#1e2c3b]">
                  {index + 1}
                </div>
                <div>
                  <div className="text-white font-medium">{market.market}</div>
                  <div className="text-xs text-gray-400">
                    collateral: {market.collateral} / debt: {market.debt} / maturity: {market.maturity} / LLTV: {market.lltv} / max LTV: {market.maxLtv}
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-400 hover:bg-red-500/10 hover:text-red-300"
                onClick={() => onRemoveWhitelistedMarket(market.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}

          {whitelistedMarkets.length === 0 && (
            <div className="text-center p-6 text-gray-400">
              No markets have been whitelisted yet.
            </div>
          )}
        </div>
      </div>

      {/* Fee Management */}
      <div className="bg-[#0c1624] border border-[#1e2c3b] rounded-lg overflow-hidden">
        <div className="p-4 border-b border-[#1e2c3b]">
          <h3 className="text-white font-medium text-lg">Fee Management</h3>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Current Fee Rate */}
            <div className="bg-[#081020] border border-[#1e2c3b] rounded-lg p-4">
              <div className="flex justify-between">
                <div>
                  <div className="text-white font-medium mb-1">Current Fee Rate</div>
                  <div className="text-xs text-gray-400 mb-4">
                    Fee is charged on profits and distributed to the protocol
                  </div>
                </div>
                <div className="text-lg font-bold text-[#5FBDE9]">
                  {currentFeeRate.toFixed(1)}%
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 items-end">
                <div className="col-span-2">
                  <label className="block text-xs text-gray-400 mb-1">New Fee Rate</label>
                  <Input 
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={newFeeRate}
                    onChange={(e) => setNewFeeRate(e.target.value)}
                    className="bg-[#0a1525] border-[#1e2c3b]"
                  />
                </div>
                <Button 
                  className="bg-[#2a4365] hover:bg-[#2c5282] text-white border-[#3182CE]/30"
                  onClick={handleUpdateFeeRate}
                >
                  Update
                </Button>
              </div>
            </div>

            {/* Collected Fees */}
            <div className="bg-[#081020] border border-[#1e2c3b] rounded-lg p-4">
              <div className="flex justify-between">
                <div>
                  <div className="text-white font-medium mb-1">Collected Fees</div>
                  <div className="text-xs text-gray-400 mb-4">
                    Total unclaimed fees across all orders
                  </div>
                </div>
                <div className="text-lg font-bold text-[#5FBDE9]">
                  {collectedFees.toFixed(1)} {currencySymbol}
                </div>
              </div>

              <div className="flex justify-end">
                <Button 
                  className="bg-[#2a4365] hover:bg-[#2c5282] text-white border-[#3182CE]/30"
                  disabled={collectedFees <= 0}
                >
                  Claim Fees
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timelock Settings */}
      <div className="bg-[#0c1624] border border-[#1e2c3b] rounded-lg overflow-hidden">
        <div className="p-4 border-b border-[#1e2c3b]">
          <h3 className="text-white font-medium text-lg">Timelock Settings</h3>
        </div>

        <div className="p-4">
          <div className="bg-[#081020] border border-[#1e2c3b] rounded-lg p-4">
            <div className="flex justify-between">
              <div>
                <div className="text-white font-medium mb-1">Current Timelock</div>
                <div className="text-xs text-gray-400 mb-4">
                  Time required before submitted changes take effect
                </div>
              </div>
              <div className="text-lg font-bold text-[#5FBDE9]">
                {currentTimelock}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 items-end">
              <div className="col-span-2">
                <label className="block text-xs text-gray-400 mb-1">New Timelock</label>
                <Input 
                  value={newTimelock}
                  onChange={(e) => setNewTimelock(e.target.value)}
                  className="bg-[#0a1525] border-[#1e2c3b]"
                  placeholder="2m 1s"
                />
              </div>
              <Button 
                className="bg-[#2a4365] hover:bg-[#2c5282] text-white border-[#3182CE]/30"
                onClick={handleUpdateTimelock}
              >
                Update
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Capacity Management */}
      <div className="bg-[#0c1624] border border-[#1e2c3b] rounded-lg overflow-hidden">
        <div className="p-4 border-b border-[#1e2c3b]">
          <h3 className="text-white font-medium text-lg">Capacity Management</h3>
        </div>

        <div className="p-4">
          <div className="bg-[#081020] border border-[#1e2c3b] rounded-lg p-4">
            <div className="flex justify-between">
              <div>
                <div className="text-white font-medium mb-1">Total Vault Capacity</div>
                <div className="text-xs text-gray-400 mb-4">
                  Maximum amount of funds the vault can handle
                </div>
              </div>
              <div className="text-lg font-bold text-[#5FBDE9]">
                {totalVaultCapacity} {currencySymbol}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 items-end">
              <div className="col-span-2">
                <label className="block text-xs text-gray-400 mb-1">New Capacity</label>
                <Input 
                  value={newCapacity}
                  onChange={(e) => setNewCapacity(e.target.value)}
                  className="bg-[#0a1525] border-[#1e2c3b]"
                  placeholder="10,000,000,000,000 USDC"
                />
              </div>
              <Button 
                className="bg-[#2a4365] hover:bg-[#2c5282] text-white border-[#3182CE]/30"
                onClick={handleUpdateCapacity}
              >
                Update
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}