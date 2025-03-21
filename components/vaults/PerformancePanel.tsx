// components/vaults/PerformancePanel.tsx
import React from 'react';
import { TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import CountUp from '@/components/shared/CountUp';

interface PerformancePanelProps {
  apy: number;
  apr7d?: number;
  apr30d?: number;
}

const PerformancePanel: React.FC<PerformancePanelProps> = ({ 
  apy, 
  apr7d, 
  apr30d 
}) => {
  // Calculate component values based on APY
  const baseYield = apy * 0.65;
  const protocolIncentives = apy * 0.25;
  const tradingFees = apy * 0.1;

  return (
    <motion.div
      className="bg-[#0c1624] border border-[#1e2c3b] rounded-lg p-6 shadow-lg h-full"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1 }}
    >
      <h3 className="text-base font-medium text-white mb-4 flex items-center">
        <TrendingUp className="h-5 w-5 mr-2 text-[#5FBDE9]" />
        Performance
      </h3>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-[#081020] p-4 rounded-lg shadow-inner border border-[#1e2c3b]">
          <div className="text-sm text-gray-400 mb-1">Now APY</div>
          <div className="text-2xl font-medium text-[#5FBDE9]">
            <CountUp value={apy} decimals={2} suffix="%" />
          </div>
        </div>

        <div className="bg-[#081020] p-4 rounded-lg shadow-inner border border-[#1e2c3b]">
          <div className="text-sm text-gray-400 mb-1">7D APY</div>
          <div className="text-2xl font-medium text-[#5FBDE9]">
            <CountUp value={apr7d || apy * 0.95} decimals={2} suffix="%" />
          </div>
        </div>

        <div className="bg-[#081020] p-4 rounded-lg shadow-inner border border-[#1e2c3b]">
          <div className="text-sm text-gray-400 mb-1">30D APY</div>
          <div className="text-2xl font-medium text-[#5FBDE9]">
            <CountUp value={apr30d || apy * 0.90} decimals={2} suffix="%" />
          </div>
        </div>
      </div>

      <div className="space-y-5 pt-4">
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-400">Base Yield</span>
            <span className="text-white">{baseYield.toFixed(2)}%</span>
          </div>
          <div className="w-full bg-[#1e2c3b]/30 rounded-full h-2 overflow-hidden">
            <motion.div
              className="bg-[#5FBDE9] h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: '65%' }}
              transition={{ delay: 0.3, duration: 0.8 }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-400">Protocol Incentives</span>
            <span className="text-white">{protocolIncentives.toFixed(2)}%</span>
          </div>
          <div className="w-full bg-[#1e2c3b]/30 rounded-full h-2 overflow-hidden">
            <motion.div
              className="bg-[#3182CE] h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: '25%' }}
              transition={{ delay: 0.5, duration: 0.8 }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-400">Trading Fees</span>
            <span className="text-white">{tradingFees.toFixed(2)}%</span>
          </div>
          <div className="w-full bg-[#1e2c3b]/30 rounded-full h-2 overflow-hidden">
            <motion.div
              className="bg-[#2a4365] h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: '10%' }}
              transition={{ delay: 0.7, duration: 0.8 }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PerformancePanel;