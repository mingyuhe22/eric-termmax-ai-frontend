// components/range-order/LendOrderForm.tsx
'use client'

import React, { useEffect, useState, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { DollarSign, AlertTriangle } from 'lucide-react'
import { WalletData } from '@/lib/range-order/types'

interface LendOrderFormProps {
  orderAmount: string;
  setOrderAmount: (amount: string) => void;
  walletData: WalletData;
  minRate: string;
  maxRate: string;
  setMinRate: (rate: string) => void;
  setMaxRate: (rate: string) => void;
}

export default function LendOrderForm({
  orderAmount,
  setOrderAmount,
  walletData,
  minRate,
  maxRate,
  setMinRate,
  setMaxRate
}: LendOrderFormProps) {
  // State for amount slider
  const [amountPercentage, setAmountPercentage] = useState(50);
  
  // Error state for rate validation
  const [rateError, setRateError] = useState('');
  
  // Refs to track manual changes
  const isUpdatingFromSlider = useRef(false);
  const isUpdatingFromInput = useRef(false);
  
  // Update amount when slider changes
  const handleSliderChange = (values: number[]) => {
    if (values.length > 0) {
      isUpdatingFromSlider.current = true;
      setAmountPercentage(values[0]);
      const maxAmount = walletData.debtToken.balance;
      const calculatedAmount = (maxAmount * values[0] / 100).toFixed(2);
      setOrderAmount(calculatedAmount);
      isUpdatingFromSlider.current = false;
    }
  };
  
  // Update slider when amount changes directly
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setOrderAmount(value);
    
    if (value && !isNaN(parseFloat(value))) {
      isUpdatingFromInput.current = true;
      const percentage = Math.min(100, (parseFloat(value) / walletData.debtToken.balance) * 100);
      setAmountPercentage(percentage);
      isUpdatingFromInput.current = false;
    }
  };
  
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
  
  // Initialize amount percentage on first render
  useEffect(() => {
    if (orderAmount && !isNaN(parseFloat(orderAmount)) && !isUpdatingFromSlider.current) {
      const percentage = Math.min(100, (parseFloat(orderAmount) / walletData.debtToken.balance) * 100);
      setAmountPercentage(percentage);
    }
  }, [orderAmount, walletData.debtToken.balance]);
  
  // Handle max button click
  const handleMax = () => {
    setOrderAmount(walletData.debtToken.balance.toString());
    setAmountPercentage(100);
  };
  
  return (
    <div className="space-y-5">
      {/* Lend Amount Input */}
      <div>
        <label className="block text-sm font-medium text-white mb-1">
          Amount to Lend ({walletData.debtToken.symbol})
        </label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={orderAmount}
            onChange={handleAmountChange}
            className="pl-9 bg-[#081020] border-[#1e2c3b]"
            placeholder="0.00"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 text-xs text-[#5FBDE9]"
            onClick={handleMax}
          >
            MAX
          </Button>
        </div>
        <div className="text-xs text-gray-400 mt-1">
          Available: {walletData.debtToken.balance.toLocaleString()} {walletData.debtToken.symbol}
        </div>
        
        {/* Amount Slider */}
        <div className="mt-2">
          <Slider
            value={[amountPercentage]}
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
      
      {/* Fixed Income Token Balance */}
      <div className="pt-4 border-t border-[#1e2c3b]">
        <div className="bg-[#0a1525] rounded-lg p-3 border border-[#1e2c3b]">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">Fixed Income Token</span>
            <span className="text-xs text-white">{walletData.fixedIncome?.symbol}</span>
          </div>
          <div className="flex justify-between items-end mt-1">
            <div>
              <div className="text-white text-base">{walletData.fixedIncome?.balance.toLocaleString()}</div>
              <div className="text-gray-400 text-xs">${walletData.fixedIncome?.value.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Simple Summary */}
      <div className="bg-[#081020] border border-[#1e2c3b] rounded-lg p-3">
        <div className="text-xs text-gray-400 mb-1">Order Summary</div>
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Lending:</span>
            <span className="text-white">
              {orderAmount ? parseFloat(orderAmount).toLocaleString() : '0'} {walletData.debtToken.symbol}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Interest Range:</span>
            <span className="text-white">
              {minRate}% - {maxRate}%
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}