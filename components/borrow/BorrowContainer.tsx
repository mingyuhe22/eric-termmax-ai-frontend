// components/borrow/BorrowContainer.tsx
import React, { useState } from 'react';
import { Market } from '@/types/borrow';
import BorrowHeader from './BorrowHeader';
import AddressSection from './AddressSection';
import MarketStats from './MarketStats';
import RateCharts from './RateCharts';
import OrderTabs from './OrderTabs';
import BorrowForm from './BorrowForm';
import TransactionHistory from './TransactionHistory';

interface BorrowContainerProps {
  market: Market;
  onClose: () => void;
}

const BorrowContainer: React.FC<BorrowContainerProps> = ({ market, onClose }) => {
  const [isVisible] = useState(true);
  const [activeTab, setActiveTab] = useState<'market' | 'limit'>('market');
  const [leverageValue, setLeverageValue] = useState(1.0);
  const [isLeverageActive, setIsLeverageActive] = useState(false);
  
  // Handle leverage change
  const handleLeverageChange = (newValue: number) => {
    setLeverageValue(newValue);
    setIsLeverageActive(newValue > 1.0);
  };
  
  // Handle backdrop click to close
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  // Only show leverage if market supports it and we're in market order mode
  const showLeverageControls = market.supportsLeverage && activeTab === 'market';
  
  return (
    <>
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[99] transition-opacity duration-300"
        style={{ opacity: isVisible ? 1 : 0 }}
        onClick={handleBackdropClick}
      />
      
      {/* Sidebar */}
      <div 
        className="fixed right-0 top-0 bottom-0 w-full sm:w-2/3 md:w-3/5 lg:w-2/5 bg-[#0a0d19] text-white z-[100] overflow-y-auto shadow-2xl border-l border-[#1e2c3b] transition-transform duration-300"
        style={{ transform: isVisible ? 'translateX(0)' : 'translateX(100%)' }}
      >
        <BorrowHeader 
          market={market} 
          onClose={onClose} 
        />
        
        <AddressSection addresses={market.addresses} />
        
        {/* Updated to only pass borrowAPR */}
        <MarketStats 
          borrowAPR={market.borrowAPR} 
        />
        
        {/* Charts - show both borrow and leverage rates in single chart if leverage is active */}
        <RateCharts
          borrowAPR={market.borrowAPR}
          leverageValue={leverageValue}
          showLeverage={isLeverageActive && showLeverageControls}
        />
        
        <OrderTabs 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        
        <BorrowForm 
          market={market}
          activeTab={activeTab}
          leverageValue={leverageValue}
          isLeverageActive={isLeverageActive}
          onLeverageChange={handleLeverageChange}
        />
        
        <TransactionHistory />
      </div>
    </>
  );
};

export default BorrowContainer;