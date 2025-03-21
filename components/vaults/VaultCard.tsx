// components/vaults/VaultCard.tsx
'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Vault } from '@/types/vault'
import TokenIcon from '@/components/shared/TokenIcon'
import CountUp from '@/components/shared/CountUp'
import { cn } from '@/lib/utils/utils'
import { formatTVL } from '@/lib/utils/format'

interface VaultCardProps {
  vault: Vault;
  isSelected?: boolean;
  onClick?: () => void;
  index?: number;
}

/**
 * A card component for displaying vault information in a table row
 */
const VaultCard: React.FC<VaultCardProps> = ({
  vault,
  isSelected = false,
  onClick,
  index = 0,
}) => {
  // Extract the underlying token symbol
  const getBaseToken = (symbol: string) => {
    return symbol.split('/')[0];
  };

  const baseToken = getBaseToken(vault.symbol);
  const vaultName = `TMX-${baseToken}-${vault.underlyingAddress.slice(-4)}-Vault`;
  const hasUserPosition = (vault.userPosition ?? 0) > 0;

  return (
    <motion.div
    className={cn(
        'px-6 py-4 border-b border-[#1e2c3b]/5 grid grid-cols-5 items-center cursor-pointer transition-all duration-200',
        isSelected ? 'bg-[#0d111d]' : '',
        hasUserPosition 
          ? 'bg-[#5FBDE9]/10 border-l-2 border-l-[#5FBDE9]' 
          : '',
        'hover:bg-[#0c1020]'
      )}
      onClick={onClick}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.05 * (index % 5) }}
      whileHover={{ 
        scale: 1.001, 
        transition: { duration: 0.2 } 
      }}
    >
      {/* Vault Name */}
      <div className="flex items-center space-x-3">
        <TokenIcon symbol={baseToken} />
        <div>
          <div className="text-[#ffffff] font-medium text-sm md:text-base">{vaultName}</div>
          <div className="text-xs text-[#9ca3af] mt-0.5 flex items-center">
            <span>{baseToken}</span>
            <span className="mx-1">•</span>
            <span className="flex items-center">
              {vault.chain === 'ethereum' && <span title="Ethereum">Ξ</span>}
              {vault.chain === 'arbitrum' && <span title="Arbitrum">🔷</span>}
              {vault.chain === 'base' && <span title="Base">🅱️</span>}
              <span className="ml-1">{vault.chain}</span>
            </span>
          </div>
        </div>
      </div>

      {/* APY */}
      <div className="text-right">
        <motion.div
          className="inline-flex items-center justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          key={`${vault.id}-${vault.apy}`}
        >
          <span className="text-[#5FBDE9] font-medium text-sm md:text-base">
            <CountUp value={vault.apy} decimals={2} suffix="%" />
          </span>
        </motion.div>
      </div>

      {/* TVL */}
      <div className="text-right text-[#ffffff] text-sm md:text-base">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          key={`${vault.id}-${vault.tvl}`}
        >
          {formatTVL(vault.tvl)}
        </motion.span>
      </div>

      {/* Liquidity */}
      <div className="text-right text-[#ffffff] text-sm md:text-base">
        {formatTVL(vault.idleFunds ?? 0)}
      </div>

      {/* Your Position */}
      <div className="text-right text-sm md:text-base">
        <span className={hasUserPosition ? "text-[#ffffff] font-medium" : "text-[#6b7280]"}>
          {vault.userPosition ? `$${vault.userPosition.toLocaleString()}` : '-'}
        </span>
      </div>
    </motion.div>
  );
};

export default VaultCard;