// components/range-order/OrderDataTable.tsx
'use client'

import React, { useState, useCallback } from 'react'
import { Info, ArrowUpDown, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
  // Optional curve data for editing
  lendPoints?: Array<{amount: string, percentage: number, apr: number}>
  borrowPoints?: Array<{amount: string, percentage: number, apr: number}>
}

interface OrderDataTableProps {
  orders?: OrderData[]
  onSelectOrder?: (order: OrderData) => void
  selectedOrderId?: string
}

export default function OrderDataTable({ 
  orders: initialOrders, 
  onSelectOrder,
  selectedOrderId 
}: OrderDataTableProps) {
  // If no orders are provided, use sample data
  const sampleOrders: OrderData[] = [
    {
      id: "1",
      orderType: "Two Way",
      debtToken: "pufETH",
      collateral: "PT-pufETH",
      maturity: "Mar 24, 2025",
      ltv: 0.94,
      borrowAPR: "6.32%",
      borrowAPRRaw: 6.32,
      lendAPR: "7.38%",
      lendAPRRaw: 7.38,
      availableToWithdraw: "220,000",
      healthFactor: "-",
      borrowingCapacity: "1,980,000",
      claimable: "220,000",
      lendingCapacity: "220,000",
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
      id: "2",
      orderType: "Two Way",
      debtToken: "WETH",
      collateral: "weETH",
      maturity: "Apr 25, 2025",
      ltv: 0.94,
      borrowAPR: "2.1%",
      borrowAPRRaw: 2.1,
      lendAPR: "4.2%",
      lendAPRRaw: 4.2,
      availableToWithdraw: "220,000",
      healthFactor: "-",
      borrowingCapacity: "1,980,000",
      claimable: "220,000",
      lendingCapacity: "220,000",
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
    },
    {
      id: "3",
      orderType: "Two Way",
      debtToken: "USDC",
      collateral: "USUALUS",
      maturity: "Apr 25, 2025",
      ltv: 0.80,
      borrowAPR: "5%",
      borrowAPRRaw: 5,
      lendAPR: "10%",
      lendAPRRaw: 10,
      availableToWithdraw: "500,000,000",
      healthFactor: "-",
      borrowingCapacity: "4,500,000,000",
      claimable: "500,000,000",
      lendingCapacity: "500,000,000",
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
      id: "4",
      orderType: "Two Way",
      debtToken: "USDC",
      collateral: "wstETH",
      maturity: "Apr 25, 2025",
      ltv: 0.85,
      borrowAPR: "5.12%",
      borrowAPRRaw: 5.12,
      lendAPR: "10.24%",
      lendAPRRaw: 10.24,
      availableToWithdraw: "500,000,000",
      healthFactor: "-",
      borrowingCapacity: "4,500,000,000",
      claimable: "500,000,000",
      lendingCapacity: "500,000,000",
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
    },
    {
      id: "5",
      orderType: "Two Way",
      debtToken: "USDC",
      collateral: "eUSDe",
      maturity: "Apr 25, 2025",
      ltv: 0.94,
      borrowAPR: "7.5%",
      borrowAPRRaw: 7.5,
      lendAPR: "15%",
      lendAPRRaw: 15,
      availableToWithdraw: "500,000,000",
      healthFactor: "-",
      borrowingCapacity: "4,500,000,000",
      claimable: "500,000,000",
      lendingCapacity: "500,000,000",
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
      id: "6",
      orderType: "Two Way",
      debtToken: "USDT",
      collateral: "PT-sUSDe",
      maturity: "May 30, 2025",
      ltv: 0.90,
      borrowAPR: "6.57%",
      borrowAPRRaw: 6.57,
      lendAPR: "8.61%",
      lendAPRRaw: 8.61,
      availableToWithdraw: "500,000,000",
      healthFactor: "-",
      borrowingCapacity: "4,500,000,000",
      claimable: "500,000,000",
      lendingCapacity: "500,000,000",
      lendPoints: [
        { amount: '0', percentage: 0, apr: 45 },
        { amount: '900000', percentage: 23.1, apr: 19 },
        { amount: '3400000', percentage: 87.1, apr: 35 },
        { amount: '3900000', percentage: 100, apr: 45 }
      ],
      borrowPoints: [
        { amount: '0', percentage: 0, apr: 35 },
        { amount: '450000', percentage: 11.5, apr: 15 },
        { amount: '2800000', percentage: 71.8, apr: 12 },
        { amount: '3900000', percentage: 100, apr: 8 }
      ]
    }
  ];

  const [orders] = useState<OrderData[]>(initialOrders || sampleOrders);
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [activeTab, setActiveTab] = useState<string>('all');
  const [, setHoveredOrder] = useState<string | null>(null);
  const [hoveredColumn, setHoveredColumn] = useState<string | null>(null);

  // Sort orders based on field and direction
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter and sort orders
  const getFilteredAndSortedOrders = useCallback(() => {
    let filteredOrders = [...orders];
    
    // Filter by tab selection
    if (activeTab === 'lending') {
      filteredOrders = filteredOrders.filter(order => parseFloat(order.lendAPR) > 0);
    } else if (activeTab === 'borrowing') {
      filteredOrders = filteredOrders.filter(order => parseFloat(order.borrowAPR) > 0);
    } else if (activeTab === 'two-way') {
      filteredOrders = filteredOrders.filter(order => order.orderType === 'Two Way');
    }
    
    // Sort by selected field
    if (sortField) {
      filteredOrders.sort((a, b) => {
        let valueA, valueB;
        
        switch (sortField) {
          case 'borrowAPR':
            valueA = a.borrowAPRRaw;
            valueB = b.borrowAPRRaw;
            break;
          case 'lendAPR':
            valueA = a.lendAPRRaw;
            valueB = b.lendAPRRaw;
            break;
          case 'ltv':
            valueA = a.ltv;
            valueB = b.ltv;
            break;
          case 'maturity':
            valueA = new Date(a.maturity).getTime();
            valueB = new Date(b.maturity).getTime();
            break;
          case 'debtToken':
            valueA = `${a.debtToken}/${a.collateral}`;
            valueB = `${b.debtToken}/${b.collateral}`;
            break;
          default:
            valueA = a[sortField as keyof OrderData];
            valueB = b[sortField as keyof OrderData];
        }
        
        if (valueA !== undefined && valueB !== undefined && valueA < valueB) {
          return sortDirection === 'asc' ? -1 : 1;
        }
        if (valueA !== undefined && valueB !== undefined && valueA > valueB) {
          return sortDirection === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return filteredOrders;
  }, [orders, activeTab, sortField, sortDirection]);

  // Memoize the filtered and sorted orders to avoid unnecessary recalculations
  const filteredAndSortedOrders = getFilteredAndSortedOrders();
  
  // Helper function to format the date consistently
  const formatDate = (dateString: string) => {
    // Check if already in the correct format
    if (dateString.includes(',')) return dateString;
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

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
  );

  return (
    <div className="mt-8 bg-[#0c1624] border border-[#1e2c3b] rounded-lg overflow-hidden">
      {/* Section Header */}
      <div className="border-b border-[#1e2c3b] p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-white">Market Orders</h3>
          <div className="relative group">
            <Info className="h-4 w-4 text-gray-400 cursor-pointer hover:text-white" />
            <div className="absolute left-0 bottom-full mb-2 w-60 p-2 bg-[#0a1525] border border-[#1e2c3b] rounded text-xs text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none shadow-lg">
              View and manage all available market orders with current interest rates and capacity.
            </div>
          </div>
        </div>
        
        <div className="inline-flex bg-[#0a1525] rounded-md border border-[#1e2c3b]">
          <Button 
            variant={activeTab === 'all' ? 'default' : 'ghost'} 
            size="sm"
            className={`rounded-none first:rounded-l-md ${activeTab === 'all' ? 'bg-[#5FBDE9] hover:bg-[#3ba7d9] text-white border-0' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setActiveTab('all')}
          >
            All Markets
          </Button>
          <Button 
            variant={activeTab === 'lending' ? 'default' : 'ghost'} 
            size="sm"
            className={`rounded-none ${activeTab === 'lending' ? 'bg-[#5FBDE9] hover:bg-[#3ba7d9] text-white border-0' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setActiveTab('lending')}
          >
            Lending
          </Button>
          <Button 
            variant={activeTab === 'borrowing' ? 'default' : 'ghost'} 
            size="sm"
            className={`rounded-none ${activeTab === 'borrowing' ? 'bg-[#5FBDE9] hover:bg-[#3ba7d9] text-white border-0' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setActiveTab('borrowing')}
          >
            Borrowing
          </Button>
          <Button 
            variant={activeTab === 'two-way' ? 'default' : 'ghost'} 
            size="sm"
            className={`rounded-none last:rounded-r-md ${activeTab === 'two-way' ? 'bg-[#5FBDE9] hover:bg-[#3ba7d9] text-white border-0' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setActiveTab('two-way')}
          >
            Two-Way
          </Button>
        </div>
      </div>
      
      {/* Table */}
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
                onClick={() => onSelectOrder && onSelectOrder(order)}
                onMouseEnter={() => setHoveredOrder(order.id)}
                onMouseLeave={() => setHoveredOrder(null)}
              >
                <td className="px-4 py-3">
                  <div className="font-medium text-white">
                    {order.debtToken}/{order.collateral}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                      {order.orderType}
                    </Badge>
                    <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">
                      {formatDate(order.maturity)}
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
      
      {/* Pagination or Show More */}
      <div className="p-4 flex justify-between items-center border-t border-[#1e2c3b]">
        <span className="text-xs text-gray-400">
          Showing {filteredAndSortedOrders.length} of {orders.length} markets
        </span>
        
        <Button variant="outline" size="sm" className="text-xs border-[#1e2c3b] text-gray-400 flex items-center gap-1">
          View All Markets
          <ExternalLink className="h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}