// lib/utils/token.ts

/**
 * Get token pair from symbol string
 * @param symbol - The token pair symbol (e.g., "ETH/USDC")
 * @returns An object containing the base and quote tokens
 */
export function getTokenPair(symbol: string) {
    const tokens = symbol.split('/')
    return {
      baseToken: tokens[0],
      quoteToken: tokens[1] || 'USDC'
    }
  }
  
  /**
   * Clean a token symbol by removing common prefixes (e.g., 'w' for wrapped tokens)
   * @param symbol - The token symbol to clean
   * @returns The cleaned token symbol
   */
  export function cleanTokenSymbol(symbol: string): string {
    // Remove common prefixes (e.g., 'w' for wrapped tokens)
    return symbol.toLowerCase().replace(/^w/, '')
  }
  
  /**
   * Get appropriate cryptocurrency icon URL
   * @param symbol - The token symbol
   * @returns The URL for the token icon
   */
  export function getTokenIconUrl(symbol: string): string {
    const normalizedSymbol = cleanTokenSymbol(symbol)
    
    // Primary source
    const primarySource = `https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/svg/color/${normalizedSymbol}.svg`
    
    // Define fallback sources that can be tried if the primary source fails
    // const fallbackSources = [
    //   `https://cdn.morpho.org/assets/logos/${normalizedSymbol}.svg`,
    //   `https://termmax-backend-v2-test.onrender.com/icon/${normalizedSymbol}.svg`,
    // ]
    
    return primarySource
  }
  
  /**
   * Find asset icon based on symbol from a list of assets
   * @param assets - The list of assets to search
   * @param symbol - The token symbol to find
   * @returns The icon URL for the token
   */
  export function findAssetIcon(assets: { symbol: string; name?: string; icon?: string }[], symbol: string): string {
    const symbolParts = symbol.split('/')
    const baseAsset = assets.find(a => 
      a.symbol === symbolParts[0] || a.name?.includes(symbolParts[0])
    )
    
    return baseAsset?.icon || 'https://termmax-backend-v2-test.onrender.com/icon/FT.svg'
  }
  
  /**
   * Get the base token from a symbol
   * @param symbol - The token pair symbol (e.g., "ETH/USDC")
   * @returns The base token
   */
  export function getBaseToken(symbol: string): string {
    return symbol.split('/')[0]
  }
  
  /**
   * Get the quote token from a symbol
   * @param symbol - The token pair symbol (e.g., "ETH/USDC")
   * @returns The quote token
   */
  export function getQuoteToken(symbol: string): string {
    const tokens = symbol.split('/')
    return tokens[1] || 'USDC'
  }
  
  /**
   * Format token amount with appropriate decimals
   * @param amount - The token amount
   * @param decimals - The number of decimals to display
   * @param symbol - The token symbol
   * @returns Formatted token amount with symbol
   */
  export function formatTokenAmount(amount: number, decimals: number, symbol: string): string {
    return `${amount.toFixed(decimals)} ${symbol}`
  }
  
  /**
   * Truncate token amount for display
   * @param amount - The token amount
   * @param symbol - The token symbol
   * @returns Truncated token amount with symbol
   */
  export function truncateTokenAmount(amount: number, symbol: string): string {
    // Use different precision based on the amount
    let precision = 2
    if (amount < 0.01) precision = 6
    else if (amount < 1) precision = 4
    
    return `${amount.toFixed(precision)} ${symbol}`
  }