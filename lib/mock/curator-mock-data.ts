// lib/mock/curator-mock-data.ts

import { CuratorVault, VaultOrder, PendingRequest, WhitelistedMarket, RebalanceMetrics } from '@/types/curator'

// Generate mock rebalance metrics
export const generateMockRebalanceMetrics = (totalValue: number = 4000000): RebalanceMetrics => {
  const allocatedValue = totalValue * 0.75
  const unallocatedValue = totalValue * 0.25
  const averageAPY = 12.5
  
  return {
    totalVaultValue: totalValue,
    allocatedValue,
    unallocatedValue,
    averageAPY
  }
}

// Generate mock curator vaults
export const generateMockCuratorVaults = (): CuratorVault[] => {
  return [
    {
      address: '0x83a2E5a23a38D7e7964f38f5988C9B127d65Df3F',
      name: 'USDC Yield Optimizer',
      tvl: 4700000,
      availableLiquidity: 2200000,
      notionalValue: 5100000,
      apy: 12.5,
      status: 'Live',
      creator: '0x51a9F2fe5A7B98b8fc8E2e52E987982f7A7E632D',
      strategy: 'Lending',
      token: 'USDC',
      maturity: 'Open',
      lastActivity: '2 hours ago',
      description: 'A decentralized vault that optimizes yield across multiple DeFi protocols, automatically balancing risk and return for maximum APY while maintaining liquidity requirements.',
      idleFunds: 2500000,
      redeemableAmount: 4700000,
      performanceFee: 10,
      orders: generateMockVaultOrders(),
      marketAllocation: [
        { market: 'WBTC/USDC', allocation: 36.74, supply: 39900000, cap: 99970000, apy: 6.30 },
        { market: 'cbBTC/USDC', allocation: 34.63, supply: 37600000, cap: 49980000, apy: 7.14 },
        { market: 'wstETH/USDC', allocation: 28.62, supply: 31080000, cap: 99970000, apy: 6.62 },
        { market: 'wUSDM/USDC', allocation: 0, supply: 0, cap: 99970000, apy: 2.99 },
        { market: 'USDC', allocation: 0, supply: 0, cap: 0, apy: 1.11 }
      ]
    },
    {
      address: '0x51a9F2fe5A7B98b8fc8E2e52E987982f7A7E632D',
      name: 'ETH-stETH Liquidity',
      tvl: 2100000,
      availableLiquidity: 1100000,
      notionalValue: 2300000,
      apy: 8.2,
      status: 'Live',
      creator: '0x51a9F2fe5A7B98b8fc8E2e52E987982f7A7E632D',
      strategy: 'Liquidity',
      token: 'ETH/stETH',
      maturity: 'Open',
      lastActivity: '5 hours ago'
    },
    {
      address: '0x29Fe7D60DdF151E5b52e5FAB4f1325da6b2bD70F',
      name: 'Stable Yield Aggregator',
      tvl: 8300000,
      availableLiquidity: 3500000,
      notionalValue: 8900000,
      apy: 6.9,
      status: 'Live',
      creator: '0x51a9F2fe5A7B98b8fc8E2e52E987982f7A7E632D',
      strategy: 'Stablecoin',
      token: 'USDT/USDC/DAI',
      maturity: 'Open',
      lastActivity: '1 day ago'
    },
    {
      address: '0xB81a5bfD29E25e35CC9c39D05AE143aFb73F5bfD',
      name: 'Liquid Staking Derivative',
      tvl: 1500000,
      availableLiquidity: 600000,
      notionalValue: 1650000,
      apy: 15.2,
      status: 'Live',
      creator: '0x51a9F2fe5A7B98b8fc8E2e52E987982f7A7E632D',
      strategy: 'Staking',
      token: 'ETH',
      maturity: 'Apr 25, 2025',
      lastActivity: '3 days ago'
    }
  ]
}

// Generate mock pending requests
export const generateMockPendingRequests = (): PendingRequest[] => {
  return [
    { 
      id: "pr1", 
      type: "market", 
      name: "Whitelist Market", 
      market: "WETH/USDC-20250425 · Apr 25, 2025", 
      newValue: "0xe955e90ca94dc1853e366bf1f85f3bd5fd487d5fd", 
      validAt: "Mar 20, 2025, 14:56:49", 
      status: "unlocked" 
    },
    { 
      id: "pr2", 
      type: "fee", 
      name: "Update Fee Rate", 
      market: "USDC Yield Optimizer", 
      currentValue: "10.0%", 
      newValue: "12.5%", 
      validAt: "Mar 21, 2025, 09:30:15", 
      status: "pending" 
    },
    { 
      id: "pr3", 
      type: "capacity", 
      name: "Update Vault Capacity", 
      market: "USDC Yield Optimizer", 
      currentValue: "10,000,000 USDC", 
      newValue: "15,000,000 USDC", 
      validAt: "Mar 22, 2025, 18:22:33", 
      status: "locked" 
    }
  ]
}

// Generate mock whitelisted markets
export const generateMockWhitelistedMarkets = (): WhitelistedMarket[] => {
  return [
    { id: "wm1", market: "ARB/USDC-20250425", collateral: "ARB", debt: "USDC", maturity: "Apr 25, 2025", lltv: 0.70, maxLtv: 0.60 },
    { id: "wm2", market: "WBTC/USDC-20250425", collateral: "WBTC", debt: "USDC", maturity: "Apr 25, 2025", lltv: 0.80, maxLtv: 0.70 },
    { id: "wm3", market: "ETH/USDC-20250425", collateral: "ETH", debt: "USDC", maturity: "Apr 25, 2025", lltv: 0.85, maxLtv: 0.75 },
    { id: "wm4", market: "stETH/USDC-20250630", collateral: "stETH", debt: "USDC", maturity: "Jun 30, 2025", lltv: 0.80, maxLtv: 0.70 },
    { id: "wm5", market: "pufETH/PT-pufETH-20250324", collateral: "PT-pufETH", debt: "pufETH", maturity: "Mar 24, 2025", lltv: 0.94, maxLtv: 0.92 }
  ]
}

// Sample vault orders for demonstration purposes
export const generateMockVaultOrders = (): VaultOrder[] => {
  return [
    {
      id: "order-1",
      orderType: "Two Way",
      debtToken: "pufETH",
      collateral: "PT-pufETH",
      maturity: "Mar 24, 2025",
      ltv: 0.94,
      borrowAPR: "6.32%",
      borrowAPRRaw: 6.32,
      lendAPR: "7.38%",
      lendAPRRaw: 7.38,
      allocatedAmount: 180000,
      allocationPercentage: 45,
      maxCapacity: 400000,
      reservedAssets: {
        xt: 220000, 
        ft: 150000
      },
      borrowPoints: [
        { amount: '0', percentage: 0, apr: 40 },
        { amount: '400000', percentage: 10.2, apr: 17 },
        { amount: '2900000', percentage: 74.3, apr: 15 },
        { amount: '3900000', percentage: 100, apr: 10 }
      ],
      lendPoints: [
        { amount: '0', percentage: 0, apr: 45 },
        { amount: '900000', percentage: 23.1, apr: 19 },
        { amount: '3400000', percentage: 87.1, apr: 35 },
        { amount: '3900000', percentage: 100, apr: 45 }
      ]
    },
    {
      id: "order-2",
      orderType: "Lend",
      debtToken: "USDC",
      collateral: "eUSDe",
      maturity: "Apr 25, 2025",
      ltv: 0.94,
      borrowAPR: null,
      borrowAPRRaw: null,
      lendAPR: "15.32%",
      lendAPRRaw: 15.32,
      allocatedAmount: 80000,
      allocationPercentage: 20,
      maxCapacity: 300000,
      reservedAssets: {
        xt: 150000, 
        ft: 0
      },
      lendPoints: [
        { amount: '0', percentage: 0, apr: 45 },
        { amount: '900000', percentage: 23.1, apr: 19 },
        { amount: '3400000', percentage: 87.1, apr: 35 },
        { amount: '3900000', percentage: 100, apr: 45 }
      ]
    },
    {
      id: "order-3",
      orderType: "Borrow",
      debtToken: "USDC",
      collateral: "WETH",
      maturity: "Apr 25, 2025",
      ltv: 0.82,
      borrowAPR: "5.67%",
      borrowAPRRaw: 5.67,
      lendAPR: null,
      lendAPRRaw: null,
      allocatedAmount: 60000,
      allocationPercentage: 15,
      maxCapacity: 120000,
      reservedAssets: {
        xt: 0, 
        ft: 75000
      },
      borrowPoints: [
        { amount: '0', percentage: 0, apr: 40 },
        { amount: '400000', percentage: 10.2, apr: 17 },
        { amount: '2900000', percentage: 74.3, apr: 15 },
        { amount: '3900000', percentage: 100, apr: 10 }
      ]
    },
    {
      id: "order-4",
      orderType: "Lend",
      debtToken: "wstETH",
      collateral: "PT-wstETH",
      maturity: "May 30, 2025",
      ltv: 0.90,
      borrowAPR: null,
      borrowAPRRaw: null,
      lendAPR: "9.15%",
      lendAPRRaw: 9.15,
      allocatedAmount: 40000,
      allocationPercentage: 10,
      maxCapacity: 50000,
      reservedAssets: {
        xt: 10000, 
        ft: 0
      },
      lendPoints: [
        { amount: '0', percentage: 0, apr: 35 },
        { amount: '1200000', percentage: 30.8, apr: 15 },
        { amount: '3500000', percentage: 89.7, apr: 22 },
        { amount: '3900000', percentage: 100, apr: 30 }
      ]
    },
    {
      id: "order-5",
      orderType: "Two Way",
      debtToken: "WETH",
      collateral: "weETH",
      maturity: "Apr 25, 2025",
      ltv: 0.94,
      borrowAPR: "2.1%",
      borrowAPRRaw: 2.1,
      lendAPR: "4.2%",
      lendAPRRaw: 4.2,
      allocatedAmount: 40000,
      allocationPercentage: 10,
      maxCapacity: 250000,
      reservedAssets: {
        xt: 200000, 
        ft: 120000
      },
      borrowPoints: [
        { amount: '0', percentage: 0, apr: 35 },
        { amount: '450000', percentage: 11.5, apr: 15 },
        { amount: '2800000', percentage: 71.8, apr: 12 },
        { amount: '3900000', percentage: 100, apr: 8 }
      ],
      lendPoints: [
        { amount: '0', percentage: 0, apr: 35 },
        { amount: '1200000', percentage: 30.8, apr: 15 },
        { amount: '3500000', percentage: 89.7, apr: 22 },
        { amount: '3900000', percentage: 100, apr: 30 }
      ]
    }
  ]
}