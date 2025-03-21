'use client';
import { arbitrum, arbitrumSepolia, base, mainnet, optimism, polygon, sonic } from 'wagmi/chains';
import {
  argentWallet,
  ledgerWallet,
  trustWallet
} from '@rainbow-me/rainbowkit/wallets';
import { http } from 'viem';
import { createConfig, WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { connectorsForWallets, darkTheme, RainbowKitProvider, getDefaultWallets} from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';

// Configure chains - note: sonic has been removed as it might not be supported
export const { wallets } = getDefaultWallets();

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Other',
      wallets: [argentWallet, trustWallet, ledgerWallet],
    },
  ],
  {
    appName: 'TermMax.Fi',
    projectId: 'YOUR_PROJECT_ID',
  }
);

// Create wagmi config
export const config = createConfig({
  chains: [
    mainnet,
    polygon,
    optimism,
    arbitrum,
    sonic,
    base,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [arbitrumSepolia] : []),
  ],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [optimism.id]: http(),
    [arbitrum.id]: http(),
    [sonic.id]: http(),
    [base.id]: http(),
    [arbitrumSepolia.id]: http(), 
  },
  connectors,
});

// Create query client
const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  const customRainbowTheme = darkTheme({
    accentColor: '#4aa2de',           // 使用 logo 中的主要藍色
    accentColorForeground: '#FFFFFF', // 藍色上的文字為白色
    borderRadius: 'medium',           // 中等圓角
    fontStack: 'system',              // 系統字體
    overlayBlur: 'small',             // 輕微模糊效果
  });

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider 
          theme={customRainbowTheme}
          appInfo={{
            appName: 'TermMax Finance',
            learnMoreUrl: '/about',
          }}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default Providers;