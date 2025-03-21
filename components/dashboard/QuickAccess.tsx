'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  DollarSign, 
  CircleDollarSign, 
  ArrowRightLeft, 
  FileText, 
  ArrowUpRight 
} from 'lucide-react'

const QuickAccess: React.FC = () => {
  const quickLinks = [
    {
      title: 'Earn',
      description: 'Lend assets and earn fixed or variable yields',
      icon: <DollarSign className="h-5 w-5 text-[#5FBDE9]" />,
      link: '/earn',
      linkText: 'View Markets',
      delay: 0.1
    },
    {
      title: 'Borrow',
      description: 'Borrow assets with fixed rates and leverage',
      icon: <CircleDollarSign className="h-5 w-5 text-[#5FBDE9]" />,
      link: '/borrow',
      linkText: 'View Markets',
      delay: 0.2
    },
    {
      title: 'Range Orders',
      description: 'Create range orders for optimized lending and borrowing',
      icon: <ArrowRightLeft className="h-5 w-5 text-[#5FBDE9]" />,
      link: '/range-order',
      linkText: 'Create Order',
      delay: 0.3
    },
    {
      title: 'Documentation',
      description: 'Read guides and technical documentation',
      icon: <FileText className="h-5 w-5 text-[#5FBDE9]" />,
      link: 'https://docs.ts.finance/',
      isExternal: true,
      linkText: 'Read Docs',
      delay: 0.4
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {quickLinks.map((item, index) => (
        <Link 
          href={item.link} 
          key={index}
          target={item.isExternal ? "_blank" : "_self"}
          rel={item.isExternal ? "noopener noreferrer" : ""}
        >
          <motion.div 
            className="bg-[#0c1624] border border-[#1e2c3b] rounded-lg p-5 hover:border-[#5FBDE9]/50 transition-colors duration-200 h-full flex flex-col"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: item.delay }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-white font-medium">{item.title}</h3>
              {item.icon}
            </div>
            <p className="text-gray-400 text-sm mt-2">{item.description}</p>
            <div className="mt-auto pt-4 text-xs text-[#5FBDE9] flex items-center">
              {item.linkText}
              <ArrowUpRight className="h-3 w-3 ml-1" />
            </div>
          </motion.div>
        </Link>
      ))}
    </div>
  )
}

export default QuickAccess