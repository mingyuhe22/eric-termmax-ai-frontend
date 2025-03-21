// components/shared/TokenIcon.tsx
'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils/utils'

interface TokenIconProps {
  symbol: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showFallback?: boolean;
}

const TokenIcon: React.FC<TokenIconProps> = ({
  symbol,
  size = 'md',
  className,
  showFallback = true
}) => {
  const [imageError, setImageError] = useState(false)
  const cleanedSymbol = symbol.split('/')[0].toLowerCase().replace(/^w/, '')
  
  // Size mappings
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  }
  
  // Primary icon source from popular repository
  const iconSrc = `https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/svg/color/${cleanedSymbol}.svg`
  
  // Fallback icon sources
  const fallbackSources = [
    `https://cdn.morpho.org/assets/logos/${cleanedSymbol}.svg`,
    `https://termmax-backend-v2-test.onrender.com/icon/${cleanedSymbol}.svg`,
  ]
  
  // If image fails to load and fallback is enabled, show a letter
  if (imageError && showFallback) {
    return (
      <div className={cn(
        'rounded-full bg-primary/10 p-0.5 flex items-center justify-center shadow-md',
        sizeClasses[size],
        className
      )}>
        <div className="h-full w-full rounded-full bg-background-tertiary flex items-center justify-center overflow-hidden">
          <span className="text-primary font-bold">
            {symbol.charAt(0).toUpperCase()}
          </span>
        </div>
      </div>
    )
  }
  
  // Try to load image
  return (
    <div className={cn(
      'rounded-full bg-primary/10 p-0.5 flex items-center justify-center shadow-md',
      sizeClasses[size],
      className
    )}>
      <div className="h-full w-full rounded-full bg-background-tertiary flex items-center justify-center overflow-hidden">
        <motion.img
          src={iconSrc}
          alt={symbol}
          className="h-3/4 w-3/4 object-contain"
          onError={(e) => {
            // Try fallback sources in sequence
            const target = e.currentTarget;
            const currentSrc = target.src;
            
            // Find index of current source
            const currentIndex = fallbackSources.findIndex(src => currentSrc.includes(src));
            
            // If there are more fallbacks to try
            if (currentIndex < fallbackSources.length - 1) {
              const nextFallback = fallbackSources[currentIndex + 1];
              target.src = nextFallback;
            } else {
              // All fallbacks failed
              setImageError(true);
            }
          }}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  )
}

export default TokenIcon