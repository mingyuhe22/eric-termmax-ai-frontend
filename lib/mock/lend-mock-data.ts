// lib/mock-data/lend-data.ts

export interface LendingMarket {
    id: string;
    lendToken: string;
    collateral: string;
    maturity: string;
    days: number;
    ftSymbol: string;
    lendAPR: number;
    supportsLeverage: boolean;
    lendingCapacity: string;
    chain: string;
    userPosition: number;
    addresses: {
      market: string;
      ft: string;
      xt: string;
      collateral: string;
      router: string;
    };
    yieldBreakdown: {
      nativeYield: number;
      incentiveYield: number;
      totalYield: number;
    };
  }
  
  // Mock data for fixed-rate lending markets
  export const mockLendingMarkets: LendingMarket[] = [
    {
      id: 'usdc-arb-1',
      lendToken: 'USDC',
      collateral: 'ARB',
      maturity: '25 Apr, 2025',
      days: 36,
      ftSymbol: 'FT',
      lendAPR: 7.21,
      supportsLeverage: false,
      lendingCapacity: '$4.50M',
      chain: 'ethereum',
      userPosition: 0,
      addresses: {
        market: '0xB81a...5bfD',
        ft: '0xA342...9cF7',
        xt: '0xD901...3eB2',
        collateral: '0xC84c...6b3D',
        router: '0x8B6b...45dE',
      },
      yieldBreakdown: {
        nativeYield: 4.85,
        incentiveYield: 2.36,
        totalYield: 7.21
      }
    },
    {
      id: 'usdc-wbtc-1',
      lendToken: 'USDC',
      collateral: 'WBTC',
      maturity: '25 Apr, 2025',
      days: 36,
      ftSymbol: 'FT',
      lendAPR: 5.60,
      supportsLeverage: false,
      lendingCapacity: '$4.53M',
      chain: 'ethereum',
      userPosition: 5000,
      addresses: {
        market: '0xD84a...7bfE',
        ft: '0xF232...8cG7',
        xt: '0xE501...2eB9',
        collateral: '0xA24c...5b3C',
        router: '0x9B3b...15dF',
      },
      yieldBreakdown: {
        nativeYield: 3.52,
        incentiveYield: 2.08,
        totalYield: 5.60
      }
    },
    {
      id: 'usdc-wsteth-1',
      lendToken: 'USDC',
      collateral: 'wstETH',
      maturity: '25 Apr, 2025',
      days: 36,
      ftSymbol: 'FT',
      lendAPR: 5.60,
      supportsLeverage: false,
      lendingCapacity: '$4.53M',
      chain: 'arbitrum',
      userPosition: 0,
      addresses: {
        market: '0xB81a...5bfD',
        ft: '0xA342...9cF7',
        xt: '0xD901...3eB2',
        collateral: '0xC84c...6b3D',
        router: '0x8B6b...45dE',
      },
      yieldBreakdown: {
        nativeYield: 3.40,
        incentiveYield: 2.20,
        totalYield: 5.60
      }
    },
    {
      id: 'usdc-weth-1',
      lendToken: 'USDC',
      collateral: 'WETH',
      maturity: '25 Apr, 2025',
      days: 36,
      ftSymbol: 'FT',
      lendAPR: 2.38,
      supportsLeverage: false,
      lendingCapacity: '$4.56M',
      chain: 'ethereum',
      userPosition: 0,
      addresses: {
        market: '0xB81a...5bfD',
        ft: '0xA342...9cF7',
        xt: '0xD901...3eB2',
        collateral: '0xC84c...6b3D',
        router: '0x8B6b...45dE',
      },
      yieldBreakdown: {
        nativeYield: 1.85,
        incentiveYield: 0.53,
        totalYield: 2.38
      }
    },
    {
      id: 'weth-pufeth-1',
      lendToken: 'WETH',
      collateral: 'pufETH',
      maturity: '25 Apr, 2025',
      days: 36,
      ftSymbol: 'FT',
      lendAPR: 2.43,
      supportsLeverage: false,
      lendingCapacity: '$4.50M',
      chain: 'base',
      userPosition: 0,
      addresses: {
        market: '0xB81a...5bfD',
        ft: '0xA342...9cF7',
        xt: '0xD901...3eB2',
        collateral: '0xC84c...6b3D',
        router: '0x8B6b...45dE',
      },
      yieldBreakdown: {
        nativeYield: 1.95,
        incentiveYield: 0.48,
        totalYield: 2.43
      }
    },
    {
      id: 'weth-weeth-1',
      lendToken: 'WETH',
      collateral: 'weETH',
      maturity: '25 Apr, 2025',
      days: 36,
      ftSymbol: 'FT',
      lendAPR: 2.19,
      supportsLeverage: false,
      lendingCapacity: '$4.37M',
      chain: 'ethereum',
      userPosition: 0,
      addresses: {
        market: '0xB81a...5bfD',
        ft: '0xA342...9cF7',
        xt: '0xD901...3eB2',
        collateral: '0xC84c...6b3D',
        router: '0x8B6b...45dE',
      },
      yieldBreakdown: {
        nativeYield: 1.69,
        incentiveYield: 0.50,
        totalYield: 2.19
      }
    },
  ];
  
  // Generate mock lending transaction history
  export function generateMockLendingTransactions() {
    return [
      {
        timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
        type: 'Lend',
        amount: 500000,
        displayAmount: '$500,000.00',
        user: '0xB81a...5bfD',
        hash: '0xe764...5c4f'
      },
      {
        timestamp: new Date(Date.now() - 24 * 60 * 1000), // 24 minutes ago
        type: 'Lend',
        amount: 250000,
        displayAmount: '$250,000.00',
        user: '0xD4C8...2446',
        hash: '0xcbbf...0c98'
      },
      {
        timestamp: new Date(Date.now() - 42 * 60 * 1000), // 42 minutes ago
        type: 'Withdraw',
        amount: 100000,
        displayAmount: '$100,000.00',
        user: '0xF078...f19E',
        hash: '0x1b0b...76f1'
      }
    ];
  }