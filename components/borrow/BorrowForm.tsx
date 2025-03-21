// components/borrow/BorrowForm.tsx
import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Market } from '@/types/borrow';

export interface BorrowFormProps {
  market: Market;
  activeTab: 'market' | 'limit';
  leverageValue: number;
  isLeverageActive: boolean;
  onLeverageChange: (value: number) => void;
}

const BorrowForm: React.FC<BorrowFormProps> = ({ 
  market, 
  activeTab, 
  leverageValue, 
  isLeverageActive, 
  onLeverageChange 
}) => {
  // Form state
  const [collateralAmount, setCollateralAmount] = useState<string>('');
  const [borrowAmount, setBorrowAmount] = useState<string>('');
  const [sliderValue, setSliderValue] = useState<number>(47); // Default 47% LTV
  const [healthFactor, setHealthFactor] = useState<number>(0);
  const [targetRate, setTargetRate] = useState<string>('5.45');
  
  // Mock wallet balance
  const walletBalance = 10.5;
  
  // Calculate max borrowing capacity
  const calculateMaxBorrow = (): number => {
    if (!collateralAmount || isNaN(parseFloat(collateralAmount))) return 0;
    const collateral = parseFloat(collateralAmount);
    const maxLtv = market.maxLtv || 0.94; // Use market max LTV or default to 94%
    return collateral * maxLtv * (isLeverageActive ? leverageValue : 1.0);
  };

  // Handle max collateral button
  const handleMaxCollateral = (): void => {
    setCollateralAmount(walletBalance.toString());
  };
  
  // Handle max borrow button
  const handleMaxBorrow = (): void => {
    const maxBorrow = calculateMaxBorrow();
    setBorrowAmount(maxBorrow.toFixed(4));
    setSliderValue(94); // 94% is max LTV
  };
  
  // Update borrow amount when collateral, slider, or leverage changes
  useEffect(() => {
    if (collateralAmount && !isNaN(parseFloat(collateralAmount))) {
      const collateralValue = parseFloat(collateralAmount);
      const ltv = sliderValue / 100;
      const leverageFactor = isLeverageActive ? leverageValue : 1.0;
      const newBorrowAmount = collateralValue * ltv * leverageFactor;
      setBorrowAmount(newBorrowAmount.toFixed(4));
      
      // Update health factor calculation
      const healthFactor = collateralValue > 0 && newBorrowAmount > 0 
        ? (collateralValue / newBorrowAmount) * 0.9 / (isLeverageActive ? leverageValue : 1.0)
        : 0;
      setHealthFactor(healthFactor);
    } else {
      setBorrowAmount('');
      setHealthFactor(0);
    }
  }, [collateralAmount, sliderValue, leverageValue, isLeverageActive]);
  
  // Handle leverage slider change
  const handleLeverageSliderChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newValue = parseFloat(e.target.value);
    onLeverageChange(newValue);
  };
  
  return (
    <div className="p-6 pt-0 space-y-6">
      {/* Collateral Input */}
      <div>
        <label className="text-sm text-gray-400 block mb-2">
          Collateral Amount
        </label>
        <div className="flex items-center gap-2">
          <div className="flex-grow relative">
            <input
              type="number"
              value={collateralAmount}
              onChange={(e) => setCollateralAmount(e.target.value)}
              className="w-full pl-4 pr-28 py-2 rounded-md bg-[#0a1525] border border-[#1e2c3b] text-white h-12"
              placeholder="0"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 flex items-center gap-1">
              <span>{market.collateral}</span>
            </div>
          </div>
          <button 
            className="px-3 py-1 rounded-md border border-[#1e2c3b] text-[#47A6E5] text-sm hover:text-white transition-colors"
            onClick={handleMaxCollateral}
          >
            Max
          </button>
        </div>
        <div className="mt-1 text-xs text-gray-400 text-right">
          Balance: {walletBalance} {market.collateral}
        </div>
      </div>
      
      {/* Leverage Slider - Only if market supports leverage and we're in market order mode */}
      {market.supportsLeverage && activeTab === 'market' && (
        <div className="bg-[#0c1624] border border-[#1e2c3b] rounded-md p-4">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-white">Leverage</span>
              <div className={`px-2 py-0.5 rounded-full text-xs ${
                isLeverageActive
                  ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30" 
                  : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
              }`}>
                {leverageValue.toFixed(1)}x
              </div>
            </div>
          </div>
          
          <div className="mt-2">
            <input
              type="range"
              min="1.0"
              max={market.maxLeverage || 12.4}
              step="0.1"
              value={leverageValue}
              onChange={handleLeverageSliderChange}
              className="w-full h-1.5 bg-[#0a1525] rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, ${isLeverageActive ? '#F59E0B' : '#1e2c3b'} 0%, ${isLeverageActive ? '#F59E0B' : '#1e2c3b'} ${((leverageValue - 1) / (market.maxLeverage - 1)) * 100}%, #0a1525 ${((leverageValue - 1) / (market.maxLeverage - 1)) * 100}%, #0a1525 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>1.0x</span>
              <span>{market.maxLeverage || 12.4}x</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Target APR - for Limit Orders */}
      {activeTab === 'limit' && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-gray-400">Target APR</label>
            <div className="text-xs text-gray-400">
              Current Market: {market.borrowAPR.toFixed(2)}%
            </div>
          </div>
          
          <div className="relative">
            <input
              type="number"
              step="0.01"
              value={targetRate}
              onChange={(e) => setTargetRate(e.target.value)}
              className="w-full pl-4 pr-16 py-2 rounded-md bg-[#0a1525] border border-[#1e2c3b] text-white h-12"
              placeholder="0"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              % APR
            </div>
          </div>
          
          <div className="mt-1 text-xs text-right">
            <span className="text-gray-400">Discount: </span>
            <span className="text-green-400">
              {targetRate && (market.borrowAPR - parseFloat(targetRate)).toFixed(1)}%
            </span>
          </div>
        </div>
      )}
      
      {/* Target Borrow Amount */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm text-gray-400">Target Borrow Amount</label>
          <div className="text-xs text-gray-400">
            Slider adjusts LTV
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex-grow relative">
            <input
              type="number"
              value={borrowAmount}
              onChange={(e) => {
                setBorrowAmount(e.target.value);
                if (e.target.value && collateralAmount) {
                  const borrowVal = parseFloat(e.target.value);
                  const collateralVal = parseFloat(collateralAmount);
                  if (collateralVal > 0) {
                    const newSliderValue = Math.min(94, (borrowVal / collateralVal / (isLeverageActive ? leverageValue : 1.0)) * 100);
                    setSliderValue(newSliderValue);
                  }
                }
              }}
              className="w-full pl-4 pr-16 py-2 rounded-md bg-[#0a1525] border border-[#1e2c3b] text-white h-12"
              placeholder="0"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              {market.debtToken}
            </div>
          </div>
          <button 
            className="px-3 py-1 rounded-md border border-[#1e2c3b] text-[#47A6E5] text-sm hover:text-white transition-colors"
            onClick={handleMaxBorrow}
            disabled={!collateralAmount || parseFloat(collateralAmount) <= 0}
          >
            Max
          </button>
        </div>
        
        <div className="mt-1 mb-3 text-xs text-gray-400 text-right">
          Max borrowing capacity: {calculateMaxBorrow().toFixed(4)} {market.debtToken}
        </div>
        
        {/* LTV Slider */}
        <div className="mt-4">
          <input
            type="range"
            min="0"
            max="94"
            value={sliderValue}
            onChange={(e) => setSliderValue(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-[#0a1525] rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #47A6E5 0%, #47A6E5 ${sliderValue}%, #0a1525 ${sliderValue}%, #0a1525 100%)`
            }}
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>0%</span>
            <span className="text-white">{sliderValue}%</span>
            <span>94%</span>
          </div>
        </div>
      </div>
      
      {/* Order Info - Two Column Layout */}
      <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
        <div className="flex justify-between border-b border-[#1e2c3b]/50 py-2">
          <span className="text-gray-400">Collateral</span>
          <span className="text-white">
            {collateralAmount || '0'} {market.collateral}
          </span>
        </div>
        
        <div className="flex justify-between border-b border-[#1e2c3b]/50 py-2">
          <span className="text-gray-400">Debt</span>
          <span className="text-white">
            {borrowAmount || '0'} {market.debtToken}
          </span>
        </div>
        
        <div className="flex justify-between border-b border-[#1e2c3b]/50 py-2">
          <span className="text-gray-400">Maturity</span>
          <span className="text-white">{market.maturity}</span>
        </div>
        
        <div className="flex justify-between border-b border-[#1e2c3b]/50 py-2">
          <span className="text-gray-400">Health Factor</span>
          <span className={`font-medium ${
            healthFactor >= 1.2 ? 'text-green-400' : 
            healthFactor >= 1 ? 'text-yellow-400' : 'text-red-400'
          }`}>
            {healthFactor ? healthFactor.toFixed(2) : '0.00'}
          </span>
        </div>
        
        <div className="flex justify-between border-b border-[#1e2c3b]/50 py-2">
          <span className="text-gray-400">Liquidation Threshold</span>
          <span className="text-white">0.89</span>
        </div>
        
        <div className="flex justify-between border-b border-[#1e2c3b]/50 py-2">
          <span className="text-gray-400">LTV</span>
          <span className="text-[#47A6E5]">{sliderValue}%</span>
        </div>
        
        <div className="flex justify-between border-b border-[#1e2c3b]/50 py-2">
          <span className="text-gray-400">Borrow Rate</span>
          <span className="text-[#47A6E5]">{market.borrowAPR.toFixed(2)}%</span>
        </div>
        
        <div className="flex justify-between border-b border-[#1e2c3b]/50 py-2">
          <span className="text-gray-400">Fee</span>
          <span className="text-white">
            ${collateralAmount ? (parseFloat(collateralAmount) * 0.001).toFixed(2) : '0.00'}
          </span>
        </div>
      </div>
      
      {/* Combined Received Amount + Borrow Button */}
      <div className="grid grid-cols-12 gap-4 items-center">
        <div className="flex items-center col-span-5">
          <ArrowRight className="text-gray-500 flex-shrink-0 mr-2" size={20} />
          
          {!isLeverageActive ? (
            <div className="bg-[#081020] border border-[#1e2c3b] text-white h-12 rounded-md w-full flex items-center px-4">
              <span className="text-white truncate">{borrowAmount || '0'}</span>
              <span className="text-gray-400 ml-1 whitespace-nowrap">{market.debtToken}</span>
            </div>
          ) : (
            <div className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 py-2 px-3 rounded-md w-full text-center">
              {leverageValue.toFixed(1)}x Leverage
            </div>
          )}
        </div>
        
        {/* Submit Button */}
        <button
          className="col-span-7 rounded-md bg-[#2a4365] hover:bg-[#2c5282] text-white border border-[#3182CE]/30 h-12 text-base font-medium"
          disabled={
            !collateralAmount || 
            !borrowAmount || 
            parseFloat(collateralAmount) <= 0 || 
            parseFloat(borrowAmount) <= 0 ||
            (activeTab === 'limit' && (!targetRate || parseFloat(targetRate) <= 0))
          }
        >
          {isLeverageActive 
            ? `Leverage ${market.debtToken}` 
            : activeTab === 'limit' 
              ? 'Place Limit Order' 
              : `Borrow ${market.debtToken}`
          }
        </button>
      </div>
    </div>
  );
};

export default BorrowForm;