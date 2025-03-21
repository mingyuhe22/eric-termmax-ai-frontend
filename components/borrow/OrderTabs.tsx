// components/borrow/OrderTabs.tsx
import React from 'react';

interface OrderTabsProps {
  activeTab: 'market' | 'limit';
  setActiveTab: (tab: 'market' | 'limit') => void;
}

const OrderTabs: React.FC<OrderTabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="mx-6 mb-4">
      <div className="bg-[#0c1624] border border-[#1e2c3b] rounded-lg overflow-hidden">
        <div className="flex">
          <button
            className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 ${
              activeTab === 'market' 
                ? 'border-[#47A6E5] text-white' 
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('market')}
          >
            Market Order
          </button>
          <button
            className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 ${
              activeTab === 'limit' 
                ? 'border-[#47A6E5] text-white' 
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('limit')}
          >
            Limit Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderTabs;