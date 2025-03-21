// types/borrow.ts
export interface Market {
  id: string;
  debtToken: string;
  collateral: string;
  maturity: string;
  days: number;
  ltv: number;
  maxLtv: number;
  borrowAPR: number;
  // Adding the missing properties
  lendAPR?: number;
  nativeYield?: number;
  incentiveYield?: number;
  lendingCapacity?: string;
  supportsLeverage: boolean;
  maxLeverage: number;
  borrowingCapacity?: string;
  leverageAPY?: number;
  chain: 'ethereum' | 'bsc' | 'polygon' | 'arbitrum' | 'avalanche' | 'base';
  addresses: {
    market: string;
    debt: string;
    collateral: string;
    router: string;
    ft: string;
    xt: string;
    gt: string;
  };
}

export interface MarketStatistic {
  liquidity: string;
  liquidityChange: string;
  volume24h: string;
  volumeChange: string;
  underlyingAPY: string;
  underlyingChange: string;
  fixedAPY: string;
  fixedChange: string;
}

export interface RateDataPoint {
  date: string;
  rate: number;
}

export interface Transaction {
  time: string;
  type: 'Borrow' | 'Repay' | 'Collateral';
  amount: string;
}