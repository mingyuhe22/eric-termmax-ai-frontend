// components/borrow/MarketBorrowForm.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { ArrowRight, Info } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Market } from '@/types/borrow'
import { cn } from '@/lib/utils/utils'

interface MarketBorrowFormProps {
  market: Market
  onClose: () => void
}

const MarketBorrowForm: React.FC<MarketBorrowFormProps> = ({ market, onClose }) => {
  // Form state
  const [collateralAmount, setCollateralAmount] = useState('')
  const [borrowAmount, setBorrowAmount] = useState('')
  const [sliderValue, setSliderValue] = useState(market.ltv * 0.5) // Start at 50% of max LTV
  const [healthFactor, setHealthFactor] = useState(2.0)
  
  // Leverage state
  const [leverageEnabled, setLeverageEnabled] = useState(false)
  const [leverageValue, setLeverageValue] = useState(1.5) // Default leverage
  const [leveragedAPY, setLeveragedAPY] = useState(0)
  
  // Mock wallet balances
  const collateralBalance = market.collateral.includes('ETH') ? 10.5 : 5000
  
  // Update borrow amount when collateral or slider changes
  useEffect(() => {
    if (collateralAmount && !isNaN(parseFloat(collateralAmount))) {
      const collateralValue = parseFloat(collateralAmount)
      const effectiveLTV = leverageEnabled ? sliderValue * leverageValue : sliderValue
      const newBorrowAmount = collateralValue * effectiveLTV
      setBorrowAmount(newBorrowAmount.toFixed(4))
      
      // Update health factor (simplified calculation)
      const newHealthFactor = collateralValue / (newBorrowAmount || 1) / market.ltv
      setHealthFactor(newHealthFactor)
      
      // Calculate leveraged APY based on market data
      if (leverageEnabled) {
        // Simple linear model for demo
        const baseAPY = market.borrowAPR * 2 // Example base lending APY
        const newLeveragedAPY = baseAPY * leverageValue
        setLeveragedAPY(newLeveragedAPY)
      } else {
        setLeveragedAPY(0)
      }
    } else {
      setBorrowAmount('')
      setHealthFactor(2.0)
      setLeveragedAPY(0)
    }
  }, [collateralAmount, sliderValue, leverageEnabled, leverageValue, market.ltv, market.borrowAPR])
  
  // Update slider when borrow amount changes directly
  const handleBorrowAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setBorrowAmount(value)
    
    if (value && collateralAmount && !isNaN(parseFloat(value)) && !isNaN(parseFloat(collateralAmount))) {
      const borrowVal = parseFloat(value)
      const collateralVal = parseFloat(collateralAmount)
      if (collateralVal > 0) {
        const divisor = leverageEnabled ? leverageValue : 1
        const newSliderValue = Math.min(market.ltv, (borrowVal / collateralVal) / divisor)
        setSliderValue(newSliderValue)
        
        // Update health factor
        const newHealthFactor = collateralVal / borrowVal / market.ltv
        setHealthFactor(newHealthFactor)
      }
    }
  }
  
  // Calculate max borrowing capacity based on collateral
  const calculateMaxBorrow = () => {
    if (!collateralAmount || isNaN(parseFloat(collateralAmount))) return 0
    
    const collateral = parseFloat(collateralAmount)
    return collateral * (leverageEnabled ? market.ltv * leverageValue : market.ltv)
  }
  
  // Handle max buttons
  const handleMaxCollateral = () => {
    setCollateralAmount(collateralBalance.toString())
  }
  
  const handleMaxBorrow = () => {
    const maxBorrow = calculateMaxBorrow()
    setBorrowAmount(maxBorrow.toFixed(4))
    setSliderValue(market.ltv)
  }
  
  // Toggle leverage
  const handleToggleLeverage = (checked: boolean) => {
    setLeverageEnabled(checked)
    // Reset leverage value when turning off
    if (!checked) {
      setLeverageValue(1.5)
    }
  }
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log('Submitting borrow order:', {
      market: market.id,
      collateralAmount,
      borrowAmount,
      ltv: sliderValue,
      healthFactor,
      leverageEnabled,
      leverageValue,
      leveragedAPY
    })
    
    // Show success message (in real app would show transaction status)
    alert(`Successfully submitted borrow order using ${collateralAmount} ${market.collateral} as collateral${leverageEnabled ? ` with ${leverageValue.toFixed(1)}x leverage` : ''}`)
    onClose()
  }
  
  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      {/* Collateral Input */}
      <div>
        <label className="text-sm text-gray-400 block mb-2">
          Collateral Amount
        </label>
        <div className="flex items-center gap-2">
          <div className="flex-grow relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center">
              <div className="h-5 w-5 rounded-full bg-[#5FBDE9]/20 flex items-center justify-center text-[#5FBDE9] text-xs font-semibold">
                {market.collateral.charAt(0)}
              </div>
            </div>
            <Input
              type="number"
              value={collateralAmount}
              onChange={(e) => setCollateralAmount(e.target.value)}
              className="pl-10 pr-20 bg-[#081020] border-[#1e2c3b] text-white"
              placeholder="0.0"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              {market.collateral}
            </div>
          </div>
          <Button 
            type="button"
            variant="outline"
            size="sm"
            className="border-[#1e2c3b] text-[#5FBDE9] hover:text-white"
            onClick={handleMaxCollateral}
          >
            Max
          </Button>
        </div>
        <div className="mt-1 text-xs text-gray-400 text-right">
          Balance: {collateralBalance.toLocaleString()} {market.collateral}
        </div>
      </div>
      
      {/* Leverage Toggle - Only show if market supports leverage */}
      {market.supportsLeverage && (
        <div className="p-4 bg-[#081020] border border-[#1e2c3b] rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Switch 
                checked={leverageEnabled} 
                onCheckedChange={handleToggleLeverage}
              />
              <div>
                <label className="text-white font-medium">Enable Leverage</label>
                <p className="text-xs text-gray-400">Higher leverage = higher APY & risk</p>
              </div>
            </div>
            <Badge 
              className={cn(
                "font-medium transition-colors",
                leverageEnabled 
                  ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" 
                  : "bg-gray-500/20 text-gray-400 border-gray-500/30"
              )}
            >
              {leverageEnabled ? `${leverageValue.toFixed(1)}x` : 'Off'}
            </Badge>
          </div>
          
          {/* Leverage Slider - Only show when leverage is enabled */}
          {leverageEnabled && (
            <div>
              <div className="mb-1 flex justify-between items-center">
                <span className="text-xs text-gray-400">Leverage</span>
                <span className="text-xs text-[#5FBDE9]">{leveragedAPY.toFixed(2)}% APY</span>
              </div>
              <Slider
                value={[leverageValue]}
                min={1.1}
                max={market.maxLeverage}
                step={0.1}
                onValueChange={(values) => setLeverageValue(values[0])}
                className="mb-1"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>1.1x</span>
                <span>{market.maxLeverage.toFixed(1)}x</span>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Target Borrow Amount */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm text-gray-400">Target Borrow Amount</label>
          <div className="flex items-center text-xs text-gray-400">
            <Info size={12} className="mr-1" />
            <span>Slider adjusts LTV</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex-grow relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center">
              <div className="h-5 w-5 rounded-full bg-gray-700 flex items-center justify-center text-white text-xs font-semibold">
                {market.debtToken.charAt(0)}
              </div>
            </div>
            <Input
              type="number"
              value={borrowAmount}
              onChange={handleBorrowAmountChange}
              className="pl-10 pr-20 bg-[#081020] border-[#1e2c3b] text-white"
              placeholder="0.0"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              {market.debtToken}
            </div>
          </div>
          <Button 
            type="button"
            variant="outline"
            size="sm"
            className="border-[#1e2c3b] text-[#5FBDE9] hover:text-white"
            onClick={handleMaxBorrow}
            disabled={!collateralAmount || parseFloat(collateralAmount) <= 0}
          >
            Max
          </Button>
        </div>
        
        <div className="mt-1 mb-3 text-xs text-gray-400 text-right">
          Max borrowing capacity: {calculateMaxBorrow().toFixed(4)} {market.debtToken}
        </div>
        
        {/* LTV Slider */}
        <div className="mt-4">
          <Slider
            value={[sliderValue]}
            min={0}
            max={market.ltv}
            step={0.01}
            onValueChange={(values) => setSliderValue(values[0])}
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>0</span>
            <span className="text-white">{(sliderValue * 100).toFixed(0)}%</span>
            <span>{(market.ltv * 100).toFixed(0)}%</span>
          </div>
        </div>
      </div>
      
      {/* Order Info */}
      <div className="space-y-3 p-4 rounded-md bg-[#081020] border border-[#1e2c3b]">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">Collateral</span>
          <span className="text-sm text-white">
            {collateralAmount || '0'} {market.collateral}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">Debt</span>
          <span className="text-sm text-white">
            {borrowAmount || '0'} {market.debtToken}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">Maturity</span>
          <span className="text-sm text-white">
            {market.maturity}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">Health Factor</span>
          <span className={`text-sm font-medium ${
            healthFactor >= 2 ? 'text-green-400' : 
            healthFactor >= 1.5 ? 'text-yellow-400' : 'text-red-400'
          }`}>
            {healthFactor.toFixed(2)}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">Liquidation Threshold</span>
          <span className="text-sm text-white">
            {(market.ltv * 0.95).toFixed(2)}
          </span>
        </div>
        
        {leverageEnabled && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Leveraged APY</span>
            <span className="text-sm text-[#5FBDE9] font-medium">
              {leveragedAPY.toFixed(2)}%
            </span>
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">LTV</span>
          <div className="flex items-center gap-1">
            <Badge className="bg-[#5FBDE9]/10 text-[#5FBDE9] border-[#5FBDE9]/30">
              {(sliderValue * 100).toFixed(0)}%
            </Badge>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">Borrow Rate</span>
          <span className="text-sm text-[#5FBDE9] font-medium">
            {market.borrowAPR.toFixed(2)}%
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">Fee</span>
          <span className="text-sm text-white">
            ${collateralAmount ? (parseFloat(collateralAmount) * 0.001).toFixed(2) : '0.00'}
          </span>
        </div>
      </div>
      
      {/* Received Amount */}
      <div className="border-t border-[#1e2c3b] pt-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">Received Borrow Amount</span>
        </div>
        <div className="flex items-center gap-2">
          <ArrowRight className="text-gray-500" size={20} />
          <div className="flex-grow relative">
            <Input
              readOnly
              value={borrowAmount}
              className="pl-3 pr-20 bg-[#081020] border-[#1e2c3b] text-white"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              {market.debtToken}
            </div>
          </div>
        </div>
      </div>
      
      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full bg-[#2a4365] hover:bg-[#2c5282] text-white border-[#3182CE]/30 py-6"
        disabled={!collateralAmount || !borrowAmount || parseFloat(collateralAmount) <= 0 || parseFloat(borrowAmount) <= 0}
      >
        Borrow {market.debtToken}
      </Button>
    </form>
  )
}

export default MarketBorrowForm