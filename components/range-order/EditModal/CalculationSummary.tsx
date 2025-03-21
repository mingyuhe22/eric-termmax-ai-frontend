// components/range-order/EditModal/CalculationSummary.tsx
'use client'

import React from 'react'
import { ArrowRight } from 'lucide-react'
import { Position } from '@/lib/mock/range-order-mock-data'

interface CalculationSummaryProps {
  position: Position
  action: string
  amount: number
  positionType: 'lend' | 'borrow' | 'two-way'
}

export default function CalculationSummary({
  position,
  action,
  amount,
  positionType
}: CalculationSummaryProps) {
  // Function to calculate change impact based on action and amount
  const calculateImpact = () => {
    if (!amount) return null;
    
    const impact: Record<string, { current: string; new: string; change: string }> = {};
    
    if (positionType === 'lend') {
      if (action === 'supply') {
        // Calculate impact of supplying more to lend position
        const currentSupplied = parseFloat(position.suppliedAmount?.replace(/,/g, '') || '0');
        const newSupplied = currentSupplied + amount;
        
        impact.suppliedAmount = {
          current: formatAmount(currentSupplied),
          new: formatAmount(newSupplied),
          change: `+${formatAmount(amount)}`
        };
        
        // Update available to withdraw
        const currentAvailable = parseFloat(position.availableToWithdraw.replace(/,/g, '') || '0');
        impact.availableToWithdraw = {
          current: formatAmount(currentAvailable),
          new: formatAmount(currentAvailable + amount),
          change: `+${formatAmount(amount)}`
        };
        
      } else if (action === 'withdraw') {
        // Calculate impact of withdrawing from lend position
        const currentSupplied = parseFloat(position.suppliedAmount?.replace(/,/g, '') || '0');
        const newSupplied = Math.max(0, currentSupplied - amount);
        
        impact.suppliedAmount = {
          current: formatAmount(currentSupplied),
          new: formatAmount(newSupplied),
          change: `-${formatAmount(amount)}`
        };
        
        // Update available to withdraw
        const currentAvailable = parseFloat(position.availableToWithdraw.replace(/,/g, '') || '0');
        impact.availableToWithdraw = {
          current: formatAmount(currentAvailable),
          new: formatAmount(Math.max(0, currentAvailable - amount)),
          change: `-${formatAmount(amount)}`
        };
      }
    } else if (positionType === 'borrow') {
      if (action === 'add') {
        // Calculate impact of adding collateral
        const currentCollateral = parseFloat(position.collateralAmount?.replace(/,/g, '') || '0');
        const newCollateral = currentCollateral + amount;
        
        impact.collateralAmount = {
          current: formatAmount(currentCollateral, position.collateral),
          new: formatAmount(newCollateral, position.collateral),
          change: `+${formatAmount(amount, position.collateral)}`
        };
        
        // Update health factor (simplified calculation)
        const currentHealthFactor = parseFloat(position.healthFactor || '0');
        const estimatedNewHealthFactor = currentHealthFactor * (newCollateral / currentCollateral);
        
        impact.healthFactor = {
          current: currentHealthFactor.toFixed(2),
          new: estimatedNewHealthFactor.toFixed(2),
          change: `+${(estimatedNewHealthFactor - currentHealthFactor).toFixed(2)}`
        };
        
        // Update borrowing capacity
        const currentCapacity = parseFloat(position.borrowingCapacity?.replace(/,/g, '') || '0');
        const estimatedNewCapacity = currentCapacity * (newCollateral / currentCollateral);
        
        impact.borrowingCapacity = {
          current: formatAmount(currentCapacity),
          new: formatAmount(estimatedNewCapacity),
          change: `+${formatAmount(estimatedNewCapacity - currentCapacity)}`
        };
        
      } else if (action === 'remove') {
        // Calculate impact of removing collateral
        const currentCollateral = parseFloat(position.collateralAmount?.replace(/,/g, '') || '0');
        const newCollateral = Math.max(0, currentCollateral - amount);
        
        impact.collateralAmount = {
          current: formatAmount(currentCollateral, position.collateral),
          new: formatAmount(newCollateral, position.collateral),
          change: `-${formatAmount(amount, position.collateral)}`
        };
        
        // Update health factor (simplified calculation)
        const currentHealthFactor = parseFloat(position.healthFactor || '0');
        const estimatedNewHealthFactor = newCollateral > 0 ? 
          currentHealthFactor * (newCollateral / currentCollateral) : 0;
        
        impact.healthFactor = {
          current: currentHealthFactor.toFixed(2),
          new: estimatedNewHealthFactor.toFixed(2),
          change: `-${(currentHealthFactor - estimatedNewHealthFactor).toFixed(2)}`
        };
        
        // Update borrowing capacity
        const currentCapacity = parseFloat(position.borrowingCapacity?.replace(/,/g, '') || '0');
        const estimatedNewCapacity = newCollateral > 0 ?
          currentCapacity * (newCollateral / currentCollateral) : 0;
        
        impact.borrowingCapacity = {
          current: formatAmount(currentCapacity),
          new: formatAmount(estimatedNewCapacity),
          change: `-${formatAmount(currentCapacity - estimatedNewCapacity)}`
        };
        
      } else if (action === 'withdraw') {
        // Calculate impact of withdrawing borrowed funds
        const currentBorrowed = parseFloat(position.borrowedAmount?.replace(/,/g, '') || '0');
        const newBorrowed = currentBorrowed + amount;
        
        impact.borrowedAmount = {
          current: formatAmount(currentBorrowed),
          new: formatAmount(newBorrowed),
          change: `+${formatAmount(amount)}`
        };
        
        // Update health factor (simplified)
        const currentHealthFactor = parseFloat(position.healthFactor || '0');
        const estimatedNewHealthFactor = currentHealthFactor * (currentBorrowed / newBorrowed);
        
        impact.healthFactor = {
          current: currentHealthFactor.toFixed(2),
          new: estimatedNewHealthFactor.toFixed(2),
          change: `-${(currentHealthFactor - estimatedNewHealthFactor).toFixed(2)}`
        };
      }
    } else {
      // For two-way positions, impact calculation depends on specific action
      if (action === 'supply' || action === 'withdraw') {
        // Lender side actions
        if (action === 'supply') {
          const currentSupplied = parseFloat(position.suppliedAmount?.replace(/,/g, '') || '0');
          const newSupplied = currentSupplied + amount;
          
          impact.suppliedAmount = {
            current: formatAmount(currentSupplied),
            new: formatAmount(newSupplied),
            change: `+${formatAmount(amount)}`
          };
        } else { // withdraw
          const currentSupplied = parseFloat(position.suppliedAmount?.replace(/,/g, '') || '0');
          const newSupplied = Math.max(0, currentSupplied - amount);
          
          impact.suppliedAmount = {
            current: formatAmount(currentSupplied),
            new: formatAmount(newSupplied),
            change: `-${formatAmount(amount)}`
          };
        }
      } else if (action === 'add' || action === 'remove') {
        // Borrower collateral actions
        if (action === 'add') {
          const currentCollateral = parseFloat(position.collateralAmount?.replace(/,/g, '') || '0');
          const newCollateral = currentCollateral + amount;
          
          impact.collateralAmount = {
            current: formatAmount(currentCollateral, position.collateral),
            new: formatAmount(newCollateral, position.collateral),
            change: `+${formatAmount(amount, position.collateral)}`
          };
        } else { // remove
          const currentCollateral = parseFloat(position.collateralAmount?.replace(/,/g, '') || '0');
          const newCollateral = Math.max(0, currentCollateral - amount);
          
          impact.collateralAmount = {
            current: formatAmount(currentCollateral, position.collateral),
            new: formatAmount(newCollateral, position.collateral),
            change: `-${formatAmount(amount, position.collateral)}`
          };
        }
      }
    }
    
    return impact;
  };
  
  const formatAmount = (amount: number, symbol?: string): string => {
    return `${amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}${symbol ? ` ${symbol}` : ''}`;
  };
  
  const impact = calculateImpact();
  
  if (!impact || Object.keys(impact).length === 0) {
    return (
      <div className="mt-4 p-4 border border-[#1e2c3b] rounded-lg bg-[#0a1525]">
        <p className="text-gray-400 text-sm">Enter an amount to see how it will affect your position.</p>
      </div>
    );
  }
  
  return (
    <div className="mt-4 border border-[#1e2c3b] rounded-lg overflow-hidden">
      <div className="bg-[#0a1525] p-3 border-b border-[#1e2c3b]">
        <h3 className="text-sm font-medium text-white">Transaction Impact</h3>
      </div>
      
      <div className="p-4 bg-[#0c1624]">
        <table className="w-full text-sm">
          <thead className="text-gray-400 text-xs">
            <tr>
              <th className="text-left pb-2">Parameter</th>
              <th className="text-right pb-2">Current</th>
              <th className="text-center pb-2 px-2"></th>
              <th className="text-right pb-2">New Value</th>
              <th className="text-right pb-2">Change</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(impact).map(([key, value]) => (
              <tr key={key} className="border-t border-[#1e2c3b]/50">
                <td className="py-2 text-white capitalize">{key.replace(/([A-Z])/g, ' $1')}</td>
                <td className="py-2 text-right text-gray-400">{value.current}</td>
                <td className="py-2 text-center px-2">
                  <ArrowRight className="h-3 w-3 text-gray-500 inline" />
                </td>
                <td className="py-2 text-right text-white">{value.new}</td>
                <td className={`py-2 text-right ${value.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                  {value.change}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="mt-4 pt-4 border-t border-[#1e2c3b]/50 text-xs text-gray-400">
          <p>Note: These calculations are estimates and may vary based on market conditions.</p>
        </div>
      </div>
    </div>
  )
}