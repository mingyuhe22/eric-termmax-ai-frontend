// components/curator/rebalance/EnhancedVaultMetrics.tsx
'use client'

import React from 'react'
import { CuratorVault } from '@/types/curator'
import { formatCurrency } from '@/lib/utils/format'
import CountUp from '@/components/shared/CountUp'

interface EnhancedVaultMetricsProps {
  vault: CuratorVault
}

export const EnhancedVaultMetrics: React.FC<EnhancedVaultMetricsProps> = ({
  vault
}) => {
  const metrics = [
    {
      label: 'Total Value Locked',
      value: vault.tvl,
      valueFormatted: `$${formatCurrency(vault.tvl)}`
    },
    {
      label: 'Current APY',
      value: vault.apy,
      valueFormatted: `${vault.apy.toFixed(1)}%`,
      valueClass: 'text-[#5FBDE9]'
    },
    {
      label: 'Idle Funds',
      value: vault.idleFunds || 0,
      valueFormatted: `$${formatCurrency(vault.idleFunds || 0)}`
    },
    {
      label: 'Performance Fee',
      value: vault.performanceFee || 0,
      valueFormatted: `${vault.performanceFee || 0}%`
    }
  ]
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {metrics.map((metric, index) => (
        <div 
          key={index} 
          className="bg-[#0c1624] border border-[#1e2c3b] rounded-lg p-5"
        >
          <div className="text-sm text-gray-400 mb-1">{metric.label}</div>
          <div className={`text-2xl font-bold ${metric.valueClass || 'text-white'}`}>
            {metric.label === 'Current APY' ? (
              <CountUp value={metric.value} decimals={1} suffix="%" />
            ) : metric.label === 'Performance Fee' ? (
              <CountUp value={metric.value} decimals={0} suffix="%" />
            ) : (
              <CountUp value={metric.value} prefix="$" decimals={0} />
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default EnhancedVaultMetrics