// components/curator/VaultOrdersTable.tsx
'use client'

import React, { useState } from 'react'
import { ArrowUpDown } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface OrderData {
  id: string
  orderType: string
  debtToken: string
  collateral: string
  maturity: string
  ltv: number
  borrowAPR: string
  borrowAPRRaw: number
  lendAPR: string
  lendAPRRaw: number
  availableToWithdraw: string
  healthFactor: string
  borrowingCapacity: string
  claimable: string
  lendingCapacity: string
}

interface VaultOrdersTableProps {
  orders: OrderData[]
  onSelectOrder: (order: OrderData) => void
  selectedOrderId?: string
  filterTab?: string
}

export default function VaultOrdersTable({
  orders,
  onSelectOrder,
  selectedOrderId,
  filterTab = 'all'
}: VaultOrdersTableProps) {
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

  // Filter and sort orders
  const getFilteredAndSortedOrders = () => {
    let filteredOrders = [...orders]
    
    // Filter by tab selection
    if (filterTab === 'lending') {
      filteredOrders = filteredOrders.filter(order => parseFloat(order.lendAPR) > 0)
    } else if (filterTab === 'borrowing') {
      filteredOrders = filteredOrders.filter(order => parseFloat(order.borrowAPR) > 0)
    } else if (filterTab === 'two-way') {
      filteredOrders = filteredOrders.filter(order => order.orderType === 'Two Way')
    }
    
    // Sort by selected field
    if (sortField) {
      filteredOrders.sort((a, b) => {
        let valueA, valueB
        
        switch (sortField) {
          case 'borrowAPR':
            valueA = a.borrowAPRRaw
            valueB = b.borrowAPRRaw
            break
          case 'lendAPR':
            valueA = a.lendAPRRaw
            valueB = b.lendAPRRaw
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
          default:
            valueA = a[sortField as keyof OrderData]
            valueB = b[sortField as keyof OrderData]
        }
        
        if (valueA !== undefined && valueB !== undefined && valueA < valueB) {
          return sortDirection === 'asc' ? -1 : 1
        }
        if (valueA !== undefined && valueB !== undefined && valueA > valueB) {
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
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          {/* Main Column Headers */}
          <tr className="text-xs text-gray-400 border-b border-[#1e2c3b]">
            <th className="px-4 py-3 text-left">Market</th>
            <th className="px-4 py-3 text-center" colSpan={2}>Current Interest Rate</th>
            <th className="px-4 py-3 text-center" colSpan={2}>Borrowing Metrics</th>
            <th className="px-4 py-3 text-center" colSpan={2}>Lending Metrics</th>
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
                <div className="font-medium text-white">
                  {order.debtToken}/{order.collateral}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                    {order.orderType}
                  </Badge>
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                    LTV: {order.ltv.toFixed(2)}
                  </Badge>
                </div>
              </td>
              <td className="px-4 py-3 text-right text-[#3182CE] font-medium">{order.borrowAPR}</td>
              <td className="px-4 py-3 text-right text-[#5FBDE9] font-medium">{order.lendAPR}</td>
              <td className="px-4 py-3 text-right text-white">{order.availableToWithdraw}</td>
              <td className="px-4 py-3 text-right text-white">{order.borrowingCapacity}</td>
              <td className="px-4 py-3 text-right text-white">{order.claimable}</td>
              <td className="px-4 py-3 text-right text-white">{order.lendingCapacity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}