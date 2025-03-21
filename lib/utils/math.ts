// lib/utils/math.ts

/**
 * Calculate yield based on principal and APY
 * @param principal - The principal amount
 * @param apy - The annual percentage yield
 * @param days - The number of days to calculate yield for (default: 365)
 * @returns The calculated yield
 */
export function calculateYield(principal: number, apy: number, days = 365): number {
    return Math.floor(principal * (apy / 100) / 365 * days)
  }
  
  /**
   * Calculate Annual Percentage Rate (APR) from Annual Percentage Yield (APY)
   * @param apy - The annual percentage yield
   * @param compoundingPeriodsPerYear - Number of compounding periods per year
   * @returns The calculated APR
   */
  export function calculateAPRFromAPY(apy: number, compoundingPeriodsPerYear = 365): number {
    // Formula: APR = n * ((1 + APY)^(1/n) - 1)
    const apyDecimal = apy / 100
    const apr = compoundingPeriodsPerYear * (Math.pow(1 + apyDecimal, 1 / compoundingPeriodsPerYear) - 1)
    return apr * 100
  }
  
  /**
   * Calculate Annual Percentage Yield (APY) from Annual Percentage Rate (APR)
   * @param apr - The annual percentage rate
   * @param compoundingPeriodsPerYear - Number of compounding periods per year
   * @returns The calculated APY
   */
  export function calculateAPYFromAPR(apr: number, compoundingPeriodsPerYear = 365): number {
    // Formula: APY = (1 + APR/n)^n - 1
    const aprDecimal = apr / 100
    const apy = Math.pow(1 + aprDecimal / compoundingPeriodsPerYear, compoundingPeriodsPerYear) - 1
    return apy * 100
  }
  
  /**
   * Calculate the number of days between two dates
   * @param date1 - The first date
   * @param date2 - The second date
   * @returns The number of days between the two dates
   */
  export function daysBetween(date1: Date, date2: Date): number {
    const oneDay = 24 * 60 * 60 * 1000 // hours*minutes*seconds*milliseconds
    const diffDays = Math.round(Math.abs((date1.getTime() - date2.getTime()) / oneDay))
    return diffDays
  }
  
  /**
   * Calculate days remaining until maturity
   * @param maturityDate - The maturity date
   * @returns The number of days remaining until maturity
   */
  export function getDaysToMaturity(maturityDate: Date): number {
    const now = new Date()
    const diffTime = maturityDate.getTime() - now.getTime()
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)))
  }
  
  /**
   * Check if a vault is mature (past maturity date)
   * @param maturityDate - The maturity date
   * @returns Whether the vault is mature
   */
  export function isVaultMature(maturityDate: Date): boolean {
    const now = new Date()
    return now >= maturityDate
  }
  
  /**
   * Parse a string to a number, return 0 if invalid
   * @param value - The string to parse
   * @returns The parsed number or 0 if invalid
   */
  export function parseStringToNumber(value: string): number {
    const parsed = parseFloat(value)
    return isNaN(parsed) ? 0 : parsed
  }