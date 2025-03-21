// app/layout.tsx
import './globals.css'
import { Inter } from 'next/font/google'
import Providers from '@/app/Providers'
import NavBar from '@/components/layout/navigation/NavBar'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'TermMax Finance',
  description: 'Advanced yield strategies, vaults, and range orders for DeFi',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#0a0e19] text-white`}>
        <Providers>
          {/* Header Navigation */}
          <NavBar />
          
          {/* Main Content */}
          <main className="mt-16 px-4 sm:px-6 lg:px-8">
            {children}
          </main>
          
          {/* Footer */}
          <footer className="mt-20 bg-[#0d111d] border-t border-[#1e2c3b]/5 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">TermMax</h3>
                  <p className="text-text-secondary">
                    Advanced DeFi yield optimization platform with fixed and variable rate solutions.
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-medium text-white mb-4">Quick Links</h4>
                  <ul className="space-y-2">
                    <li><Link href="/borrow" className="text-text-secondary hover:text-primary transition-colors">Borrow</Link></li>
                    <li><Link href="/earn" className="text-text-secondary hover:text-primary transition-colors">Earn</Link></li>
                    <li><Link href="/range-order" className="text-text-secondary hover:text-primary transition-colors">Range Orders</Link></li>
                    <li><Link href="/curator" className="text-text-secondary hover:text-primary transition-colors">Curator</Link></li>
                    <li><Link href="/" className="text-text-secondary hover:text-primary transition-colors">Dashboard</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-medium text-white mb-4">Community</h4>
                  <ul className="space-y-2">
                    <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-primary transition-colors">Twitter</a></li>
                    <li><a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-primary transition-colors">Discord</a></li>
                    <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-primary transition-colors">GitHub</a></li>
                    <li><a href="https://docs.example.com" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-primary transition-colors">Documentation</a></li>
                  </ul>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t border-[#1e2c3b]/5 text-center text-text-tertiary text-sm">
                &copy; {new Date().getFullYear()} TermMax Finance. All rights reserved.
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  )
}