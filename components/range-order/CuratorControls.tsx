// components/range-order/CuratorControls.tsx
'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Info } from 'lucide-react'
import { Vault } from '@/types/vault'

interface CuratorControlsProps {
  vaults: Vault[]
  selectedVault: Vault | null
  onSelectVault: (vault: Vault) => void
}

export default function CuratorControls({ 
  vaults, 
  selectedVault, 
  onSelectVault 
}: CuratorControlsProps) {
  const [isVaultDropdownOpen, setIsVaultDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Format TVL values
  function formatTVL(tvl: number): string {
    if (tvl >= 1000000000) {
      return `$${(tvl / 1000000000).toFixed(2)}B`;
    } else if (tvl >= 1000000) {
      return `$${(tvl / 1000000).toFixed(2)}M`;
    } else if (tvl >= 1000) {
      return `$${(tvl / 1000).toFixed(2)}K`;
    } else {
      return `$${tvl.toFixed(2)}`;
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsVaultDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-[#0c1624] border border-[#1e2c3b] rounded-lg p-4 mb-4">
      <div className="flex items-center gap-1 mb-3">
        <span className="text-gray-300 text-sm">Curator Vault Order</span>
        <div className="relative group">
          <Info className="h-3.5 w-3.5 text-gray-400 cursor-help" />
          <div className="absolute left-0 bottom-full mb-2 w-64 p-2 bg-[#0a1525] border border-[#1e2c3b] rounded text-xs text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
            As a curator, you can create range orders using liquidity from managed vaults.
          </div>
        </div>
      </div>
      
      {/* Main grid with 3 columns layout */}
      <div className="grid grid-cols-3 gap-3">
        {/* Vault Selection Dropdown - First column */}
        <div className="relative" ref={dropdownRef}>
          <div 
            className="bg-[#081020] border border-[#1e2c3b] rounded-lg p-3 h-full flex items-center justify-between cursor-pointer hover:border-[#1e2c3b]/80 transition-colors"
            onClick={() => setIsVaultDropdownOpen(!isVaultDropdownOpen)}
          >
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-[#5FBDE9]/10 flex items-center justify-center text-[#5FBDE9] text-sm">
                {selectedVault ? selectedVault.symbol.charAt(0) : 'V'}
              </div>
              <div>
                <div className="text-white text-sm font-medium">
                  {selectedVault ? selectedVault.name : 'Select Vault'}
                </div>
                <div className="text-gray-400 text-xs">
                  {selectedVault 
                    ? `${formatTVL(selectedVault.tvl)} · ${selectedVault.apy.toFixed(2)}% APY` 
                    : 'No vault selected'}
                </div>
              </div>
            </div>
            <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isVaultDropdownOpen ? 'rotate-180' : ''}`} />
          </div>
          
          {/* Dropdown Menu */}
          {isVaultDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-[#081020] border border-[#1e2c3b] rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
              {vaults.length > 0 ? (
                vaults.map((vault) => (
                  <div 
                    key={vault.id}
                    className={`p-3 flex items-center gap-2 hover:bg-[#0a1525] cursor-pointer transition-colors ${
                      selectedVault?.id === vault.id ? 'bg-[#0a1525]' : ''
                    }`}
                    onClick={() => {
                      onSelectVault(vault);
                      setIsVaultDropdownOpen(false);
                    }}
                  >
                    <div className="h-7 w-7 rounded-full bg-[#5FBDE9]/10 flex items-center justify-center text-[#5FBDE9] text-sm">
                      {vault.symbol.charAt(0)}
                    </div>
                    <div>
                      <div className="text-white text-sm">{vault.name}</div>
                      <div className="text-gray-400 text-xs flex items-center gap-1">
                        <span>{formatTVL(vault.tvl)}</span>
                        <span>•</span>
                        <span className="text-[#5FBDE9]">{vault.apy.toFixed(2)}% APY</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-400 text-sm">
                  No vaults available
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Only show these panels when a vault is selected */}
        {selectedVault ? (
          <>
            {/* Available Balance - Second column */}
            <div className="bg-[#081020] border border-[#1e2c3b] rounded-lg p-3">
              <div className="text-gray-400 text-xs mb-1">Available Vault Balance</div>
              <div className="text-white text-lg font-medium">
                {formatTVL(selectedVault.idleFunds || 0)}
              </div>
              <div className="text-gray-400 text-xs">
                ({((selectedVault.idleFunds || 0) / selectedVault.tvl * 100).toFixed(2)}% of TVL)
              </div>
            </div>
          
            {/* APY Info - Third column */}
            <div className="bg-[#081020] border border-[#1e2c3b] rounded-lg p-3">
              <div className="text-gray-400 text-xs mb-1">Vault APY</div>
              <div className="text-[#5FBDE9] text-lg font-medium">
                {selectedVault.apy.toFixed(2)}%
              </div>
              <div className="text-gray-400 text-xs">
                Current vault yield
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Placeholder panels when no vault is selected */}
            <div className="bg-[#081020] border border-[#1e2c3b] rounded-lg p-3 flex items-center justify-center">
              <span className="text-gray-500 text-xs">Select a vault to see balance</span>
            </div>
            <div className="bg-[#081020] border border-[#1e2c3b] rounded-lg p-3 flex items-center justify-center">
              <span className="text-gray-500 text-xs">Select a vault to see APY</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}