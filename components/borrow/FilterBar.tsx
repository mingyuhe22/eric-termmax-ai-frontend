// components/borrow/FilterBar.tsx
'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils/utils'

interface FilterBarProps {
  searchTerm: string
  chainFilter: string
  assetFilter: string
  setSearchTerm: (term: string) => void
  setChainFilter: (chain: string) => void
  setAssetFilter: (asset: string) => void
}

const FilterBar: React.FC<FilterBarProps> = ({
  searchTerm,
  chainFilter,
  assetFilter,
  setSearchTerm,
  setChainFilter,
  setAssetFilter
}) => {
  return (
    <motion.div
      className="mt-4 mb-6 flex flex-col md:flex-row gap-4 md:items-center justify-between"
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      {/* Chain Filter */}
      <div className="flex h-10 overflow-hidden rounded-md border border-[#1e2c3b]/5 bg-[#0d111d] shadow-sm">
        {[
          { id: 'all', name: 'All', icon: '🌐' },
          { id: 'ethereum', name: 'Eth', icon: 'Ξ' },
          { id: 'arbitrum', name: 'Arb', icon: '🔷' },
          { id: 'base', name: 'Base', icon: '🅱️' },
        ].map((chain) => (
          <button
            key={chain.id}
            className={cn(
              'px-4 py-2 text-sm font-medium transition-colors duration-200 flex items-center gap-1',
              chainFilter === chain.id
                ? 'bg-[#1e2c3b] text-white'
                : 'text-gray-400 hover:bg-[#0e1320]'
            )}
            onClick={() => setChainFilter(chain.id)}
          >
            <span className="mr-1">{chain.icon}</span>
            {chain.name}
          </button>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Filter */}
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search markets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-64 rounded-md border border-[#1e2c3b]/5 bg-[#0d111d] py-2 pl-10 pr-4 text-white placeholder:text-gray-500 focus:ring-0 focus:border-[#1e2c3b]/30 focus:outline-none transition-all duration-200 hover:border-[#1e2c3b]/10"
          />
        </div>

        {/* Asset Filter */}
        <div className="flex h-9 overflow-hidden rounded-md border border-[#1e2c3b]/5 bg-[#0d111d] shadow-sm">
          {['All', 'USD', 'ETH', 'BTC'].map((filter, index) => (
            <button
              key={index}
              className={cn(
                'px-3 py-1.5 text-sm font-medium transition-colors duration-200',
                assetFilter === filter.toLowerCase()
                  ? 'bg-[#1e2c3b] text-white'
                  : 'text-gray-400 hover:bg-[#0e1320]'
              )}
              onClick={() => setAssetFilter(filter.toLowerCase())}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default FilterBar