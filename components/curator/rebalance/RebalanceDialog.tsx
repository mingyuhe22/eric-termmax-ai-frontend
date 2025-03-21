// components/curator/rebalance/RebalanceDialog.tsx
'use client'

import React, { useState, useEffect } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { VaultOrder, RebalanceMetrics, CuratorVault } from '@/types/curator'
import RebalanceInterface from './RebalanceInterface'

interface RebalanceDialogProps {
  vault: CuratorVault
  metrics: RebalanceMetrics
  trigger?: React.ReactNode
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  onSave: (orders: VaultOrder[], deposit?: number, withdraw?: number) => void
}

export const RebalanceDialog: React.FC<RebalanceDialogProps> = ({
  vault,
  metrics,
  trigger,
  isOpen: externalIsOpen,
  onOpenChange: externalOnOpenChange,
  onSave
}) => {
  // Use internal state if external state is not provided
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  
  // Determine if we should use external or internal state
  const isControlled = externalIsOpen !== undefined
  const isOpen = isControlled ? externalIsOpen : internalIsOpen
  
  // Update internal state when external state changes
  useEffect(() => {
    if (isControlled) {
      setInternalIsOpen(externalIsOpen)
    }
  }, [isControlled, externalIsOpen])
  
  // Handle open state changes
  const handleOpenChange = (open: boolean) => {
    // Update internal state
    setInternalIsOpen(open)
    
    // Call external handler if provided
    if (externalOnOpenChange) {
      externalOnOpenChange(open)
    }
  }
  
  // Get orders from vault
  const vaultOrders = vault.orders || []
  
  // Handle save rebalance
  const handleSaveRebalance = (orders: VaultOrder[], deposit?: number, withdraw?: number) => {
    onSave(orders, deposit, withdraw)
    handleOpenChange(false)
  }
  
  // Handle cancel
  const handleCancel = () => {
    handleOpenChange(false)
  }
  
  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      {trigger && <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>}
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[90vw] max-w-6xl max-h-[85vh] bg-[#0a0e19] rounded-lg shadow-lg z-50 overflow-y-auto">
          <div className="sticky top-0 bg-[#0c1624] border-b border-[#1e2c3b] flex items-center justify-between p-4 z-10">
            <Dialog.Title className="text-xl font-bold text-white">
              Rebalance Vault: {vault.name}
            </Dialog.Title>
            <Dialog.Close asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 rounded-full text-gray-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </Dialog.Close>
          </div>
          
          <div className="p-6">
            <RebalanceInterface
              vaultOrders={vaultOrders}
              metrics={metrics}
              onSaveRebalance={handleSaveRebalance}
              onCancelRebalance={handleCancel}
            />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default RebalanceDialog