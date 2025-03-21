// components/curator/rebalance/AdvancedOrderSettings.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { Info, Plus, Minus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { VaultOrder } from '@/types/curator'

interface AdvancedOrderSettingsProps {
  order: VaultOrder
}

export const AdvancedOrderSettings: React.FC<AdvancedOrderSettingsProps> = ({
  order
}) => {
  // Initialize with actual values from the order
  const [reservedAssets, setReservedAssets] = useState({
    xt: order.reservedAssets?.xt || 250000,
    ft: order.reservedAssets?.ft || 180000,
    maxSupply: 500000
  })
  
  // Effect to update local state when order changes
  useEffect(() => {
    if (order.reservedAssets) {
      setReservedAssets({
        ...reservedAssets,
        xt: order.reservedAssets.xt,
        ft: order.reservedAssets.ft
      })
    }
  }, [order])

  // Handle XT token adjustment
  const handleXtChange = (value: number) => {
    setReservedAssets({
      ...reservedAssets,
      xt: value
    })
  }

  // Handle FT token adjustment
  const handleFtChange = (value: number) => {
    setReservedAssets({
      ...reservedAssets,
      ft: value,
      // Adjusting FT also changes the max supply for visualization
      maxSupply: value * 2.5 // Example relationship
    })
  }

  // Format number with commas
  const formatNumber = (num: number) => {
    return num.toLocaleString(undefined, { maximumFractionDigits: 0 })
  }

  // Calculate dollar value of tokens (mock values for demo)
  const getXtDollarValue = (xtAmount: number) => {
    // Example conversion rate: 1 XT = $1.2
    return formatNumber(xtAmount * 1.2)
  }

  const getFtDollarValue = (ftAmount: number) => {
    // Example conversion rate: 1 FT = $0.95
    return formatNumber(ftAmount * 0.95)
  }

  // Get APR values directly from the order
  const lendAPR = order.lendAPRRaw || 7.38;
  const borrowAPR = order.borrowAPRRaw || 6.32;
  
  // Calculate APR values at different points
  const calculateAPRPoints = () => {
    // Calculate position percentage (how far along the X axis we are)
    const positionPercentage = reservedAssets.xt / reservedAssets.maxSupply;
    
    // Calculate lending curve points
    const lendCurveStart = 45; // Starting at max APR (left side of chart)
    const lendCurveEnd = 9; // Ending at min APR (right side of chart)
    
    // Calculate lending APR at current position - this is where we use the real lendAPR
    // from the order at the exact current position
    const lendCurveAtPosition = (
      positionPercentage <= 0.5 
        ? lendAPR // Use actual APR around the middle
        : lendCurveEnd + (lendAPR - lendCurveEnd) * (1 - (positionPercentage - 0.5) * 2)
    );
    
    // Calculate borrowing curve points
    const borrowCurveStart = 30; // Starting at max APR (left side of chart)
    const borrowCurveEnd = 5; // Ending at min APR (right side of chart)
    
    // Calculate borrowing APR at current position - uses the real borrowAPR
    const borrowCurveAtPosition = (
      positionPercentage <= 0.5 
        ? borrowAPR // Use actual APR around the middle
        : borrowCurveEnd + (borrowAPR - borrowCurveEnd) * (1 - (positionPercentage - 0.5) * 2)
    );
    
    return {
      lendCurveStart,
      lendCurveAtPosition,
      lendCurveEnd,
      borrowCurveStart,
      borrowCurveAtPosition,
      borrowCurveEnd
    };
  };
  
  const aprPoints = calculateAPRPoints();

  return (
    <div className="mt-4 bg-[#081020] p-4 rounded-lg border border-[#1e2c3b]">
      <h4 className="text-white font-medium mb-3">Order Curve Settings</h4>
      
      {/* Reserved Assets Section */}
      <div>
        <h5 className="text-sm text-gray-400 mb-3">Reserved Assets</h5>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* XToken Reserve */}
          <div>
            <div className="flex items-center mb-1">
              <span className="text-gray-400 text-sm">XToken Reserve</span>
              <div className="relative ml-1 group">
                <Info className="h-3.5 w-3.5 text-gray-500" />
                <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-[#0a1525] rounded text-xs text-gray-300 z-50 border border-[#1e2c3b]">
                  XToken represents your lending capacity. Adjusting this will shift the current position.
                </div>
              </div>
            </div>
            
            <div className="flex items-center">
              <Input 
                type="number"
                value={reservedAssets.xt}
                onChange={(e) => handleXtChange(parseFloat(e.target.value) || 0)}
                className="bg-[#0a1525] border-[#1e2c3b]"
              />
              <div className="flex ml-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8 rounded-r-none border-[#1e2c3b]"
                  onClick={() => handleXtChange(Math.max(0, reservedAssets.xt - 10000))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8 rounded-l-none border-[#1e2c3b] border-l-0"
                  onClick={() => handleXtChange(reservedAssets.xt + 10000)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-1">${getXtDollarValue(reservedAssets.xt)}</div>
          </div>

          {/* FToken Reserve */}
          <div>
            <div className="flex items-center mb-1">
              <span className="text-gray-400 text-sm">FToken Reserve</span>
              <div className="relative ml-1 group">
                <Info className="h-3.5 w-3.5 text-gray-500" />
                <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-[#0a1525] rounded text-xs text-gray-300 z-50 border border-[#1e2c3b]">
                  FToken represents your borrowing capacity. Adjusting this will change max supply.
                </div>
              </div>
            </div>
            
            <div className="flex items-center">
              <Input 
                type="number"
                value={reservedAssets.ft}
                onChange={(e) => handleFtChange(parseFloat(e.target.value) || 0)}
                className="bg-[#0a1525] border-[#1e2c3b]"
              />
              <div className="flex ml-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8 rounded-r-none border-[#1e2c3b]"
                  onClick={() => handleFtChange(Math.max(0, reservedAssets.ft - 10000))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8 rounded-l-none border-[#1e2c3b] border-l-0"
                  onClick={() => handleFtChange(reservedAssets.ft + 10000)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-1">${getFtDollarValue(reservedAssets.ft)}</div>
          </div>
        </div>
      </div>

      {/* Order Curves Section */}
      <div>
        <h5 className="text-sm text-gray-400 mb-3">Order Curves</h5>
        
        <div className="relative h-80 bg-[#06090f] rounded border border-[#1e2c3b] overflow-hidden">
          {/* Curve Chart - SVG Based */}
          <svg viewBox="0 0 1000 400" className="w-full h-full">
            {/* Chart Background */}
            <rect x="80" y="40" width="840" height="320" fill="transparent" />
            
            {/* X and Y Axis */}
            <line x1="80" y1="360" x2="920" y2="360" stroke="#1e2c3b" strokeWidth="1" />
            <line x1="80" y1="40" x2="80" y2="360" stroke="#1e2c3b" strokeWidth="1" />
            
            {/* Y-axis grid lines and labels */}
            <line x1="80" y1="40" x2="920" y2="40" stroke="#1e2c3b" strokeWidth="0.5" strokeDasharray="3,3" />
            <text x="70" y="45" textAnchor="end" fill="#9ca3af" fontSize="14">45%</text>
            
            <line x1="80" y1="120" x2="920" y2="120" stroke="#1e2c3b" strokeWidth="0.5" strokeDasharray="3,3" />
            <text x="70" y="125" textAnchor="end" fill="#9ca3af" fontSize="14">30%</text>
            
            <line x1="80" y1="200" x2="920" y2="200" stroke="#1e2c3b" strokeWidth="0.5" strokeDasharray="3,3" />
            <text x="70" y="205" textAnchor="end" fill="#9ca3af" fontSize="14">20%</text>
            
            <line x1="80" y1="280" x2="920" y2="280" stroke="#1e2c3b" strokeWidth="0.5" strokeDasharray="3,3" />
            <text x="70" y="285" textAnchor="end" fill="#9ca3af" fontSize="14">10%</text>
            
            <line x1="80" y1="360" x2="920" y2="360" stroke="#1e2c3b" strokeWidth="0.5" />
            <text x="70" y="365" textAnchor="end" fill="#9ca3af" fontSize="14">0%</text>
            
            {/* X-axis labels */}
            <text x="80" y="380" textAnchor="middle" fill="#9ca3af" fontSize="14">0</text>
            <text x="500" y="380" textAnchor="middle" fill="#9ca3af" fontSize="14">{formatNumber(reservedAssets.maxSupply/2)}</text>
            <text x="920" y="380" textAnchor="middle" fill="#9ca3af" fontSize="14">{formatNumber(reservedAssets.maxSupply)}</text>
            
            {/* Max supply indicator */}
            <text x="860" y="60" textAnchor="start" fill="#ffd700" fontSize="14">max: {formatNumber(reservedAssets.maxSupply)}</text>
            <text x="860" y="80" textAnchor="start" fill="#ffd700" fontSize="14">45%</text>
            
            {/* Axis Titles */}
            <text x="500" y="405" textAnchor="middle" fill="#9ca3af" fontSize="14">XT Reserve</text>
            
            <text 
              x="-250" 
              y="20" 
              transform="rotate(-90)" 
              textAnchor="middle" 
              fill="#9ca3af" 
              fontSize="14"
            >
              Borrowing APR
            </text>
            
            <text 
              x="-200" 
              y="970" 
              transform="rotate(-90)" 
              textAnchor="middle" 
              fill="#9ca3af" 
              fontSize="14"
            >
              Lending APR
            </text>
            
            {/* Legend */}
            <g transform="translate(100, 80)">
              <line x1="0" y1="0" x2="30" y2="0" stroke="#5FBDE9" strokeWidth="2" />
              <text x="40" y="5" fill="#9ca3af" fontSize="14">Lending Curve</text>
              
              <line x1="0" y1="25" x2="30" y2="25" stroke="#3182CE" strokeWidth="2" />
              <text x="40" y="30" fill="#9ca3af" fontSize="14">Borrowing Curve</text>
              
              <line x1="0" y1="50" x2="30" y2="50" stroke="#ffd700" strokeWidth="2" />
              <text x="40" y="55" fill="#9ca3af" fontSize="14">Current Position</text>
            </g>
            
            {/* Lending Curve - Top curve */}
            <path 
              d={`
                M 80 40
                C 200 60, 300 70, ${80 + (reservedAssets.xt / reservedAssets.maxSupply) * 840} ${40 + ((45 - aprPoints.lendCurveAtPosition) / 45) * 320}
                C ${80 + (reservedAssets.xt / reservedAssets.maxSupply) * 840 + 100} ${40 + ((45 - aprPoints.lendCurveAtPosition) / 45) * 320 + 50}, 700 280, 920 320
              `}
              fill="none"
              stroke="#5FBDE9"
              strokeWidth="2"
            />
            
            {/* Borrowing Curve - Bottom curve */}
            <path 
              d={`
                M 80 120
                C 200 150, 300 170, ${80 + (reservedAssets.xt / reservedAssets.maxSupply) * 840} ${40 + ((45 - aprPoints.borrowCurveAtPosition) / 45) * 320}
                C ${80 + (reservedAssets.xt / reservedAssets.maxSupply) * 840 + 100} ${40 + ((45 - aprPoints.borrowCurveAtPosition) / 45) * 320 + 30}, 700 320, 920 340
              `}
              fill="none"
              stroke="#3182CE"
              strokeWidth="2"
            />
            
            {/* Current Position Indicator */}
            <line 
              x1={80 + (reservedAssets.xt / reservedAssets.maxSupply) * 840} 
              y1="40" 
              x2={80 + (reservedAssets.xt / reservedAssets.maxSupply) * 840} 
              y2="360" 
              stroke="#ffd700" 
              strokeWidth="2" 
            />
            
            {/* Current Position Label */}
            <text 
              x={80 + (reservedAssets.xt / reservedAssets.maxSupply) * 840} 
              y="380" 
              textAnchor="middle" 
              fill="#ffd700" 
              fontSize="14"
            >
              {formatNumber(reservedAssets.xt)}
            </text>
            
            {/* APR Indicators at Current Position */}
            {/* Lending APR Indicator */}
            <circle 
              cx={80 + (reservedAssets.xt / reservedAssets.maxSupply) * 840} 
              cy={40 + ((45 - aprPoints.lendCurveAtPosition) / 45) * 320} 
              r="6" 
              fill="#ffd700" 
            />
            
            <text 
              x={80 + (reservedAssets.xt / reservedAssets.maxSupply) * 840 + 10} 
              y={40 + ((45 - aprPoints.lendCurveAtPosition) / 45) * 320} 
              fill="#ffd700" 
              fontSize="14" 
              dominantBaseline="middle"
            >
              {aprPoints.lendCurveAtPosition.toFixed(2)}%
            </text>
            
            {/* Borrowing APR Indicator */}
            <circle 
              cx={80 + (reservedAssets.xt / reservedAssets.maxSupply) * 840} 
              cy={40 + ((45 - aprPoints.borrowCurveAtPosition) / 45) * 320} 
              r="6" 
              fill="#ffd700" 
            />
            
            <text 
              x={80 + (reservedAssets.xt / reservedAssets.maxSupply) * 840 + 10} 
              y={40 + ((45 - aprPoints.borrowCurveAtPosition) / 45) * 320} 
              fill="#ffd700" 
              fontSize="14" 
              dominantBaseline="middle"
            >
              {aprPoints.borrowCurveAtPosition.toFixed(2)}%
            </text>
          </svg>
        </div>
      </div>
    </div>
  )
}

export default AdvancedOrderSettings