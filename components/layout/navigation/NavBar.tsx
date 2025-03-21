'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils/utils'
import { Menu } from 'lucide-react' 
import ConnectWalletButton from '@/components/layout/ConnectWalletButton'

export default function NavBar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const navigation = [
    { name: 'Borrow', href: '/borrow' },
    { name: 'Earn', href: '/earn' },
    { name: 'Range Order', href: '/range-order' },
    { name: 'Curator', href: '/curator', isNew: true },
    { name: 'Dashboard', href: '/'},
    { name: 'Docs', href: 'https://docs.ts.finance/', isExternal: true }, 
  ]
  
  return (
    <header className="border-b border-[#1e2c3b]/5 fixed top-0 left-0 right-0 z-50 bg-[#0a0e19]/95 backdrop-blur-sm w-full h-16">
      <div className="h-full w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-full">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 mr-8">
              <div className="flex items-center justify-center rounded-md w-10 h-10 bg-[#131722] text-white font-bold text-xl">
                T
              </div>
              <span className="text-xl font-bold text-white">TermMax</span>
            </Link>
            
            <nav className="hidden md:flex space-x-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'px-4 py-2 text-sm font-medium rounded-md flex items-center relative transition-colors duration-200',
                    pathname === item.href
                      ? 'bg-primary text-white'
                      : 'text-text-secondary hover:bg-[#0e1320] hover:text-white'
                  )}
                >
                  {item.name}
                  {item.isNew && (
                    <Badge 
                      className="ml-2 text-[10px] py-0 px-1.5 border border-primary/20 bg-primary/10 text-primary"
                    >
                      NEW
                    </Badge>
                  )}
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Hamburger menu for mobile */}
            <button
              className="md:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <ConnectWalletButton />
          </div>
        </div>
      </div>
      
      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0a1525] border-b border-[#1e2c3b]">
          <div className="px-4 py-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'block px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200',
                  pathname === item.href
                    ? 'bg-primary text-white'
                    : 'text-text-secondary hover:bg-[#0e1320] hover:text-white'
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center">
                  {item.name}
                  {item.isNew && (
                    <Badge 
                      className="ml-2 text-[10px] py-0 px-1.5 border border-primary/20 bg-primary/10 text-primary"
                    >
                      NEW
                    </Badge>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}