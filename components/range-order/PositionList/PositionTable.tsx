// components/range-order/PositionList/PositionTable.tsx
'use client'

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Info } from 'lucide-react'
import { Position } from '@/lib/mock/range-order-mock-data'

interface PositionTableProps {
  positions: Position[]
  onSelectPosition: (position: Position) => void
  renderActions?: (position: Position) => React.ReactNode
  showBorrowColumns: boolean
  showLendColumns: boolean
  filterType?: 'all' | 'lend' | 'borrow' | 'two-way'
}

export default function PositionTable({
  positions,
  onSelectPosition,
  filterType = 'all'
}: PositionTableProps) {
  // 過濾位置
  const filteredPositions = () => {
    if (filterType === 'all') return positions;
    
    return positions.filter(position => {
      switch (filterType) {
        case 'lend':
          return position.orderType === 'Lend';
        case 'borrow':
          return position.orderType === 'Borrow';
        case 'two-way':
          return position.orderType === 'Two Way';
        default:
          return true;
      }
    });
  };

  // 將位置按類型分組
  const getPositionsByType = () => {
    const result = {
      lend: [] as Position[],
      borrow: [] as Position[],
      twoWay: [] as Position[]
    };
    
    filteredPositions().forEach(position => {
      if (position.orderType === 'Lend') {
        result.lend.push(position);
      } else if (position.orderType === 'Borrow') {
        result.borrow.push(position);
      } else if (position.orderType === 'Two Way') {
        result.twoWay.push(position);
      }
    });
    
    return result;
  };

  // 格式化 APY 數字
  const formatAPY = (apy: number | null) => {
    if (apy === null) return '-';
    return `${apy.toFixed(2)}%`;
  };

  // 格式化訂單狀態
  const formatOrderStatus = (matched: number | null, total: number | null) => {
    if (matched === null || total === null || total === 0) return '-';
    const percentage = Math.round((matched / total) * 100);
    return `${matched.toLocaleString()}/${total.toLocaleString()} (${percentage}%)`;
  };

  // 獲取分組數據
  const { lend, borrow, twoWay } = getPositionsByType();
  
  // 渲染市場名稱和標籤
  const renderMarketCell = (position: Position) => (
    <td className="px-4 py-3">
      <div className="font-medium text-white">
        {position.debtToken}/{position.collateral}
      </div>
      <div className="flex items-center gap-2 mt-1">
        <Badge className={`text-xs ${position.orderType === 'Lend' ? 'bg-[#2a4365]/20 text-blue-400' : position.orderType === 'Borrow' ? 'bg-[#5FBDE9]/20 text-[#5FBDE9]' : 'bg-[#2a4365]/20 text-purple-400'}`}>
          {position.orderType}
        </Badge>
        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">
          {new Date(position.maturity).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </Badge>
        <Badge className={`text-xs ${position.isActive ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
          {position.isActive ? 'Active' : 'Expired'}
        </Badge>
        <Badge className="text-xs bg-blue-500/20 text-blue-400 border-blue-500/30">
          LTV: {position.ltv.toFixed(2)}
        </Badge>
      </div>
    </td>
  );

  return (
    <div className="space-y-8">
      {/* Lend Positions Table */}
      {lend.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-white mb-3">Lend Positions</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-gray-400 border-b border-[#1e2c3b] bg-[#081020]">
                  <th className="px-4 py-2 text-left font-medium">Market</th>
                  <th className="px-4 py-2 text-center font-medium">Lend APY</th>
                  <th className="px-4 py-2 text-center font-medium">Avg. Match APY</th>
                  <th className="px-4 py-2 text-center font-medium">Lend Order Status</th>
                  <th className="px-4 py-2 text-right font-medium">Redeemable</th>
                </tr>
              </thead>
              <tbody>
                {lend.map((position, index) => (
                  <tr 
                    key={position.id} 
                    className={`text-sm border-b border-[#1e2c3b] transition-colors cursor-pointer
                      ${index % 2 === 0 ? 'bg-[#0a1525]/30' : ''}
                      hover:bg-[#1e2c3b] hover:shadow-inner
                    `}
                    onClick={() => onSelectPosition(position)}
                  >
                    {renderMarketCell(position)}
                    
                    {/* Lend APR */}
                    <td className="px-4 py-3 text-center">
                      {position.lendAPRRaw ? (
                        <span className="text-[#5FBDE9] font-medium">{formatAPY(position.lendAPRRaw)}</span>
                      ) : "-"}
                    </td>
                    
                    {/* Avg Match APY (Lend) */}
                    <td className="px-4 py-3 text-center">
                      {position.lendMatchAPY !== null ? (
                        <span className="text-green-400 font-medium">{formatAPY(position.lendMatchAPY)}</span>
                      ) : "-"}
                    </td>
                    
                    {/* Lend Order Status */}
                    <td className="px-4 py-3 text-center text-white">
                      {formatOrderStatus(position.lendMatchedAmt, position.lendTotalAmt)}
                    </td>
                    
                    {/* Redeemable */}
                    <td className="px-4 py-3 text-right text-white">
                      {!position.isActive && position.redeemable !== null && position.redeemable > 0 ? 
                        position.redeemable.toLocaleString() : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Borrow Positions Table */}
      {borrow.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-white mb-3">Borrow Positions</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-gray-400 border-b border-[#1e2c3b] bg-[#081020]">
                  <th className="px-4 py-2 text-left font-medium">Market</th>
                  <th className="px-4 py-2 text-center font-medium">Borrow APY</th>
                  <th className="px-4 py-2 text-center font-medium">Avg. Match APY</th>
                  <th className="px-4 py-2 text-center font-medium">Borrow Order Status</th>
                  <th className="px-4 py-2 text-center font-medium">
                    <div className="flex items-center justify-center">
                      <span>Health Factor</span>
                      <Info className="ml-1 h-3 w-3 text-gray-500" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {borrow.map((position, index) => (
                  <tr 
                    key={position.id} 
                    className={`text-sm border-b border-[#1e2c3b] transition-colors cursor-pointer
                      ${index % 2 === 0 ? 'bg-[#0a1525]/30' : ''}
                      hover:bg-[#1e2c3b] hover:shadow-inner
                    `}
                    onClick={() => onSelectPosition(position)}
                  >
                    {renderMarketCell(position)}
                    
                    {/* Borrow APR */}
                    <td className="px-4 py-3 text-center">
                      {position.borrowAPRRaw ? (
                        <span className="text-[#3182CE] font-medium">{formatAPY(position.borrowAPRRaw)}</span>
                      ) : "-"}
                    </td>
                    
                    {/* Avg Match APY (Borrow) */}
                    <td className="px-4 py-3 text-center">
                      {position.borrowMatchAPY !== null ? (
                        <span className="text-red-400 font-medium">{formatAPY(position.borrowMatchAPY)}</span>
                      ) : "-"}
                    </td>
                    
                    {/* Borrow Order Status */}
                    <td className="px-4 py-3 text-center text-white">
                      {formatOrderStatus(position.borrowMatchedAmt, position.borrowTotalAmt)}
                    </td>
                    
                    {/* Health Factor */}
                    <td className="px-4 py-3 text-center">
                      {position.healthFactor !== "-" ? (
                        <span className={`font-medium ${
                          parseFloat(position.healthFactor) < 1.2 ? 'text-red-400' : 
                          parseFloat(position.healthFactor) < 1.5 ? 'text-yellow-400' : 
                          'text-green-400'
                        }`}>
                          {position.healthFactor}
                        </span>
                      ) : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Two-Way Positions Table */}
      {twoWay.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-white mb-3">Two-Way Positions</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-gray-400 border-b border-[#1e2c3b] bg-[#081020]">
                  <th className="px-4 py-2 text-left font-medium">Market</th>
                  <th className="px-4 py-2 text-center font-medium">Borrow APY</th>
                  <th className="px-4 py-2 text-center font-medium">Borrow Avg. Match</th>
                  <th className="px-4 py-2 text-center font-medium">Borrow Status</th>
                  <th className="px-4 py-2 text-center font-medium">Lend APY</th>
                  <th className="px-4 py-2 text-center font-medium">Lend Avg. Match</th>
                  <th className="px-4 py-2 text-center font-medium">Lend Status</th>
                  <th className="px-4 py-2 text-center font-medium">LP Profit</th>
                  <th className="px-4 py-2 text-right font-medium">Redeemable</th>
                </tr>
              </thead>
              <tbody>
                {twoWay.map((position, index) => (
                  <tr 
                    key={position.id} 
                    className={`text-sm border-b border-[#1e2c3b] transition-colors cursor-pointer
                      ${index % 2 === 0 ? 'bg-[#0a1525]/30' : ''}
                      hover:bg-[#1e2c3b] hover:shadow-inner
                    `}
                    onClick={() => onSelectPosition(position)}
                  >
                    {renderMarketCell(position)}
                    
                    {/* Borrow APR */}
                    <td className="px-4 py-3 text-center">
                      {position.borrowAPRRaw ? (
                        <span className="text-[#3182CE] font-medium">{formatAPY(position.borrowAPRRaw)}</span>
                      ) : "-"}
                    </td>
                    
                    {/* Avg Match APY (Borrow) */}
                    <td className="px-4 py-3 text-center">
                      {position.borrowMatchAPY !== null ? (
                        <span className="text-red-400 font-medium">{formatAPY(position.borrowMatchAPY)}</span>
                      ) : "-"}
                    </td>
                    
                    {/* Borrow Order Status */}
                    <td className="px-4 py-3 text-center text-white">
                      {formatOrderStatus(position.borrowMatchedAmt, position.borrowTotalAmt)}
                    </td>
                    
                    {/* Lend APR */}
                    <td className="px-4 py-3 text-center">
                      {position.lendAPRRaw ? (
                        <span className="text-[#5FBDE9] font-medium">{formatAPY(position.lendAPRRaw)}</span>
                      ) : "-"}
                    </td>
                    
                    {/* Avg Match APY (Lend) */}
                    <td className="px-4 py-3 text-center">
                      {position.lendMatchAPY !== null ? (
                        <span className="text-green-400 font-medium">{formatAPY(position.lendMatchAPY)}</span>
                      ) : "-"}
                    </td>
                    
                    {/* Lend Order Status */}
                    <td className="px-4 py-3 text-center text-white">
                      {formatOrderStatus(position.lendMatchedAmt, position.lendTotalAmt)}
                    </td>
                    
                    {/* LP Profit % */}
                    <td className="px-4 py-3 text-center">
                      {position.lpProfit !== null ? (
                        <span className="text-green-400 font-medium">{position.lpProfit.toFixed(2)}%</span>
                      ) : "-"}
                    </td>
                    
                    {/* Redeemable */}
                    <td className="px-4 py-3 text-right text-white">
                      {!position.isActive && position.redeemable !== null && position.redeemable > 0 ? 
                        position.redeemable.toLocaleString() : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 無資料顯示 */}
      {lend.length === 0 && borrow.length === 0 && twoWay.length === 0 && (
        <div className="p-8 text-center text-gray-400">
          No positions found.
        </div>
      )}
    </div>
  )
}