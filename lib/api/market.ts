// lib/api/market.ts
import { MarketConfig, AssetConfig, GTConfig } from '@/types/vault';

/**
 * Market configuration response from the API
 */
interface MarketConfigResponse {
  data: {
    network: string;
    chainId: number;
    globalConfig: {
      confirmedBlocks: number;
      syncEventSyBatchBlocks: number;
      routerStartBlock: number;
      oracleAggregator: string;
      routerAddress: string;
      mockSwapAdapter: string;
      faucetAddress: string;
    };
    assetConfigs: AssetConfig[];
    gtConfigs: GTConfig[];
    markets: MarketConfig[];
    orderConfigs: { [key: string]: string | number | boolean }[];
  };
}

/**
 * Fetch market configuration for a specific chain
 */
export async function fetchMarketConfig(chainId: number): Promise<MarketConfigResponse['data'] | null> {
  try {
    const response = await fetch(`https://termmax-api.staging.ts.finance/market/config/list?chainId=${chainId}`);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data: MarketConfigResponse = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching market config:', error);
    return null;
  }
}

/**
 * Market metrics response structure
 */
interface MarketMetricsResponse {
  data: {
    tvl: number;
    apy: number;
  };
}

/**
 * Fetch metrics for a specific market
 */
export async function fetchMarketMetrics(marketAddress: string): Promise<MarketMetricsResponse['data'] | null> {
  try {
    // For now, without using the apiClient, we'll use a direct fetch
    const response = await fetch(`https://termmax-api.staging.ts.finance/market/${marketAddress}/metrics`);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data: MarketMetricsResponse = await response.json();
    return data.data;
  } catch (error) {
    console.error(`Error fetching metrics for market ${marketAddress}:`, error);
    return null;
  }
}

/**
 * Get token pair from symbol string
 */
export function getTokenPair(symbol: string) {
  const tokens = symbol.split('/');
  return {
    baseToken: tokens[0] || 'UNKNOWN',
    quoteToken: tokens[1] || 'USDC'
  };
}

/**
 * Calculate yield based on principal and APY
 */
export function calculateYield(principal: number, apy: number, days = 365): number {
  return Math.floor(principal * (apy / 100) / days);
}

/**
 * Mock function for fetching vault TVL and APY
 * In a production app, you would use the real API endpoints
 */
export async function fetchVaultMetrics() {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return mock data for now
  return {
    tvl: Math.random() * 1000000, // Random TVL between 0 and 1,000,000
    apy: 5 + Math.random() * 15, // Random APY between 5% and 20%,
  };
}

/**
 * Mock function for fetching user's position in a vault
 * In a production app, you would use the real API endpoints
 */
export async function fetchUserPosition(vaultAddress: string) {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return mock data for now
  return {
    vaultAddress,
    tokenAddress: '0x1234567890123456789012345678901234567890',
    balance: (Math.random() * 10).toFixed(4),
    decimals: 18,
    symbol: 'LP',
  };
}

export default {
  fetchMarketConfig,
  fetchMarketMetrics,
  fetchVaultMetrics,
  fetchUserPosition,
};