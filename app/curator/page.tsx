// app/curator/page.tsx
'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { generateMockCuratorVaults } from '@/lib/mock/curator-mock-data'

// Import components
import MetricsPanel from '@/components/curator/MetricsPanel'
import EnhancedVaultList from '@/components/curator/rebalance/EnhancedVaultList'
import CreateVaultPanel from '@/components/curator/CreateVaultPanel'
import EmptyHistoryPanel from '@/components/curator/EmptyHistoryPanel'
import CuratorEducationPanel from '@/components/curator/rebalance/CuratorEducationPanel'

export default function CuratorPage() {
  const [activeTab, setActiveTab] = useState('available')
  
  // Get mock vaults
  const vaults = generateMockCuratorVaults()
  
  // Calculate metrics
  const totalTvl = vaults.reduce((sum, vault) => sum + vault.tvl, 0)
  const averageApy = vaults.reduce((sum, vault) => sum + vault.apy, 0) / vaults.length
  const vaultsCount = vaults.length
  const accumulatedFees = 32500 // This would normally come from an API
  
  // Handle create vault action
  const handleCreateVault = () => {
    setActiveTab('create')
  }

  return (
    <div className="min-h-screen pb-16">
      <motion.div
        className="mb-6 pt-1"
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Add consistent max-width container */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Education panel with curator description */}
          <CuratorEducationPanel onCreateVault={handleCreateVault} />
          
          {/* Key metrics */}
          <MetricsPanel 
            tvl={totalTvl}
            averageApy={averageApy}
            vaultsCount={vaultsCount}
            accFee={accumulatedFees}
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
              <EnhancedVaultList vaults={vaults} />
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
      </motion.div>
    </div>
  )
}