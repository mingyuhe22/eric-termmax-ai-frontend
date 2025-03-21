'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Loader2, ArrowUpDown, ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { cn } from '@/lib/utils/utils'
import MarketCard from './MarketCard'

interface Market {
  id: string
  lendToken: string
  collateral: string
  maturity: string
  days: number
  ftSymbol: string
  lendAPR: number
  supportsLeverage: boolean
  lendingCapacity: string
  chain: string
  userPosition: number
  addresses: {
    market: string
    ft: string
    xt: string
    collateral: string
    router: string
  }
  yieldBreakdown: {
    nativeYield: number
    incentiveYield: number
    totalYield: number
  }
}

interface MarketListProps {
  market: Market[] // This was likely the issue - it should be an array of markets, not a single market
  loading: boolean
  error: string | null
  selectedMarketId: string | null
  sortField: string
  sortDirection: 'asc' | 'desc'
  searchTerm: string
  chainFilter: string
  assetFilter: string
  onMarketSelect: (marketId: string) => void
  handleSort: (field: string) => void
}

const MarketList: React.FC<MarketListProps> = ({
  market: markets, // Rename for clarity
  loading,
  error,
  selectedMarketId,
  sortField,
  sortDirection,
  searchTerm,
  chainFilter,
  assetFilter,
  onMarketSelect,
  handleSort
}) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const marketsPerPage = 10;

  // Filter markets based on searchTerm, chainFilter, and assetFilter
  const filteredMarkets = React.useMemo(() => {
    return markets.filter(m => {
      // Search filter
      const matchesSearch = searchTerm === '' || 
        m.lendToken.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.collateral.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Chain filter
      const matchesChain = chainFilter === 'all' || 
        m.chain.toLowerCase() === chainFilter.toLowerCase();
      
      // Asset filter - simplified version
      const matchesAsset = assetFilter === 'all' || 
        (assetFilter === 'btc' && (m.lendToken.toLowerCase().includes('btc') || m.collateral.toLowerCase().includes('btc'))) ||
        (assetFilter === 'eth' && (m.lendToken.toLowerCase().includes('eth') || m.collateral.toLowerCase().includes('eth'))) ||
        (assetFilter === 'usd' && (m.lendToken.toLowerCase().includes('usd') || m.collateral.toLowerCase().includes('usd')));
      
      return matchesSearch && matchesChain && matchesAsset;
    });
  }, [markets, searchTerm, chainFilter, assetFilter]);

  // Sort markets
  const sortedMarkets = React.useMemo(() => {
    return [...filteredMarkets].sort((a, b) => {
      // Special case for lendAPR sorting
      if (sortField === 'lendAPR') {
        return sortDirection === 'asc' ? a.lendAPR - b.lendAPR : b.lendAPR - a.lendAPR;
      }
      
      // Special case for userPosition - always keep positions at the top
      if (sortField === 'userPosition') {
        if (a.userPosition > 0 && b.userPosition === 0) return -1;
        if (a.userPosition === 0 && b.userPosition > 0) return 1;
        return sortDirection === 'asc' ? a.userPosition - b.userPosition : b.userPosition - a.userPosition;
      }
      
      // Default case for other fields (not currently used)
      return 0;
    });
  }, [filteredMarkets, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(sortedMarkets.length / marketsPerPage);
  const indexOfLastMarket = currentPage * marketsPerPage;
  const indexOfFirstMarket = indexOfLastMarket - marketsPerPage;
  const currentMarkets = sortedMarkets.slice(indexOfFirstMarket, indexOfLastMarket);

  // Reset pagination when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, chainFilter, assetFilter]);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#1e2c3b] mb-4" />
          <p className="text-[#9ca3af] text-lg">Loading markets...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-8 flex flex-col items-center justify-center">
        <div className="rounded-full bg-red-500/10 p-4 mb-4">
          <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <p className="text-lg text-red-400 text-center">{error}</p>
        <button
          className="mt-4 px-4 py-2 bg-[#0d111d] hover:bg-[#0e1320] rounded-md text-[#ffffff] transition-colors duration-200"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  // Empty state
  if (markets.length === 0 || filteredMarkets.length === 0) {
    return (
      <div className="p-8 text-center flex flex-col items-center justify-center py-20">
        <div className="rounded-full bg-[#0d111d] p-4 mb-4 opacity-50">
          <Search className="h-8 w-8 text-[#9ca3af]" />
        </div>
        <p className="text-lg text-[#9ca3af] mb-2">No markets found matching your criteria</p>
        <button
          className="mt-2 px-4 py-2 bg-[#1e2c3b]/10 text-[#1e2c3b] border border-[#1e2c3b]/20 hover:bg-[#1e2c3b]/20 rounded-md transition-colors duration-200"
          onClick={() => {
            // Clear filters functionality would go here
          }}
        >
          Clear filters
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Market List Table */}
      <motion.div
        className="border border-[#1e2c3b]/5 rounded-lg bg-[#0a0e19] overflow-hidden shadow-md mb-12"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        {/* Table header */}
        <div className="border-b border-[#1e2c3b]/5 px-6 py-4 text-sm text-[#9ca3af] grid grid-cols-5 bg-[#0d111d]">
          <div className="flex items-center font-medium text-sm md:text-base">Market</div>
          <div className="text-center font-medium text-sm md:text-base">Maturity</div>
          <div
            className="flex items-center justify-center cursor-pointer text-sm md:text-base"
            onClick={() => handleSort('lendAPR')}
          >
            <span className="font-medium">APR</span>
            <ArrowUpDown className={cn(
              'ml-1 h-3.5 w-3.5 transition-colors duration-200',
              sortField === 'lendAPR' ? 'text-[#1e2c3b]' : ''
            )} />
          </div>
          <div className="text-right font-medium text-sm md:text-base">Capacity</div>
          <div
            className="flex items-center justify-end cursor-pointer text-sm md:text-base"
            onClick={() => handleSort('userPosition')}
          >
            <span className="font-medium">Your Position</span>
            <ArrowUpDown className={cn(
              'ml-1 h-3.5 w-3.5 transition-colors duration-200',
              sortField === 'userPosition' ? 'text-[#1e2c3b]' : ''
            )} />
          </div>
        </div>

        {/* Market rows */}
        <div>
          {currentMarkets.map((market, index) => (
            <MarketCard
              key={market.id}
              market={market}
              isSelected={selectedMarketId === market.id}
              onClick={() => onMarketSelect(market.id)}
              index={index}
            />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center p-4 border-t border-[#1e2c3b]/5 bg-[#0d111d]">
            <button
              className="p-1.5 rounded-full text-[#9ca3af] hover:text-[#ffffff] hover:bg-[#1e2c3b]/10 disabled:opacity-50 transition-colors duration-200"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={18} />
            </button>
            <span className="mx-4 text-sm text-[#9ca3af]">
              {currentPage} of {totalPages}
            </span>
            <button
              className="p-1.5 rounded-full text-[#9ca3af] hover:text-[#ffffff] hover:bg-[#1e2c3b]/10 disabled:opacity-50 transition-colors duration-200"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </motion.div>
    </>
  );
};

export default MarketList;