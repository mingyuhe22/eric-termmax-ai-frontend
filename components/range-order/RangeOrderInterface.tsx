// components/range-order/RangeOrderInterface.tsx
'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowUpDown,
} from 'lucide-react'

// Import components
import MarketSelector from '@/components/range-order/MarketSelector'
import MarketSummary from '@/components/range-order/MarketSummary'
import CuratorControls from '@/components/range-order/CuratorControls'
import TwoWayOrderForm from '@/components/range-order/TwoWayOrderForm'
import LendOrderForm from '@/components/range-order/LendOrderForm'
import BorrowOrderForm from '@/components/range-order/BorrowOrderForm'
import SyncedRangeChart from '@/components/range-order/SyncedRangeChart'
import PositionsTabs from '@/components/range-order/PositionsTabs'
import PositionEditModal from '@/components/range-order/EditModal/PositionEditModal'

// Import types and mocks
import { 
  RangePoint, 
  OrderTab, 
  strategyPresets, 
  Market, 
  WalletData 
} from '@/lib/range-order/types'
import { 
  Position, 
  lendPositions, 
  borrowPositions, 
  twoWayPositions,
} from '@/lib/mock/range-order-mock-data'
import { Vault } from '@/types/vault'
import { generateMockVaultData } from '@/lib/mock/vault-mock-data'

// Mock curator address for demo purposes
const CURATOR_ADDRESS = "0xB81a5bfD";
const CURRENT_USER_ADDRESS = "0xB81a5bfD"; // Set this to match CURATOR_ADDRESS to see curator functionality

export default function RangeOrderInterface() {
  // Order type
  const [orderTab, setOrderTab] = useState<OrderTab>('both')
  
  // Order amount and rate
  const [orderAmount, setOrderAmount] = useState('1000')
  const [minRate, setMinRate] = useState('5')
  const [maxRate, setMaxRate] = useState('15')
  
  // Chart state
  const [zoomLevel, setZoomLevel] = useState(1)
  
  // Initialize range points with classic strategy (default)
  const [lendPoints, setLendPoints] = useState<RangePoint[]>(strategyPresets.lend.classic)
  const [borrowPoints, setBorrowPoints] = useState<RangePoint[]>(strategyPresets.borrow.classic)
  
  // Position state
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null)
  
  // Flag to track if chart has been manually edited
  const [, setChartEdited] = useState(false)

  // Sample markets data
  const markets: Market[] = [
    {
      id: '1',
      debtToken: 'USDC',
      collateral: 'ETH',
      maturity: '25-04-25',
      lltv: 0.86,
      maxLtv: 0.82,
      icon: <div className="text-[#5FBDE9] font-medium">$</div>
    },
    {
      id: '2',
      debtToken: 'USDC',
      collateral: 'ARB',
      maturity: '25-04-25',
      lltv: 0.70,
      maxLtv: 0.65,
      icon: <div className="text-[#5FBDE9] font-medium">$</div>
    },
    {
      id: '3',
      debtToken: 'WETH',
      collateral: 'wstETH',
      maturity: '25-04-25',
      lltv: 0.94,
      maxLtv: 0.90,
      icon: <div className="text-[#5FBDE9] font-medium">Ξ</div>
    },
    {
      id: '4',
      debtToken: 'WETH',
      collateral: 'weETH',
      maturity: '25-04-25',
      lltv: 0.94,
      maxLtv: 0.90,
      icon: <div className="text-[#5FBDE9] font-medium">Ξ</div>
    },
  ]
  
  const [selectedMarket, setSelectedMarket] = useState<Market>(markets[0])

  // Current wallet balances (mock data)
  const walletData: WalletData = {
    collateral: {
      symbol: selectedMarket.collateral,
      balance: 2.47,
      value: 5434.0
    },
    debtToken: {
      symbol: selectedMarket.debtToken,
      balance: 8213.25,
      value: 8213.25
    },
    fixedIncome: {
      symbol: `FT-${selectedMarket.debtToken}`,
      balance: 1250.0,
      value: 1250.0
    },
    extraBalance: {
      symbol: `XT-${selectedMarket.debtToken}`,
      balance: 2500.0,
      value: 2500.0
    }
  }
  
  // Curator state - mock vault data
  const [isCurator, setIsCurator] = useState(false)
  const [vaults, setVaults] = useState<Vault[]>([])
  const [selectedVault, setSelectedVault] = useState<Vault | null>(null)
  
  // Check if user is a curator on mount
  useEffect(() => {
    // In a real app, this would check the connected wallet address against a list of curators
    const checkIfCurator = async () => {
      // For demo purposes, we're using a hardcoded address
      if (CURRENT_USER_ADDRESS === CURATOR_ADDRESS) {
        setIsCurator(true);
        
        // Load mock vault data
        const mockVaults: Vault[] = [];
        
        // Create some mock vaults
        const mockMarketConfig = {
          contracts: {
            routerAddr: "0x123...",
            marketAddr: "0x456...",
            underlyingAddr: "0x789...",
            collateralAddr: "0xabc...",
            ftAddr: "0xdef...",
            xtAddr: "0xghi...",
            gtAddr: "0xjkl..."
          },
          symbol: "USDC/ETH",
          isFixed: true,
          openTime: "2023-01-01",
          maturity: "2025-04-25",
          treasurer: CURATOR_ADDRESS,
          defaultFeeConfig: {
            lendTakerFeeRatio: "0.1",
            lendMakerFeeRatio: "0.05",
            borrowTakerFeeRatio: "0.1",
            borrowMakerFeeRatio: "0.05",
            issueFtFeeRatio: "0.1",
            issueFtFeeRef: "0.1",
            redeemFeeRatio: "0.1"
          }
        };
        
        const assetConfigs = [
          {
            type: "token",
            contractAddress: "0x123...",
            icon: "https://termmax-backend-v2-test.onrender.com/icon/usdc.svg",
            name: "USD Coin",
            displayName: "USDC",
            issuer: "Circle",
            symbol: "USDC",
            decimals: 6
          }
        ];
        
        // Generate mock vaults with unique IDs
        for (let i = 0; i < 5; i++) {
          const mockVault = generateMockVaultData({
            ...mockMarketConfig,
            symbol: `${['USDC', 'ETH', 'BTC', 'ARB', 'DAI'][i]}/ETH`,
            treasurer: CURATOR_ADDRESS,
            contracts: {
              ...mockMarketConfig.contracts,
              marketAddr: `0x${i}56...` // Create unique IDs for each vault
            }
          }, assetConfigs);
          
          // Add custom idle funds for curator feature
          mockVault.idleFunds = Math.floor(Math.random() * mockVault.tvl * 0.3); // Random idle funds up to 30% of TVL
          
          mockVaults.push(mockVault);
        }
        
        setVaults(mockVaults);
        
        // Set the first vault as the selected one
        if (mockVaults.length > 0) {
          setSelectedVault(mockVaults[0]);
        }
      }
    };
    
    checkIfCurator();
  }, []);
  
  // Handle position selection for editing
  const handleSelectPosition = useCallback((position: Position) => {
    setSelectedPosition(position);
  }, []);
  
  // Close position edit modal
  const handleCloseModal = useCallback(() => {
    setSelectedPosition(null);
  }, []);
  
  // Handle order tab change
  const handleOrderTabChange = useCallback((tab: OrderTab) => {
    setOrderTab(tab);
  }, []);
  
  // Handle chart point drag
  const handlePointDrag = useCallback((type: 'lend' | 'borrow', index: number, newValues: Partial<RangePoint>) => {
    setChartEdited(true);
    
    if (type === 'lend') {
      const newPoints = [...lendPoints];
      
      // Update the point with new values
      if (newValues.amount !== undefined) {
        newPoints[index].amount = newValues.amount;
      }
      
      if (newValues.apr !== undefined) {
        newPoints[index].apr = newValues.apr;
      }
      
      // Recalculate percentages based on max amount
      const maxAmount = Math.max(...newPoints.map(p => parseFloat(p.amount)));
      newPoints.forEach(point => {
        point.percentage = Math.round((parseFloat(point.amount) / maxAmount) * 100);
      });
      
      setLendPoints(newPoints);
    } else {
      const newPoints = [...borrowPoints];
      
      // Update the point with new values
      if (newValues.amount !== undefined) {
        newPoints[index].amount = newValues.amount;
      }
      
      if (newValues.apr !== undefined) {
        newPoints[index].apr = newValues.apr;
      }
      
      // Recalculate percentages based on max amount
      const maxAmount = Math.max(...newPoints.map(p => parseFloat(p.amount)));
      newPoints.forEach(point => {
        point.percentage = Math.round((parseFloat(point.amount) / maxAmount) * 100);
      });
      
      setBorrowPoints(newPoints);
    }
  }, [lendPoints, borrowPoints]);
  
  // Handle vault selection for curator
  const handleSelectVault = useCallback((vault: Vault) => {
    setSelectedVault(vault);
  }, []);
  
  // Handle order creation
  const handleCreateOrder = useCallback(() => {
    // In a real app, this would create an order with the selected parameters
    console.log('Creating order with:', {
      market: selectedMarket,
      orderTab,
      lendPoints,
      borrowPoints,
      orderAmount,
      minRate,
      maxRate,
      vault: selectedVault // For curator's order creation
    });
    
    // For demo purposes, show a success message
    alert('Order created successfully!');
  }, [selectedMarket, orderTab, lendPoints, borrowPoints, orderAmount, minRate, maxRate, selectedVault]);
  
  // Render the appropriate order form based on the selected tab
  const renderOrderForm = () => {
    switch (orderTab) {
      case 'lend':
        return (
          <LendOrderForm
            orderAmount={orderAmount}
            setOrderAmount={setOrderAmount}
            walletData={walletData}
            minRate={minRate}
            maxRate={maxRate}
            setMinRate={setMinRate}
            setMaxRate={setMaxRate}
          />
        );
      case 'borrow':
        return (
          <BorrowOrderForm
            orderAmount={orderAmount}
            setOrderAmount={setOrderAmount}
            walletData={walletData}
            maxLtv={selectedMarket.maxLtv}
            minRate={minRate}
            maxRate={maxRate}
            setMinRate={setMinRate}
            setMaxRate={setMaxRate}
          />
        );
      case 'both':
        return (
          <TwoWayOrderForm
            orderAmount={orderAmount}
            setOrderAmount={setOrderAmount}
            walletData={walletData}
            minRate={minRate}
            maxRate={maxRate}
            setMinRate={setMinRate}
            setMaxRate={setMaxRate}
            lendPoints={lendPoints}
            borrowPoints={borrowPoints}
            setLendPoints={setLendPoints}
            setBorrowPoints={setBorrowPoints}
            orderTab={orderTab}
          />
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="mt-4 max-w-7xl mx-auto px-4">
      {/* Top row - Market Selector and Market Summary */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
        <div className="md:col-span-2">
          <MarketSelector 
            selectedMarket={selectedMarket}
            markets={markets}
            onSelectMarket={setSelectedMarket}
          />
        </div>
        
        <div className="md:col-span-3">
          <MarketSummary 
            bestLendAPR="45.00%"
            bestBorrowAPR="10.00%"
            totalLiquidity="$4.3M"
            utilization="76.5%"
          />
        </div>
      </div>
      
      {/* Main Content - Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column - Parameters */}
        <div>
          <div className="bg-[#0c1624] border border-[#1e2c3b] rounded-lg p-4">
            {/* Order form */}
            {renderOrderForm()}
            
            {/* Submit Button */}
            <Button 
              className="w-full mt-4 bg-[#2a4365] hover:bg-[#2c5282] text-white border-[#3182CE]/30"
              onClick={handleCreateOrder}
              disabled={!orderAmount || parseFloat(orderAmount) <= 0}
            >
              {isCurator && selectedVault 
                ? `Submit Vault Order (${selectedVault.name})` 
                : "Submit Range Order"
              }
            </Button>
          </div>
        </div>
        
        {/* Right Column - Chart Visualization */}
        <div className="lg:col-span-2">
          {/* Curator Controls - Only visible if user is a curator */}
          {isCurator && (
            <CuratorControls
              vaults={vaults}
              selectedVault={selectedVault}
              onSelectVault={handleSelectVault}
            />
          )}
          
          <div className="bg-[#0c1624] border border-[#1e2c3b] rounded-lg p-4">
            {/* Order Type Buttons at the top of chart */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <Button 
                variant={orderTab === 'lend' ? 'default' : 'outline'} 
                className={`w-full text-sm ${orderTab === 'lend' ? 'bg-[#2a4365] hover:bg-[#2c5282] text-white' : 'text-[#A9B1BC] border-[#1e2c3b] hover:text-white hover:border-[#5FBDE9]/50'}`}
                onClick={() => handleOrderTabChange('lend')}
              >
                <TrendingUp className="h-4 w-4 mr-1.5" />
                Lend Only
              </Button>
              <Button 
                variant={orderTab === 'borrow' ? 'default' : 'outline'} 
                className={`w-full text-sm ${orderTab === 'borrow' ? 'bg-[#2a4365] hover:bg-[#2c5282] text-white' : 'text-[#A9B1BC] border-[#1e2c3b] hover:text-white hover:border-[#3182CE]/50'}`}
                onClick={() => handleOrderTabChange('borrow')}
              >
                <TrendingDown className="h-4 w-4 mr-1.5" />
                Borrow Only
              </Button>
              <Button 
                variant={orderTab === 'both' ? 'default' : 'outline'} 
                className={`w-full text-sm ${orderTab === 'both' ? 'bg-[#2a4365] hover:bg-[#2c5282] text-white' : 'text-[#A9B1BC] border-[#1e2c3b] hover:text-white hover:border-[#5FBDE9]/50'}`}
                onClick={() => handleOrderTabChange('both')}
              >
                <ArrowUpDown className="h-4 w-4 mr-1.5" />
                Both
              </Button>
            </div>
            
            {/* LLTV and Max-LTV Indicators */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-[#0a1525] border border-[#1e2c3b] rounded-lg p-3">
                <div className="text-gray-400 text-xs mb-1">LLTV</div>
                <div className="flex items-center gap-2">
                  <span className="text-[#5FBDE9] text-lg font-medium">{(selectedMarket.lltv * 100).toFixed(0)}%</span>
                  <span className="text-gray-400 text-xs">Liquidation loan-to-value</span>
                </div>
              </div>
              <div className="bg-[#0a1525] border border-[#1e2c3b] rounded-lg p-3">
                <div className="text-gray-400 text-xs mb-1">Max-LTV</div>
                <div className="flex items-center gap-2">
                  <span className="text-[#3182CE] text-lg font-medium">{(selectedMarket.maxLtv * 100).toFixed(0)}%</span>
                  <span className="text-gray-400 text-xs">Maximum loan-to-value</span>
                </div>
              </div>
            </div>
            
            <SyncedRangeChart
              orderTab={orderTab}
              lendPoints={lendPoints}
              borrowPoints={borrowPoints}
              zoomLevel={zoomLevel}
              setZoomLevel={setZoomLevel}
              onPointDrag={handlePointDrag}
            />
          </div>
        </div>
      </div>
      
      {/* Positions Section */}
      <div className="mt-8">
        <PositionsTabs
          lendPositions={lendPositions}
          borrowPositions={borrowPositions}
          twoWayPositions={twoWayPositions}
          onSelectPosition={handleSelectPosition}
        />
      </div>
      
      {/* Position Edit Modal */}
      {selectedPosition && (
        <PositionEditModal
          position={selectedPosition}
          onClose={handleCloseModal}
        />
      )}
    </div>
  )
}