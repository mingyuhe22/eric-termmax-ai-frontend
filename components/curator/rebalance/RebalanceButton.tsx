// components/curator/RebalanceButton.tsx
'use client'

import React from 'react'
import { ArrowUpDown } from 'lucide-react'
import { Button, ButtonProps } from '@/components/ui/button'

interface RebalanceButtonProps extends Omit<ButtonProps, 'onClick'> {
  onRebalance: () => void
  size?: 'default' | 'sm' | 'lg'
  withLabel?: boolean
}

export const RebalanceButton: React.FC<RebalanceButtonProps> = ({
  onRebalance,
  size = 'default',
  withLabel = true,
  className,
  ...props
}) => {
  return (
    <Button
      className={`bg-[#2a4365] hover:bg-[#2c5282] text-white border-[#3182CE]/30 flex items-center gap-1.5 ${className || ''}`}
      size={size}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onRebalance()
      }}
      {...props}
    >
      <ArrowUpDown className={size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
      {withLabel && 'Rebalance'}
    </Button>
  )
}

export default RebalanceButton