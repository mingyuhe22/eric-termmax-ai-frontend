// types/vault.ts

/**
 * Market configuration from the API
 */
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
  
  /**
   * Asset configuration from the API
   */
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
  
  /**
   * Gearing Token (GT) configuration
   */
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
  
  /**
   * Risk metrics for a vault
   */
  export interface RiskMetrics {
    riskLevel: string
    volatility: string
    protocolDiversity: string
    impermanentLossProtection: string
    smartContractAudits: number
    insuranceCoverage: string
    governanceRisk: string
  }
  
  /**
   * Market allocation for a vault
   */
  export interface MarketAllocation {
    market: string
    allocation: number
    supply: number
    cap: number
    apy: number
  }
  
  /**
   * Transaction in a vault
   */
  export interface VaultTransaction {
    timestamp: Date
    type: string
    amount: number
    displayAmount: string
    user: string
    hash: string
  }
  
  /**
   * User position in a vault
   */
  export interface UserPosition {
    vaultAddress: string
    tokenAddress: string
    balance: string
    decimals: number
    symbol: string
  }
  
  /**
   * Main Vault interface
   */
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
    // Additional properties
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
    marketAllocation?: MarketAllocation[]
    transactions?: VaultTransaction[]
    riskMetrics?: RiskMetrics
  }