// lib/utils/vault-utils.ts
import { Vault } from '@/types/vault'

/**
 * Filter vaults based on search term and asset type
 */
export function filterVaults(
  vaults: Vault[], 
  searchTerm: string, 
  assetFilter: string
): Vault[] {
  return vaults.filter(vault => {
    // Search filter
    const matchesSearch = searchTerm === '' || 
      vault.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vault.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    
    // Asset filter
    const matchesAssetFilter = assetFilter === 'all' || 
      (assetFilter === 'btc' && vault.symbol.toLowerCase().includes('btc')) ||
      (assetFilter === 'eth' && (vault.symbol.toLowerCase().includes('eth') || vault.symbol.toLowerCase().includes('steth'))) ||
      (assetFilter === 'usd' && (
        vault.symbol.toLowerCase().includes('usd') || 
        vault.symbol.toLowerCase().includes('usdc') || 
        vault.symbol.toLowerCase().includes('usdt')
      ))
    
    return matchesSearch && matchesAssetFilter
  })
}

/**
 * Sort vaults based on field and direction
 */
export function sortVaults(
  vaults: Vault[], 
  sortField: string, 
  sortDirection: 'asc' | 'desc'
): Vault[] {
  return [...vaults].sort((a, b) => {
    // Always put vaults with positions at the top
    if ((a.userPosition ?? 0) > 0 && (b.userPosition ?? 0) === 0) return -1
    if ((a.userPosition ?? 0) === 0 && (b.userPosition ?? 0) > 0) return 1

    // Then sort by the selected field
    let valueA = a[sortField as keyof Vault]
    let valueB = b[sortField as keyof Vault]

    // Handle date objects
    if (valueA instanceof Date && valueB instanceof Date) {
      valueA = valueA.getTime()
      valueB = valueB.getTime()
    }

    if (valueA === undefined || valueB === undefined) return 0
    if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1
    if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1
    return 0
  })
}

/**
 * Find asset icon based on symbol
 */
interface Asset {
  symbol: string;
  name?: string;
  icon?: string;
}

export function findAssetIcon(assets: Asset[], symbol: string): string {
  const symbolParts = symbol.split('/')
  const baseAsset = assets.find(a => 
    a.symbol === symbolParts[0] || a.name?.includes(symbolParts[0])
  )
  
  return baseAsset?.icon || 'https://termmax-backend-v2-test.onrender.com/icon/FT.svg'
}

/**
 * Get token pair from symbol string
 */
export function getTokenPair(symbol: string) {
  const tokens = symbol.split('/')
  return {
    baseToken: tokens[0],
    quoteToken: tokens[1] || 'USDC'
  }
}

/**
 * Calculate yield based on principal and APY
 */
export function calculateYield(principal: number, apy: number, days = 365): number {
  return Math.floor(principal * (apy / 100) / 365 * days)
}

/**
 * Calculate days remaining until maturity
 */
export function getDaysToMaturity(maturityDate: Date): number {
  const now = new Date()
  const diffTime = maturityDate.getTime() - now.getTime()
  return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)))
}

/**
 * Format TVL for display
 */
export function formatTVL(tvl: number): string {
  if (tvl >= 1000000) {
    return `$${(tvl / 1000000).toFixed(2)}M`
  } else if (tvl >= 1000) {
    return `$${(tvl / 1000).toFixed(2)}K`
  } else {
    return `$${tvl.toFixed(2)}`
  }
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number, decimals = 2): string {
  return `$${amount.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })}`
}

/**
 * Format percentage for display
 */
export function formatPercentage(amount: number, decimals = 2): string {
  return `${amount.toFixed(decimals)}%`
}