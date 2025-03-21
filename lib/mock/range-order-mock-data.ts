// lib/range-order/mock-data.ts

import { RangePoint } from '@/lib/range-order/types';

export interface Position {
  id: string;
  orderType: 'Lend' | 'Borrow' | 'Two Way';
  debtToken: string;
  collateral: string;
  maturity: string;
  ltv: number;
  // 新的順序和欄位
  // 借款相關
  borrowAPR: string | null;
  borrowAPRRaw: number | null;
  borrowMatchAPY: number | null;  // 新增：平均匹配APY（負數）
  borrowMatchedAmt: number | null;  // 新增：已匹配數量
  borrowTotalAmt: number | null;  // 新增：總訂單數量
  healthFactor: string;
  // 借出相關
  lendAPR: string | null;
  lendAPRRaw: number | null;
  lendMatchAPY: number | null;  // 新增：平均匹配APY
  lendMatchedAmt: number | null;  // 新增：已匹配數量
  lendTotalAmt: number | null;  // 新增：總訂單數量
  // 其他字段
  lpProfit: number | null;  // 新增：LP收益百分比
  isActive: boolean;  // 新增：是否活躍
  redeemable: number | null;  // 新增：可贖回金額
  // 舊字段保留，但可能已不使用
  availableToWithdraw: string;
  borrowingCapacity: string | null;
  claimable: string;
  lendingCapacity: string | null;
  borrowedAmount?: string;
  collateralAmount?: string;
  suppliedAmount?: string;
  // Range order 點
  lendPoints?: RangePoint[];
  borrowPoints?: RangePoint[];
}

// Lend-only positions
export const lendPositions: Position[] = [
  {
    id: "lend-1",
    orderType: "Lend",
    debtToken: "USDC",
    collateral: "eUSDe",
    maturity: "Apr 25, 2025",
    ltv: 0.94,
    // 借款相關
    borrowAPR: null,
    borrowAPRRaw: null,
    borrowMatchAPY: null,
    borrowMatchedAmt: null,
    borrowTotalAmt: null,
    healthFactor: "-",
    // 借出相關
    lendAPR: "15.32%",
    lendAPRRaw: 15.32,
    lendMatchAPY: 7.8,
    lendMatchedAmt: 150000,
    lendTotalAmt: 500000,
    // 其他字段
    lpProfit: null,
    isActive: true,
    redeemable: null,
    // 舊字段
    availableToWithdraw: "300,000",
    borrowingCapacity: null,
    claimable: "150,000",
    lendingCapacity: "2,500,000",
    suppliedAmount: "300,000",
    lendPoints: [
      { amount: '0', percentage: 0, apr: 45 },
      { amount: '900000', percentage: 23.1, apr: 19 },
      { amount: '3400000', percentage: 87.1, apr: 35 },
      { amount: '3900000', percentage: 100, apr: 45 }
    ]
  },
  {
    id: "lend-2",
    orderType: "Lend",
    debtToken: "wstETH",
    collateral: "PT-wstETH",
    maturity: "May 30, 2025",
    ltv: 0.90,
    // 借款相關
    borrowAPR: null,
    borrowAPRRaw: null,
    borrowMatchAPY: null,
    borrowMatchedAmt: null,
    borrowTotalAmt: null,
    healthFactor: "-",
    // 借出相關
    lendAPR: "9.15%",
    lendAPRRaw: 9.15,
    lendMatchAPY: 5.2,
    lendMatchedAmt: 10000,
    lendTotalAmt: 30000,
    // 其他字段
    lpProfit: null,
    isActive: true,
    redeemable: null,
    // 舊字段
    availableToWithdraw: "10,000",
    borrowingCapacity: null,
    claimable: "10,000",
    lendingCapacity: "50,000",
    suppliedAmount: "10,000",
    lendPoints: [
      { amount: '0', percentage: 0, apr: 35 },
      { amount: '1200000', percentage: 30.8, apr: 15 },
      { amount: '3500000', percentage: 89.7, apr: 22 },
      { amount: '3900000', percentage: 100, apr: 30 }
    ]
  }
];

// Borrow-only positions
export const borrowPositions: Position[] = [
  {
    id: "borrow-1",
    orderType: "Borrow",
    debtToken: "USDC",
    collateral: "WETH",
    maturity: "Apr 25, 2025",
    ltv: 0.82,
    // 借款相關
    borrowAPR: "5.67%",
    borrowAPRRaw: 5.67,
    borrowMatchAPY: -4.2,
    borrowMatchedAmt: 75000,
    borrowTotalAmt: 100000,
    healthFactor: "1.28",
    // 借出相關
    lendAPR: null,
    lendAPRRaw: null,
    lendMatchAPY: null,
    lendMatchedAmt: null,
    lendTotalAmt: null,
    // 其他字段
    lpProfit: null,
    isActive: true,
    redeemable: null,
    // 舊字段
    availableToWithdraw: "0",
    borrowingCapacity: "120,000",
    claimable: "0",
    lendingCapacity: null,
    borrowedAmount: "75,000",
    collateralAmount: "4.2",
    borrowPoints: [
      { amount: '0', percentage: 0, apr: 40 },
      { amount: '400000', percentage: 10.2, apr: 17 },
      { amount: '2900000', percentage: 74.3, apr: 15 },
      { amount: '3900000', percentage: 100, apr: 10 }
    ]
  },
  {
    id: "borrow-2",
    orderType: "Borrow",
    debtToken: "USDT",
    collateral: "wBTC",
    maturity: "Mar 24, 2025",
    ltv: 0.75,
    // 借款相關
    borrowAPR: "8.32%",
    borrowAPRRaw: 8.32,
    borrowMatchAPY: -6.5,
    borrowMatchedAmt: 45000,
    borrowTotalAmt: 60000,
    healthFactor: "1.45",
    // 借出相關
    lendAPR: null,
    lendAPRRaw: null,
    lendMatchAPY: null,
    lendMatchedAmt: null,
    lendTotalAmt: null,
    // 其他字段
    lpProfit: null,
    isActive: true,
    redeemable: null,
    // 舊字段
    availableToWithdraw: "0",
    borrowingCapacity: "75,000",
    claimable: "0",
    lendingCapacity: null,
    borrowedAmount: "45,000",
    collateralAmount: "1.26",
    borrowPoints: [
      { amount: '0', percentage: 0, apr: 35 },
      { amount: '450000', percentage: 11.5, apr: 15 },
      { amount: '2800000', percentage: 71.8, apr: 12 },
      { amount: '3900000', percentage: 100, apr: 8 }
    ]
  },
  {
    id: "borrow-3",
    orderType: "Borrow",
    debtToken: "USDC",
    collateral: "ARB",
    maturity: "May 30, 2025",
    ltv: 0.70,
    // 借款相關
    borrowAPR: "7.15%",
    borrowAPRRaw: 7.15,
    borrowMatchAPY: -5.8,
    borrowMatchedAmt: 25000,
    borrowTotalAmt: 40000,
    healthFactor: "1.65",
    // 借出相關
    lendAPR: null,
    lendAPRRaw: null,
    lendMatchAPY: null,
    lendMatchedAmt: null,
    lendTotalAmt: null,
    // 其他字段
    lpProfit: null,
    isActive: true,
    redeemable: null,
    // 舊字段
    availableToWithdraw: "0",
    borrowingCapacity: "40,000",
    claimable: "0",
    lendingCapacity: null,
    borrowedAmount: "25,000",
    collateralAmount: "8500",
    borrowPoints: [
      { amount: '0', percentage: 0, apr: 45 },
      { amount: '350000', percentage: 9.0, apr: 20 },
      { amount: '3000000', percentage: 76.9, apr: 18 },
      { amount: '3900000', percentage: 100, apr: 15 }
    ]
  }
];

// Two-way positions
export const twoWayPositions: Position[] = [
  {
    id: "two-way-1",
    orderType: "Two Way",
    debtToken: "pufETH",
    collateral: "PT-pufETH",
    maturity: "Mar 24, 2025",
    ltv: 0.94,
    // 借款相關
    borrowAPR: "6.32%",
    borrowAPRRaw: 6.32,
    borrowMatchAPY: -5.2,
    borrowMatchedAmt: 180000,
    borrowTotalAmt: 250000,
    healthFactor: "-",
    // 借出相關
    lendAPR: "7.38%",
    lendAPRRaw: 7.38,
    lendMatchAPY: 6.1,
    lendMatchedAmt: 220000,
    lendTotalAmt: 300000,
    // 其他字段
    lpProfit: 4.8,
    isActive: false, // 過期
    redeemable: 125000,
    // 舊字段
    availableToWithdraw: "220,000",
    borrowingCapacity: "1,980,000",
    claimable: "220,000",
    lendingCapacity: "220,000",
    borrowedAmount: "150,000",
    suppliedAmount: "180,000",
    collateralAmount: "10.5",
    lendPoints: [
      { amount: '0', percentage: 0, apr: 45 },
      { amount: '900000', percentage: 23.1, apr: 19 },
      { amount: '3400000', percentage: 87.1, apr: 35 },
      { amount: '3900000', percentage: 100, apr: 45 }
    ],
    borrowPoints: [
      { amount: '0', percentage: 0, apr: 40 },
      { amount: '400000', percentage: 10.2, apr: 17 },
      { amount: '2900000', percentage: 74.3, apr: 15 },
      { amount: '3900000', percentage: 100, apr: 10 }
    ]
  },
  {
    id: "two-way-2",
    orderType: "Two Way",
    debtToken: "WETH",
    collateral: "weETH",
    maturity: "Apr 25, 2025",
    ltv: 0.94,
    // 借款相關
    borrowAPR: "2.1%",
    borrowAPRRaw: 2.1,
    borrowMatchAPY: -1.8,
    borrowMatchedAmt: 120000,
    borrowTotalAmt: 150000,
    healthFactor: "-",
    // 借出相關
    lendAPR: "4.2%",
    lendAPRRaw: 4.2,
    lendMatchAPY: 3.5,
    lendMatchedAmt: 200000,
    lendTotalAmt: 250000,
    // 其他字段
    lpProfit: 2.6,
    isActive: true,
    redeemable: null,
    // 舊字段
    availableToWithdraw: "220,000",
    borrowingCapacity: "1,980,000",
    claimable: "220,000",
    lendingCapacity: "220,000",
    borrowedAmount: "120,000",
    suppliedAmount: "200,000",
    collateralAmount: "8.3",
    lendPoints: [
      { amount: '0', percentage: 0, apr: 35 },
      { amount: '1200000', percentage: 30.8, apr: 15 },
      { amount: '3500000', percentage: 89.7, apr: 22 },
      { amount: '3900000', percentage: 100, apr: 30 }
    ],
    borrowPoints: [
      { amount: '0', percentage: 0, apr: 35 },
      { amount: '450000', percentage: 11.5, apr: 15 },
      { amount: '2800000', percentage: 71.8, apr: 12 },
      { amount: '3900000', percentage: 100, apr: 8 }
    ]
  }
];

// Get all positions combined
export const allPositions = [...lendPositions, ...borrowPositions, ...twoWayPositions];