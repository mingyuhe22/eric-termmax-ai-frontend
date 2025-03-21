// components/curator/rebalance/MetricsPanel.tsx
'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { BarChart2 } from 'lucide-react'
import CountUp from '@/components/shared/CountUp'
import { RebalanceMetrics } from '@/types/curator'
import { formatCurrency } from '@/lib/utils/format'

interface MetricsPanelProps {
  metrics: RebalanceMetrics
}

export const MetricsPanel: React.FC<MetricsPanelProps> = ({ metrics }) => {
  const metricItems = [
    {
      label: 'Total Value',
      value: metrics.totalVaultValue,
      formatted: formatCurrency(metrics.totalVaultValue),
      color: 'text-white',
      delay: 0,
      icon: <BarChart2 className="h-5 w-5 text-[#5FBDE9]" />
    },
    {
      label: 'Unallocated',
      value: metrics.unallocatedValue,
      formatted: formatCurrency(metrics.unallocatedValue),
      color: 'text-white',
      delay: 0.1,
      icon: <BarChart2 className="h-5 w-5 text-[#5FBDE9]" />
    },
    {
      label: 'Allocated',
      value: metrics.allocatedValue,
      formatted: formatCurrency(metrics.allocatedValue),
      color: 'text-white',
      delay: 0.2,
      icon: <BarChart2 className="h-5 w-5 text-[#5FBDE9]" />
    },
    {
      label: 'Projected APY',
      value: metrics.averageAPY,
      suffix: '%',
      formatted: `${metrics.averageAPY.toFixed(2)}%`,
      decimals: 2,
      color: 'text-[#5FBDE9]',
      delay: 0.3,
      icon: <BarChart2 className="h-5 w-5 text-[#5FBDE9]" />
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {metricItems.map((item, index) => (
        <motion.div
          key={index}
          className="bg-[#0c1624] border border-[#1e2c3b] rounded-lg p-5 shadow-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: item.delay }}
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-[#5FBDE9]/20 flex items-center justify-center">
              {item.icon}
            </div>
            <div>
              <p className="text-gray-400 text-sm">{item.label}</p>
              <h3 className={`text-2xl font-bold ${item.color}`}>
                {item.label === 'Projected APY' ? (
                  <CountUp value={item.value} decimals={item.decimals} suffix={item.suffix} />
                ) : (
                  <CountUp value={item.value} prefix="$" decimals={0} />
                )}
              </h3>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default MetricsPanel