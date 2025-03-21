// lib/mock-data.ts
import { Vault, MarketConfig, AssetConfig, MarketAllocation, VaultTransaction } from '@/types/vault';
import { findAssetIcon } from '@/lib/utils/token';

/**
 * Generate mock vault data from market config
 */
export function generateMockVaultData(market: MarketConfig, assetConfigs: AssetConfig[]): Vault {
  const now = new Date();
  
  // Generate a random date 1-3 months in the future for maturity (if applicable)
  const maturityDate = new Date(now.getTime());
  maturityDate.setDate(maturityDate.getDate() + Math.floor(Math.random() * 60) + 30);

  // Generate a random date 1-2 months in the past for creation
  const openTime = new Date(now.getTime());
  openTime.setDate(openTime.getDate() - Math.floor(Math.random() * 30) - 30);

  // Generate realistic APY numbers
  const baseApy = 4 + Math.random() * 6; // Base APY between 4-10%
  const apy = baseApy * (1 + Math.random() * 0.5); // Add some variance

  // Extract underlying token symbol from market.symbol (e.g., "USDC" from "ARB/USDC")
  const underlyingSymbol = market.symbol.split('/')[1];
  
  // Consistent naming. TMX-{Underlying Asset}-{Unique ID (last 4 digits of underlying address)}-Vault.
  const vaultName = `TMX-${underlyingSymbol}-${market.contracts.underlyingAddr.slice(-4)}-Vault`;

  return {
    id: market.contracts.marketAddr,
    name: vaultName,
    address: market.contracts.marketAddr,
    routerAddress: market.contracts.routerAddr,
    underlyingAddress: market.contracts.underlyingAddr,
    collateralAddress: market.contracts.collateralAddr,
    symbol: market.symbol,
    chain: 'Ethereum',
    maturity: maturityDate,
    tvl: Math.floor(50000 + Math.random() * 150000) * 1000, // TVL between $50M and $200M
    apy: parseFloat(apy.toFixed(2)),
    apr7d: parseFloat((apy * (0.95 + Math.random() * 0.1)).toFixed(2)),
    apr30d: parseFloat((apy * (0.9 + Math.random() * 0.1)).toFixed(2)),
    ltv: 75 + Math.floor(Math.random() * 15), // Loan-to-Value (if applicable)
    isFixed: market.isFixed,
    openTime: openTime,
    contracts: market.contracts,
    icon: findAssetIcon(assetConfigs, underlyingSymbol),
    userPosition: isMockUserPosition(underlyingSymbol)
      ? Math.floor(Math.random() * 2000) + 100
      : 0,
    curator: "TermMax",
    performanceFee: 5 + Math.floor(Math.random() * 10),
    idleFunds: Math.floor(Math.random() * 50000000),
    redeemableAmount: Math.random() * 200000,
    baseYield: parseFloat((baseApy).toFixed(2)),
    protocolIncentives: parseFloat((apy * 0.25).toFixed(2)),
    tradingFees: parseFloat((apy * 0.10).toFixed(2)),
    marketAllocation: generateMarketAllocation(),
    transactions: generateTransactionHistory(),
    riskMetrics: {
      riskLevel: 'Conservative',
      volatility: 'Low',
      protocolDiversity: 'High',
      impermanentLossProtection: 'Partial',
      smartContractAudits: 3,
      insuranceCoverage: 'Available via Nexus Mutual',
      governanceRisk: 'Low'
    }
  };
}

/**
 * Determine if a vault should have a mock user position
 */
function isMockUserPosition(underlyingSymbol: string): boolean {
  return ['USDT', 'USDC'].includes(underlyingSymbol);
}

/**
 * Generate mock market allocation data
 */
function generateMarketAllocation(): MarketAllocation[] {
  return [
    { market: 'USDO++/USDC', allocation: 47.45, supply: 147150000, cap: 350100000, apy: 10.39 },
    { market: 'USDOUSDO++/USDC', allocation: 15.88, supply: 49270000, cap: 200060000, apy: 10.13 },
    { market: 'PT-sUSDE-27MAR2025/USDC', allocation: 9.67, supply: 30000000, cap: 30000000, apy: 7.42 },
    { market: 'PT-USDO++-27MAR2025/USDC', allocation: 5.89, supply: 18280000, cap: 30000000, apy: 13.82 },
    { market: 'USR/USDC', allocation: 5.81, supply: 18020000, cap: 50010000, apy: 7.12 }
  ];
}

/**
 * Generate mock transaction history
 */
function generateTransactionHistory(): VaultTransaction[] {
  const now = new Date();
  
  return [
    {
      timestamp: new Date(now.getTime() - 10 * 60 * 1000), // 10 minutes ago
      type: 'Withdraw',
      amount: 500000,
      displayAmount: '$500,000.00',
      user: '0xB81a...5bfD',
      hash: '0xe764...5c4f'
    },
    {
      timestamp: new Date(now.getTime() - 10 * 60 * 1000 - 100), // Just after the withdraw
      type: 'Vault Fee',
      amount: 35.99,
      displayAmount: '$35.56',
      user: '0xD4C8...2446',
      hash: '0xe764...5c4f'
    },
    {
      timestamp: new Date(now.getTime() - 24 * 60 * 1000), // 24 minutes ago
      type: 'Withdraw',
      amount: 500000,
      displayAmount: '$500,000.00',
      user: '0xB81a...5bfD',
      hash: '0xcbbf...0c98'
    },
    {
      timestamp: new Date(now.getTime() - 24 * 60 * 1000 - 100), // Just after the withdraw
      type: 'Vault Fee',
      amount: 11.99,
      displayAmount: '$11.99',
      user: '0xD4C8...2446',
      hash: '0xcbbf...0c98'
    },
    {
      timestamp: new Date(now.getTime() - 42 * 60 * 1000), // 42 minutes ago
      type: 'Deposit',
      amount: 1000000,
      displayAmount: '$1,000,000.00',
      user: '0xF078...f19E',
      hash: '0x1b0b...76f1'
    }
  ];
}

/**
 * Generate mock collateral types
 */
export function generateMockCollateralTypes() {
  return [
    { name: 'WETH', ltv: 80, icon: 'https://termmax-backend-v2-test.onrender.com/icon/weth.svg' },
    { name: 'WBTC', ltv: 75, icon: 'https://termmax-backend-v2-test.onrender.com/icon/wbtc.svg' },
    { name: 'USDC', ltv: 90, icon: 'https://termmax-backend-v2-test.onrender.com/icon/usdc.svg' },
    { name: 'ARB', ltv: 70, icon: 'https://termmax-backend-v2-test.onrender.com/icon/arb.svg' },
    { name: 'DAI', ltv: 85, icon: 'https://termmax-backend-v2-test.onrender.com/icon/dai.svg' },
  ];
}