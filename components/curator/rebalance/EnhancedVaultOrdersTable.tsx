// components/curator/rebalance/EnhancedVaultOrdersTable.tsx
'use client'

import React, { useState } from 'react'
import { ArrowUpDown, Plus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { VaultOrder } from '@/types/curator'
import TokenIcon from '@/components/shared/TokenIcon'
import { formatCurrency } from '@/lib/utils/format'
import { getOrderTypeBadgeVariant } from '@/lib/utils/curator'

interface EnhancedVaultOrdersTableProps {
  orders: VaultOrder[]
  onSelectOrder: (order: VaultOrder) => void
  selectedOrderId?: string
  filterTab?: string
}

export const EnhancedVaultOrdersTable: React.FC<EnhancedVaultOrdersTableProps> = ({
  orders,
  onSelectOrder,
  selectedOrderId,
  filterTab = 'all'
}) => {
  const router = useRouter()
  const [sortField, setSortField] = useState<string>('')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [hoveredColumn, setHoveredColumn] = useState<string | null>(null)

  // Sort orders based on field and direction
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  // Handle creating a new order by navigating to the range order page
  const handleCreateNewOrder = () => {
    router.push('/range-order')
  }

  // Filter and sort orders
  const getFilteredAndSortedOrders = () => {
    let filteredOrders = [...orders]
    
    // Filter by tab selection
    if (filterTab === 'lending') {
      filteredOrders = filteredOrders.filter(order => order.lendAPRRaw !== null && order.lendAPRRaw > 0)
    } else if (filterTab === 'borrowing') {
      filteredOrders = filteredOrders.filter(order => order.borrowAPRRaw !== null && order.borrowAPRRaw > 0)
    } else if (filterTab === 'two-way') {
      filteredOrders = filteredOrders.filter(order => order.orderType === 'Two Way')
    }
    
    // Sort by selected field
    if (sortField) {
      filteredOrders.sort((a, b) => {
        let valueA, valueB
        
        switch (sortField) {
          case 'borrowAPR':
            valueA = a.borrowAPRRaw || 0
            valueB = b.borrowAPRRaw || 0
            break
          case 'lendAPR':
            valueA = a.lendAPRRaw || 0
            valueB = b.lendAPRRaw || 0
            break
          case 'ltv':
            valueA = a.ltv
            valueB = b.ltv
            break
          case 'maturity':
            valueA = new Date(a.maturity).getTime()
            valueB = new Date(b.maturity).getTime()
            break
          case 'debtToken':
            valueA = `${a.debtToken}/${a.collateral}`
            valueB = `${b.debtToken}/${b.collateral}`
            break
          case 'allocatedAmount':
            valueA = a.allocatedAmount
            valueB = b.allocatedAmount
            break
          default:
            valueA = a[sortField as keyof VaultOrder]
            valueB = b[sortField as keyof VaultOrder]
        }
        
        if (valueA !== undefined && valueB !== undefined && valueA !== null && valueB !== null && valueA < valueB) {
          return sortDirection === 'asc' ? -1 : 1
        }
        if (valueA !== undefined && valueB !== undefined && valueA !== null && valueB !== null && valueA > valueB) {
          return sortDirection === 'asc' ? 1 : -1
        }
        return 0
      })
    }
    
    return filteredOrders
  }

  // Column header with tooltip
  const renderColumnHeader = (title: string, description: string, sortable: boolean = false, field?: string) => (
    <div 
      className="relative" 
      onMouseEnter={() => setHoveredColumn(title)}
      onMouseLeave={() => setHoveredColumn(null)}
    >
      {sortable ? (
        <div 
          className="flex items-center cursor-pointer justify-end" 
          onClick={() => field && handleSort(field)}
        >
          {title}
          <ArrowUpDown className={`ml-1 h-3 w-3 ${sortField === field ? 'text-[#5FBDE9]' : ''}`} />
        </div>
      ) : (
        <div className="text-right">{title}</div>
      )}
      
      {hoveredColumn === title && (
        <div className="absolute right-0 top-full mt-1 w-48 p-2 bg-[#0a1525] border border-[#1e2c3b] rounded text-xs text-gray-300 z-50 pointer-events-none shadow-lg">
          {description}
        </div>
      )}
    </div>
  )

  // Get filtered and sorted orders
  const filteredAndSortedOrders = getFilteredAndSortedOrders()

  return (
    <div className="bg-[#0c1624] border border-[#1e2c3b] rounded-lg overflow-hidden shadow-lg">
      {/* Header with Create New Order Button */}
      <div className="border-b border-[#1e2c3b] p-4 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Market Orders</h3>
        <Button 
          className="bg-[#2a4365] hover:bg-[#2c5282] text-white border-[#3182CE]/30 flex items-center gap-1.5"
          onClick={handleCreateNewOrder}
        >
          <Plus className="h-4 w-4" />
          Create New Order
        </Button>
      </div>
      
      {/* Filter tabs */}
      <div className="p-4 border-b border-[#1e2c3b]">
        <div className="inline-flex bg-[#0a1525] rounded-md border border-[#1e2c3b]">
          <Button 
            variant={filterTab === 'all' ? 'default' : 'ghost'} 
            size="sm"
            className={`rounded-none first:rounded-l-md ${filterTab === 'all' ? 'bg-[#2a4365] hover:bg-[#2c5282] text-white border-0' : 'text-gray-400 hover:text-white'}`}
            onClick={() => onSelectOrder({ filterTab: 'all' } as unknown as VaultOrder)}
          >
            All Markets
          </Button>
          <Button 
            variant={filterTab === 'lending' ? 'default' : 'ghost'} 
            size="sm"
            className={`rounded-none ${filterTab === 'lending' ? 'bg-[#2a4365] hover:bg-[#2c5282] text-white border-0' : 'text-gray-400 hover:text-white'}`}
            onClick={() => onSelectOrder({ filterTab: 'lending' } as unknown as VaultOrder)}
          >
            Lending
          </Button>
          <Button 
            variant={filterTab === 'borrowing' ? 'default' : 'ghost'} 
            size="sm"
            className={`rounded-none ${filterTab === 'borrowing' ? 'bg-[#2a4365] hover:bg-[#2c5282] text-white border-0' : 'text-gray-400 hover:text-white'}`}
            onClick={() => onSelectOrder({ filterTab: 'borrowing' } as unknown as VaultOrder)}
          >
            Borrowing
          </Button>
          <Button 
            variant={filterTab === 'two-way' ? 'default' : 'ghost'} 
            size="sm"
            className={`rounded-none last:rounded-r-md ${filterTab === 'two-way' ? 'bg-[#2a4365] hover:bg-[#2c5282] text-white border-0' : 'text-gray-400 hover:text-white'}`}
            onClick={() => onSelectOrder({ filterTab: 'two-way' } as unknown as VaultOrder)}
          >
            Two-Way
          </Button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            {/* Main Column Headers */}
            <tr className="text-xs text-gray-400 border-b border-[#1e2c3b]">
              <th className="px-4 py-3 text-left">Market</th>
              <th className="px-4 py-3 text-center" colSpan={2}>Current Interest Rate</th>
              <th className="px-4 py-3 text-center" colSpan={2}>Borrowing Metrics</th>
              <th className="px-4 py-3 text-center" colSpan={2}>Lending Metrics</th>
              <th className="px-4 py-3 text-center">Allocation</th>
            </tr>
            
            {/* Subheaders */}
            <tr className="text-xs text-gray-400 border-b border-[#1e2c3b] bg-[#081020]">
              <th className="px-4 py-2 text-left font-medium">
                {renderColumnHeader("Market", "Trading pair and maturity date", true, "debtToken")}
              </th>
              <th className="px-4 py-2 text-right font-medium">
                {renderColumnHeader("Borrow APR", "Annual percentage rate for borrowing", true, "borrowAPR")}
              </th>
              <th className="px-4 py-2 text-right font-medium">
                {renderColumnHeader("Lend APR", "Annual percentage rate for lending", true, "lendAPR")}
              </th>
              <th className="px-4 py-2 text-right font-medium">
                {renderColumnHeader("Available", "Amount available to withdraw from the market", false)}
              </th>
              <th className="px-4 py-2 text-right font-medium">
                {renderColumnHeader("Capacity", "Maximum amount available for borrowing", false)}
              </th>
              <th className="px-4 py-2 text-right font-medium">
                {renderColumnHeader("Claimable", "Amount you can claim from this market", false)}
              </th>
              <th className="px-4 py-2 text-right font-medium">
                {renderColumnHeader("Capacity", "Maximum amount available for lending", false)}
              </th>
              <th className="px-4 py-2 text-right font-medium">
                {renderColumnHeader("Allocation", "Percentage of vault funds allocated to this market", true, "allocatedAmount")}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedOrders.map((order, index) => (
              <tr 
                key={order.id} 
                className={`text-sm border-b border-[#1e2c3b] transition-colors cursor-pointer
                  ${index % 2 === 0 ? 'bg-[#0a1525]/30' : ''}
                  ${selectedOrderId === order.id ? 'bg-[#0a1525]' : ''}
                  hover:bg-[#1e2c3b] hover:shadow-inner
                `}
                onClick={() => onSelectOrder(order)}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex -space-x-2">
                      <TokenIcon symbol={order.debtToken} size="sm" />
                      <TokenIcon symbol={order.collateral} size="sm" className="border-2 border-[#081020]" />
                    </div>
                    <div>
                      <div className="font-medium text-white">
                        {order.debtToken}/{order.collateral}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={`bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs`} variant={getOrderTypeBadgeVariant(order.orderType) as "default" | "primary" | "destructive" | "outline" | "secondary" | "purple" | "success" | "warning" | "info" | null | undefined}>
                          {order.orderType}
                        </Badge>
                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                          LTV: {order.ltv.toFixed(2)}
                        </Badge>
                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                          {order.maturity}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-right text-[#3182CE] font-medium">
                  {order.borrowAPR || '-'}
                </td>
                <td className="px-4 py-3 text-right text-[#5FBDE9] font-medium">
                  {order.lendAPR || '-'}
                </td>
                <td className="px-4 py-3 text-right text-white">
                  {formatCurrency(order.reservedAssets?.xt || 0)}
                </td>
                <td className="px-4 py-3 text-right text-white">
                  {formatCurrency(order.maxCapacity / 2)}
                </td>
                <td className="px-4 py-3 text-right text-white">
                  {formatCurrency(order.reservedAssets?.ft || 0)}
                </td>
                <td className="px-4 py-3 text-right text-white">
                  {formatCurrency(order.maxCapacity)}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end">
                    <span className="text-[#5FBDE9] font-medium">{order.allocationPercentage.toFixed(1)}%</span>
                    <div className="ml-2 w-16 bg-[#0a1525] h-1.5 rounded-full">
                      <div 
                        className="bg-[#5FBDE9] h-1.5 rounded-full"
                        style={{ width: `${order.allocationPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
            
            {filteredAndSortedOrders.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-400">
                  No orders found for the selected filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination or Show More */}
      <div className="p-4 flex justify-between items-center border-t border-[#1e2c3b]">
        <span className="text-xs text-gray-400">
          Showing {filteredAndSortedOrders.length} of {orders.length} markets
        </span>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs border-[#1e2c3b] text-gray-400 hover:text-white"
          onClick={handleCreateNewOrder}
        >
          View All Markets
        </Button>
      </div>
    </div>
  )
}

export default EnhancedVaultOrdersTable