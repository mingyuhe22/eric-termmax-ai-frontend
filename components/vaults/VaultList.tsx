// components/vaults/VaultList.tsx
'use client'

import React from 'react';
import { Loader2, ArrowUpDown, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Vault } from '@/types/vault';
import { motion } from 'framer-motion';
import VaultCard from '@/components/vaults/VaultCard';
import { cn } from '@/lib/utils/utils';

interface VaultListProps {
  vaults: Vault[];
  loading: boolean;
  error: string | null;
  selectedVault: string | null;
  sortField: string;
  sortDirection: 'asc' | 'desc';
  searchTerm: string;
  chainFilter: string;
  assetFilter: string;
  setSearchTerm: (term: string) => void;
  setChainFilter: (chain: string) => void;
  setAssetFilter: (asset: string) => void;
  setSelectedVault: (vaultId: string | null) => void;
  handleSort: (field: string) => void;
}

const VaultList: React.FC<VaultListProps> = ({
  vaults,
  loading,
  error,
  selectedVault,
  sortField,
  searchTerm,
  chainFilter,
  assetFilter,
  setSearchTerm,
  setChainFilter,
  setAssetFilter,
  setSelectedVault,
  handleSort
}) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const vaultsPerPage = 10;

  // Pagination
  const totalPages = Math.ceil(vaults.length / vaultsPerPage);
  const indexOfLastVault = currentPage * vaultsPerPage;
  const indexOfFirstVault = indexOfLastVault - vaultsPerPage;
  const currentVaults = vaults.slice(indexOfFirstVault, indexOfLastVault);

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
          <p className="text-[#9ca3af] text-lg">Loading vaults...</p>
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
  if (vaults.length === 0) {
    return (
      <div className="p-8 text-center flex flex-col items-center justify-center py-20">
        <div className="rounded-full bg-[#0d111d] p-4 mb-4 opacity-50">
          <Search className="h-8 w-8 text-[#9ca3af]" />
        </div>
        <p className="text-lg text-[#9ca3af] mb-2">No vaults found matching your criteria</p>
        <button
          className="mt-2 px-4 py-2 bg-[#1e2c3b]/10 text-[#1e2c3b] border border-[#1e2c3b]/20 hover:bg-[#1e2c3b]/20 rounded-md transition-colors duration-200"
          onClick={() => {
            setSearchTerm('');
            setChainFilter('all');
            setAssetFilter('all');
          }}
        >
          Clear filters
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Header, Filters */}
      <motion.div
  className="mt-4 mb-6 flex flex-col md:flex-row gap-4 md:items-center justify-between"
  initial={{ opacity: 0, y: -5 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, delay: 0.2 }}
>
  {/* Chain Filter - Replacing the Vault Dashboard header */}
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
        placeholder="Search vaults..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full md:w-64 rounded-md border border-[#1e2c3b]/5 bg-[#0d111d] py-2 pl-10 pr-4 text-white placeholder:text-gray-500 focus:ring-0 focus:border-[#1e2c3b]/30 focus:outline-none transition-all duration-200 hover:border-[#1e2c3b]/10"
      />
    </div>

    {/* Asset Filter - Keep it here on the right */}
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
          onClick={() => {
            setAssetFilter(filter.toLowerCase());
            setCurrentPage(1);
          }}
        >
          {filter}
        </button>
      ))}
    </div>
  </div>
</motion.div>

      {/* Vault List Table */}
      <motion.div
        className="border border-[#1e2c3b]/5 rounded-lg bg-[#0a0e19] overflow-hidden shadow-md"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        {/* Table header */}
        <div className="border-b border-[#1e2c3b]/5 px-6 py-4 text-sm text-[#9ca3af] grid grid-cols-5 bg-[#0d111d]">
          <div className="flex items-center font-medium text-sm md:text-base">Vault</div>
          <div
            className="flex items-center justify-end cursor-pointer text-sm md:text-base"
            onClick={() => handleSort('apy')}
          >
            <span className="font-medium">Net APY</span>
            <ArrowUpDown className={cn(
              'ml-1 h-3.5 w-3.5 transition-colors duration-200',
              sortField === 'apy' ? 'text-[#1e2c3b]' : ''
            )} />
          </div>
          <div className="text-right font-medium text-sm md:text-base">TVL</div>
          <div className="text-right font-medium text-sm md:text-base">Liquidity</div>
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

        {/* Vault rows */}
        <div>
          {currentVaults.map((vault, index) => (
            <VaultCard
              key={vault.id}
              vault={vault}
              isSelected={selectedVault === vault.id}
              onClick={() => setSelectedVault(vault.id === selectedVault ? null : vault.id)}
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

export default VaultList;