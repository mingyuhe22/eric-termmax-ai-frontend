// components/range-order/RangeChart.tsx
'use client'

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Scatter
} from 'recharts'
import { ZoomIn, ZoomOut, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RangePoint, OrderTab } from '@/lib/range-order/types'

interface RangeChartProps {
  orderTab: OrderTab
  lendPoints: RangePoint[]
  borrowPoints: RangePoint[]
  zoomLevel: number
  setZoomLevel: React.Dispatch<React.SetStateAction<number>>
  onPointDrag?: (type: 'lend' | 'borrow', index: number, newValues: Partial<RangePoint>) => void
}

export default function RangeChart({
  orderTab,
  lendPoints,
  borrowPoints,
  zoomLevel,
  setZoomLevel,
  onPointDrag
}: RangeChartProps) {
  // Chart ref to get dimensions for drag calculations
  const chartRef = useRef<HTMLDivElement>(null);
  
  // State to track which point is being dragged
  const [dragInfo, setDragInfo] = useState<{
    type: 'lend' | 'borrow';
    index: number;
    active: boolean;
  } | null>(null);

  // Colors for chart elements
  const lendColor = "#5FBDE9";
  const borrowColor = "#3182CE"; // Darker blue for borrow side
  
  // Convert RangePoint arrays to chart data format
  const chartData = useMemo(() => {
    // Get the maximum amount to set the chart domain
    const maxLendAmount = Math.max(...lendPoints.map(p => parseFloat(p.amount)));
    const maxBorrowAmount = Math.max(...borrowPoints.map(p => parseFloat(p.amount)));
    const maxAmount = Math.max(maxLendAmount, maxBorrowAmount);
    
    // Generate data points for smooth curves
    const result = [];
    const step = maxAmount / 100;
    
    for (let i = 0; i <= 100; i++) {
      const amount = i * step;
      result.push({
        amount,
        lendAPR: interpolateAPR(amount, lendPoints),
        borrowAPR: interpolateAPR(amount, borrowPoints),
      });
    }
    
    return result;
  }, [lendPoints, borrowPoints]);
  
  // Create exactly matching point data for the scatter plots
  const lendPointsData = useMemo(() => 
    lendPoints.map(point => ({
      amount: parseFloat(point.amount),
      lendAPR: point.apr
    })),
    [lendPoints]
  );
  
  const borrowPointsData = useMemo(() => 
    borrowPoints.map(point => ({
      amount: parseFloat(point.amount),
      borrowAPR: point.apr
    })),
    [borrowPoints]
  );
  
  // Helper function to interpolate APR between points
  function interpolateAPR(amount: number, points: RangePoint[]) {
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
  }
  
  // Get chart max amount based on zoom level - 使用 useCallback 包裝以修復 ESLint 警告
  const getChartMaxX = useCallback(() => {
    const maxLendAmount = Math.max(...lendPoints.map(p => parseFloat(p.amount)));
    const maxBorrowAmount = Math.max(...borrowPoints.map(p => parseFloat(p.amount)));
    const defaultMax = Math.max(maxLendAmount, maxBorrowAmount);
    return defaultMax * zoomLevel;
  }, [lendPoints, borrowPoints, zoomLevel]);

  // Reset zoom
  const resetZoom = () => setZoomLevel(1);
  
  // Function to start dragging a point
  const startDrag = useCallback((type: 'lend' | 'borrow', index: number) => {
    if (!onPointDrag) return;
    
    setDragInfo({ 
      type, 
      index, 
      active: true 
    });
  }, [onPointDrag]);
  
  // Setup mouse event handlers for dragging
  useEffect(() => {
    if (!onPointDrag) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragInfo?.active || !chartRef.current) return;
      
      const { type, index } = dragInfo;
      const chartRect = chartRef.current.getBoundingClientRect();
      
      // Calculate relative position within chart area
      const relativeX = (e.clientX - chartRect.left) / chartRect.width;
      const relativeY = 1 - (e.clientY - chartRect.top) / chartRect.height;
      
      // Convert to chart values
      const maxAmount = getChartMaxX();
      const newAmount = relativeX * maxAmount;
      const newAPR = relativeY * 70; // Assuming Y domain is [0, 70]
      
      // Get the points array we're working with
      const points = type === 'lend' ? lendPoints : borrowPoints;
      
      // Only allow dragging if we have a valid index
      const canDrag = index >= 0 && index < points.length;
      
      if (canDrag) {
        let boundedAmount = newAmount;
        
        // Keep points in order by enforcing min/max constraints
        if (index > 0) {
          const minAmount = parseFloat(points[index - 1].amount) + 1000;
          boundedAmount = Math.max(minAmount, boundedAmount);
        }
        
        if (index < points.length - 1) {
          const maxAmount = parseFloat(points[index + 1].amount) - 1000;
          boundedAmount = Math.min(maxAmount, boundedAmount);
        }
        
        // Keep APR in valid range
        const boundedAPR = Math.max(1, Math.min(70, newAPR));
        
        // Update the point
        onPointDrag(type, index, {
          amount: boundedAmount.toString(),
          apr: boundedAPR
        });
      }
    };
    
    const handleMouseUp = () => {
      setDragInfo(prev => prev ? { ...prev, active: false } : null);
    };
    
    // Add event listeners if we're dragging
    if (dragInfo?.active) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    
    // Clean up event listeners
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragInfo, lendPoints, borrowPoints, onPointDrag, getChartMaxX]);
  
  // 修改渲染點函數以符合 Recharts 的類型要求，接收 unknown 參數
  const renderLendDot = useCallback((props: unknown) => {
    // 安全類型判斷
    if (!props || typeof props !== 'object' || !('cx' in props) || !('cy' in props) || !('index' in props)) {
      return <circle cx={0} cy={0} r={0} opacity={0} />;
    }
    
    // 使用類型斷言訪問屬性
    const { cx, cy, index } = props as { cx: number; cy: number; index: number };
    
    // Determine if this dot is draggable
    const isDraggable = !!onPointDrag;
    
    return (
      <circle
        key={`lend-dot-${index}`}
        cx={cx}
        cy={cy}
        r={6}
        fill={lendColor}
        stroke="#FFFFFF"
        strokeWidth={2}
        style={{ cursor: isDraggable ? 'move' : 'default' }}
        onMouseDown={(e) => {
          if (isDraggable) {
            e.stopPropagation();
            startDrag('lend', index);
          }
        }}
      />
    );
  }, [lendColor, onPointDrag, startDrag]);
  
  const renderBorrowDot = useCallback((props: unknown) => {
    // 安全類型判斷
    if (!props || typeof props !== 'object' || !('cx' in props) || !('cy' in props) || !('index' in props)) {
      return <circle cx={0} cy={0} r={0} opacity={0} />;
    }
    
    // 使用類型斷言訪問屬性
    const { cx, cy, index } = props as { cx: number; cy: number; index: number };
    
    // Determine if this dot is draggable
    const isDraggable = !!onPointDrag;
    
    return (
      <circle
        key={`borrow-dot-${index}`}
        cx={cx}
        cy={cy}
        r={6}
        fill={borrowColor}
        stroke="#FFFFFF"
        strokeWidth={2}
        style={{ cursor: isDraggable ? 'move' : 'default' }}
        onMouseDown={(e) => {
          if (isDraggable) {
            e.stopPropagation();
            startDrag('borrow', index);
          }
        }}
      />
    );
  }, [borrowColor, onPointDrag, startDrag]);
  
  return (
    <div className="h-[500px] w-full bg-[#0a1525] rounded-lg border border-[#1e2c3b] p-4 relative mb-4" ref={chartRef}>
      <div className="absolute top-4 left-4 z-10 bg-[#0a1525]/80 p-2 rounded border border-[#1e2c3b] text-xs text-gray-300">
        {onPointDrag && (
          <p>Drag any point to adjust the curve</p>
        )}
      </div>
      
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
            formatter={(value) => `${Number(value).toFixed(2)}%`}
            labelFormatter={(value) => `$${Number(value).toLocaleString()}`}
            contentStyle={{ backgroundColor: '#0c1624', borderColor: '#1e2c3b' }}
            itemStyle={{ color: '#fff' }}
            labelStyle={{ color: '#9ca3af' }}
          />
          
          {/* Lend curve */}
          {(orderTab === 'lend' || orderTab === 'both') && (
            <Area 
              type="monotone" 
              dataKey="lendAPR" 
              stroke={lendColor} 
              strokeWidth={2}
              fill={lendColor} 
              fillOpacity={0.2}
              name="Lend APR"
              connectNulls={true}
              isAnimationActive={false}
            />
          )}
          
          {/* Borrow curve */}
          {(orderTab === 'borrow' || orderTab === 'both') && (
            <Area 
              type="monotone" 
              dataKey="borrowAPR" 
              stroke={borrowColor} 
              strokeWidth={2}
              fill={borrowColor} 
              fillOpacity={0.1}
              name="Borrow APR"
              connectNulls={true}
              isAnimationActive={false}
            />
          )}
          
          {/* Lend points */}
          {(orderTab === 'lend' || orderTab === 'both') && (
            <Scatter
              name="Lend Points"
              data={lendPointsData}
              fill={lendColor}
              line={false}
              shape={renderLendDot}
              isAnimationActive={false}
              xAxisId={0}
              yAxisId={0}
            />
          )}
          
          {/* Borrow points */}
          {(orderTab === 'borrow' || orderTab === 'both') && (
            <Scatter
              name="Borrow Points"
              data={borrowPointsData}
              fill={borrowColor}
              line={false}
              shape={renderBorrowDot}
              isAnimationActive={false}
              xAxisId={0}
              yAxisId={0}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
      
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
      
      {/* Legend */}
      <div className="absolute top-4 right-4 bg-[#0a1525]/90 p-2 rounded border border-[#1e2c3b] text-xs">
        <div className="flex items-center gap-1 mb-1">
          {(orderTab === 'lend' || orderTab === 'both') && (
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded-full bg-[#5FBDE9]"></div>
              <span className="text-gray-300">Lend APR</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1">
          {(orderTab === 'borrow' || orderTab === 'both') && (
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded-full bg-[#3182CE]"></div>
              <span className="text-gray-300">Borrow APR</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}