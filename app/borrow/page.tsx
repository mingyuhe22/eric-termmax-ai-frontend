// app/borrow/page.tsx
'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, ArrowUpDown } from 'lucide-react'
import { cn } from '@/lib/utils/utils'
import MarketCard from '@/components/borrow/MarketList'
import BorrowContainer from '@/components/borrow/BorrowContainer'
import { Market } from '@/types/borrow'

// Mock market data
const mockMarkets: Market[] = [
  {
    id: 'weth-1',
    debtToken: 'WETH',
    collateral: 'pufETH',
    maturity: '25 Apr, 2025',
    days: 36,
    ltv: 0.84,
    maxLtv: 0.94,
    borrowAPR: 3.43,
    supportsLeverage: true,
    maxLeverage: 5.5,
    borrowingCapacity: '$378.20K',
    leverageAPY: 16.93,
    chain: 'ethereum',
    addresses: {
      market: '0xB81a...5bfD',
      debt: '0x62F5...7eA4',
      collateral: '0xC84c...6b3D',
      router: '0x8B6b...45dE',
      ft: '0xA342...9cF7',
      xt: '0xD901...3eB2',
      gt: '0xF430...1aA9'
    }
  },
  {
    id: 'usdc-1',
    debtToken: 'USDC',
    collateral: 'weETH',
    maturity: '24 Mar, 2025',
    days: 4,
    ltv: 0.90,
    maxLtv: 0.94,
    borrowAPR: 5.82,
    supportsLeverage: false,
    maxLeverage: 1.0,
    borrowingCapacity: '$1.25M',
    chain: 'ethereum',
    addresses: {
      market: '0xD84a...7bfE',
      debt: '0x45F2...9eA1',
      collateral: '0xA24c...5b3C',
      router: '0x9B3b...15dF',
      ft: '0xF232...8cG7',
      xt: '0xE501...2eB9',
      gt: '0xC140...3aB3'
    }
  },
  {
    id: 'pufeth-1',
    debtToken: 'pufETH',
    collateral: 'PT-pufETH-26JUN2025',
    maturity: '24 Mar, 2025',
    days: 4,
    ltv: 0.94,
    maxLtv: 0.94,
    borrowAPR: 6.05,
    supportsLeverage: true,
    maxLeverage: 12.4,
    borrowingCapacity: '$700.80K',
    leverageAPY: 63.77,
    chain: 'base',
    addresses: {
      market: '0xB81a...5bfD',
      debt: '0x62F5...7eA4',
      collateral: '0xC84c...6b3D',
      router: '0x8B6b...45dE',
      ft: '0xA342...9cF7',
      xt: '0xD901...3eB2',
      gt: '0xF430...1aA9'
    }
  },
  {
    id: 'usdt-1',
    debtToken: 'USDT',
    collateral: 'PT-USDC-29MAY2025',
    maturity: '30 May, 2025',
    days: 71,
    ltv: 0.90,
    maxLtv: 0.94,
    borrowAPR: 7.50,
    supportsLeverage: true,
    maxLeverage: 5.5,
    borrowingCapacity: '$901.97K',
    leverageAPY: 42.07,
    chain: 'arbitrum',
    addresses: {
      market: '0xE55a...4bfC',
      debt: '0x72G1...2eF4',
      collateral: '0xD47c...9b1D',
      router: '0x3C4b...95dA',
      ft: '0xB132...7aD7',
      xt: '0xF701...4eB1',
      gt: '0xG244...5aB9'
    }
  },
  {
    id: 'dai-1',
    debtToken: 'DAI',
    collateral: 'wBTC',
    maturity: '15 Jun, 2025',
    days: 87,
    ltv: 0.80,
    maxLtv: 0.94,
    borrowAPR: 8.25,
    supportsLeverage: true,
    maxLeverage: 5.0,
    borrowingCapacity: '$805.42K',
    leverageAPY: 35.06,
    chain: 'ethereum',
    addresses: {
      market: '0xF61a...1bfA',
      debt: '0x35G2...8aE4',
      collateral: '0xB14c...4b1C',
      router: '0x7D2b...75dB',
      ft: '0xC332...1cE7',
      xt: '0xA401...9aB1',
      gt: '0xD649...2dC9'
    }
  },
  {
    id: 'usdc-2',
    debtToken: 'USDC',
    collateral: 'weETH',
    maturity: '25 Apr, 2025',
    days: 36,
    ltv: 0.85,
    maxLtv: 0.94,
    borrowAPR: 10.82,
    supportsLeverage: false,
    maxLeverage: 1.0,
    borrowingCapacity: '$496.03K',
    chain: 'ethereum',
    addresses: {
      market: '0xA71a...3dfD',
      debt: '0x82F1...4aA4',
      collateral: '0xF44c...7f3D',
      router: '0x1B6b...35fE',
      ft: '0xE142...4cF7',
      xt: '0xC901...6aB2',
      gt: '0xD130...8bA9'
    }
  }
];

export default function BorrowPage() {
  // Market filtering state
  const [searchTerm, setSearchTerm] = useState('');
  const [chainFilter, setChainFilter] = useState('all');
  const [assetFilter, setAssetFilter] = useState('all');
  const [sortField, setSortField] = useState<'maturity' | 'borrowAPR' | 'maxLeverage'>('borrowAPR');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // Modal state
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  
  // Filter markets
  const filteredMarkets = mockMarkets.filter(market => {
    // Search filter
    const matchesSearch = searchTerm === '' || 
      market.debtToken.toLowerCase().includes(searchTerm.toLowerCase()) ||
      market.collateral.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Chain filter
    const matchesChain = chainFilter === 'all' || 
      market.chain === chainFilter;
    
    // Asset filter (USD, ETH, BTC)
    const matchesAsset = assetFilter === 'all' || 
      (assetFilter === 'usd' && (
        market.debtToken.includes('USD') || 
        market.debtToken.includes('USDC') || 
        market.debtToken.includes('USDT') ||
        market.debtToken.includes('DAI')
      )) ||
      (assetFilter === 'eth' && (
        market.debtToken.includes('ETH') || 
        market.debtToken.includes('WETH')
      )) ||
      (assetFilter === 'btc' && (
        market.debtToken.includes('BTC') || 
        market.debtToken.includes('WBTC')
      ));
    
    return matchesSearch && matchesChain && matchesAsset;
  });
  
  // Sort markets
  const sortedMarkets = [...filteredMarkets].sort((a, b) => {
    if (sortField === 'maturity') {
      // Convert maturity strings to timestamp for comparison
      const dateA = new Date(a.maturity.replace(',', '')).getTime();
      const dateB = new Date(b.maturity.replace(',', '')).getTime();
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    }
    
    // Sort by numeric fields
    const valueA = a[sortField];
    const valueB = b[sortField];
    return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
  });
  
  // Handle sort
  const handleSort = (field: 'maturity' | 'borrowAPR' | 'maxLeverage') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Handle market selection
  const handleSelectMarket = (market: Market) => {
    setSelectedMarket(market);
  };
  
  // Handle modal close
  const handleCloseModal = () => {
    setSelectedMarket(null);
  };

  return (
    <div className="min-h-screen pb-16">
      <div className="w-full max-w-7xl mx-auto px-4 pt-8">
        {/* Header section */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-3xl font-bold text-white mb-2">Borrow</h1>
            <p className="text-xl">
              <span className="text-[#5FBDE9]">at Fixed Rate </span>
              <span className="text-yellow-400">and Fixed Term</span>
            </p>
            <p className="text-gray-400 mt-2">Secure your borrowing costs with fixed-rate loans and optional leverage</p>
          </motion.div>
        </div>
        
        {/* Filters Area */}
        <div className="flex flex-wrap items-center gap-4 mt-4 mb-6">
          {/* Chain Filter */}
          <div className="flex h-10 overflow-hidden rounded-md border border-[#1e2c3b] bg-[#0a1525]">
            <button
              className={cn(
                'px-4 py-2 text-sm font-medium transition-colors',
                chainFilter === 'all' ? 'bg-[#0c1624] text-white' : 'text-gray-400'
              )}
              onClick={() => setChainFilter('all')}
            >
              🌐 All
            </button>
            <button
              className={cn(
                'px-4 py-2 text-sm font-medium transition-colors',
                chainFilter === 'ethereum' ? 'bg-[#0c1624] text-white' : 'text-gray-400'
              )}
              onClick={() => setChainFilter('ethereum')}
            >
              Ξ Eth
            </button>
            <button
              className={cn(
                'px-4 py-2 text-sm font-medium transition-colors',
                chainFilter === 'arbitrum' ? 'bg-[#0c1624] text-white' : 'text-gray-400'
              )}
              onClick={() => setChainFilter('arbitrum')}
            >
              🔷 Arb
            </button>
            <button
              className={cn(
                'px-4 py-2 text-sm font-medium transition-colors',
                chainFilter === 'base' ? 'bg-[#0c1624] text-white' : 'text-gray-400'
              )}
              onClick={() => setChainFilter('base')}
            >
              🅱️ Base
            </button>
          </div>

          {/* Search Input */}
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search markets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-md border border-[#1e2c3b] bg-[#0a1525] text-white"
            />
          </div>
          
          {/* Asset Filter */}
          <div className="flex h-10 overflow-hidden rounded-md border border-[#1e2c3b] bg-[#0a1525] ml-auto">
            <button
              className={cn(
                'px-4 py-2 text-sm font-medium transition-colors',
                assetFilter === 'all' ? 'bg-[#0c1624] text-white' : 'text-gray-400'
              )}
              onClick={() => setAssetFilter('all')}
            >
              All
            </button>
            <button
              className={cn(
                'px-4 py-2 text-sm font-medium transition-colors',
                assetFilter === 'usd' ? 'bg-[#0c1624] text-white' : 'text-gray-400'
              )}
              onClick={() => setAssetFilter('usd')}
            >
              USD
            </button>
            <button
              className={cn(
                'px-4 py-2 text-sm font-medium transition-colors',
                assetFilter === 'eth' ? 'bg-[#0c1624] text-white' : 'text-gray-400'
              )}
              onClick={() => setAssetFilter('eth')}
            >
              ETH
            </button>
            <button
              className={cn(
                'px-4 py-2 text-sm font-medium transition-colors',
                assetFilter === 'btc' ? 'bg-[#0c1624] text-white' : 'text-gray-400'
              )}
              onClick={() => setAssetFilter('btc')}
            >
              BTC
            </button>
          </div>
        </div>
        
        {/* Market List */}
        <motion.div
          className="border border-[#1e2c3b]/5 rounded-lg bg-[#0a0e19] overflow-hidden shadow-md"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          {/* Table Header */}
          <div className="border-b border-[#1e2c3b]/5 px-6 py-4 text-sm text-[#9ca3af] grid grid-cols-6 bg-[#0d111d]">
            <div className="col-span-2">
              <div className="flex items-center font-medium">Debt/Collateral</div>
            </div>
            <div 
              className="text-center cursor-pointer"
              onClick={() => handleSort('maturity')}
            >
              <div className="flex items-center justify-center">
                <span className="font-medium">Maturity</span>
                <ArrowUpDown className={cn(
                  'ml-1 h-3.5 w-3.5 transition-colors',
                  sortField === 'maturity' ? 'text-[#5FBDE9]' : ''
                )} />
              </div>
            </div>
            <div 
              className="text-center cursor-pointer"
              onClick={() => handleSort('borrowAPR')}
            >
              <div className="flex items-center justify-center">
                <span className="font-medium">Borrow Rate</span>
                <ArrowUpDown className={cn(
                  'ml-1 h-3.5 w-3.5 transition-colors',
                  sortField === 'borrowAPR' ? 'text-[#5FBDE9]' : ''
                )} />
              </div>
            </div>
            <div className="text-right font-medium">Capacity</div>
            <div 
              className="text-right cursor-pointer"
              onClick={() => handleSort('maxLeverage')}
            >
              <div className="flex items-center justify-end">
                <span className="font-medium">Leverage</span>
                <ArrowUpDown className={cn(
                  'ml-1 h-3.5 w-3.5 transition-colors',
                  sortField === 'maxLeverage' ? 'text-[#5FBDE9]' : ''
                )} />
              </div>
            </div>
          </div>
          
          {/* Market Rows */}
          <div>
            {sortedMarkets.map((market, index) => (
              <MarketCard
                key={market.id}
                market={market}
                index={index}
                onClick={() => handleSelectMarket(market)}
              />
            ))}
            
            {/* Empty state */}
            {sortedMarkets.length === 0 && (
              <div className="p-8 text-center">
                <div className="h-12 w-12 mx-auto mb-4 rounded-full bg-[#0d111d] flex items-center justify-center">
                  <Search className="h-6 w-6 text-gray-500" />
                </div>
                <h3 className="text-xl font-medium text-white mb-2">No Markets Found</h3>
                <p className="text-gray-400 max-w-md mx-auto mb-4">
                  No borrowing markets match your current filters. Try adjusting your search criteria.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setChainFilter('all');
                    setAssetFilter('all');
                  }}
                  className="px-4 py-2 border border-[#1e2c3b] rounded-md text-gray-400 hover:text-white hover:border-[#5FBDE9]/30"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
      
      {/* Borrow Sidebar */}
      {selectedMarket && (
        <BorrowContainer 
          market={selectedMarket} 
          onClose={handleCloseModal} 
        />
      )}
    </div>
  )
}