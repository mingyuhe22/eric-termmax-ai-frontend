// types/vault.ts
export interface MarketConfig {
  contracts: {
    routerAddr: string
    marketAddr: string
    underlyingAddr: string
    collateralAddr: string
    ftAddr: string
    xtAddr: string
    gtAddr: string
  }
  symbol: string
  isFixed: boolean
  openTime: string
  maturity: string
  treasurer: string
  defaultFeeConfig: {
    lendTakerFeeRatio: string
    lendMakerFeeRatio: string
    borrowTakerFeeRatio: string
    borrowMakerFeeRatio: string
    issueFtFeeRatio: string
    issueFtFeeRef: string
    redeemFeeRatio: string
  }
}

export interface AssetConfig {
  type: string
  contractAddress: string
  icon: string
  name: string
  displayName: string
  issuer: string
  symbol: string
  decimals: number
}

export interface GTConfig {
  contractAddress: string
  icon: string
  name: string
  displayName: string
  issuer: string
  symbol: string
  maxLtv: string
  liquidationLtv: string
  liquidatable: boolean
  oracleAddress: string
}

export interface MarketAllocation {
  market: string;
  allocation: number;
  supply: number;
  cap: number;
  apy: number;
}

export interface VaultTransaction {
  timestamp: Date;
  type: string;
  amount: number;
  displayAmount: string;
  user: string;
  hash: string;
}

export interface Vault {
  id: string
  name: string
  address: string
  routerAddress: string
  underlyingAddress: string
  collateralAddress: string
  symbol: string
  maturity: Date
  tvl: number
  apy: number
  icon: string
  isFixed: boolean
  openTime: Date
  contracts: {
    routerAddr: string
    marketAddr: string
    underlyingAddr: string
    collateralAddr: string
    ftAddr: string
    xtAddr: string
    gtAddr: string
  }
  // 附加屬性
  chain?: string
  apr7d?: number
  apr30d?: number
  ltv?: number
  curator?: string
  performanceFee?: number
  idleFunds?: number
  redeemableAmount?: number
  userPosition?: number
  baseYield?: number
  protocolIncentives?: number
  tradingFees?: number
  marketAllocation?: MarketAllocation[];
  transactions?: VaultTransaction[];
  riskMetrics?: {
    riskLevel: string
    volatility: string
    protocolDiversity: string
    impermanentLossProtection: string
    smartContractAudits: number
    insuranceCoverage: string
    governanceRisk: string
  }
}

export interface UserPosition {
  vaultAddress: string
  tokenAddress: string
  balance: string
  decimals: number
  symbol: string
}