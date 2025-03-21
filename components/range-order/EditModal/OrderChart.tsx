// components/range-order/EditModal/OrderChart.tsx
'use client'

import React, { JSX } from 'react'
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot 
} from 'recharts'
import { ZoomIn, ZoomOut, RefreshCw, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RangePoint } from '@/lib/range-order/types'

interface OrderChartProps {
  originalLendPoints?: RangePoint[]
  originalBorrowPoints?: RangePoint[]
  modifiedLendPoints?: RangePoint[]
  modifiedBorrowPoints?: RangePoint[]
  zoomLevel: number
  setZoomLevel: React.Dispatch<React.SetStateAction<number>>
  showLendCurve?: boolean
  showBorrowCurve?: boolean
  readOnly?: boolean // New prop to indicate if the chart is in read-only mode
}

export default function OrderChart({
  originalLendPoints = [],
  originalBorrowPoints = [],
  modifiedLendPoints,
  modifiedBorrowPoints,
  zoomLevel,
  setZoomLevel,
  showLendCurve = true,
  showBorrowCurve = true,
  readOnly = false // Default to interactive mode
}: OrderChartProps) {
  // Generate chart data based on current points
  const generateChartData = () => {
    const lendPoints = modifiedLendPoints || originalLendPoints;
    const borrowPoints = modifiedBorrowPoints || originalBorrowPoints;
    
    const maxLendAmount = lendPoints?.length > 0 
      ? Math.max(...lendPoints.map(p => parseFloat(p.amount || '0')))
      : 0;
    
    const maxBorrowAmount = borrowPoints?.length > 0 
      ? Math.max(...borrowPoints.map(p => parseFloat(p.amount || '0')))
      : 0;
    
    const maxAmount = Math.max(maxLendAmount, maxBorrowAmount, 3900000); // Default max if no points
    
    // Generate data points for smooth curves
    const data = [];
    const step = maxAmount / 100;
    
    for (let i = 0; i <= 100; i++) {
      const amount = i * step;
      const dataPoint: { amount: number; originalLendAPR?: number | null; modifiedLendAPR?: number | null; originalBorrowAPR?: number | null; modifiedBorrowAPR?: number | null } = { amount };
      
      if (showLendCurve) {
        if (originalLendPoints?.length > 0) {
          dataPoint.originalLendAPR = interpolateAPR(amount, originalLendPoints);
        }
        if (modifiedLendPoints && modifiedLendPoints.length > 0) {
          dataPoint.modifiedLendAPR = interpolateAPR(amount, modifiedLendPoints);
        }
      }
      
      if (showBorrowCurve) {
        if (originalBorrowPoints?.length > 0) {
          dataPoint.originalBorrowAPR = interpolateAPR(amount, originalBorrowPoints);
        }
        if (modifiedBorrowPoints && modifiedBorrowPoints.length > 0) {
          dataPoint.modifiedBorrowAPR = interpolateAPR(amount, modifiedBorrowPoints);
        }
      }
      
      data.push(dataPoint);
    }
    
    return data;
  };
  
  // Helper function to interpolate APR between points
  const interpolateAPR = (amount: number, points: RangePoint[]) => {
    if (!points || points.length === 0) return null;
    
    // Find surrounding points
    let lowPoint = points[0];
    let highPoint = points[points.length - 1];
    
    for (let i = 0; i < points.length - 1; i++) {
      if (
        amount >= parseFloat(points[i].amount) &&
        amount <= parseFloat(points[i + 1].amount)
      ) {
        lowPoint = points[i];
        highPoint = points[i + 1];
        break;
      }
    }
    
    // If amount is outside the range, return the closest endpoint
    if (amount <= parseFloat(lowPoint.amount)) return lowPoint.apr;
    if (amount >= parseFloat(highPoint.amount)) return highPoint.apr;
    
    // Linear interpolation
    const ratio = (amount - parseFloat(lowPoint.amount)) / 
                 (parseFloat(highPoint.amount) - parseFloat(lowPoint.amount));
    return lowPoint.apr + ratio * (highPoint.apr - lowPoint.apr);
  };
  
  // Calculate chart max amount based on zoom level
  const getChartMaxX = () => {
    const data = generateChartData();
    if (data.length === 0) return 3900000;
    
    const maxX = data[data.length - 1].amount;
    return maxX * zoomLevel;
  };

  // Reset zoom
  const resetZoom = () => setZoomLevel(1);

  // Colors for chart elements
  const lendColor = "#5FBDE9";
  const borrowColor = "#3182CE";
  const modifiedLendColor = "#48bb78"; // Green for modified lend curve
  const modifiedBorrowColor = "#ed8936"; // Orange for modified borrow curve
  
  const chartData = generateChartData();
  
  // Generate reference dots for curve points
  const renderReferenceDots = () => {
    const dots: JSX.Element[] = [];
    
    // Original lend points
    if (showLendCurve && originalLendPoints?.length > 0) {
      originalLendPoints.forEach((point, index) => {
        dots.push(
          <ReferenceDot
            key={`lend-dot-${index}`}
            x={parseFloat(point.amount)}
            y={point.apr}
            r={4}
            fill={lendColor}
            stroke="#fff"
          />
        );
      });
    }
    
    // Modified lend points
    if (showLendCurve && modifiedLendPoints && modifiedLendPoints.length > 0) {
      modifiedLendPoints.forEach((point, index) => {
        dots.push(
          <ReferenceDot
            key={`mod-lend-dot-${index}`}
            x={parseFloat(point.amount)}
            y={point.apr}
            r={4}
            fill={modifiedLendColor}
            stroke="#fff"
          />
        );
      });
    }
    
    // Original borrow points
    if (showBorrowCurve && originalBorrowPoints?.length > 0) {
      originalBorrowPoints.forEach((point, index) => {
        dots.push(
          <ReferenceDot
            key={`borrow-dot-${index}`}
            x={parseFloat(point.amount)}
            y={point.apr}
            r={4}
            fill={borrowColor}
            stroke="#fff"
          />
        );
      });
    }
    
    // Modified borrow points
    if (showBorrowCurve && modifiedBorrowPoints && modifiedBorrowPoints.length > 0) {
      modifiedBorrowPoints.forEach((point, index) => {
        dots.push(
          <ReferenceDot
            key={`mod-borrow-dot-${index}`}
            x={parseFloat(point.amount)}
            y={point.apr}
            r={4}
            fill={modifiedBorrowColor}
            stroke="#fff"
          />
        );
      });
    }
    
    return dots;
  };
  
  return (
    <div className="h-[400px] w-full bg-[#0a1525] rounded-lg border border-[#1e2c3b] p-4 relative">
      {/* Read-only indicator for expired positions */}
      {readOnly && (
        <div className="absolute top-4 left-4 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded px-2 py-1 text-xs flex items-center">
          <Lock className="h-3 w-3 mr-1" />
          Historical View
        </div>
      )}
      
      <div className="h-full w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1e2c3b" />
            <XAxis 
              dataKey="amount" 
              domain={[0, getChartMaxX()]}
              tickFormatter={(value) => `$${(value/1000000).toFixed(1)}M`}
              stroke="#4c5563"
            />
            <YAxis 
              tickFormatter={(value) => `${value}%`}
              domain={[0, 70]}
              stroke="#4c5563"
              label={{ value: 'APR (%)', angle: -90, position: 'insideLeft', fill: '#6b7280', dx: -20 }}
            />
            <Tooltip 
              formatter={(value) => (value ? `${Number(value).toFixed(2)}%` : 'N/A')}
              labelFormatter={(value) => `$${Number(value).toLocaleString()}`}
              contentStyle={{ backgroundColor: '#0c1624', borderColor: '#1e2c3b' }}
              itemStyle={{ color: '#fff' }}
              labelStyle={{ color: '#9ca3af' }}
            />
            
            {/* Original Lend Curve */}
            {showLendCurve && originalLendPoints?.length > 0 && (
              <Area 
                type="monotone" 
                dataKey="originalLendAPR" 
                stroke={lendColor} 
                strokeWidth={2}
                fill={lendColor} 
                fillOpacity={0.2}
                name="Current Lend APR"
                activeDot={{ r: 6, stroke: '#3ba7d9', strokeWidth: 1 }}
              />
            )}
            
            {/* Modified Lend Curve */}
            {showLendCurve && modifiedLendPoints && modifiedLendPoints.length > 0 && (
              <Area 
                type="monotone" 
                dataKey="modifiedLendAPR" 
                stroke={modifiedLendColor} 
                strokeWidth={2}
                strokeDasharray="5 5"
                fill={modifiedLendColor} 
                fillOpacity={0.2}
                name="Modified Lend APR"
                activeDot={{ r: 6, stroke: modifiedLendColor, strokeWidth: 1 }}
              />
            )}
            
            {/* Original Borrow Curve */}
            {showBorrowCurve && originalBorrowPoints?.length > 0 && (
              <Area 
                type="monotone" 
                dataKey="originalBorrowAPR" 
                stroke={borrowColor} 
                strokeWidth={2}
                fill={borrowColor} 
                fillOpacity={0.1}
                name="Current Borrow APR"
                activeDot={{ r: 6, stroke: borrowColor, strokeWidth: 1 }}
              />
            )}
            
            {/* Modified Borrow Curve */}
            {showBorrowCurve && modifiedBorrowPoints && modifiedBorrowPoints.length > 0 && (
              <Area 
                type="monotone" 
                dataKey="modifiedBorrowAPR" 
                stroke={modifiedBorrowColor} 
                strokeWidth={2}
                strokeDasharray="5 5"
                fill={modifiedBorrowColor} 
                fillOpacity={0.1}
                name="Modified Borrow APR"
                activeDot={{ r: 6, stroke: modifiedBorrowColor, strokeWidth: 1 }}
              />
            )}
            
            {/* Reference Dots */}
            {renderReferenceDots()}
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      {/* Zoom Controls */}
      <div className="absolute bottom-4 right-4 flex gap-1">
        <Button 
          variant="outline" 
          size="icon" 
          className="h-7 w-7 bg-[#0c1624] border-[#1e2c3b] hover:bg-[#1e2c3b]"
          onClick={() => setZoomLevel(prev => Math.max(0.5, prev / 2))}
        >
          <ZoomOut className="h-3.5 w-3.5" />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          className="h-7 w-7 bg-[#0c1624] border-[#1e2c3b] hover:bg-[#1e2c3b]"
          onClick={() => setZoomLevel(prev => prev * 2)}
        >
          <ZoomIn className="h-3.5 w-3.5" />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          className="h-7 w-7 bg-[#0c1624] border-[#1e2c3b] hover:bg-[#1e2c3b]"
          onClick={resetZoom}
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </Button>
      </div>
      
      {/* Chart Legend */}
      <div className="absolute top-4 right-4 bg-[#0a1525]/90 p-2 rounded border border-[#1e2c3b] text-xs">
        <div className="flex items-center gap-2 mb-1">
          {showLendCurve && originalLendPoints?.length > 0 && (
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded-full bg-[#5FBDE9]"></div>
              <span className="text-gray-300">Current Lend</span>
            </div>
          )}
          {showLendCurve && modifiedLendPoints && modifiedLendPoints.length > 0 && (
            <div className="flex items-center gap-1 ml-2">
              <div className="h-3 w-3 rounded-full bg-[#48bb78]"></div>
              <span className="text-gray-300">Modified Lend</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {showBorrowCurve && originalBorrowPoints?.length > 0 && (
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded-full bg-[#3182CE]"></div>
              <span className="text-gray-300">Current Borrow</span>
            </div>
          )}
          {showBorrowCurve && modifiedBorrowPoints && modifiedBorrowPoints.length > 0 && (
            <div className="flex items-center gap-1 ml-2">
              <div className="h-3 w-3 rounded-full bg-[#ed8936]"></div>
              <span className="text-gray-300">Modified Borrow</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}