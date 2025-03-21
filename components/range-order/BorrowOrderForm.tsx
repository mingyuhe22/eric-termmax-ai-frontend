// components/range-order/BorrowOrderForm.tsx
'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { DollarSign, Info, AlertTriangle } from 'lucide-react'
import { WalletData } from '@/lib/range-order/types'

interface BorrowOrderFormProps {
  orderAmount: string;
  setOrderAmount: (amount: string) => void;
  walletData: WalletData;
  maxLtv: number;
  minRate: string;
  maxRate: string;
  setMinRate: (rate: string) => void;
  setMaxRate: (rate: string) => void;
}

export default function BorrowOrderForm({
  orderAmount,
  setOrderAmount,
  walletData,
  maxLtv = 0.82, // Default value
  minRate,
  maxRate,
  setMinRate,
  setMaxRate
}: BorrowOrderFormProps) {
  // State for collateral amount
  const [collateralAmount, setCollateralAmount] = useState('');
  // State for collateral slider
  const [collateralPercentage, setCollateralPercentage] = useState(50);
  
  // Calculated health factor
  const [healthFactor, setHealthFactor] = useState(0);
  
  // Error state for rate validation
  const [rateError, setRateError] = useState('');
  
  // Refs to track manual changes
  const isUpdatingFromSlider = useRef(false);
  const isUpdatingFromInput = useRef(false);
  
  // Handle slider change
  const handleSliderChange = (values: number[]) => {
    if (values.length > 0) {
      isUpdatingFromSlider.current = true;
      setCollateralPercentage(values[0]);
      const maxCollateral = walletData.collateral.balance;
      const calculatedAmount = (maxCollateral * values[0] / 100).toFixed(4);
      setCollateralAmount(calculatedAmount);
      isUpdatingFromSlider.current = false;
    }
  };
  
  // Handle collateral input change
  const handleCollateralChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCollateralAmount(value);
    
    if (value && !isNaN(parseFloat(value))) {
      isUpdatingFromInput.current = true;
      const percentage = Math.min(100, (parseFloat(value) / walletData.collateral.balance) * 100);
      setCollateralPercentage(percentage);
      isUpdatingFromInput.current = false;
    }
  };
  
  // Initialize collateral percentage on first render
  useEffect(() => {
    if (collateralAmount && !isNaN(parseFloat(collateralAmount)) && !isUpdatingFromSlider.current) {
      const percentage = Math.min(100, (parseFloat(collateralAmount) / walletData.collateral.balance) * 100);
      setCollateralPercentage(percentage);
    }
  }, [collateralAmount, walletData.collateral.balance]);
  
  // Validate rates
  useEffect(() => {
    if (minRate && maxRate && !isNaN(parseFloat(minRate)) && !isNaN(parseFloat(maxRate))) {
      if (parseFloat(minRate) >= parseFloat(maxRate)) {
        setRateError('Minimum rate must be less than maximum rate');
      } else {
        setRateError('');
      }
    }
  }, [minRate, maxRate]);
  
  // Calculate max borrowing capacity based on collateral
  const calculateMaxBorrow = () => {
    if (!collateralAmount || isNaN(parseFloat(collateralAmount))) return 0;
    
    const collateral = parseFloat(collateralAmount);
    const collateralValue = collateral * (walletData.collateral.value / walletData.collateral.balance);
    return collateralValue * maxLtv;
  };
  
  // Update health factor when values change
  useEffect(() => {
    if (orderAmount && collateralAmount && 
        !isNaN(parseFloat(orderAmount)) && 
        !isNaN(parseFloat(collateralAmount))) {
      
      const borrowAmount = parseFloat(orderAmount);
      const collateralValue = parseFloat(collateralAmount) * 
        (walletData.collateral.value / walletData.collateral.balance);
      
      if (borrowAmount > 0) {
        const newHealthFactor = collateralValue / borrowAmount / maxLtv;
        setHealthFactor(newHealthFactor);
      } else {
        setHealthFactor(0);
      }
    } else {
      setHealthFactor(0);
    }
  }, [orderAmount, collateralAmount, maxLtv, walletData]);
  
  // Handle max button clicks
  const handleMaxCollateral = () => {
    setCollateralAmount(walletData.collateral.balance.toString());
    setCollateralPercentage(100);
  };
  
  const handleMaxBorrow = () => {
    const maxBorrow = calculateMaxBorrow();
    setOrderAmount(maxBorrow.toFixed(2));
  };
  
  return (
    <div className="space-y-5">
      {/* Collateral Input */}
      <div>
        <label className="block text-sm font-medium text-white mb-1">
          Collateral Amount ({walletData.collateral.symbol})
        </label>
        <div className="relative">
          <Input
            value={collateralAmount}
            onChange={handleCollateralChange}
            className="bg-[#081020] border-[#1e2c3b]"
            placeholder="0.00"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 text-xs text-[#5FBDE9]"
            onClick={handleMaxCollateral}
          >
            MAX
          </Button>
        </div>
        <div className="text-xs text-gray-400 mt-1">
          Available: {walletData.collateral.balance.toFixed(4)} {walletData.collateral.symbol}
        </div>
        
        {/* Collateral Slider */}
        <div className="mt-2">
          <Slider
            value={[collateralPercentage]}
            max={100}
            step={1}
            onValueChange={handleSliderChange}
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
      </div>
      
      {/* Borrow Amount Input */}
      <div>
        <label className="block text-sm font-medium text-white mb-1">
          Amount to Borrow ({walletData.debtToken.symbol})
        </label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={orderAmount}
            onChange={(e) => setOrderAmount(e.target.value)}
            className="pl-9 bg-[#081020] border-[#1e2c3b]"
            placeholder="0.00"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 text-xs text-[#5FBDE9]"
            onClick={handleMaxBorrow}
            disabled={!collateralAmount || parseFloat(collateralAmount) <= 0}
          >
            MAX
          </Button>
        </div>
        <div className="text-xs text-gray-400 mt-1">
          Max borrowing capacity: {calculateMaxBorrow().toLocaleString()} {walletData.debtToken.symbol}
        </div>
      </div>
      
      {/* Interest Rate Range */}
      <div className="pt-3 border-t border-[#1e2c3b]">
        <label className="block text-sm font-medium text-white mb-3">
          Interest Rate Range (%)
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-gray-400 mb-1">Minimum Rate</div>
            <Input
              value={minRate}
              onChange={(e) => setMinRate(e.target.value)}
              className="bg-[#081020] border-[#1e2c3b]"
              placeholder="e.g. 5.00"
            />
          </div>
          <div>
            <div className="text-xs text-gray-400 mb-1">Maximum Rate</div>
            <Input
              value={maxRate}
              onChange={(e) => setMaxRate(e.target.value)}
              className="bg-[#081020] border-[#1e2c3b]"
              placeholder="e.g. 15.00"
            />
          </div>
        </div>
        
        {/* Rate validation error */}
        {rateError && (
          <div className="mt-2 text-xs text-red-400 flex items-center">
            <AlertTriangle className="h-3 w-3 mr-1" />
            {rateError}
          </div>
        )}
      </div>
      
      {/* Health Factor */}
      <div className="bg-[#081020] border border-[#1e2c3b] rounded-lg p-3">
        <div className="flex items-center gap-1 mb-1">
          <span className="text-xs text-gray-400">Health Factor</span>
          <div className="relative group">
            <Info className="h-3 w-3 text-gray-500" />
            <div className="absolute left-0 bottom-full mb-2 w-48 p-2 bg-[#0a1525] border border-[#1e2c3b] rounded text-xs text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
              Health factor represents your position safety. Higher is better. Below 1 risks liquidation.
            </div>
          </div>
        </div>
        <div className={`text-xl font-medium ${
          healthFactor >= 1.5 ? 'text-green-400' : 
          healthFactor >= 1.1 ? 'text-yellow-400' : 
          'text-red-400'
        }`}>
          {healthFactor ? healthFactor.toFixed(2) : '-'}
        </div>
      </div>
      
      {/* Wallet Information */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#1e2c3b]">
        <div className="bg-[#0a1525] rounded-lg p-3 border border-[#1e2c3b]">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">Debt Token</span>
            <span className="text-xs text-white">{walletData.debtToken.symbol}</span>
          </div>
          <div className="flex justify-between items-end mt-1">
            <div>
              <div className="text-white text-base">{walletData.debtToken.balance.toLocaleString()}</div>
              <div className="text-gray-400 text-xs">${walletData.debtToken.value.toLocaleString()}</div>
            </div>
          </div>
        </div>
        
        <div className="bg-[#0a1525] rounded-lg p-3 border border-[#1e2c3b]">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">Collateral</span>
            <span className="text-xs text-white">{walletData.collateral.symbol}</span>
          </div>
          <div className="flex justify-between items-end mt-1">
            <div>
              <div className="text-white text-base">{walletData.collateral.balance.toFixed(4)}</div>
              <div className="text-gray-400 text-xs">${walletData.collateral.value.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}