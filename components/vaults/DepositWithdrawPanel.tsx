// components/vaults/DepositWithdrawPanel.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface DepositWithdrawPanelProps {
  baseToken: string;
  performanceFee: number;
  userPosition: number;
  walletBalance: number;
  onDeposit: (amount: string) => void;
  onWithdraw: (amount: string) => void;
  calculateYield: (amount: string) => number;
}

const DepositWithdrawPanel: React.FC<DepositWithdrawPanelProps> = ({
  baseToken,
  performanceFee,
  userPosition,
  walletBalance,
  onDeposit,
  onWithdraw,
  calculateYield
}) => {
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit');
  const [amount, setAmount] = useState('');

  const handleAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;

    if (activeTab === 'deposit') {
      onDeposit(amount);
    } else {
      onWithdraw(amount);
    }
  };

  return (
    <motion.div
      className="bg-[#0c1624] border border-[#1e2c3b] rounded-lg overflow-hidden shadow-lg h-full"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <Tabs defaultValue="deposit" className="h-full flex flex-col">
        <TabsList className="w-full border-b border-[#1e2c3b] bg-[#0a1525] p-0 rounded-none">
          <TabsTrigger
            value="deposit"
            onClick={() => setActiveTab('deposit')}
            className="flex-1 text-base font-medium rounded-none transition-colors duration-200 
                     data-[state=active]:bg-[#2a4365] data-[state=active]:text-white
                     data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:text-white data-[state=inactive]:hover:bg-[#1e2c3b]/30"
          >
            Deposit
          </TabsTrigger>
          <TabsTrigger
            value="withdraw"
            onClick={() => setActiveTab('withdraw')}
            className="flex-1 text-base font-medium rounded-none transition-colors duration-200 
                     data-[state=active]:bg-[#2a4365] data-[state=active]:text-white
                     data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:text-white data-[state=inactive]:hover:bg-[#1e2c3b]/30"
          >
            Withdraw
          </TabsTrigger>
        </TabsList>

        <TabsContent value="deposit" className="flex-grow p-6 m-0">
          <form onSubmit={handleAction} className="space-y-4">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-300">
                Amount
              </label>
              <div className="relative mt-1">
                <Input
                  type="number"
                  id="amount"
                  placeholder="0.0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pr-20 bg-[#081020] border-[#1e2c3b] text-white"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-6 text-xs text-[#5FBDE9]"
                  onClick={() => setAmount(walletBalance.toString())}
                >
                  MAX
                </Button>
              </div>
              <div className="flex justify-end mt-1">
                <span className="text-xs text-gray-400">
                  Wallet Balance: <span className="text-white">{walletBalance.toFixed(4)} {baseToken}</span>
                </span>
              </div>
            </div>
            <div className="text-sm text-gray-400">
              Expected yield (1 year): <span className="text-[#5FBDE9]">{calculateYield(amount).toFixed(4)} {baseToken}</span>
            </div>
            <div className="text-sm text-gray-400">
              Performance Fee: <span className="text-white">{performanceFee}%</span>
            </div>
            <Button
              type="submit"
              className="w-full bg-[#2a4365] hover:bg-[#2c5282] text-white border-[#3182CE]/30"
            >
              Deposit {baseToken}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="withdraw" className="flex-grow p-6 m-0">
          <form onSubmit={handleAction} className="space-y-4">
            <div>
              <label htmlFor="withdraw-amount" className="block text-sm font-medium text-gray-300">
                Amount
              </label>
              <div className="relative mt-1">
                <Input
                  type="number"
                  id="withdraw-amount"
                  placeholder="0.0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pr-20 bg-[#081020] border-[#1e2c3b] text-white"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-6 text-xs text-[#5FBDE9]"
                  onClick={() => setAmount(userPosition.toString())}
                >
                  MAX
                </Button>
              </div>
              <div className="flex justify-end mt-1">
                <span className="text-xs text-gray-400">
                  Your Position: <span className="text-white">{userPosition.toFixed(4)} {baseToken}</span>
                </span>
              </div>
            </div>
            <div className="text-sm text-gray-400">
              Withdrawable: <span className="text-white">{userPosition.toFixed(4)} {baseToken}</span>
            </div>
            <div className="text-sm text-gray-400">
              Performance Fee: <span className="text-white">{performanceFee}%</span>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#2a4365] hover:bg-[#2c5282] text-white border-[#3182CE]/30"
            >
              Withdraw {baseToken}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default DepositWithdrawPanel;