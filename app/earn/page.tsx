'use client'

import React, { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils/utils'
import { fetchMarketConfig } from '@/lib/api/market'
import { generateMockVaultData } from '@/lib/mock/vault-mock-data'
import { mockLendingMarkets, LendingMarket } from '@/lib/mock/lend-mock-data'
import { Vault } from '@/types/vault'
import VaultList from '@/components/vaults/VaultList'
import VaultSidebar from '@/components/vaults/VaultSidebar'
import FixedRateLendingModal from '@/components/lending/FixedRateLendingModal'

export default function EarnPage() {
  const [vaults, setVaults] = useState<Vault[]>([])
  const [lendingMarkets] = useState<LendingMarket[]>(mockLendingMarkets)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Selected product type and item
  const [productType, setProductType] = useState<'floating' | 'fixed'>('floating')
  const [selectedVaultId, setSelectedVaultId] = useState<string | null>(null)
  const [selectedMarketId, setSelectedMarketId] = useState<string | null>(null)
  
  // Filtering
  const [sortField, setSortField] = useState('apy')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [searchTerm, setSearchTerm] = useState('')
  const [chainFilter, setChainFilter] = useState('all')
  const [assetFilter, setAssetFilter] = useState('all')

  // Load vaults
  useEffect(() => {
    async function loadVaults() {
      try {
        setLoading(true)
        const chainId = 421614
        const data = await fetchMarketConfig(chainId)

        if (data) {
          const marketVaults = data.markets.map((market) => generateMockVaultData(market, data.assetConfigs))
          // Assign random chains for the demo
          const chainsArray = ['ethereum', 'arbitrum', 'base']
          const vaultsWithChains = marketVaults.map(vault => ({
            ...vault,
            chain: chainsArray[Math.floor(Math.random() * chainsArray.length)]
          }))
          setVaults(vaultsWithChains)
        }
      } catch (err) {
        console.error('Failed to load vaults:', err)
        setError('Failed to load vaults. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    loadVaults()
  }, [])

  // Filter vaults based on search, chain, and asset
  const filteredVaults = vaults.filter(vault => {
    // Search filter
    const matchesSearch = searchTerm === '' || 
      vault.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vault.symbol.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Chain filter
    const matchesChain = chainFilter === 'all' || 
      vault.chain?.toLowerCase() === chainFilter.toLowerCase();
    
    // Asset filter
    const matchesAsset = assetFilter === 'all' || 
      (assetFilter === 'btc' && vault.symbol.toLowerCase().includes('btc')) ||
      (assetFilter === 'eth' && (vault.symbol.toLowerCase().includes('eth') || vault.symbol.toLowerCase().includes('weth'))) ||
      (assetFilter === 'usd' && (
        vault.symbol.toLowerCase().includes('usd') || 
        vault.symbol.toLowerCase().includes('usdc') || 
        vault.symbol.toLowerCase().includes('usdt')
      ));
    
    return matchesSearch && matchesChain && matchesAsset;
  });

  // Filter markets based on search term and filters
  const filteredMarkets = lendingMarkets.filter(market => {
    // Search filter
    const matchesSearch = searchTerm === '' || 
      market.lendToken.toLowerCase().includes(searchTerm.toLowerCase()) ||
      market.collateral.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Chain filter
    const matchesChain = chainFilter === 'all' || 
      market.chain.toLowerCase() === chainFilter.toLowerCase();
    
    // Asset filter
    const matchesAsset = assetFilter === 'all' || 
      (assetFilter === 'btc' && (market.lendToken.toLowerCase().includes('btc') || market.collateral.toLowerCase().includes('btc'))) ||
      (assetFilter === 'eth' && (market.lendToken.toLowerCase().includes('eth') || market.collateral.toLowerCase().includes('eth'))) ||
      (assetFilter === 'usd' && (market.lendToken.toLowerCase().includes('usd') || market.collateral.toLowerCase().includes('usd')));
    
    return matchesSearch && matchesChain && matchesAsset;
  });

  // Selected vault/market
  const selectedVault = vaults.find(v => v.id === selectedVaultId) || null;
  const selectedMarket = lendingMarkets.find(m => m.id === selectedMarketId) || null;

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Handle actions
  const handleDeposit = (vault: Vault) => {
    console.log('Depositing into vault:', vault.id);
  };

  const handleWithdraw = (vault: Vault) => {
    console.log('Withdrawing from vault:', vault.id);
  };

  // Handle market/vault selection
  const handleMarketSelect = (marketId: string) => {
    setSelectedMarketId(marketId === selectedMarketId ? null : marketId);
  };

  const handleVaultSelect = (vaultId: string | null) => {
    setSelectedVaultId(vaultId === selectedVaultId ? null : vaultId);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0d19] flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-t-[#47A6E5] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading earning opportunities...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0d19] flex items-center justify-center p-4">
        <div className="bg-[#0c1624] border border-[#1e2c3b] rounded-lg p-6 max-w-md">
          <h2 className="text-xl font-bold text-white mb-2">Error Loading Data</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button 
            className="bg-[#47A6E5] hover:bg-[#3a91c9] text-white px-4 py-2 rounded"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0d19] pb-16">
      <div className="w-full max-w-7xl mx-auto px-4">
        {/* Page Header with toggle button for Fixed/Floating Rate */}
        <div className="pt-8 pb-6">
          {/* Title and toggle buttons in the same row */}
          <div className="flex items-center mb-2">
            <h1 className="text-3xl font-bold text-white mr-4">Earn</h1>
            
            {/* Product type toggles with direct styling to match the images */}
            <div className="relative z-10 inline-flex rounded-lg shadow-lg overflow-hidden">
              <button
                onClick={() => setProductType('floating')}
                className={cn(
                  "relative py-2 px-6 font-medium transition-all duration-200",
                  productType === 'floating' 
                    ? "bg-amber-500 text-black font-bold" 
                    : "bg-[#0c1624] text-amber-500 hover:bg-[#0e1320]"
                )}
              >
                Floating
              </button>
              <button
                onClick={() => setProductType('fixed')}
                className={cn(
                  "relative py-2 px-6 font-medium transition-all duration-200",
                  productType === 'fixed' 
                    ? "bg-amber-500 text-black font-bold" 
                    : "bg-[#0c1624] text-amber-500 hover:bg-[#0e1320]"
                )}
              >
                Fixed
              </button>
            </div>
          </div>
          <p className="text-gray-400 mt-1">Maximize your returns with our suite of earning products</p>
        </div>
        
        {/* Conditional Content Based on Selected Type */}
        <AnimatePresence mode="wait">
          {productType === 'floating' ? (
            <motion.div
              key="floating-rate"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                    <path d="M21 8L12 2L3 8V16L12 22L21 16V8Z" stroke="#47A6E5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M21 8L12 14L3 8" stroke="#47A6E5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 14V22" stroke="#47A6E5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 14L3 16" stroke="#47A6E5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 14L21 16" stroke="#47A6E5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <h2 className="text-xl font-bold text-white">Floating-Rate Vaults</h2>
                </div>
                
                <div className="text-sm text-gray-400">
                  {filteredVaults.length} vaults available
                </div>
              </div>
              
              <VaultList
                vaults={filteredVaults}
                loading={false}
                error={null}
                selectedVault={selectedVaultId}
                sortField={sortField}
                sortDirection={sortDirection}
                searchTerm={searchTerm}
                chainFilter={chainFilter}
                assetFilter={assetFilter}
                setSearchTerm={setSearchTerm}
                setChainFilter={setChainFilter}
                setAssetFilter={setAssetFilter}
                setSelectedVault={handleVaultSelect}
                handleSort={handleSort}
              />
            </motion.div>
          ) : (
            <motion.div
              key="fixed-rate"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                    <path d="M9 18L15 12L9 6" stroke="#47A6E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <h2 className="text-xl font-bold text-white">Fixed-Rate Markets</h2>
                </div>
                
                <div className="text-sm text-gray-400">
                  {filteredMarkets.length} markets available
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex space-x-1 bg-[#0a0e19] p-1 rounded-md">
                  <button 
                    className={cn("px-3 py-1 rounded-md text-sm", chainFilter === 'all' ? "text-white bg-[#1e2c3b]" : "text-gray-400")}
                    onClick={() => setChainFilter('all')}
                  >
                    All
                  </button>
                  <button 
                    className={cn("px-3 py-1 rounded-md text-sm flex items-center", chainFilter === 'ethereum' ? "text-white bg-[#1e2c3b]" : "text-gray-400")}
                    onClick={() => setChainFilter('ethereum')}
                  >
                    <span className="mr-1">Ξ</span> Eth
                  </button>
                  <button 
                    className={cn("px-3 py-1 rounded-md text-sm flex items-center", chainFilter === 'arbitrum' ? "text-white bg-[#1e2c3b]" : "text-gray-400")}
                    onClick={() => setChainFilter('arbitrum')}
                  >
                    <span className="mr-1">🔷</span> Arb
                  </button>
                  <button 
                    className={cn("px-3 py-1 rounded-md text-sm flex items-center", chainFilter === 'base' ? "text-white bg-[#1e2c3b]" : "text-gray-400")}
                    onClick={() => setChainFilter('base')}
                  >
                    <span className="mr-1">🅱️</span> Base
                  </button>
                </div>
                
                {/* Middle search bar */}
                <div className="relative flex-grow mx-4 max-w-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Search markets..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-[#0a0e19] border border-[#1e2c3b]/20 rounded-md py-1 pl-10 pr-4 text-white w-full focus:outline-none focus:border-[#47A6E5]/50"
                  />
                </div>
                
                {/* Right asset filter */}
                <div className="flex space-x-1 bg-[#0a0e19] p-1 rounded-md">
                  <button 
                    className={cn("px-3 py-1 rounded-md text-sm", assetFilter === 'all' ? "text-white bg-[#1e2c3b]" : "text-gray-400")}
                    onClick={() => setAssetFilter('all')}
                  >
                    All
                  </button>
                  <button 
                    className={cn("px-3 py-1 rounded-md text-sm", assetFilter === 'btc' ? "text-white bg-[#1e2c3b]" : "text-gray-400")}
                    onClick={() => setAssetFilter('btc')}
                  >
                    BTC
                  </button>
                  <button 
                    className={cn("px-3 py-1 rounded-md text-sm", assetFilter === 'eth' ? "text-white bg-[#1e2c3b]" : "text-gray-400")}
                    onClick={() => setAssetFilter('eth')}
                  >
                    ETH
                  </button>
                  <button 
                    className={cn("px-3 py-1 rounded-md text-sm", assetFilter === 'usd' ? "text-white bg-[#1e2c3b]" : "text-gray-400")}
                    onClick={() => setAssetFilter('usd')}
                  >
                    USD
                  </button>
                </div>
              </div>
              
              <div className="border border-[#1e2c3b]/5 rounded-lg bg-[#0a0e19] overflow-hidden shadow-md mb-12">
                {/* Table header */}
                <div className="border-b border-[#1e2c3b]/5 px-6 py-4 text-sm text-[#9ca3af] grid grid-cols-5 bg-[#0d111d]">
                  <div className="flex items-center font-medium text-sm md:text-base">Market</div>
                  <div className="text-center font-medium text-sm md:text-base">Maturity</div>
                  <div
                    className="flex items-center justify-center cursor-pointer text-sm md:text-base"
                    onClick={() => handleSort('lendAPR')}
                  >
                    <span className="font-medium">APR</span>
                  </div>
                  <div className="text-right font-medium text-sm md:text-base">Capacity</div>
                  <div className="text-right font-medium text-sm md:text-base">Your Position</div>
                </div>

                {/* Market rows */}
                <div>
                  {filteredMarkets.map((market, index) => (
                    <motion.div
                      key={market.id}
                      className={cn(
                        'px-6 py-4 border-b border-[#1e2c3b]/5 grid grid-cols-5 items-center cursor-pointer transition-all duration-200',
                        selectedMarketId === market.id ? 'bg-[#0d111d]' : '',
                        market.userPosition > 0 
                          ? 'bg-[#47A6E5]/10 border-l-2 border-l-[#47A6E5]' 
                          : '',
                        'hover:bg-[#0c1020]'
                      )}
                      onClick={() => handleMarketSelect(market.id)}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.05 * (index % 5) }}
                    >
                      {/* Market Name */}
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-[#0c1624] flex items-center justify-center text-white font-medium">
                          {market.lendToken.charAt(0)}
                        </div>
                        <div>
                          <div className="text-[#ffffff] font-medium text-sm md:text-base">
                            {market.lendToken} / {market.collateral}
                          </div>
                          <div className="text-xs text-[#9ca3af] mt-0.5 flex items-center">
                            <span>{market.ftSymbol}</span>
                            <span className="mx-1">•</span>
                            <span className="flex items-center">
                              <span className="mr-1">
                                {market.chain === 'ethereum' ? 'Ξ' : 
                                market.chain === 'arbitrum' ? '🔷' : 
                                market.chain === 'base' ? '🅱️' : ''}
                              </span>
                              <span>{market.chain}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Maturity */}
                      <div className="text-center">
                        <div className="text-[#ffffff] text-sm md:text-base">{market.maturity}</div>
                        <div className="text-xs text-[#9ca3af] mt-0.5">{market.days} days</div>
                      </div>

                      {/* APR */}
                      <div className="text-center">
                        <div className="text-[#47A6E5] font-medium text-sm md:text-base inline-block group relative">
                          {market.lendAPR.toFixed(2)}%
                          <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 bg-[#081020] border border-[#1e2c3b] text-xs text-white py-1 px-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none w-36 z-10">
                            <div className="flex justify-between items-center mb-1">
                              <span>Base:</span>
                              <span>{market.yieldBreakdown.nativeYield.toFixed(2)}%</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>Incentive:</span>
                              <span>{market.yieldBreakdown.incentiveYield.toFixed(2)}%</span>
                            </div>
                            <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[5px] border-b-[#1e2c3b] absolute -bottom-[5px] left-1/2 transform -translate-x-1/2 rotate-180"></div>
                          </div>
                        </div>
                      </div>

                      {/* Lending Capacity */}
                      <div className="text-right text-[#ffffff] text-sm md:text-base">
                        {market.lendingCapacity}
                      </div>

                      {/* Your Position */}
                      <div className="text-right text-sm md:text-base">
                        <span className={market.userPosition > 0 ? "text-[#ffffff] font-medium" : "text-[#6b7280]"}>
                          {market.userPosition > 0 ? `$${market.userPosition.toLocaleString()}` : '-'}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Vault Sidebar */}
      <AnimatePresence>
        {selectedVault && (
          <VaultSidebar
            vault={selectedVault}
            onClose={() => setSelectedVaultId(null)}
            onDeposit={handleDeposit}
            onWithdraw={handleWithdraw}
            utils={{
              getTokenPair: (symbol: string) => ({ 
                baseToken: symbol.split('/')[0], 
                quoteToken: symbol.split('/')[1] || 'USDC' 
              }),
              calculateYield: (principal: number, apy: number, period: number) => {
                return principal * (apy / 100) * (period / 365);
              }
            }}
          />
        )}
      </AnimatePresence>

      {/* Fixed-Rate Lending Modal */}
      <AnimatePresence>
        {selectedMarket && (
          <FixedRateLendingModal
            market={selectedMarket}
            onClose={() => setSelectedMarketId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}