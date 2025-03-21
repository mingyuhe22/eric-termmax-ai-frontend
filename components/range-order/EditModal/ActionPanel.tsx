// components/range-order/EditModal/ActionPanel.tsx
'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { 
  ArrowRight, 
  ChevronDown, 
  ChevronUp, 
  PanelRightOpen,
  BarChart2,
  Info
} from 'lucide-react'
import { Position } from '@/lib/mock/range-order-mock-data'
import { debounce } from 'lodash'

interface ActionPanelProps {
  position: Position
  positionType: 'lend' | 'borrow' | 'two-way'
  onUpdate: (data: { action: string; amount: number; positionId: string }) => void
}

export default function ActionPanel({
  position,
  positionType,
  onUpdate
}: ActionPanelProps) {
  // For general tabs in two-way positions
  const [action, setAction] = useState<'lender' | 'borrower' | 'curve'>('lender');
  
  // For specific action tabs
  const [lendAction, setLendAction] = useState<'supply' | 'withdraw'>('supply');
  const [borrowAction, setBorrowAction] = useState<'add' | 'remove' | 'withdraw'>('add');
  
  // For advanced operations in Two-Way positions
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [advancedAction, setAdvancedAction] = useState<'deposit-xt' | 'deposit-ft' | 'withdraw-xt' | 'withdraw-ft'>(
    'deposit-xt'
  );
  
  // Form state
  const [amount, setAmount] = useState('');
  const [showCurveEditor, setShowCurveEditor] = useState(false);

  // Create a debounced update function for automatic calculation
  const debouncedUpdate = useCallback(
    debounce((value: string) => {
      if (value && !isNaN(parseFloat(value)) && parseFloat(value) > 0) {
        // Determine the action type based on position type and selected tabs
        let actionType = '';
        
        if (positionType === 'lend') {
          actionType = lendAction;
        } else if (positionType === 'borrow') {
          actionType = borrowAction;
        } else {
          // Two-way position
          if (showAdvanced) {
            // Map advanced actions to their respective action types
            switch (advancedAction) {
              case 'deposit-xt':
                actionType = 'deposit-xt';
                break;
              case 'deposit-ft':
                actionType = 'deposit-ft';
                break;
              case 'withdraw-xt':
                actionType = 'withdraw-xt';
                break;
              case 'withdraw-ft':
                actionType = 'withdraw-ft';
                break;
            }
          } else {
            // Standard two-way actions
            actionType = action === 'lender' ? lendAction : borrowAction;
          }
        }
        
        // Call the onUpdate prop with the action data
        onUpdate({
          action: actionType,
          amount: parseFloat(value),
          positionId: position.id
        });
      }
    }, 1000), // 1 second delay for calculation
    [lendAction, borrowAction, action, advancedAction, position.id, positionType, onUpdate, showAdvanced]
  );
  
  // Trigger the update when amount changes
  useEffect(() => {
    debouncedUpdate(amount);
    
    // Cleanup on unmount
    return () => {
      debouncedUpdate.cancel();
    };
  }, [amount, debouncedUpdate]);
  
  // Handle max button click
  const handleMax = useCallback(() => {
    if (positionType === 'lend') {
      if (lendAction === 'supply') {
        setAmount('10000'); // Mock wallet balance
      } else { // withdraw
        setAmount(position.availableToWithdraw.replace(/,/g, '') || '0');
      }
    } else if (positionType === 'borrow') {
      if (borrowAction === 'add') {
        setAmount('5'); // Mock collateral balance
      } else if (borrowAction === 'remove') {
        setAmount(position.collateralAmount?.replace(/,/g, '') || '0');
      } else { // withdraw
        setAmount(position.borrowingCapacity?.replace(/,/g, '') || '0');
      }
    } else if (positionType === 'two-way') {
      if (showAdvanced) {
        // Set max for advanced actions
        switch (advancedAction) {
          case 'deposit-xt':
          case 'deposit-ft':
            setAmount('5000'); // Mock token balance
            break;
          case 'withdraw-xt':
          case 'withdraw-ft':
            setAmount('2500'); // Mock available balance
            break;
        }
      } else {
        // Standard two-way actions
        if (action === 'lender') {
          if (lendAction === 'supply') {
            setAmount('10000'); // Mock wallet balance
          } else { // withdraw
            setAmount(position.availableToWithdraw.replace(/,/g, '') || '0');
          }
        } else if (action === 'borrower') {
          if (borrowAction === 'add') {
            setAmount('5'); // Mock collateral balance
          } else if (borrowAction === 'remove') {
            setAmount(position.collateralAmount?.replace(/,/g, '') || '0');
          } else { // withdraw
            setAmount(position.borrowingCapacity?.replace(/,/g, '') || '0');
          }
        }
      }
    }
  }, [positionType, lendAction, borrowAction, action, position, showAdvanced, advancedAction]);
  
  // Handle form submission
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (amount && !isNaN(parseFloat(amount))) {
      // Determine the action type based on position type and selected tabs
      let actionType = '';
      
      if (positionType === 'lend') {
        actionType = lendAction;
      } else if (positionType === 'borrow') {
        actionType = borrowAction;
      } else {
        // Two-way position
        if (showAdvanced) {
          actionType = advancedAction;
        } else {
          actionType = action === 'lender' ? lendAction : borrowAction;
        }
      }
      
      // Call the onUpdate prop with the action data
      onUpdate({
        action: actionType,
        amount: parseFloat(amount),
        positionId: position.id
      });
    }
  }, [amount, positionType, lendAction, borrowAction, action, position.id, onUpdate, showAdvanced, advancedAction]);
  
  // Common input field with Max button
  const renderAmountInput = useCallback((label: string, placeholder: string, maxAvailable?: string) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-white mb-1">
        {label}
      </label>
      <div className="relative">
        <Input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder={placeholder}
          className="bg-[#081020] border-[#1e2c3b] pr-16"
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 text-xs text-[#5FBDE9]"
          onClick={handleMax}
        >
          MAX
        </Button>
      </div>
      {maxAvailable && (
        <div className="text-xs text-gray-400 mt-1">
          Available: {maxAvailable}
        </div>
      )}
    </div>
  ), [amount, handleMax]);
  
  // Lender content
  const renderLenderContent = useCallback(() => {
    return (
      <Tabs 
        defaultValue="supply" 
        value={lendAction} 
        onValueChange={(value) => {
          setLendAction(value as 'supply' | 'withdraw');
          setAmount(''); // Reset amount when changing tabs
        }}
        className="w-full"
      >
        <TabsList className="bg-[#0a1525] p-1 border border-[#1e2c3b] w-full grid grid-cols-2">
          <TabsTrigger 
            value="supply" 
            className="data-[state=active]:bg-[#2a4365] data-[state=active]:text-white"
          >
            Supply
          </TabsTrigger>
          <TabsTrigger 
            value="withdraw" 
            className="data-[state=active]:bg-[#2a4365] data-[state=active]:text-white"
          >
            Withdraw
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="supply" className="pt-4">
          {renderAmountInput(
            `Amount to Supply (${position.debtToken})`,
            "0.00",
            `10,000 ${position.debtToken}`
          )}
        </TabsContent>
        
        <TabsContent value="withdraw" className="pt-4">
          {renderAmountInput(
            `Amount to Withdraw (${position.debtToken})`,
            "0.00",
            `${position.availableToWithdraw} ${position.debtToken}`
          )}
        </TabsContent>
      </Tabs>
    );
  }, [lendAction, position, renderAmountInput]);
  
  // Borrower content
  const renderBorrowerContent = useCallback(() => {
    return (
      <Tabs 
        defaultValue="add" 
        value={borrowAction} 
        onValueChange={(value) => {
          setBorrowAction(value as 'add' | 'remove' | 'withdraw');
          setAmount(''); // Reset amount when changing tabs
        }}
        className="w-full"
      >
        <TabsList className="bg-[#0a1525] p-1 border border-[#1e2c3b] w-full grid grid-cols-3">
          <TabsTrigger 
            value="add" 
            className="data-[state=active]:bg-[#2a4365] data-[state=active]:text-white"
          >
            Add Collateral
          </TabsTrigger>
          <TabsTrigger 
            value="remove" 
            className="data-[state=active]:bg-[#2a4365] data-[state=active]:text-white"
          >
            Remove
          </TabsTrigger>
          <TabsTrigger 
            value="withdraw" 
            className="data-[state=active]:bg-[#2a4365] data-[state=active]:text-white"
          >
            Withdraw
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="add" className="pt-4">
          {renderAmountInput(
            `Collateral to Add (${position.collateral})`,
            "0.00",
            `5 ${position.collateral}`
          )}
        </TabsContent>
        
        <TabsContent value="remove" className="pt-4">
          {renderAmountInput(
            `Collateral to Remove (${position.collateral})`,
            "0.00",
            `${position.collateralAmount || '0'} ${position.collateral}`
          )}
        </TabsContent>
        
        <TabsContent value="withdraw" className="pt-4">
          {renderAmountInput(
            `Amount to Withdraw (${position.debtToken})`,
            "0.00",
            `${position.borrowingCapacity || '0'} ${position.debtToken}`
          )}
        </TabsContent>
      </Tabs>
    );
  }, [borrowAction, position, renderAmountInput]);
  
  // Advanced operations content for Two-Way positions
  const renderAdvancedContent = useCallback(() => {
    return (
      <div className="space-y-4">
        <div className="bg-[#081020] border border-[#1e2c3b] rounded-lg p-3 mb-3">
          <div className="text-xs text-gray-400 mb-2">Advanced Operations</div>
          <p className="text-xs text-yellow-400">
            These operations directly modify your liquidity tokens. Use with caution.
          </p>
        </div>
        
        <Tabs 
          defaultValue="deposit-xt" 
          value={advancedAction} 
          onValueChange={(value) => {
            setAdvancedAction(value as 'deposit-xt' | 'deposit-ft' | 'withdraw-xt' | 'withdraw-ft');
            setAmount(''); // Reset amount when changing tabs
          }}
          className="w-full"
        >
          <TabsList className="bg-[#0a1525] p-1 border border-[#1e2c3b] w-full grid grid-cols-2 gap-1 mb-2">
            <TabsTrigger 
              value="deposit-xt" 
              className="data-[state=active]:bg-[#2a4365] data-[state=active]:text-white text-xs h-9"
            >
              Deposit XT
            </TabsTrigger>
            <TabsTrigger 
              value="deposit-ft" 
              className="data-[state=active]:bg-[#2a4365] data-[state=active]:text-white text-xs h-9"
            >
              Deposit FT
            </TabsTrigger>
          </TabsList>
          
          <TabsList className="bg-[#0a1525] p-1 border border-[#1e2c3b] w-full grid grid-cols-2 gap-1">
            <TabsTrigger 
              value="withdraw-xt" 
              className="data-[state=active]:bg-[#2a4365] data-[state=active]:text-white text-xs h-9"
            >
              Withdraw XT
            </TabsTrigger>
            <TabsTrigger 
              value="withdraw-ft" 
              className="data-[state=active]:bg-[#2a4365] data-[state=active]:text-white text-xs h-9"
            >
              Withdraw FT
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="deposit-xt" className="pt-4">
            {renderAmountInput(
              `Deposit XT Tokens`,
              "0.00",
              `5,000 XT-${position.debtToken}`
            )}
            <div className="text-xs text-gray-400 mt-2">
              Depositing XT tokens increases your lending liquidity in this position.
            </div>
          </TabsContent>
          
          <TabsContent value="deposit-ft" className="pt-4">
            {renderAmountInput(
              `Deposit FT Tokens`,
              "0.00", 
              `5,000 FT-${position.debtToken}`
            )}
            <div className="text-xs text-gray-400 mt-2">
              Depositing FT tokens increases your borrowing liquidity in this position.
            </div>
          </TabsContent>
          
          <TabsContent value="withdraw-xt" className="pt-4">
            {renderAmountInput(
              `Withdraw XT Tokens`,
              "0.00",
              `2,500 XT-${position.debtToken}`
            )}
            <div className="text-xs text-gray-400 mt-2">
              Withdrawing XT tokens reduces your lending liquidity in this position.
            </div>
          </TabsContent>
          
          <TabsContent value="withdraw-ft" className="pt-4">
            {renderAmountInput(
              `Withdraw FT Tokens`,
              "0.00",
              `2,500 FT-${position.debtToken}`
            )}
            <div className="text-xs text-gray-400 mt-2">
              Withdrawing FT tokens reduces your borrowing liquidity in this position.
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
  }, [advancedAction, position.debtToken, renderAmountInput]);
  
  // Rate Curve Editing content
  const renderCurveContent = useCallback(() => {
    return (
      <div className="p-4 bg-[#0a1525] border border-[#1e2c3b] rounded-lg">
        <div className="flex items-center gap-2 mb-3">
          <BarChart2 className="h-4 w-4 text-gray-400" />
          <h3 className="text-sm font-medium text-white">Curve Editing</h3>
        </div>
        <p className="text-xs text-gray-400 mb-4">
          Curve editing is disabled in this view. To edit the order curve, please use the custom parameters in the main order creation interface.
        </p>
        <div className="flex items-center gap-2 border-t border-[#1e2c3b] pt-3 mt-3 text-xs text-gray-400">
          <Info className="h-3 w-3 text-gray-500" />
          <span>Curve editing is available when creating a new order.</span>
        </div>
      </div>
    );
  }, []);
  
  // Render different forms based on position type
  const renderContent = useCallback(() => {
    if (positionType === 'lend') {
      return (
        <div>
          <h3 className="text-lg font-medium text-white mb-4">Lend Position Actions</h3>
          {!showCurveEditor ? (
            renderLenderContent()
          ) : (
            renderCurveContent()
          )}
          
          <div className="mt-6 border-t border-[#1e2c3b] pt-4">
            <button
              type="button"
              className="text-sm text-gray-400 hover:text-white flex items-center gap-1"
              onClick={() => setShowCurveEditor(!showCurveEditor)}
            >
              {showCurveEditor ? 'Hide' : 'Show'} Rate Curve Editor
              <ArrowRight className={`h-3 w-3 transform transition-transform ${showCurveEditor ? 'rotate-90' : ''}`} />
            </button>
          </div>
        </div>
      );
    } else if (positionType === 'borrow') {
      return (
        <div>
          <h3 className="text-lg font-medium text-white mb-4">Borrow Position Actions</h3>
          {!showCurveEditor ? (
            renderBorrowerContent()
          ) : (
            renderCurveContent()
          )}
          
          <div className="mt-6 border-t border-[#1e2c3b] pt-4">
            <button
              type="button"
              className="text-sm text-gray-400 hover:text-white flex items-center gap-1"
              onClick={() => setShowCurveEditor(!showCurveEditor)}
            >
              {showCurveEditor ? 'Hide' : 'Show'} Rate Curve Editor
              <ArrowRight className={`h-3 w-3 transform transition-transform ${showCurveEditor ? 'rotate-90' : ''}`} />
            </button>
          </div>
        </div>
      );
    } else {
      // Two-way position - show tabs with different options
      return (
        <div>
          <h3 className="text-lg font-medium text-white mb-4">Two-Way Position Actions</h3>
          
          {/* Advanced Mode Toggle */}
          <div 
            className="mb-4 p-3 border border-[#1e2c3b] rounded-lg bg-[#0a1525] cursor-pointer"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <PanelRightOpen className="h-4 w-4 text-[#5FBDE9]" />
                <span className="text-sm font-medium text-white">Advanced Operations</span>
              </div>
              <div>
                {showAdvanced ? (
                  <ChevronUp className="h-4 w-4 text-gray-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                )}
              </div>
            </div>
            {!showAdvanced && (
              <p className="text-xs text-gray-400 mt-1">
                Access specialized operations like direct token deposits and withdrawals.
              </p>
            )}
          </div>
          
          {showAdvanced ? (
            // Show advanced two-way operations
            renderAdvancedContent()
          ) : (
            // Show standard role-based options
            <Tabs 
              defaultValue="lender" 
              value={action} 
              onValueChange={(value) => {
                setAction(value as 'lender' | 'borrower' | 'curve');
                setAmount(''); // Reset amount when changing roles
              }}
              className="w-full"
            >
              <TabsList className="bg-[#0a1525] p-1 border border-[#1e2c3b] w-full grid grid-cols-3">
                <TabsTrigger 
                  value="lender" 
                  className="data-[state=active]:bg-[#2a4365] data-[state=active]:text-white"
                >
                  Lender
                </TabsTrigger>
                <TabsTrigger 
                  value="borrower" 
                  className="data-[state=active]:bg-[#2a4365] data-[state=active]:text-white"
                >
                  Borrower
                </TabsTrigger>
                <TabsTrigger 
                  value="curve" 
                  className="data-[state=active]:bg-[#2a4365] data-[state=active]:text-white"
                >
                  Curve
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="lender" className="pt-4">
                {renderLenderContent()}
              </TabsContent>
              
              <TabsContent value="borrower" className="pt-4">
                {renderBorrowerContent()}
              </TabsContent>
              
              <TabsContent value="curve" className="pt-4">
                {renderCurveContent()}
              </TabsContent>
            </Tabs>
          )}
        </div>
      );
    }
  }, [
    positionType, 
    renderLenderContent, 
    renderBorrowerContent, 
    renderCurveContent,
    renderAdvancedContent,
    showCurveEditor, 
    showAdvanced,
    action
  ]);

  const submitButtonText = useCallback(() => { 
    if (showCurveEditor) return 'Update Curve Parameters';
    
    if (positionType === 'lend') { 
      return lendAction === 'supply' ? 'Supply' : 'Withdraw'; 
    } else if (positionType === 'borrow') { 
      return borrowAction === 'add' 
        ? 'Add Collateral' 
        : borrowAction === 'remove'
          ? 'Remove Collateral'
          : 'Withdraw'; 
    } else { 
      // Two-way position
      if (showAdvanced) {
        switch (advancedAction) {
          case 'deposit-xt':
            return 'Deposit XT';
          case 'deposit-ft':
            return 'Deposit FT';
          case 'withdraw-xt':
            return 'Withdraw XT';
          case 'withdraw-ft':
            return 'Withdraw FT';
          default:
            return 'Submit';
        }
      } else {
        if (action === 'lender') { 
          return lendAction === 'supply' ? 'Supply' : 'Withdraw'; 
        } else if (action === 'borrower') { 
          return borrowAction === 'add' 
            ? 'Add Collateral' 
            : borrowAction === 'remove'
              ? 'Remove Collateral'
              : 'Withdraw'; 
        } else if (action === 'curve') {
          return 'Update Curve';
        } else { 
          return 'Submit'; 
        } 
      }
    } 
  }, [positionType, lendAction, borrowAction, action, showCurveEditor, showAdvanced, advancedAction]);
  
  return ( 
    <form onSubmit={handleSubmit} className="w-full"> 
      <div className="mb-6"> 
        {renderContent()} 
      </div> 
      
      <Button 
        type="submit" 
        className="w-full bg-[#2a4365] hover:bg-[#2c5282] text-white border-[#3182CE]/30"
        disabled={((!amount || parseFloat(amount) <= 0) && !showCurveEditor) || (action === 'curve')}
      >
        {submitButtonText()}
      </Button>
    </form>
  );
}