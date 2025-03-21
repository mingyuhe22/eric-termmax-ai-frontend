'use client'

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatPercentage } from '@/lib/utils/format'

interface SqueezeMetrics {
  debt: number
  collateral: number
  ltv: number
  healthFactor: number
  status: 'safe' | 'warning' | 'critical'
}

interface SqueezePreviewProps {
  metrics: SqueezeMetrics
}

const SqueezePreview: React.FC<SqueezePreviewProps> = ({ metrics }) => {
  // Get status styling
  const getStatusStyles = (status: 'safe' | 'warning' | 'critical') => {
    switch (status) {
      case 'safe':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'warning':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'critical':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
    }
  }

  // Get health factor text color
  const getHealthFactorColor = (status: 'safe' | 'warning' | 'critical') => {
    switch (status) {
      case 'safe':
        return 'text-green-400'
      case 'warning':
        return 'text-yellow-400'
      case 'critical':
        return 'text-red-400'
    }
  }

  return (
    <div className="mb-4 p-4 bg-[#081020] border border-[#1e2c3b] rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-white font-medium">Squeeze Preview</h3>
        <Badge className={getStatusStyles(metrics.status)}>
          {metrics.status.toUpperCase()}
        </Badge>
      </div>
      
      <div className="grid grid-cols-4 gap-4 mb-4">
        <div>
          <div className="text-xs text-gray-400 mb-1">Total Debt</div>
          <div className="text-sm font-medium text-white">{formatCurrency(metrics.debt)}</div>
        </div>
        <div>
          <div className="text-xs text-gray-400 mb-1">Total Collateral</div>
          <div className="text-sm font-medium text-white">{formatCurrency(metrics.collateral)}</div>
        </div>
        <div>
          <div className="text-xs text-gray-400 mb-1">New LTV</div>
          <div className="text-sm font-medium text-white">{formatPercentage(metrics.ltv * 100)}</div>
        </div>
        <div>
          <div className="text-xs text-gray-400 mb-1">New Health Factor</div>
          <div className={`text-sm font-medium ${getHealthFactorColor(metrics.status)}`}>
            {metrics.healthFactor.toFixed(2)}
          </div>
        </div>
      </div>
      
      <Button className="w-full bg-[#2a4365] text-white">
        Squeeze Selected Positions
      </Button>
    </div>
  )
}

export default SqueezePreview