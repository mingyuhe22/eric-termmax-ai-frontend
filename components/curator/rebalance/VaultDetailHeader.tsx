// components/curator/VaultDetailHeader.tsx
'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CuratorVault } from '@/types/curator'
import { RebalanceButton } from './RebalanceButton'
import { truncateMiddle } from '@/lib/utils/format'

interface VaultDetailHeaderProps {
  vault: CuratorVault
  onRebalance: () => void
}

export const VaultDetailHeader: React.FC<VaultDetailHeaderProps> = ({
  vault,
  onRebalance
}) => {
  const [copiedText, setCopiedText] = useState('')
  
  // Function to copy address to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedText(text)
    setTimeout(() => setCopiedText(''), 2000)
  }
  
  return (
    <div className="flex items-center mb-6">
      <Link href="/curator" className="mr-4">
        <Button variant="outline" size="sm" className="rounded-full h-8 w-8 p-0">
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </Link>
      <div className="flex-grow">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-white">{vault.name}</h1>
          <Badge variant="success" className="ml-2">
            {vault.status}
          </Badge>
        </div>
        <div className="flex items-center text-gray-400 mt-1 text-sm">
          <span className="font-mono">{truncateMiddle(vault.address, 8, 6)}</span>
          <button 
            onClick={() => copyToClipboard(vault.address)}
            className="ml-2 text-gray-400 hover:text-white transition-colors"
          >
            {copiedText === vault.address ? (
              <span className="text-green-400 text-xs">Copied!</span>
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </button>
          <a 
            href={`https://etherscan.io/address/${vault.address}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="ml-3 text-gray-400 hover:text-white transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
      <div>
        <RebalanceButton onRebalance={onRebalance} />
      </div>
    </div>
  )
}

export default VaultDetailHeader