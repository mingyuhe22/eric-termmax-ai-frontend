// components/range-order/EditModal/EditModalContainer.tsx
'use client'

import React from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Position } from '@/lib/mock/range-order-mock-data'

interface EditModalContainerProps {
  position: Position | null
  onClose: () => void
  children: React.ReactNode
  title: string
}

export default function EditModalContainer({
  position,
  onClose,
  children,
  title
}: EditModalContainerProps) {
  if (!position) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-[#0c1624] border border-[#1e2c3b] rounded-lg max-w-5xl w-full max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#1e2c3b]">
          <div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <div className="text-sm text-gray-400 mt-1">
              {position.debtToken}/{position.collateral} - {position.maturity}
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-gray-400 hover:text-white"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Modal Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {children}
        </div>
        
        {/* Modal Footer */}
        <div className="border-t border-[#1e2c3b] p-4 flex justify-end gap-3">
          <Button
            variant="outline"
            className="border-[#1e2c3b] text-gray-400 hover:text-white"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}