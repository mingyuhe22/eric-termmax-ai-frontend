// components/vaults/VaultSidebar.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Vault } from '@/types/vault';
import VaultHeader from './VaultHeader';
import AddressRow from './AddressRow';
import PerformancePanel from './PerformancePanel';
import DepositWithdrawPanel from './DepositWithdrawPanel';
import MarketAllocationTable from './MarketAllocationTable';
import TransactionHistory from './TransactionHistory';
import { X } from 'lucide-react';

interface VaultSidebarProps {
  vault: Vault | null;
  onClose: () => void;
  onDeposit: (vault: Vault) => void;
  onWithdraw: (vault: Vault) => void;
  utils: {
    getTokenPair: (symbol: string) => { baseToken: string; quoteToken: string };
    calculateYield: (amount: number, apy: number, period: number) => number;
  };
}

// Helper function to extract the underlying token symbol
const getUnderlyingSymbol = (symbol: string) => {
  return symbol.split('/')[1];
};

const VaultSidebar: React.FC<VaultSidebarProps> = ({
  vault,
  onClose,
  onDeposit,
  onWithdraw,
  utils
}) => {
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [marketPage, setMarketPage] = useState(1);
  const [transactionPage, setTransactionPage] = useState(1);
  const [isVisible, setIsVisible] = useState(false);

  // Mock wallet balances for display
  const walletBalances = {
    WETH: 1.8523,
    USDC: 5280.65,
    USDT: 3150.42,
    wBTC: 0.0821,
  };

  useEffect(() => {
    // Trigger animation after component mounts
    setIsVisible(true);
  }, []);

  // Handle the case where no vault is selected
  if (!vault) {
    return (
      <motion.div
        className="fixed right-0 top-0 bottom-0 w-full sm:w-2/3 md:w-3/5 lg:w-2/5 bg-[#0a1525] text-white z-50 overflow-y-auto shadow-2xl"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 250, damping: 30 }}
      >
        <div className="flex items-center justify-between p-4 border-b border-[#1e2c3b]">
          <h2 className="text-lg font-medium">Select a Vault</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
      </motion.div>
    );
  }

  const { baseToken } = utils.getTokenPair(vault.symbol);
  const underlyingSymbol = getUnderlyingSymbol(vault.symbol);
  const vaultName = `TMX-${underlyingSymbol}-${vault.underlyingAddress.slice(-4)}-Vault`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(text);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  // Calculate expected yield
  const calculateExpectedYield = (amount: string) => {
    if (!amount || isNaN(parseFloat(amount))) return 0;
    return utils.calculateYield(parseFloat(amount), vault.apy, 365);
  };

  // Handle deposit action 
  const handleDeposit = (amount: string) => {
    if (!amount || parseFloat(amount) <= 0) return;
    onDeposit(vault);
  };

  // Handle withdraw action
  const handleWithdraw = (amount: string) => {
    if (!amount || parseFloat(amount) <= 0) return;
    onWithdraw(vault);
  };

  // Market pagination
  const marketsPerPage = 4;
  const totalMarketPages = vault.marketAllocation ? 
    Math.ceil(vault.marketAllocation.length / marketsPerPage) : 1;
  const paginatedMarkets = vault.marketAllocation ?
    vault.marketAllocation.slice((marketPage - 1) * marketsPerPage, marketPage * marketsPerPage) : [];

  // Transaction pagination
  const transactionsPerPage = 4;
  const totalTransactionPages = vault.transactions ? 
    Math.ceil(vault.transactions.length / transactionsPerPage) : 1;
  const paginatedTransactions = vault.transactions ?
    vault.transactions.slice((transactionPage - 1) * transactionsPerPage, transactionPage * transactionsPerPage) : [];

  // Get current wallet balance for the token
  const getCurrentTokenBalance = () => {
    return walletBalances[baseToken as keyof typeof walletBalances] || 0;
  };

  return (
    <>
      {/* Backdrop overlay with blur effect */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[99] transition-opacity duration-300"
        style={{ opacity: isVisible ? 1 : 0 }}
        onClick={onClose}
      />

      {/* Paper-like sidebar */}
      <motion.div
        className="fixed right-0 top-0 bottom-0 w-full sm:w-2/3 md:w-2/3 lg:w-2/3 bg-[#0a1525] text-white z-[100] overflow-y-auto shadow-2xl border-l border-[#1e2c3b]"
        initial={{ x: '100%', opacity: 0, boxShadow: '0 0 0 rgba(0,0,0,0)' }}
        animate={{
          x: isVisible ? 0 : '100%',
          opacity: isVisible ? 1 : 0,
          boxShadow: isVisible ? '-10px 0 30px rgba(0,0,0,0.5)' : '0 0 0 rgba(0,0,0,0)'
        }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      >
        {/* Header */}
        <VaultHeader 
          vaultName={vaultName}
          symbol={underlyingSymbol}
          tokenSymbol={baseToken}
          onClose={onClose}
        />

        <div className="p-6">
          {/* Description */}
          <p className="text-gray-300 text-sm mb-4">
            This vault uses {baseToken} as collateral to generate
            yield through automated lending strategies on TermMax.
          </p>

          {/* Contract Addresses */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
            <AddressRow
              label="Vault Address"
              address={vault.address}
              copyToClipboard={copyToClipboard}
              copiedAddress={copiedAddress}
            />
            <AddressRow
              label="Router Address"
              address={vault.routerAddress}
              copyToClipboard={copyToClipboard}
              copiedAddress={copiedAddress}
            />
            <AddressRow
              label="Underlying Token"
              address={vault.underlyingAddress}
              copyToClipboard={copyToClipboard}
              copiedAddress={copiedAddress}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column - Performance Section */}
            <PerformancePanel 
              apy={vault.apy}
              apr7d={vault.apr7d}
              apr30d={vault.apr30d}
            />

            {/* Right Column - Deposit/Withdraw */}
            <DepositWithdrawPanel
              baseToken={baseToken}
              performanceFee={vault.performanceFee || 10}
              userPosition={vault.userPosition || 0}
              walletBalance={getCurrentTokenBalance()}
              onDeposit={handleDeposit}
              onWithdraw={handleWithdraw}
              calculateYield={calculateExpectedYield}
            />
          </div>

          {/* Market Allocation Table */}
          {vault.marketAllocation && vault.marketAllocation.length > 0 && (
            <MarketAllocationTable
              markets={paginatedMarkets}
              ltv={vault.ltv}
              currentPage={marketPage}
              totalPages={totalMarketPages}
              onPageChange={setMarketPage}
            />
          )}

          {/* Recent Transactions */}
          {vault.transactions && vault.transactions.length > 0 && (
            <TransactionHistory
              transactions={paginatedTransactions}
              currentPage={transactionPage}
              totalPages={totalTransactionPages}
              onPageChange={setTransactionPage}
            />
          )}
        </div>
      </motion.div>
    </>
  );
};

export default VaultSidebar;