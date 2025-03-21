// app/range-order/page.tsx
'use client'

import React from 'react'
import { motion } from 'framer-motion'
import RangeOrderInterface from '@/components/range-order/RangeOrderInterface'

export default function RangeOrderPage() {
  return (
    <div className="min-h-screen pb-48 mb-0">
      <motion.div
        className="mb-6 pt-1"
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
      </motion.div>
      
      {/* Range Order Interface */}
      <RangeOrderInterface />
    </div>
  )
}