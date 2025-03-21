// app/curator/[address]/page.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Info } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { 
  generateMockCuratorVaults, 
  generateMockPendingRequests, 
  generateMockWhitelistedMarkets,
  generateMockRebalanceMetrics
} from '@/lib/mock/curator-mock-data'

// Import components
import VaultDetailHeader from '@/components/curator/rebalance/VaultDetailHeader'
import EnhancedVaultMetrics from '@/components/curator/rebalance/EnhancedVaultMetrics'
import EnhancedVaultOrdersTable from '@/components/curator/rebalance/EnhancedVaultOrdersTable'
import PendingRequests from '@/components/curator/PendingRequests'
import VaultSettings from '@/components/curator/VaultSettings'
import RebalanceDialog from '@/components/curator/rebalance/RebalanceDialog'
import { VaultOrder, CuratorVault, PendingRequest, WhitelistedMarket } from '@/types/curator'

export default function CuratorVaultDetail() {
  const params = useParams()
  const address = params?.address as string
  
  // States
  const [vault, setVault] = useState<CuratorVault | null>(null)
  const [activeTab, setActiveTab] = useState('orders')
  const [selectedOrderId, setSelectedOrderId] = useState<string | undefined>(undefined)
  const [orderFilterTab, setOrderFilterTab] = useState('all')
  const [isRebalanceOpen, setIsRebalanceOpen] = useState(false)
  
  // Load mock data
  useEffect(() => {
    // Get vault by address
    const vaults = generateMockCuratorVaults()
    const foundVault = vaults.find(v => v.address === address)
    
    if (foundVault) {
      setVault(foundVault)
    }
  }, [address])
  
  // Generate mock data
  const pendingRequests = generateMockPendingRequests()
  const whitelistedMarkets = generateMockWhitelistedMarkets()
  const rebalanceMetrics = generateMockRebalanceMetrics(vault?.tvl)
  
  // Handle order selection
  const handleOrderSelect = (order: VaultOrder) => {
    // Check if it's a filter tab change
    if ('filterTab' in order) {
      setOrderFilterTab(order.filterTab as string)
      return
    }
    
    setSelectedOrderId(order.id === selectedOrderId ? undefined : order.id)
  }
  
  // Handle rebalance button click
  const handleRebalance = () => {
    setIsRebalanceOpen(true)
  }
  
  // Handle save rebalance
  const handleSaveRebalance = (orders: VaultOrder[], deposit?: number, withdraw?: number) => {
    // In a real app, this would call an API to update the vault
    console.log('Save rebalance:', { orders, deposit, withdraw })
    
    // Update the vault with the new orders
    if (vault) {
      setVault({
        ...vault,
        orders
      })
    }
    
    setIsRebalanceOpen(false)
  }
  
  // Handle pending request actions
  const handleApproveRequest = (request: PendingRequest) => {
    console.log('Approved request:', request)
    // In a real app, this would call an API to approve the request
  }

  const handleRejectRequest = (request: PendingRequest) => {
    console.log('Rejected request:', request)
    // In a real app, this would call an API to reject the request
  }

  // Handle vault settings updates
  const handleUpdateFeeRate = (newRate: number) => {
    console.log('Update fee rate to:', newRate)
    // In a real app, this would call an API to update the fee rate
    
    if (vault) {
      setVault({
        ...vault,
        performanceFee: newRate
      })
    }
  }

  const handleUpdateTimelock = (newTimelock: string) => {
    console.log('Update timelock to:', newTimelock)
    // In a real app, this would call an API to update the timelock
  }

  const handleUpdateCapacity = (newCapacity: string) => {
    console.log('Update capacity to:', newCapacity)
    // In a real app, this would call an API to update the capacity
  }

  const handleAddWhitelistedMarket = (market: Partial<WhitelistedMarket>) => {
    console.log('Add whitelisted market:', market)
    // In a real app, this would call an API to add a whitelisted market
  }

  const handleRemoveWhitelistedMarket = (marketId: string) => {
    console.log('Remove whitelisted market:', marketId)
    // In a real app, this would call an API to remove a whitelisted market
  }
  
  // If no vault is found
  if (!vault) {
    return (
      <div className="min-h-screen pb-16">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center h-64">
            <div className="text-xl font-medium text-white mb-4">Vault not found</div>
            <div className="text-gray-400">The vault with address {address} does not exist.</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-16">
      {/* Add maximum width container */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with back button */}
        <VaultDetailHeader vault={vault} onRebalance={handleRebalance} />

        {/* Vault Info Cards */}
        <EnhancedVaultMetrics vault={vault} />

        {/* Vault Description */}
        <div className="bg-[#0c1624] border border-[#1e2c3b] rounded-lg p-6 mb-6">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-white font-medium mb-2">About this Vault</h3>
              <p className="text-gray-300">{vault.description || 'A decentralized vault that optimizes yield across multiple DeFi protocols, automatically balancing risk and return for maximum APY while maintaining liquidity requirements.'}</p>
            </div>
          </div>
        </div>
        
        {/* Main content tabs */}
        <Tabs 
          defaultValue="orders" 
          value={activeTab}
          onValueChange={setActiveTab} 
          className="space-y-6"
        >
          <TabsList className="bg-[#0a1525] p-1 border border-[#1e2c3b] w-full sm:w-auto">
            <TabsTrigger 
              value="orders" 
              className="data-[state=active]:bg-[#2a4365] data-[state=active]:text-white"
            >
              Orders
            </TabsTrigger>
            <TabsTrigger 
              value="pending" 
              className="data-[state=active]:bg-[#2a4365] data-[state=active]:text-white"
            >
              Pending Requests
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="data-[state=active]:bg-[#2a4365] data-[state=active]:text-white"
            >
              Vault Settings
            </TabsTrigger>
          </TabsList>
          
          {/* Orders Tab Content */}
          <TabsContent value="orders">
            <EnhancedVaultOrdersTable 
              orders={vault.orders || []} 
              onSelectOrder={handleOrderSelect} 
              selectedOrderId={selectedOrderId}
              filterTab={orderFilterTab}
            />
          </TabsContent>
          
          {/* Pending Requests Tab Content */}
          <TabsContent value="pending">
            <PendingRequests
              requests={pendingRequests}
              onApprove={handleApproveRequest}
              onReject={handleRejectRequest}
            />
          </TabsContent>
          
          {/* Vault Settings Tab Content */}
          <TabsContent value="settings">
            <VaultSettings
              vaultAddress={vault.address}
              currentFeeRate={vault.performanceFee || 0}
              collectedFees={12500}
              currencySymbol={vault.token}
              currentTimelock="2m 1s"
              totalVaultCapacity={(vault.tvl * 2).toLocaleString()}
              whitelistedMarkets={whitelistedMarkets}
              onUpdateFeeRate={handleUpdateFeeRate}
              onUpdateTimelock={handleUpdateTimelock}
              onUpdateCapacity={handleUpdateCapacity}
              onAddWhitelistedMarket={handleAddWhitelistedMarket}
              onRemoveWhitelistedMarket={handleRemoveWhitelistedMarket}
            />
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Rebalance Dialog with external control */}
      {vault && (
        <RebalanceDialog
          vault={vault}
          metrics={rebalanceMetrics}
          onSave={handleSaveRebalance}
          isOpen={isRebalanceOpen}
          onOpenChange={setIsRebalanceOpen}
        />
      )}
    </div>
  )
}