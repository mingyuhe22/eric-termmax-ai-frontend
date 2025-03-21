// lib/range-order/types.ts

export interface RangePoint {
    amount: string
    percentage: number
    apr: number
  }
  
  export interface Market {
    id: string
    debtToken: string
    collateral: string
    maturity: string
    lltv: number
    maxLtv: number
    icon: React.ReactNode
  }
  
  export type OrderStrategy = 'classic' | 'aggressive' | 'caution' | 'custom';
  export type OrderTab = 'lend' | 'borrow' | 'both';
  
  // Preset strategies
  export const strategyPresets = {
    lend: {
      classic: [
        { amount: '0', percentage: 0, apr: 45 },
        { amount: '900000', percentage: 23.1, apr: 19 },
        { amount: '3400000', percentage: 87.1, apr: 35 },
        { amount: '3900000', percentage: 100, apr: 45 }
      ],
      aggressive: [
        { amount: '0', percentage: 0, apr: 60 },
        { amount: '850000', percentage: 21.8, apr: 28 },
        { amount: '3100000', percentage: 79.5, apr: 42 },
        { amount: '3900000', percentage: 100, apr: 55 }
      ],
      caution: [
        { amount: '0', percentage: 0, apr: 35 },
        { amount: '1200000', percentage: 30.8, apr: 15 },
        { amount: '3500000', percentage: 89.7, apr: 22 },
        { amount: '3900000', percentage: 100, apr: 30 }
      ]
    },
    borrow: {
      classic: [
        { amount: '0', percentage: 0, apr: 40 },
        { amount: '400000', percentage: 10.2, apr: 17 },
        { amount: '2900000', percentage: 74.3, apr: 15 },
        { amount: '3900000', percentage: 100, apr: 10 }
      ],
      aggressive: [
        { amount: '0', percentage: 0, apr: 35 },
        { amount: '450000', percentage: 11.5, apr: 15 },
        { amount: '2800000', percentage: 71.8, apr: 12 },
        { amount: '3900000', percentage: 100, apr: 8 }
      ],
      caution: [
        { amount: '0', percentage: 0, apr: 45 },
        { amount: '350000', percentage: 9.0, apr: 20 },
        { amount: '3000000', percentage: 76.9, apr: 18 },
        { amount: '3900000', percentage: 100, apr: 15 }
      ]
    }
  };
  
  export interface WalletData {
    collateral: {
      symbol: string
      balance: number
      value: number
    }
    debtToken: {
      symbol: string
      balance: number
      value: number
    },
    fixedIncome: {
      symbol: string
      balance: number
      value: number
    },
    extraBalance: {
      symbol: string
      balance: number
      value: number
    }
  }