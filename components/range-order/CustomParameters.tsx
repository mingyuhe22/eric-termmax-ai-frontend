// components/range-order/CustomParameters.tsx
'use client'

import React from 'react'
import { Plus, Minus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { RangePoint, OrderTab } from '@/lib/range-order/types'

interface CustomParametersProps {
  orderTab: OrderTab
  lendPoints: RangePoint[]
  borrowPoints: RangePoint[]
  setLendPoints: React.Dispatch<React.SetStateAction<RangePoint[]>>
  setBorrowPoints: React.Dispatch<React.SetStateAction<RangePoint[]>>
}

export default function CustomParameters({
  orderTab,
  lendPoints,
  borrowPoints,
  setLendPoints,
  setBorrowPoints
}: CustomParametersProps) {
  // Function to recalculate percentages based on amounts
  const recalculatePercentages = (points: RangePoint[]): RangePoint[] => {
    if (!points.length) return points;
    
    // Find max amount for percentage calculation
    const maxAmount = Math.max(...points.map(p => parseFloat(p.amount || '0')));
    
    return points.map(point => ({
      ...point,
      percentage: Math.round((parseFloat(point.amount || '0') / maxAmount) * 100)
    }));
  };
  
  // Helper function to add a new point with proper percentage calculation
  const addPoint = (isLend: boolean, index: number) => {
    const points = isLend ? [...lendPoints] : [...borrowPoints];
    const currentPoint = points[index];
    const nextPoint = points[index + 1] || { 
      amount: String(parseFloat(currentPoint.amount || '0') + 500000), 
      percentage: currentPoint.percentage + 10, 
      apr: currentPoint.apr 
    };
    
    // Create a new point between current and next
    const newPoint = {
      amount: String(Math.round((parseFloat(currentPoint.amount || '0') + parseFloat(nextPoint.amount || '0')) / 2)),
      percentage: 0, // Will be calculated by recalculatePercentages
      apr: Math.round((currentPoint.apr + nextPoint.apr) / 2)
    };
    
    // Insert the new point
    points.splice(index + 1, 0, newPoint);
    
    // Recalculate percentages for all points
    const updatedPoints = recalculatePercentages(points);
    
    if (isLend) {
      setLendPoints(updatedPoints);
    } else {
      setBorrowPoints(updatedPoints);
    }
  };
  
  // Helper function to remove a point with proper percentage recalculation
  const removePoint = (isLend: boolean, index: number) => {
    if (index <= 0 || index >= (isLend ? lendPoints.length - 1 : borrowPoints.length - 1)) {
      return; // Don't remove first or last point
    }
    
    const points = isLend ? [...lendPoints] : [...borrowPoints];
    points.splice(index, 1);
    
    // Recalculate percentages for all points
    const updatedPoints = recalculatePercentages(points);
    
    if (isLend) {
      setLendPoints(updatedPoints);
    } else {
      setBorrowPoints(updatedPoints);
    }
  };
  
  // Handle individual point changes
  const handlePointChange = (isLend: boolean, index: number, field: keyof RangePoint, value: string) => {
    const points = isLend ? [...lendPoints] : [...borrowPoints];
    
    // Update the specific field
    if (field === 'amount') {
      points[index].amount = value;
      
      // Ensure proper ordering of amounts
      const numValue = parseFloat(value);
      if (index > 0 && numValue <= parseFloat(points[index - 1].amount)) {
        // If new amount is less than previous point, adjust it
        points[index].amount = String(parseFloat(points[index - 1].amount) + 10000);
      }
      if (index < points.length - 1 && numValue >= parseFloat(points[index + 1].amount)) {
        // If new amount is more than next point, adjust it
        points[index].amount = String(parseFloat(points[index + 1].amount) - 10000);
      }
      
      // Recalculate percentages for all points
      const updatedPoints = recalculatePercentages(points);
      
      if (isLend) {
        setLendPoints(updatedPoints);
      } else {
        setBorrowPoints(updatedPoints);
      }
    } else if (field === 'apr') {
      // For APR, just update the value without recalculating percentages
      const numValue = value === '' ? 0 : (isNaN(parseFloat(value)) ? points[index].apr : parseFloat(value));
      points[index].apr = numValue;
      
      if (isLend) {
        setLendPoints([...points]);
      } else {
        setBorrowPoints([...points]);
      }
    }
  };
  
  // Render the parameter table for either lend or borrow
  const renderParameterTable = (isLend: boolean) => {
    const points = isLend ? lendPoints : borrowPoints;
    const title = isLend ? "Lend Parameters" : "Borrow Parameters";
    
    return (
      <div className="mb-4">
        <div className="text-sm text-white font-medium mb-2">{title}</div>
        <div className="grid grid-cols-4 gap-2 p-2 bg-[#081020] rounded-lg mb-2 text-xs text-gray-400">
          <div>Reserve</div>
          <div>% Total</div>
          <div>APR</div>
          <div className="text-center">Actions</div>
        </div>
        
        {points.map((point, index) => (
          <div 
            key={index} 
            className={`grid grid-cols-4 gap-2 p-2 rounded-lg ${
              index % 2 === 0 ? 'bg-[#081020]' : 'bg-transparent'
            } mb-1 items-center`}
          >
            <Input 
              value={point.amount}
              onChange={(e) => handlePointChange(isLend, index, 'amount', e.target.value)}
              className="h-7 text-xs bg-[#061020] border-[#1e2c3b]"
            />
            <div className="text-xs text-gray-400 text-center">
              {point.percentage}%
            </div>
            <Input 
              value={point.apr.toString()}
              onChange={(e) => handlePointChange(isLend, index, 'apr', e.target.value)}
              className="h-7 text-xs bg-[#061020] border-[#1e2c3b]"
            />
            <div className="flex justify-center gap-1">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-5 w-5 bg-transparent border-[#5FBDE9]/30 text-[#5FBDE9] hover:bg-[#5FBDE9]/10"
                onClick={() => addPoint(isLend, index)}
              >
                <Plus className="h-3 w-3" />
              </Button>
              {index > 0 && index < points.length - 1 && (
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-5 w-5 bg-transparent border-red-500/30 text-red-500 hover:bg-red-500/10"
                  onClick={() => removePoint(isLend, index)}
                >
                  <Minus className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div className="bg-[#0a1525] border border-[#1e2c3b] rounded-lg p-3 mb-4">
      <div className="text-sm text-white mb-2">Custom Parameters</div>
      
      {(orderTab === 'lend' || orderTab === 'both') && renderParameterTable(true)}
      {(orderTab === 'borrow' || orderTab === 'both') && renderParameterTable(false)}
    </div>
  );
}