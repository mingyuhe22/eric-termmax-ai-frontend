// components/curator/CuratorInterface.tsx
'use client'

import React, { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import MetricsPanel from './MetricsPanel'
import VaultList, { CuratorVault } from './VaultList'
import CreateVaultPanel from './CreateVaultPanel'
import EmptyHistoryPanel from './EmptyHistoryPanel'

export default function CuratorInterface() {
  const [activeTab, setActiveTab] = useState('available')
  
  // Mock data for vaults
  const vaults: CuratorVault[] = [
    {
      address: '0x83a2E5a23a38D7e7964f38f5988C9B127d65Df3F',
      name: 'USDC Yield Optimizer',
      tvl: 4700000,
      apy: 12.5,
      status: 'Live',
      creator: '0x51a9F2fe5A7B98b8fc8E2e52E987982f7A7E632D',
      strategy: 'Lending',
      token: 'USDC',
      maturity: 'Open',
      lastActivity: '2 hours ago'
    },
    {
      address: '0x51a9F2fe5A7B98b8fc8E2e52E987982f7A7E632D',
      name: 'ETH-stETH Liquidity',
      tvl: 2100000,
      apy: 8.2,
      status: 'Live',
      creator: '0x51a9F2fe5A7B98b8fc8E2e52E987982f7A7E632D',
      strategy: 'Liquidity',
      token: 'ETH/stETH',
      maturity: 'Open',
      lastActivity: '5 hours ago'
    },
    {
      address: '0x29Fe7D60DdF151E5b52e5FAB4f1325da6b2bD70F',
      name: 'Stable Yield Aggregator',
      tvl: 8300000,
      apy: 6.9,
      status: 'Live',
      creator: '0x51a9F2fe5A7B98b8fc8E2e52E987982f7A7E632D',
      strategy: 'Stablecoin',
      token: 'USDT/USDC/DAI',
      maturity: 'Open',
      lastActivity: '1 day ago'
    },
    {
      address: '0xB81a5bfD29E25e35CC9c39D05AE143aFb73F5bfD',
      name: 'Liquid Staking Derivative',
      tvl: 1500000,
      apy: 15.2,
      status: 'Live',
      creator: '0x51a9F2fe5A7B98b8fc8E2e52E987982f7A7E632D',
      strategy: 'Staking',
      token: 'ETH',
      maturity: 'Apr 25, 2025',
      lastActivity: '3 days ago'
    }
  ]
  
  // Handle create vault action
  const handleCreateVault = () => {
    setActiveTab('create')
  }

  return (
    <div className="min-h-screen pb-16">
      {/* Key metrics */}
      <MetricsPanel 
        tvl={16600000}
        averageApy={10.7}
        vaultsCount={8}
        accFee={32500}
      />
      
      {/* Main content */}
      <Tabs defaultValue="available" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-[#0a1525] p-1 border border-[#1e2c3b] w-full sm:w-auto">
          <TabsTrigger 
            value="available" 
            className="data-[state=active]:bg-[#2a4365] data-[state=active]:text-white"
          >
            Available Vaults
          </TabsTrigger>
          <TabsTrigger 
            value="create" 
            className="data-[state=active]:bg-[#2a4365] data-[state=active]:text-white"
          >
            Create Vault
          </TabsTrigger>
          <TabsTrigger 
            value="history" 
            className="data-[state=active]:bg-[#2a4365] data-[state=active]:text-white"
          >
            Vault History
          </TabsTrigger>
        </TabsList>
        
        {/* Available Vaults List */}
        <TabsContent value="available">
          <VaultList vaults={vaults} />
        </TabsContent>
        
        {/* Create Vault */}
        <TabsContent value="create">
          <CreateVaultPanel onCreateVault={handleCreateVault} />
        </TabsContent>
        
        {/* Vault History */}
        <TabsContent value="history">
          <EmptyHistoryPanel onCreateVault={handleCreateVault} />
        </TabsContent>
      </Tabs>
    </div>
  )
}