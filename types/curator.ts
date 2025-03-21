// types/curator.ts

export interface VaultOrder {
    id: string
    orderType: 'Lend' | 'Borrow' | 'Two Way'
    debtToken: string
    collateral: string
    maturity: string
    ltv: number
    borrowAPR: string | null
    borrowAPRRaw: number | null
    lendAPR: string | null
    lendAPRRaw: number | null
    allocatedAmount: number
    allocationPercentage: number
    maxCapacity: number
    borrowPoints?: unknown[]
    lendPoints?: unknown[]
    reservedAssets?: {
      xt: number
      ft: number
    }
  }
  
  export interface RebalanceMetrics {
    totalVaultValue: number
    allocatedValue: number
    unallocatedValue: number
    averageAPY: number
  }
  
  export interface CuratorVault extends CuratorVaultBase {
    marketAllocation?: MarketAllocation[]
    orders?: VaultOrder[]
    transactions?: VaultTransaction[]
    riskMetrics?: RiskMetrics
  }
  
  export interface CuratorVaultBase {
    address: string
    name: string
    tvl: number
    availableLiquidity?: number
    notionalValue?: number
    apy: number
    status: string
    creator: string
    strategy: string
    token: string
    debtToken?: string
    maturity: string
    lastActivity: string
    description?: string
    idleFunds?: number
    redeemableAmount?: number
    performanceFee?: number
  }
  
  export interface MarketAllocation {
    market: string
    allocation: number
    supply: number
    cap: number
    apy: number
  }
  
  export interface VaultTransaction {
    timestamp: Date
    type: string
    amount: number
    displayAmount: string
    user: string
    hash: string
  }
  
  export interface RiskMetrics {
    riskLevel: string
    volatility: string
    protocolDiversity: string
    impermanentLossProtection: string
    smartContractAudits: number
    insuranceCoverage: string
    governanceRisk: string
  }
  
  export interface PendingRequest {
    id: string
    type: string
    name: string
    market: string
    newValue: string
    validAt: string
    currentValue?: string
    status: 'unlocked' | 'locked' | 'pending'
  }
  
  export interface WhitelistedMarket {
    id: string
    market: string
    collateral: string
    debt: string
    maturity: string
    lltv: number
    maxLtv: number
  }

