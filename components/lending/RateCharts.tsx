'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface RateChartsProps {
  lendAPR: number
}

const RateCharts: React.FC<RateChartsProps> = ({
  lendAPR
}) => {
  
  // Generate historical rate data
  const generateHistoricalRates = () => {
    const dates = ['Mar 15', 'Mar 16', 'Mar 17', 'Mar 18', 'Mar 19', 'Mar 20', 'Mar 21']
    const baseRate = lendAPR
    
    return dates.map((date, index) => ({
      date,
      // Generate slightly varied rates, with the current rate as the last point
      rate: index === dates.length - 1 
        ? baseRate 
        : baseRate * (0.9 + Math.random() * 0.2)
    }))
  }
  
  // Create a simple chart using HTML/CSS
  const rateData = generateHistoricalRates()
  const maxRate = Math.max(...rateData.map(d => d.rate)) * 1.1 // Add 10% padding
  
  return (
    <motion.div
      className="mx-6 mb-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.3 }}
    >
      <div className="bg-[#0c1624] border border-[#1e2c3b] rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm font-medium text-white">
            Historical APR
          </div>
          <div className="text-xl font-bold text-[#5FBDE9]">
            {lendAPR.toFixed(2)}%
          </div>
        </div>
        
        {/* Simple CSS chart */}
        <div className="h-40 w-full relative">
          <div className="absolute inset-0 flex items-end justify-between px-2">
            {rateData.map((point, index) => {
              const height = (point.rate / maxRate) * 100
              return (
                <div key={index} className="flex flex-col items-center">
                  <div className="text-xs text-gray-400 absolute -top-5">
                    {point.rate.toFixed(1)}%
                  </div>
                  <div 
                    className={`w-6 bg-[#5FBDE9] rounded-t-sm transition-all duration-500 relative group`}
                    style={{ height: `${height}%` }}
                  >
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-[#081020] border border-[#1e2c3b] text-xs text-white py-1 px-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                      {point.rate.toFixed(2)}%
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        
        {/* X-axis labels */}
        <div className="flex items-center justify-between mt-2 px-2">
          {rateData.map((point, index) => (
            <div key={index} className="text-xs text-gray-400">
              {point.date}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default RateCharts