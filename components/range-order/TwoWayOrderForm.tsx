// components/range-order/TwoWayOrderForm.tsx
'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { DollarSign, ArrowDown, Settings } from 'lucide-react'
import { WalletData, RangePoint } from '@/lib/range-order/types'
import CustomParameters from '@/components/range-order/CustomParameters'

interface TwoWayOrderFormProps {
  orderAmount: string;
  setOrderAmount: (amount: string) => void;
  walletData: WalletData;
  minRate: string;
  maxRate: string;
  setMinRate: (rate: string) => void;
  setMaxRate: (rate: string) => void;
  lendPoints: RangePoint[];
  borrowPoints: RangePoint[];
  setLendPoints: React.Dispatch<React.SetStateAction<RangePoint[]>>;
  setBorrowPoints: React.Dispatch<React.SetStateAction<RangePoint[]>>;
  orderTab: 'lend' | 'borrow' | 'both';
}

export default function TwoWayOrderForm({
  orderAmount,
  setOrderAmount,
  walletData,
  minRate,
  maxRate,
  setMinRate,
  setMaxRate,
  lendPoints,
  borrowPoints,
  setLendPoints,
  setBorrowPoints,
  orderTab
}: TwoWayOrderFormProps) {
  // State for the interest amount (XT)
  const [interestAmount, setInterestAmount] = useState('');
  
  // State for the fixed yield amount (calculated, not input - FT)
  const [fixedYieldAmount, setFixedYieldAmount] = useState('');
  
  // Interest percentage slider
  const [interestPercentage, setInterestPercentage] = useState(10);
  
  // Collateral toggle
  const [provideCollateral, setProvideCollateral] = useState(false);
  
  // Collateral amount
  const [collateralAmount, setCollateralAmount] = useState('0');
  
  // Custom parameters toggle
  const [showCustomParams, setShowCustomParams] = useState(false);
  
  // Refs to track where updates are coming from
  const isUpdatingFromTotal = useRef(false);
  const isUpdatingFromInterest = useRef(false);
  const isUpdatingFromSlider = useRef(false);

  // Handle slider change to avoid loops
  const handleSliderChange = (values: number[]) => {
    if (values.length > 0) {
      isUpdatingFromSlider.current = true;
      setInterestPercentage(values[0]);
      
      if (orderAmount && !isNaN(parseFloat(orderAmount))) {
        const totalAmount = parseFloat(orderAmount);
        const interest = totalAmount * (values[0] / 100);
        setInterestAmount(interest.toFixed(2));
        setFixedYieldAmount((totalAmount + interest).toFixed(2));
      }
      
      isUpdatingFromSlider.current = false;
    }
  };
  
  // Handle total amount change
  const handleTotalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setOrderAmount(value);
    
    if (value && !isNaN(parseFloat(value))) {
      isUpdatingFromTotal.current = true;
      const totalAmount = parseFloat(value);
      const interest = totalAmount * (interestPercentage / 100);
      
      setInterestAmount(interest.toFixed(2));
      setFixedYieldAmount((totalAmount + interest).toFixed(2));
      
      isUpdatingFromTotal.current = false;
    }
  };
  
  // Handle interest amount change
  const handleInterestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInterestAmount(value);
    
    if (value && !isNaN(parseFloat(value))) {
      isUpdatingFromInterest.current = true;
      const interest = parseFloat(value);
      // Calculate total based on the interest and percentage
      const totalAmount = interest / (interestPercentage / 100);
      
      setOrderAmount(totalAmount.toFixed(2));
      setFixedYieldAmount((totalAmount + interest).toFixed(2));
      
      isUpdatingFromInterest.current = false;
    }
  };
  
  // Initialize calculation on first render
  useEffect(() => {
    if (!isUpdatingFromInterest.current && !isUpdatingFromSlider.current && orderAmount && !isNaN(parseFloat(orderAmount))) {
      const totalAmount = parseFloat(orderAmount);
      const interest = totalAmount * (interestPercentage / 100);
      
      setInterestAmount(interest.toFixed(2));
      setFixedYieldAmount((totalAmount + interest).toFixed(2));
    }
  }, [orderAmount, interestPercentage]);
  
  // Handle max button for total input amount
  const handleMaxTotal = () => {
    const maxAmount = walletData.debtToken.balance.toString();
    setOrderAmount(maxAmount);
  };
  
  // Handle max button for collateral
  const handleMaxCollateral = () => {
    setCollateralAmount(walletData.collateral.balance.toString());
  };
  
  return (
    <div className="space-y-5">
      {/* Interest Rate Range (%) at the top */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-3">
          <label className="text-sm font-medium text-white">
            Interest Rate Range (%)
          </label>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 w-6 p-0 text-gray-400 hover:text-white hover:bg-[#1e2c3b]"
            onClick={() => setShowCustomParams(!showCustomParams)}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
        
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
      </div>
      
      {/* Custom Parameters (only shown when Settings is clicked) */}
      {showCustomParams && (
        <CustomParameters
          orderTab={orderTab}
          lendPoints={lendPoints}
          borrowPoints={borrowPoints}
          setLendPoints={setLendPoints}
          setBorrowPoints={setBorrowPoints}
        />
      )}
      
      {/* Total Input Amount */}
      <div>
        <label className="block text-sm font-medium text-white mb-1">
          Total Input Amount
        </label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="total-input"
            value={orderAmount}
            onChange={handleTotalChange}
            className="pl-9 bg-[#081020] border-[#1e2c3b]"
            placeholder="0.00"
          />
          <Button
            size="sm"
            variant="ghost"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 text-xs text-[#5FBDE9]"
            onClick={handleMaxTotal}
          >
            MAX
          </Button>
        </div>
        <div className="text-xs text-gray-400 mt-1">
          Available: {walletData.debtToken.balance.toLocaleString()} {walletData.debtToken.symbol}
        </div>
      </div>
      
      {/* Arrow Divider */}
      <div className="flex items-center justify-center">
        <div className="w-10 h-10 rounded-full bg-[#0a1525] border border-[#1e2c3b] flex items-center justify-center">
          <ArrowDown className="h-5 w-5 text-[#5FBDE9]" />
        </div>
      </div>
      
      {/* Interest and Fixed Yield Split */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Interest (XT)
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="interest-input"
              value={interestAmount}
              onChange={handleInterestChange}
              className="pl-9 bg-[#081020] border-[#1e2c3b]"
              placeholder="0.00"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Fixed Yield (FT)
          </label>
          <div className="flex items-center gap-2 text-white mt-1">
            <span className="text-gray-400 text-sm">Σ</span>
            <span className="text-lg font-medium">{fixedYieldAmount || '0.00'}</span>
          </div>
        </div>
      </div>
      
      {/* Interest Ratio Slider */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-white">
            Interest Ratio
          </label>
          <span className="text-sm text-[#5FBDE9]">
            {interestPercentage}%
          </span>
        </div>
        <Slider
          value={[interestPercentage]}
          max={100}
          step={1}
          onValueChange={handleSliderChange}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>
      
      {/* Provide with Collateral Toggle */}
      <div className="pt-2 border-t border-[#1e2c3b]">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-white cursor-pointer">
            Provide with Collateral
          </label>
          <Switch
            checked={provideCollateral}
            onCheckedChange={setProvideCollateral}
          />
        </div>
      </div>
      
      {/* Collateral Input (shown when toggle is on) */}
      {provideCollateral && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-white mb-1">
            Collateral Amount ({walletData.collateral.symbol})
          </label>
          <div className="relative">
            <Input
              value={collateralAmount}
              onChange={(e) => setCollateralAmount(e.target.value)}
              className="bg-[#081020] border-[#1e2c3b]"
              placeholder="0.00"
            />
            <Button
              size="sm"
              variant="ghost"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 text-xs text-[#5FBDE9]"
              onClick={handleMaxCollateral}
            >
              MAX
            </Button>
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Available: {walletData.collateral.balance.toFixed(4)} {walletData.collateral.symbol}
          </div>
        </div>
      )}
      
      {/* Wallet Info for Two-Way Orders - All 4 Fields */}
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
        
        <div className="bg-[#0a1525] rounded-lg p-3 border border-[#1e2c3b]">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">Fixed Yield (FT)</span>
            <span className="text-xs text-white">{walletData.fixedIncome?.symbol}</span>
          </div>
          <div className="flex justify-between items-end mt-1">
            <div>
              <div className="text-white text-base">{walletData.fixedIncome?.balance.toLocaleString()}</div>
              <div className="text-gray-400 text-xs">${walletData.fixedIncome?.value.toLocaleString()}</div>
            </div>
          </div>
        </div>
        
        <div className="bg-[#0a1525] rounded-lg p-3 border border-[#1e2c3b]">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">Interest Tokens (XT)</span>
            <span className="text-xs text-white">{walletData.extraBalance?.symbol}</span>
          </div>
          <div className="flex justify-between items-end mt-1">
            <div>
              <div className="text-white text-base">{walletData.extraBalance?.balance.toLocaleString()}</div>
              <div className="text-gray-400 text-xs">${walletData.extraBalance?.value.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}