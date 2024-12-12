import React, { useEffect, useState } from 'react';
import { Package2, Loader, RefreshCw, X } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useProductStore } from '../store/productStore';
import { fetchProducts, fetchSales } from '../services/googleSheets';
import { SearchBar } from '../components/SearchBar';
import { ErrorDisplay } from '../components/ErrorDisplay';
import { ItemsTable } from '../components/ItemsTable';
import { SalesAnalysis } from './SalesAnalysis';

export function ItemsPerformance() {
  const { sales, setSales } = useStore();
  const { products, isLoading, error, setProducts, setLoading, setError } = useProductStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isCheckingData, setIsCheckingData] = useState(false);
  const [checkError, setCheckError] = useState<string | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchProducts();
        if (mounted) {
          setProducts(data);
        }
      } catch (error) {
        if (mounted) {
          setError(error instanceof Error ? error.message : 'Failed to load products');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadProducts();
    return () => { mounted = false; };
  }, [setProducts, setLoading, setError]);

  const handleCheckData = async () => {
    if (selectedItems.length === 0) {
      alert('Please select at least one item to check');
      return;
    }

    setIsCheckingData(true);
    setCheckError(null);

    try {
      const salesData = await fetchSales();
      setSales(salesData);
      setShowAnalysis(true);
    } catch (error) {
      setCheckError(error instanceof Error ? error.message : 'Failed to fetch sales data');
    } finally {
      setIsCheckingData(false);
    }
  };

  const handleToggleItem = (itemCode: string) => {
    if (itemCode === 'all') {
      setSelectedItems(products.map(p => p.itemCode));
    } else if (itemCode === 'none') {
      setSelectedItems([]);
    } else {
      setSelectedItems(prev => 
        prev.includes(itemCode)
          ? prev.filter(code => code !== itemCode)
          : [...prev, itemCode]
      );
    }
  };

  const handleClearSelection = () => {
    setSelectedItems([]);
  };

  const filteredItems = products.filter(item => {
    const searchLower = searchQuery.toLowerCase();
    return (
      item.itemCode.toLowerCase().includes(searchLower) ||
      item.description.toLowerCase().includes(searchLower) ||
      item.vendor.toLowerCase().includes(searchLower)
    );
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return <ErrorDisplay message={error} />;
  }

  if (showAnalysis) {
    return <SalesAnalysis sales={sales} selectedItems={selectedItems} onBack={() => setShowAnalysis(false)} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Package2 className="h-6 w-6 text-indigo-600" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900">Select Products</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleClearSelection}
              disabled={selectedItems.length === 0}
              className={`inline-flex items-center px-4 py-2 rounded-lg transition-colors ${
                selectedItems.length === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-red-100 text-red-600 hover:bg-red-200'
              }`}
            >
              <X className="h-4 w-4 mr-2" />
              Clear Selection
            </button>
            <button
              onClick={handleCheckData}
              disabled={isCheckingData || selectedItems.length === 0}
              className={`inline-flex items-center px-4 py-2 rounded-lg transition-colors ${
                isCheckingData || selectedItems.length === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
              }`}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isCheckingData ? 'animate-spin' : ''}`} />
              CHECK DATA
            </button>
          </div>
        </div>
        <div className="w-full max-w-md">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by item code, description, or vendor..."
          />
        </div>
      </div>

      {checkError && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{checkError}</p>
            </div>
          </div>
        </div>
      )}

      <ItemsTable
        items={filteredItems}
        selectedItems={selectedItems}
        onToggleItem={handleToggleItem}
      />
    </div>
  );
}