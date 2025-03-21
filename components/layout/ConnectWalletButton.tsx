// components/layout/ConnectWalletButton.tsx
'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import React from 'react'

export default function ConnectWalletButton() {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== 'loading'
        const connected = ready && account && chain && (!authenticationStatus || authenticationStatus === 'authenticated')

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    type="button"
                    className="px-4 py-2 rounded-md text-white bg-[#2a4365] hover:bg-[#2c5282] border border-[#3182CE]/30 transition-colors duration-200"
                  >
                    Connect Wallet
                  </button>
                )
              }

              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="px-4 py-2 rounded-md text-white bg-red-500/80 hover:bg-red-500 border border-red-600/30"
                  >
                    Wrong Network
                  </button>
                )
              }

              return (
                <div className="flex gap-2">
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="flex items-center px-3 py-2 rounded-md bg-[#0c1624] border border-[#1e2c3b] hover:bg-[#0a1525] transition-colors duration-200"
                  >
                    {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 16,
                          height: 16,
                          borderRadius: 999,
                          overflow: 'hidden',
                          marginRight: 4,
                        }}
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? 'Chain icon'}
                            src={chain.iconUrl}
                            style={{ width: 16, height: 16 }}
                          />
                        )}
                      </div>
                    )}
                    <span className="text-sm text-[#5FBDE9]">
                      {chain.name ?? chain.id}
                    </span>
                  </button>

                  <button
                    onClick={openAccountModal}
                    type="button"
                    className="flex items-center px-3 py-2 rounded-md bg-[#0c1624] border border-[#1e2c3b] hover:bg-[#0a1525] transition-colors duration-200"
                  >
                    <span className="text-sm font-medium text-white mr-1">
                      {account.displayName}
                    </span>
                    <span className="text-xs text-[#5FBDE9] font-mono">
                      {account.displayBalance ? `(${account.displayBalance})` : ''}
                    </span>
                  </button>
                </div>
              )
            })()}
          </div>
        )
      }}
    </ConnectButton.Custom>
  )
}