// hooks/useVaults.ts
import { useState, useEffect, useMemo } from 'react';
import { fetchMarketConfig } from '@/lib/api/market';
import { generateMockVaultData } from '@/lib/mock/vault-mock-data';
import { Vault } from '@/types/vault';

export function useVaults() {
  const [vaults, setVaults] = useState<Vault[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVaultId, setSelectedVaultId] = useState<string | null>(null);
  const [sortField, setSortField] = useState('apy');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [chainFilter, setChainFilter] = useState('all');

  // Load vaults
  useEffect(() => {
    async function loadVaults() {
      try {
        setLoading(true);
        const chainId = 421614;
        const data = await fetchMarketConfig(chainId);

        if (data) {
          const marketVaults = data.markets.map((market) => generateMockVaultData(market, data.assetConfigs));
          setVaults(marketVaults);
        }
      } catch (err) {
        console.error('Failed to load vaults:', err);
        setError('Failed to load vaults. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    loadVaults();
  }, []);

  // Handle sorting and filtering
  const filteredVaults = useMemo(() => {
    return vaults
      .filter(vault => {
        // Search filter
        const matchesSearch = searchTerm === '' || 
          vault.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vault.symbol.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Chain filter
        const matchesChain = chainFilter === 'all' || 
          vault.chain?.toLowerCase() === chainFilter.toLowerCase();
        
        return matchesSearch && matchesChain;
      })
      .sort((a, b) => {
        // Always prioritize user positions
        if ((a.userPosition ?? 0) > 0 && (b.userPosition ?? 0) === 0) return -1;
        if ((a.userPosition ?? 0) === 0 && (b.userPosition ?? 0) > 0) return 1;

        // Sort by selected field
        const valueA = a[sortField as keyof Vault];
        const valueB = b[sortField as keyof Vault];

        if (valueA === undefined || valueB === undefined) return 0;
        
        // Handle different data types
        if (valueA instanceof Date && valueB instanceof Date) {
          return sortDirection === 'asc' 
            ? valueA.getTime() - valueB.getTime() 
            : valueB.getTime() - valueA.getTime();
        }
        
        if (typeof valueA === 'number' && typeof valueB === 'number') {
          return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
        }
        
        // Default string comparison
        const strA = String(valueA).toLowerCase();
        const strB = String(valueB).toLowerCase();
        return sortDirection === 'asc' ? strA.localeCompare(strB) : strB.localeCompare(strA);
      });
  }, [vaults, searchTerm, chainFilter, sortField, sortDirection]);

  // Get selected vault
  const selectedVault = useMemo(() => {
    return vaults.find(v => v.id === selectedVaultId) || null;
  }, [vaults, selectedVaultId]);

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Handle vault selection
  const selectVault = (vaultId: string | null) => {
    setSelectedVaultId(vaultId);
  };

  return {
    vaults,
    filteredVaults,
    loading,
    error,
    selectedVault,
    sortField,
    sortDirection,
    searchTerm,
    chainFilter,
    setSearchTerm,
    setChainFilter,
    handleSort,
    selectVault
  };
}