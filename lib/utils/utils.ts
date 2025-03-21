// lib/utils.ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Re-export utility functions from specialized modules
export { 
  formatAddress, 
  formatCurrency, 
  formatPercentage, 
  formatTVL,
  formatNumber,
  formatDate,
  formatTimeAgo
} from './format'

export {
  calculateYield,
  calculateAPRFromAPY,
  calculateAPYFromAPR,
  daysBetween,
  getDaysToMaturity,
  isVaultMature,
  parseStringToNumber
} from './math'

export {
  getTokenPair,
  getTokenIconUrl,
  getBaseToken,
  getQuoteToken,
  formatTokenAmount,
  cleanTokenSymbol,
  findAssetIcon
} from './token'

/**
 * Combines multiple class names and merges tailwind classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Truncate a string in the middle
 */
export function truncateMiddle(str: string, startLength = 6, endLength = 4): string {
  if (!str) return ''
  if (str.length <= startLength + endLength) return str
  
  return `${str.substring(0, startLength)}...${str.substring(str.length - endLength)}`
}