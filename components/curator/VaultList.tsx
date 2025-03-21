// components/curator/VaultList.tsx
'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

export interface CuratorVault {
  address: string
  name: string
  tvl: number
  apy: number
  status: string
  creator: string
  strategy: string
  token: string
  maturity: string
  lastActivity: string
}

interface VaultListProps {
  vaults: CuratorVault[]
}

export default function VaultList({ vaults }: VaultListProps) {
  return (
    <motion.div
      className="bg-[#0c1624] border border-[#1e2c3b] rounded-lg overflow-hidden shadow-lg"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="border-b border-[#1e2c3b] px-6 py-4 text-sm text-gray-400 grid grid-cols-5 bg-[#0d111d]">
        <div className="flex items-center font-medium">Vault</div>
        <div className="text-right font-medium">TVL</div>
        <div className="text-right font-medium">APY</div>
        <div className="text-center font-medium">Status</div>
        <div className="text-right font-medium">Last Activity</div>
      </div>
      
      <div>
        {vaults.map((vault, index) => (
          <Link 
            href={`/curator/${vault.address}`} 
            key={vault.address}
            className="block"
          >
            <motion.div
              className="px-6 py-4 border-b border-[#1e2c3b]/20 grid grid-cols-5 items-center cursor-pointer hover:bg-[#0a1525] transition-colors"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * (index % 5) }}
              whileHover={{ scale: 1.005, transition: { duration: 0.2 } }}
            >
              {/* Vault Name */}
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-[#5FBDE9]/10 p-0.5 flex items-center justify-center shadow-md">
                  <div className="h-full w-full rounded-full bg-[#0a1525] flex items-center justify-center overflow-hidden">
                    <span className="text-[#5FBDE9] font-bold">{vault.token.charAt(0)}</span>
                  </div>
                </div>
                <div>
                  <div className="text-white font-medium">{vault.name}</div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {vault.token} · {vault.strategy}
                  </div>
                </div>
              </div>

              {/* TVL */}
              <div className="text-right text-white">
                ${(vault.tvl / 1000000).toFixed(1)}M
              </div>

              {/* APY */}
              <div className="text-right">
                <span className="text-[#5FBDE9] font-medium">
                  {vault.apy.toFixed(1)}%
                </span>
              </div>

              {/* Status */}
              <div className="text-center">
                <Badge variant="success" className="inline-flex">
                  {vault.status}
                </Badge>
              </div>

              {/* Last Activity */}
              <div className="text-right text-gray-400 flex items-center justify-end">
                <span>{vault.lastActivity}</span>
                <ChevronRight className="ml-2 h-4 w-4 text-gray-500" />
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </motion.div>
  )
}