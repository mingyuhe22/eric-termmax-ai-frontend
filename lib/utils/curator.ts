// lib/utils/curator.ts
import { VaultOrder, CuratorVault, RebalanceMetrics } from '@/types/curator'

/**
 * Calculates the amount allocated based on percentage and total value
 */
export function calculateAllocationAmount(percentage: number, totalValue: number): number {
  return (percentage / 100) * totalValue
}

/**
 * Calculates the total allocation percentage for a list of orders
 */
export function calculateTotalAllocationPercentage(orders: VaultOrder[]): number {
  return orders.reduce((total, order) => total + order.allocationPercentage, 0)
}

/**
 * Calculates the weighted average APY based on allocated percentages
 */
export function calculateWeightedAverageAPY(orders: VaultOrder[]): number {
  let totalAllocation = 0
  const totalWeightedApy = orders.reduce((acc, order) => {
    totalAllocation += order.allocationPercentage
    
    const apy = order.orderType === 'Borrow' 
      ? order.borrowAPRRaw || 0 
      : order.orderType === 'Lend' 
        ? order.lendAPRRaw || 0 
        : ((order.lendAPRRaw || 0) + (order.borrowAPRRaw || 0)) / 2
    
    return acc + (apy * order.allocationPercentage / 100)
  }, 0)
  
  // Guard against division by zero
  return totalAllocation === 0 ? 0 : totalWeightedApy
}

/**
 * Updates the allocation percentages for a list of orders
 * If total exceeds 100%, adjusts other orders proportionally
 */
export function updateOrderAllocations(
  orders: VaultOrder[], 
  orderId: string, 
  newPercentage: number, 
  totalValue: number
): VaultOrder[] {
  const updatedOrders = orders.map(order => {
    if (order.id === orderId) {
      return {
        ...order,
        allocationPercentage: newPercentage,
        allocatedAmount: calculateAllocationAmount(newPercentage, totalValue)
      }
    }
    return order
  })
  
  // Calculate total allocation percentage
  const totalPercentage = calculateTotalAllocationPercentage(updatedOrders)
  
  // If total exceeds 100%, adjust other orders proportionally
  if (totalPercentage > 100) {
    const excessPercentage = totalPercentage - 100
    const otherOrders = updatedOrders.filter(o => o.id !== orderId)
    const totalOtherPercentage = otherOrders.reduce((total, order) => total + order.allocationPercentage, 0)
    
    // Adjust other orders proportionally
    updatedOrders.forEach(order => {
      if (order.id !== orderId && totalOtherPercentage > 0) {
        const reductionFactor = excessPercentage / totalOtherPercentage
        const newOrderPercentage = Math.max(0, order.allocationPercentage - (order.allocationPercentage * reductionFactor))
        order.allocationPercentage = newOrderPercentage
        order.allocatedAmount = calculateAllocationAmount(newOrderPercentage, totalValue)
      }
    })
  }
  
  return updatedOrders
}

/**
 * Calculates the vault metrics based on orders and adjustments
 */
export function calculateVaultMetrics(
  orders: VaultOrder[],
  currentMetrics: RebalanceMetrics,
  depositAmount: number = 0,
  withdrawAmount: number = 0
): RebalanceMetrics {
  // Calculate new total value
  const newTotalValue = currentMetrics.totalVaultValue + depositAmount - withdrawAmount
  
  // Calculate allocated value based on percentages
  const allocatedValue = orders.reduce(
    (sum, order) => sum + calculateAllocationAmount(order.allocationPercentage, newTotalValue),
    0
  )
  
  // Calculate new unallocated value
  const newUnallocatedValue = newTotalValue - allocatedValue
  
  // Calculate new average APY
  const newAverageAPY = calculateWeightedAverageAPY(orders)
  
  return {
    totalVaultValue: newTotalValue,
    unallocatedValue: newUnallocatedValue,
    allocatedValue: allocatedValue,
    averageAPY: newAverageAPY
  }
}

/**
 * Gets the badge variant based on order type
 * Returns a string suitable for the component's variant prop
 */
export function getOrderTypeBadgeVariant(orderType: string): string {
  switch (orderType) {
    case 'Lend':
      return 'primary'
    case 'Borrow':
      return 'purple'
    case 'Two Way':
      return 'success'
    default:
      return 'default'
  }
}

/**
 * Distributes funds to orders based on allocation percentages
 */
export function distributeVaultFunds(vault: CuratorVault, deposit: number = 0): CuratorVault {
  if (!vault.orders || vault.orders.length === 0) {
    return vault
  }
  
  const totalValue = vault.tvl + deposit
  const updatedOrders = vault.orders.map(order => {
    return {
      ...order,
      allocatedAmount: calculateAllocationAmount(order.allocationPercentage, totalValue)
    }
  })
  
  return {
    ...vault,
    tvl: totalValue,
    orders: updatedOrders
  }
}