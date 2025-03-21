// lib/mock/dashboard-data.ts

/**
 * Types for position data
 */
export interface PositionAsset {
    symbol: string
    value: number
    formattedValue: string
    amount: number
    icon?: string
  }
  
  export interface MaturityInfo {
    date: string
    days: number
    status: 'active' | 'expired' | 'upcoming'
  }
  
  export interface HealthInfo {
    value: number
    ltv: number
    status: 'safe' | 'warning' | 'critical'
  }
  
  export interface Position {
    id: string
    type: 'lend' | 'borrow'
    asset: PositionAsset
    collateral: PositionAsset
    maturity: MaturityInfo
    healthFactor?: HealthInfo
    value: number
    formattedValue: string
    isExpanded?: boolean
    leverage?: number
  }
  
  export interface PortfolioStats {
    totalValue: number
    totalLendValue: number
    totalBorrowValue: number
    netApy: number
    maturedPositions: number
    atRiskPositions: number
  }
  
  /**
   * Generate mock lending positions
   */
  export const getMockLendPositions = (): Position[] => [
    {
      id: 'lend-1',
      type: 'lend',
      asset: {
        symbol: 'FT',
        value: 9930,
        formattedValue: '$9.93K',
        amount: 10.07
      },
      collateral: {
        symbol: 'ARB',
        value: 9930,
        formattedValue: '$9.93K',
        amount: 8200
      },
      maturity: {
        date: '25 Apr, 2025',
        days: 36,
        status: 'active'
      },
      value: 10070,
      formattedValue: '$10.07K',
      isExpanded: false
    },
    {
      id: 'lend-2',
      type: 'lend',
      asset: {
        symbol: 'FT',
        value: 2450,
        formattedValue: '$2.45K',
        amount: 2.68
      },
      collateral: {
        symbol: 'WBTC',
        value: 2450,
        formattedValue: '$2.45K',
        amount: 0.06
      },
      maturity: {
        date: '15 Jun, 2025',
        days: 87,
        status: 'active'
      },
      value: 2680,
      formattedValue: '$2.68K',
      isExpanded: false
    },
    {
      id: 'lend-3',
      type: 'lend',
      asset: {
        symbol: 'FT',
        value: 4320,
        formattedValue: '$4.32K',
        amount: 4.56
      },
      collateral: {
        symbol: 'USDC',
        value: 4320,
        formattedValue: '$4.32K',
        amount: 4320
      },
      maturity: {
        date: '20 Mar, 2025',
        days: 0,
        status: 'expired'
      },
      value: 4560,
      formattedValue: '$4.56K',
      isExpanded: false
    }
  ]
  
  /**
   * Generate mock borrowing positions
   */
  export const getMockBorrowPositions = (): Position[] => [
    {
      id: 'borrow-1',
      type: 'borrow',
      asset: {
        symbol: 'WETH',
        value: 17430,
        formattedValue: '$17.43K',
        amount: 7.925
      },
      collateral: {
        symbol: 'PT-weETH-26JUN2025',
        value: 19980,
        formattedValue: '$19.98K',
        amount: 8.513
      },
      maturity: {
        date: '25 Apr, 2025',
        days: 36,
        status: 'active'
      },
      healthFactor: {
        value: 1.06,
        ltv: 0.89,
        status: 'critical'
      },
      value: 2200,
      formattedValue: '$2.20K',
      isExpanded: false
    },
    {
      id: 'borrow-2',
      type: 'borrow',
      asset: {
        symbol: 'WETH',
        value: 167680,
        formattedValue: '$167.68K',
        amount: 76.22
      },
      collateral: {
        symbol: 'PT-weETH-26JUN2025',
        value: 189200,
        formattedValue: '$189.20K',
        amount: 82.261
      },
      maturity: {
        date: '25 Apr, 2025',
        days: 36,
        status: 'active'
      },
      healthFactor: {
        value: 1.06,
        ltv: 0.89,
        status: 'critical'
      },
      value: 22010,
      formattedValue: '$22.01K',
      isExpanded: false,
      leverage: 4.5
    },
    {
      id: 'borrow-3',
      type: 'borrow',
      asset: {
        symbol: 'WETH',
        value: 184820,
        formattedValue: '$184.82K',
        amount: 84.009
      },
      collateral: {
        symbol: 'PT-wstETH-26JUN2025',
        value: 250000,
        formattedValue: '$250.00K',
        amount: 100
      },
      maturity: {
        date: '25 Apr, 2025',
        days: 36,
        status: 'active'
      },
      healthFactor: {
        value: 1.27,
        ltv: 0.74,
        status: 'warning'
      },
      value: 65630,
      formattedValue: '$65.63K',
      isExpanded: false
    },
    {
      id: 'borrow-4',
      type: 'borrow',
      asset: {
        symbol: 'WETH',
        value: 65190,
        formattedValue: '$65.19K',
        amount: 29.633
      },
      collateral: {
        symbol: 'PT-wstETH-26JUN2025',
        value: 75000,
        formattedValue: '$75.00K',
        amount: 30
      },
      maturity: {
        date: '25 Apr, 2025',
        days: 36,
        status: 'active'
      },
      healthFactor: {
        value: 1.08,
        ltv: 0.87,
        status: 'critical'
      },
      value: 9970,
      formattedValue: '$9.97K',
      isExpanded: false
    },
    {
      id: 'borrow-5',
      type: 'borrow',
      asset: {
        symbol: 'WETH',
        value: 15990,
        formattedValue: '$15.99K',
        amount: 7.267
      },
      collateral: {
        symbol: 'PT-wstETH-26JUN2025',
        value: 25000,
        formattedValue: '$25.00K',
        amount: 10
      },
      maturity: {
        date: '25 Apr, 2025',
        days: 36,
        status: 'active'
      },
      healthFactor: {
        value: 1.47,
        ltv: 0.64,
        status: 'warning'
      },
      value: 9050,
      formattedValue: '$9.05K',
      isExpanded: false
    }
  ]
  
  /**
   * Generate mock portfolio stats based on positions
   */
  export const getMockPortfolioStats = (lendPositions: Position[], borrowPositions: Position[]): PortfolioStats => {
    const lendValue = lendPositions.reduce((sum, pos) => sum + pos.value, 0)
    const borrowValue = borrowPositions.reduce((sum, pos) => sum + pos.value, 0)
    
    return {
      totalValue: lendValue + borrowValue,
      totalLendValue: lendValue,
      totalBorrowValue: borrowValue,
      netApy: 7.82, // Mock APY
      maturedPositions: lendPositions.filter(p => p.maturity.status === 'expired').length,
      atRiskPositions: borrowPositions.filter(p => p.healthFactor?.status === 'critical').length
    }
  }
  
  /**
   * Get all mock positions
   */
  export const getAllMockPositions = (): Position[] => {
    return [...getMockLendPositions(), ...getMockBorrowPositions()]
  }
  
  /**
   * Calculate squeeze metrics for selected positions
   */
  export const calculateSqueezeMetrics = (positions: Position[], selectedIds: string[]) => {
    const selectedPositions = positions.filter(p => selectedIds.includes(p.id))
    
    if (selectedPositions.length === 0) return null
    
    const totalDebt = selectedPositions.reduce((sum, p) => sum + p.asset.value, 0)
    const totalCollateral = selectedPositions.reduce((sum, p) => sum + p.collateral.value, 0)
    const ltv = totalDebt / totalCollateral
    const healthFactor = 1 / ltv
    
    let status: 'safe' | 'warning' | 'critical' = 'safe'
    if (healthFactor < 1.2) status = 'critical'
    else if (healthFactor < 1.5) status = 'warning'
    
    return {
      debt: totalDebt,
      collateral: totalCollateral,
      ltv,
      healthFactor,
      status
    }
  }