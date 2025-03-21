// components/curator/EmptyHistoryPanel.tsx
'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EmptyHistoryPanelProps {
  onCreateVault: () => void
}

export default function EmptyHistoryPanel({ onCreateVault }: EmptyHistoryPanelProps) {
  return (
    <motion.div
      className="bg-[#0c1624] border border-[#1e2c3b] rounded-lg overflow-hidden shadow-lg"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="border-b border-[#1e2c3b]/30 px-6 py-4 text-sm text-gray-400 grid grid-cols-5 bg-[#0d111d]">
        <div className="flex items-center font-medium">Vault</div>
        <div className="text-center font-medium">Created</div>
        <div className="text-center font-medium">Status</div>
        <div className="text-right font-medium">TVL</div>
        <div className="text-right font-medium">Total Fee Earned</div>
      </div>
      
      <div className="p-8 text-center">
        <div className="h-12 w-12 mx-auto mb-4 rounded-full bg-[#5FBDE9]/20 flex items-center justify-center">
          <Clock className="h-6 w-6 text-[#5FBDE9]" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">No Vault History</h3>
        <p className="text-gray-300 mb-6 max-w-md mx-auto">
          Your created vaults will appear here. Create a new vault to get started.
        </p>
        <Button 
          className="bg-[#2a4365] hover:bg-[#2c5282] text-white border-[#3182CE]/30"
          onClick={onCreateVault}
        >
          Create New Vault
        </Button>
      </div>
    </motion.div>
  )
}