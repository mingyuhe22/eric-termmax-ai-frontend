// components/curator/CreateVaultPanel.tsx
'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CreateVaultPanelProps {
  onCreateVault: () => void
}

export default function CreateVaultPanel({ onCreateVault }: CreateVaultPanelProps) {
  return (
    <motion.div
      className="bg-[#0c1624] border border-[#1e2c3b] rounded-lg p-8"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-2xl mx-auto">
        <div className="flex gap-3 items-center mb-6">
          <div className="h-12 w-12 rounded-full bg-[#5FBDE9]/20 flex items-center justify-center">
            <Plus className="h-6 w-6 text-[#5FBDE9]" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">Create New Vault</h3>
            <p className="text-gray-400">Design your own optimized yield strategy vault</p>
          </div>
        </div>
        
        <div className="bg-[#0a1525] border border-[#5FBDE9]/20 rounded-lg p-6 mb-6">
          <h4 className="text-white font-bold text-lg mb-3">Vault Builder</h4>
          <p className="text-gray-300 mb-4">
            Creating a vault allows you to design custom yield-generating portfolios
            with optimized strategies. As a vault curator, you&apos;ll earn performance fees
            when your strategy performs well.
          </p>
          
          <div className="flex items-center justify-between">
            <Button 
              className="bg-[#2a4365] hover:bg-[#2c5282] text-white border-[#3182CE]/30"
              onClick={onCreateVault}
            >
              Create New Vault
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}