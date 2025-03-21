// components/range-order/PositionList/UnifiedPositionTable.tsx
'use client'

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Info } from 'lucide-react'
import { Position } from '@/lib/mock/range-order-mock-data'

interface UnifiedPositionTableProps {
  positions: Position[]
  onSelectPosition: (position: Position) => void
  filterType?: 'all' | 'lend' | 'borrow' | 'two-way'
}

export default function UnifiedPositionTable({
  positions,
  onSelectPosition,
  filterType = 'all'
}: UnifiedPositionTableProps) {
  // Filter positions based on type
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

  // Group positions by type
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

  // Format APY numbers
  const formatAPY = (apy: number | null) => {
    if (apy === null) return '-';
    return `${apy.toFixed(2)}%`;
  };

  // Format match percentage as a visual bar
  const renderMatchBar = (matchedAmt: number | null, totalAmt: number | null) => {
    if (matchedAmt === null || totalAmt === null || totalAmt === 0) return null;
    
    const percentage = Math.min(100, Math.round((matchedAmt / totalAmt) * 100));
    
    return (
      <div className="w-full h-2 bg-[#122136] rounded-full overflow-hidden">
        <div 
          className="h-full bg-[#5FBDE9]" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    );
  };

  // Calculate match rates for Two-Way positions
  const calculateMatchRates = (position: Position) => {
    const lendMatchRate = position.lendMatchedAmt && position.lendTotalAmt
      ? Math.round((position.lendMatchedAmt / position.lendTotalAmt) * 100)
      : 0;
      
    const borrowMatchRate = position.borrowMatchedAmt && position.borrowTotalAmt
      ? Math.round((position.borrowMatchedAmt / position.borrowTotalAmt) * 100)
      : 0;
      
    return { lendMatchRate, borrowMatchRate };
  };

  // Render dual progress bar for Two-Way positions
  const renderDualMatchBar = (position: Position) => {
    const { lendMatchRate, borrowMatchRate } = calculateMatchRates(position);
    
    return (
      <div className="w-full">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-[#3182CE]">Borrow: {borrowMatchRate}%</span>
          <span className="text-[#5FBDE9]">Lend: {lendMatchRate}%</span>
        </div>
        <div className="w-full h-3 bg-[#122136] rounded-full overflow-hidden flex">
          <div 
            className="h-full bg-[#3182CE]" 
            style={{ width: `${borrowMatchRate}%` }}
          ></div>
          <div 
            className="h-full bg-[#5FBDE9]" 
            style={{ width: `${lendMatchRate}%` }}
          ></div>
        </div>
      </div>
    );
  };

  // Render APY pair for Two-Way positions
  const renderAPYPair = (position: Position) => {
    return (
      <div>
        <div className="flex justify-between items-center">
          <span className="text-[#3182CE] font-medium">{position.borrowAPRRaw?.toFixed(2)}%</span>
          <span className="text-gray-400 mx-1">/</span>
          <span className="text-[#5FBDE9] font-medium">{position.lendAPRRaw?.toFixed(2)}%</span>
        </div>
        <div className="text-xs text-gray-400 mt-1">Borrow/Lend</div>
      </div>
    );
  };

  // Get positions by type
  const { lend, borrow, twoWay } = getPositionsByType();
  
  // Render market name and badges
  const renderMarketCell = (position: Position) => (
    <td className="px-4 py-3">
      <div className="font-medium text-white">
        {position.debtToken}/{position.collateral}
      </div>
      <div className="flex items-center gap-2 mt-1">
        <Badge className={`text-xs ${position.orderType === 'Lend' ? 'bg-[#5FBDE9]/20 text-[#5FBDE9]' : position.orderType === 'Borrow' ? 'bg-[#3182CE]/20 text-[#3182CE]' : 'bg-purple-500/20 text-purple-400'}`}>
          {position.orderType}
        </Badge>
        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">
          {position.maturity}
        </Badge>
        {position.isActive !== undefined && (
          <Badge className={`text-xs ${position.isActive ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
            {position.isActive ? 'Active' : 'Expired'}
          </Badge>
        )}
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
                  <th className="px-4 py-2 text-right font-medium">Lend APR</th>
                  <th className="px-4 py-2 text-right font-medium">Match APR</th>
                  <th className="px-4 py-2 text-center font-medium">Order Matched</th>
                  <th className="px-4 py-2 text-right font-medium">Supplied</th>
                  <th className="px-4 py-2 text-right font-medium">Available</th>
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
                    <td className="px-4 py-3 text-right">
                      <span className="text-[#5FBDE9] font-medium">{formatAPY(position.lendAPRRaw)}</span>
                    </td>
                    
                    {/* Match APY */}
                    <td className="px-4 py-3 text-right">
                      {position.lendMatchAPY !== null ? (
                        <span className="text-green-400 font-medium">{formatAPY(position.lendMatchAPY)}</span>
                      ) : "-"}
                    </td>
                    
                    {/* Order Match Progress Bar */}
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        {renderMatchBar(position.lendMatchedAmt, position.lendTotalAmt)}
                        <div className="text-xs text-gray-400 mt-1 text-center">
                          {position.lendMatchedAmt?.toLocaleString() || 0} / {position.lendTotalAmt?.toLocaleString() || 0}
                        </div>
                      </div>
                    </td>
                    
                    {/* Supplied */}
                    <td className="px-4 py-3 text-right text-white">
                      {position.suppliedAmount || "-"}
                    </td>
                    
                    {/* Available to Withdraw */}
                    <td className="px-4 py-3 text-right text-white">
                      {position.availableToWithdraw || "-"}
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
                  <th className="px-4 py-2 text-right font-medium">Borrow APR</th>
                  <th className="px-4 py-2 text-right font-medium">Match APR</th>
                  <th className="px-4 py-2 text-center font-medium">Order Matched</th>
                  <th className="px-4 py-2 text-right font-medium">Borrowed</th>
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
                    <td className="px-4 py-3 text-right">
                      <span className="text-[#3182CE] font-medium">{formatAPY(position.borrowAPRRaw)}</span>
                    </td>
                    
                    {/* Match APY */}
                    <td className="px-4 py-3 text-right">
                      {position.borrowMatchAPY !== null ? (
                        <span className="text-red-400 font-medium">{formatAPY(position.borrowMatchAPY)}</span>
                      ) : "-"}
                    </td>
                    
                    {/* Order Match Progress Bar */}
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        {renderMatchBar(position.borrowMatchedAmt, position.borrowTotalAmt)}
                        <div className="text-xs text-gray-400 mt-1 text-center">
                          {position.borrowMatchedAmt?.toLocaleString() || 0} / {position.borrowTotalAmt?.toLocaleString() || 0}
                        </div>
                      </div>
                    </td>
                    
                    {/* Borrowed Amount */}
                    <td className="px-4 py-3 text-right text-white">
                      {position.borrowedAmount || "-"}
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

      {/* Two-Way Positions Table - LP-focused */}
      {twoWay.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-white mb-3">Two-Way Positions</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-gray-400 border-b border-[#1e2c3b] bg-[#081020]">
                  <th className="px-4 py-2 text-left font-medium">Market</th>
                  <th className="px-4 py-2 text-center font-medium">Rates (Borrow/Lend)</th>
                  <th className="px-4 py-2 text-center font-medium">Match Status</th>
                  <th className="px-4 py-2 text-center font-medium">LP Profit</th>
                  <th className="px-4 py-2 text-right font-medium">Liquidity</th>
                  <th className="px-4 py-2 text-right font-medium">Available</th>
                  <th className="px-4 py-2 text-right font-medium">Redeemable</th>
                </tr>
              </thead>
              <tbody>
                {twoWay.map((position, index) => {
                  // Calculate liquidity values for this position
                  const lendLiquidity = parseFloat(position.suppliedAmount?.replace(/,/g, '') || '0');
                  const borrowLiquidity = parseFloat(position.borrowedAmount?.replace(/,/g, '') || '0');
                  const totalLiquidity = lendLiquidity + borrowLiquidity;
                  
                  // Calculate available
                  const availableToWithdraw = parseFloat(position.availableToWithdraw.replace(/,/g, '') || '0');
                  
                  return (
                    <tr 
                      key={position.id} 
                      className={`text-sm border-b border-[#1e2c3b] transition-colors cursor-pointer
                        ${index % 2 === 0 ? 'bg-[#0a1525]/30' : ''}
                        hover:bg-[#1e2c3b] hover:shadow-inner
                      `}
                      onClick={() => onSelectPosition(position)}
                    >
                      {renderMarketCell(position)}
                      
                      {/* APY Pair */}
                      <td className="px-4 py-3 text-center">
                        {renderAPYPair(position)}
                      </td>
                      
                      {/* Dual Match Status */}
                      <td className="px-4 py-3">
                        {renderDualMatchBar(position)}
                      </td>
                      
                      {/* LP Profit */}
                      <td className="px-4 py-3 text-center">
                        {position.lpProfit !== null ? (
                          <div className="flex flex-col">
                            <span className={`font-medium ${position.lpProfit > 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {position.lpProfit > 0 ? '+' : ''}{position.lpProfit.toFixed(2)}%
                            </span>
                            <span className="text-xs text-gray-400 mt-1">Spread Yield</span>
                          </div>
                        ) : "-"}
                      </td>
                      
                      {/* Liquidity Values */}
                      <td className="px-4 py-3 text-right">
                        <div className="flex flex-col">
                          <span className="text-white">{totalLiquidity.toLocaleString()}</span>
                          <div className="flex justify-end text-xs text-gray-400 mt-1">
                            <span className="text-[#5FBDE9]">{lendLiquidity.toLocaleString()} XT</span>
                            <span className="mx-1">/</span>
                            <span className="text-[#3182CE]">{borrowLiquidity.toLocaleString()} FT</span>
                          </div>
                        </div>
                      </td>
                      
                      {/* Available to Withdraw */}
                      <td className="px-4 py-3 text-right text-white">
                        {availableToWithdraw.toLocaleString()}
                      </td>
                      
                      {/* Redeemable */}
                      <td className="px-4 py-3 text-right">
                        {!position.isActive && position.redeemable !== null ? (
                          <span className="text-green-400 font-medium">
                            {position.redeemable.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* No data message */}
      {lend.length === 0 && borrow.length === 0 && twoWay.length === 0 && (
        <div className="p-8 text-center text-gray-400">
          No positions found.
        </div>
      )}
    </div>
  );
}