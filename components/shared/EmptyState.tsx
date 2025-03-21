// components/shared/EmptyState.tsx
'use client'

import React from 'react'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description: string
  actionText?: string
  onClearFilters: () => void
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText = "Clear Filters",
  onClearFilters
}) => {
  return (
    <div className="p-8 text-center">
      <div className="h-12 w-12 mx-auto mb-4 rounded-full bg-[#0d111d] flex items-center justify-center">
        {icon || <Search className="h-6 w-6 text-gray-500" />}
      </div>
      <h3 className="text-xl font-medium text-white mb-2">{title}</h3>
      <p className="text-gray-400 max-w-md mx-auto mb-4">
        {description}
      </p>
      <Button
        variant="outline"
        onClick={onClearFilters}
        className="border-[#1e2c3b] text-gray-400 hover:text-white"
      >
        {actionText}
      </Button>
    </div>
  )
}

export default EmptyState