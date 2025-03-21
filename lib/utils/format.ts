// lib/utils/format.ts

/**
 * Format an address to a shortened form (e.g., 0x1234...5678)
 */
export function formatAddress(address: string, startLength = 6, endLength = 4): string {
  if (!address || typeof address !== 'string') {
    return ''
  }
  if (address.length <= startLength + endLength) {
    return address;
  }
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
}

/**
 * Truncates an address or hash string for display
 * Alias of formatAddress for consistent naming
 */
export function truncateMiddle(text: string, startChars: number = 6, endChars: number = 4): string {
  return formatAddress(text, startChars, endChars);
}

/**
 * Format TVL (Total Value Locked) for display with abbreviations (K, M, B)
 */
export function formatTVL(tvl: number): string {
  if (tvl >= 1000000000) {
    return `$${(tvl / 1000000000).toFixed(2)}B`
  } else if (tvl >= 1000000) {
    return `$${(tvl / 1000000).toFixed(2)}M`
  } else if (tvl >= 1000) {
    return `$${(tvl / 1000).toFixed(2)}K`
  } else {
    return `$${tvl.toFixed(2)}`
  }
}

/**
 * Formats a number as currency with abbreviated values for large numbers
 * Enhanced version that can be used without currency symbol 
 */
export function formatCurrency(value: number, decimals: number = 2, currency: string = '$'): string {
  if (value === undefined || value === null) return '-'
  
  if (value >= 1000000000) {
    return `${currency}${(value / 1000000000).toFixed(1)}B`
  } else if (value >= 1000000) {
    return `${currency}${(value / 1000000).toFixed(1)}M`
  } else if (value >= 1000) {
    return `${currency}${(value / 1000).toFixed(1)}K`
  } else {
    return `${currency}${value.toFixed(decimals)}`
  }
}

/**
 * Format percentage for display with specified decimals
 */
export function formatPercentage(amount: number, decimals = 2): string {
  if (amount === undefined || amount === null) return '-'
  return `${amount.toFixed(decimals)}%`
}

/**
 * Calculates the percentage given a value and total
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0
  return (value / total) * 100
}

/**
 * Format a number for display with specified decimals
 */
export function formatNumber(number: number, decimals = 2): string {
  return number.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })
}

/**
 * Format a date to a string (e.g., "Jan 1, 2023")
 */
export function formatDate(date: Date | string, format: 'relative' | 'short' | 'long' = 'short'): string {
  if (!date) return '-'
  
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  if (format === 'relative') {
    return formatTimeAgo(dateObj)
  } else if (format === 'short') {
    return dateObj.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } else {
    return dateObj.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
}

/**
 * Format a date to a relative time string (e.g., "2 days ago")
 */
export function formatTimeAgo(timestamp: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - timestamp.getTime()) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}min ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;

  // For longer periods, return the actual date
  return formatDate(timestamp);
}