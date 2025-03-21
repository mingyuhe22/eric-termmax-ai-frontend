// components/range-order/SyncedRangeChart.tsx
'use client'

import React, { useState, useRef, useEffect, useMemo, JSX } from 'react'
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, ReferenceLine
} from 'recharts'
import { ZoomIn, ZoomOut, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RangePoint, OrderTab } from '@/lib/range-order/types'

interface SyncedRangeChartProps {
  orderTab: OrderTab
  lendPoints: RangePoint[]
  borrowPoints: RangePoint[]
  zoomLevel: number
  setZoomLevel: React.Dispatch<React.SetStateAction<number>>
  onPointDrag?: (type: 'lend' | 'borrow', index: number, newValues: Partial<RangePoint>) => void
  maxAmount?: number // Maximum input amount for reference line
}

export default function SyncedRangeChart({
  orderTab,
  lendPoints,
  borrowPoints,
  zoomLevel,
  setZoomLevel,
  onPointDrag,
  maxAmount
}: SyncedRangeChartProps) {
  // Chart ref to get dimensions for drag calculations
  const chartRef = useRef<HTMLDivElement>(null);
  
  // State to track which point is being dragged
  const [draggedPoint, setDraggedPoint] = useState<{
    type: 'lend' | 'borrow';
    index: number;
  } | null>(null);
  
  // Track if mouse is currently pressed
  const [isMouseDown, setIsMouseDown] = useState(false);

  // Colors for chart elements
  const lendColor = "#5FBDE9";
  const borrowColor = "#3182CE";
  
  // Generate chart data based on current points
  const chartData = useMemo(() => {
    // Find the maximum amount across both point sets
    const maxLendAmount = Math.max(...lendPoints.map(p => parseFloat(p.amount || '0')));
    const maxBorrowAmount = Math.max(...borrowPoints.map(p => parseFloat(p.amount || '0')));
    const maxChartAmount = Math.max(maxLendAmount, maxBorrowAmount, 1000000); // Default if no points
    
    // Generate smooth curve data
    const data = [];
    const steps = 100;
    const step = maxChartAmount / steps;
    
    for (let i = 0; i <= steps; i++) {
      const amount = i * step;
      const dataPoint: { amount: number; lendAPR?: number; borrowAPR?: number } = { amount };
      
      if (orderTab === 'lend' || orderTab === 'both') {
        dataPoint.lendAPR = interpolateAPR(amount, lendPoints);
      }
      
      if (orderTab === 'borrow' || orderTab === 'both') {
        dataPoint.borrowAPR = interpolateAPR(amount, borrowPoints);
      }
      
      data.push(dataPoint);
    }
    
    return data;
  }, [lendPoints, borrowPoints, orderTab]);
  
  // Helper function to interpolate APR between points
  function interpolateAPR(amount: number, points: RangePoint[]) {
    if (!points || points.length === 0) return 0;
    
    // If amount is less than the first point, return the first point's APR
    if (amount <= parseFloat(points[0].amount)) {
      return points[0].apr;
    }
    
    // If amount is greater than the last point, return the last point's APR
    if (amount >= parseFloat(points[points.length - 1].amount)) {
      return points[points.length - 1].apr;
    }
    
    // Find surrounding points
    for (let i = 0; i < points.length - 1; i++) {
      const currentAmount = parseFloat(points[i].amount);
      const nextAmount = parseFloat(points[i + 1].amount);
      
      if (amount >= currentAmount && amount <= nextAmount) {
        // Linear interpolation
        const ratio = (amount - currentAmount) / (nextAmount - currentAmount);
        return points[i].apr + ratio * (points[i + 1].apr - points[i].apr);
      }
    }
    
    // Fallback (should not reach here with correct data)
    return points[0].apr;
  }
  
  // Calculate max X axis value based on zoom level
  const chartMaxX = useMemo(() => {
    const maxLendAmount = Math.max(...lendPoints.map(p => parseFloat(p.amount)));
    const maxBorrowAmount = Math.max(...borrowPoints.map(p => parseFloat(p.amount)));
    const defaultMax = Math.max(maxLendAmount, maxBorrowAmount, 1000000);
    return defaultMax * zoomLevel;
  }, [lendPoints, borrowPoints, zoomLevel]);

  // Reset zoom
  const resetZoom = () => setZoomLevel(1);
  
  // Handle mouse down on a point
  const handlePointMouseDown = (type: 'lend' | 'borrow', index: number, e: React.MouseEvent) => {
    if (!onPointDrag) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    setDraggedPoint({ type, index });
    setIsMouseDown(true);
  };
  
  // Function to render drag handles over the chart
  const renderPointHandles = () => {
    if (!onPointDrag || !chartRef.current) return null;
    
    const handles: JSX.Element[] = [];
    
    // Calculate point positions from lendPoints data
    if ((orderTab === 'lend' || orderTab === 'both') && lendPoints && lendPoints.length > 0) {
      lendPoints.forEach((point, index) => {
        // Convert data values to screen coordinates
        try {
          const amount = parseFloat(point.amount || '0');
          const xPercent = amount / chartMaxX;
          
          // Don't render points outside the visible area
          if (xPercent > 1.1) return;
          
          // Calculate positions as percentages of chart area
          const chartWidth = chartRef.current?.clientWidth || 400;
          const chartHeight = chartRef.current?.clientHeight || 400;
          const xPos = 60 + (xPercent * (chartWidth - 90));
          const yPos = 20 + ((1 - (point.apr / 70)) * (chartHeight - 60));
          
          handles.push(
            <div 
              key={`lend-handle-${index}`}
              className="absolute w-6 h-6 flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 cursor-move"
              style={{
                left: `${xPos}px`,
                top: `${yPos}px`,
                zIndex: 30
              }}
              onMouseDown={(e) => handlePointMouseDown('lend', index, e)}
            >
              <div className="w-4 h-4 rounded-full border-2 border-white shadow-lg hover:w-5 hover:h-5 transition-all duration-150"
                style={{ backgroundColor: lendColor }}
              ></div>
            </div>
          );
        } catch (err) {
          console.error('Error rendering lend handle:', err);
        }
      });
    }
    
    // Calculate point positions from borrowPoints data
    if ((orderTab === 'borrow' || orderTab === 'both') && borrowPoints && borrowPoints.length > 0) {
      borrowPoints.forEach((point, index) => {
        try {
          const amount = parseFloat(point.amount || '0');
          const xPercent = amount / chartMaxX;
          
          // Don't render points outside the visible area
          if (xPercent > 1.1) return;
          
          // Calculate positions as percentages of chart area
          const chartWidth = chartRef.current?.clientWidth || 400;
          const chartHeight = chartRef.current?.clientHeight || 400;
          const xPos = 60 + (xPercent * (chartWidth - 90));
          const yPos = 20 + ((1 - (point.apr / 70)) * (chartHeight - 60));
          
          handles.push(
            <div 
              key={`borrow-handle-${index}`}
              className="absolute w-6 h-6 flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 cursor-move"
              style={{
                left: `${xPos}px`,
                top: `${yPos}px`,
                zIndex: 30
              }}
              onMouseDown={(e) => handlePointMouseDown('borrow', index, e)}
            >
              <div className="w-4 h-4 rounded-full border-2 border-white shadow-lg hover:w-5 hover:h-5 transition-all duration-150"
                style={{ backgroundColor: borrowColor }}
              ></div>
            </div>
          );
        } catch (err) {
          console.error('Error rendering borrow handle:', err);
        }
      });
    }
    
    return handles;
  };
  
  // Handle global mouse events for dragging
  useEffect(() => {
    if (!onPointDrag || !isMouseDown || !draggedPoint) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!chartRef.current) return;
      
      const { type, index } = draggedPoint;
      const chartRect = chartRef.current.getBoundingClientRect();
      
      // Account for padding and margins
      const padding = {
        left: 60,    // YAxis width
        right: 30,
        top: 20,
        bottom: 40   // XAxis height
      };
      
      // Calculate available chart area
      const chartWidth = chartRect.width - padding.left - padding.right;
      const chartHeight = chartRect.height - padding.top - padding.bottom;
      
      // Calculate relative position within chart area
      const relativeX = (e.clientX - chartRect.left - padding.left) / chartWidth;
      const relativeY = 1 - (e.clientY - chartRect.top - padding.top) / chartHeight;
      
      // Clamp values to valid range (0-1)
      const clampedX = Math.max(0, Math.min(1, relativeX));
      const clampedY = Math.max(0, Math.min(1, relativeY));
      
      // Convert to chart values
      const newAmount = clampedX * chartMaxX;
      const maxAPR = 70; // Max APR on Y axis
      const newAPR = clampedY * maxAPR;
      
      // Get relevant points array
      const points = type === 'lend' ? lendPoints : borrowPoints;
      
      // Extra safety checks
      if (!points || points.length === 0 || index < 0 || index >= points.length) {
        return;
      }
      
      // Implement constraints to maintain point order
      let constrainedAmount = newAmount;
      
      // Don't allow moving past adjacent points - with safety checks
      if (index > 0 && points[index - 1] && points[index - 1].amount) {
        try {
          const minAmount = parseFloat(points[index - 1].amount) + 10000;
          constrainedAmount = Math.max(minAmount, constrainedAmount);
        } catch (err) {
          console.error('Error calculating minimum amount constraint:', err);
        }
      }
      
      if (index < points.length - 1 && points[index + 1] && points[index + 1].amount) {
        try {
          const maxAmount = parseFloat(points[index + 1].amount) - 10000;
          constrainedAmount = Math.min(maxAmount, constrainedAmount);
        } catch (err) {
          console.error('Error calculating maximum amount constraint:', err);
        }
      }
      
      // Keep APR in valid range (1-70%)
      const constrainedAPR = Math.max(1, Math.min(maxAPR, newAPR));
      
      // Update point via callback
      onPointDrag(type, index, {
        amount: constrainedAmount.toString(),
        apr: constrainedAPR
      });
    };
    
    // Handle mouse up to end dragging
    const handleMouseUp = () => {
      setIsMouseDown(false);
      setDraggedPoint(null);
    };
    
    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    // Clean up
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isMouseDown, draggedPoint, lendPoints, borrowPoints, chartMaxX, onPointDrag]);
  
  return (
    <div 
      className="h-[500px] w-full bg-[#0a1525] rounded-lg border border-[#1e2c3b] p-4 relative mb-4" 
      ref={chartRef}
    >
      {onPointDrag && (
        <div className="absolute top-4 left-4 z-10 bg-[#0a1525] p-2 rounded border border-[#1e2c3b] text-xs text-gray-300">
          <p>Drag colored points to adjust the curve</p>
        </div>
      )}
      
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1e2c3b" />
          <XAxis 
            dataKey="amount" 
            domain={[0, chartMaxX]}
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
              isAnimationActive={false}
              dot={false}
              activeDot={false} // Using custom dots instead
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
              isAnimationActive={false}
              dot={false}
              activeDot={false} // Using custom dots instead
            />
          )}
          
          {/* Fixed amount reference line */}
          {maxAmount && (
            <ReferenceLine 
              x={maxAmount} 
              stroke="#f6ad55" 
              strokeWidth={2} 
              strokeDasharray="5 5"
              label={{
                value: 'Max Input',
                position: 'top',
                fill: '#f6ad55',
                fontSize: 12
              }}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
      
      {/* Add custom draggable point handles */}
      {renderPointHandles()}
      
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
        {maxAmount && (
          <div className="flex items-center gap-1 mt-1">
            <div className="h-3 w-0.5 bg-[#f6ad55]"></div>
            <span className="text-gray-300">Max Input Amount</span>
          </div>
        )}
      </div>
    </div>
  );
}