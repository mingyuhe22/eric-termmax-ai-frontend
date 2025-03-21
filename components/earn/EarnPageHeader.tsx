'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils/utils'

interface EarnPageHeaderProps {
  searchTerm: string
  chainFilter: string
  assetFilter: string
  productType: 'all' | 'fixed' | 'floating'
  setSearchTerm: (term: string) => void
  setChainFilter: (chain: string) => void
  setAssetFilter: (asset: string) => void
  setProductType: (type: 'all' | 'fixed' | 'floating') => void
}

const EarnPageHeader: React.FC<EarnPageHeaderProps> = ({
  searchTerm,
  chainFilter,
  assetFilter,
  productType,
  setSearchTerm,
  setChainFilter,
  setAssetFilter,
  setProductType
}) => {
  return (
    <div className="py-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold text-white mb-2">Earn</h1>
        <p className="text-xl">
          <span className="text-[#5FBDE9]">Fixed and Variable Rate </span>
          <span className="text-white">Opportunities</span>
        </p>
        <p className="text-gray-400 mt-2">Maximize your returns with our suite of earning products</p>
      </motion.div>

      <motion.div
        className="mt-6 mb-6 flex flex-col md:flex-row gap-4 md:items-center justify-between"
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        {/* Product Type Filter */}
        <div className="flex h-10 overflow-hidden rounded-md border border-[#1e2c3b]/5 bg-[#0d111d] shadow-sm">
          <button
            className={cn(
              'px-4 py-2 text-sm font-medium transition-colors duration-200 flex items-center gap-1',
              productType === 'all'
                ? 'bg-[#1e2c3b] text-white'
                : 'text-gray-400 hover:bg-[#0e1320]'
            )}
            onClick={() => setProductType('all')}
          >
            All Products
          </button>
          <button
            className={cn(
              'px-4 py-2 text-sm font-medium transition-colors duration-200 flex items-center gap-1',
              productType === 'fixed'
                ? 'bg-[#1e2c3b] text-white'
                : 'text-gray-400 hover:bg-[#0e1320]'
            )}
            onClick={() => setProductType('fixed')}
          >
            Fixed Rate
          </button>
          <button
            className={cn(
              'px-4 py-2 text-sm font-medium transition-colors duration-200 flex items-center gap-1',
              productType === 'floating'
                ? 'bg-[#1e2c3b] text-white'
                : 'text-gray-400 hover:bg-[#0e1320]'
            )}
            onClick={() => setProductType('floating')}
          >
            Floating Rate
          </button>
        </div>

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
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64 rounded-md border border-[#1e2c3b]/5 bg-[#0d111d] py-2 pl-10 pr-4 text-white placeholder:text-gray-500 focus:ring-0 focus:border-[#1e2c3b]/30 focus:outline-none transition-all duration-200 hover:border-[#1e2c3b]/10"
            />
          </div>

          {/* Asset Filter */}
          <div className="flex h-9 overflow-hidden rounded-md border border-[#1e2c3b]/5 bg-[#0d111d] shadow-sm">
            {['All', 'BTC', 'ETH', 'USD'].map((filter, index) => (
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
    </div>
  )
}

export default EarnPageHeader