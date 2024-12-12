import React, { useEffect, useState } from 'react';
import { Users, Loader, RefreshCw, X } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useCustomerStore } from '../store/customerStore';
import { fetchCustomers, fetchSales } from '../services/googleSheets';
import { SearchBar } from '../components/SearchBar';
import { ErrorDisplay } from '../components/ErrorDisplay';
import { CustomerTable } from '../components/customers/CustomerTable';
import { CustomerSalesAnalysis } from './CustomerSalesAnalysis';

export function CustomerPerformance() {
  const { sales, setSales } = useStore();
  const { customers, isLoading, error, setCustomers, setLoading, setError } = useCustomerStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [isCheckingData, setIsCheckingData] = useState(false);
  const [checkError, setCheckError] = useState<string | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [selectedSalesperson, setSelectedSalesperson] = useState<string>('all');
  const [salesData, setSalesData] = useState<Record<string, Set<string>>>({});

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [customersData, salesData] = await Promise.all([
          fetchCustomers(),
          fetchSales()
        ]);
        
        if (mounted) {
          setCustomers(customersData);
          
          // Create a mapping of customers to their salespersons
          const customerSalesMap = salesData.reduce((acc, sale) => {
            if (!acc[sale.customerCode]) {
              acc[sale.customerCode] = new Set();
            }
            acc[sale.customerCode].add(sale.salesPersonCode);
            return acc;
          }, {} as Record<string, Set<string>>);
          
          setSalesData(customerSalesMap);
        }
      } catch (error) {
        if (mounted) {
          setError(error instanceof Error ? error.message : 'Failed to load data');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadData();
    return () => { mounted = false; };
  }, [setCustomers, setLoading, setError]);

  const handleCheckData = async () => {
    if (selectedCustomers.length === 0) {
      alert('Please select at least one customer to check');
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

  const handleToggleCustomer = (customerCode: string) => {
    if (customerCode === 'all') {
      const filteredCustomers = customers
        .filter(customer => {
          if (selectedSalesperson === 'all') return true;
          return salesData[customer.customerCode]?.has(selectedSalesperson);
        })
        .map(c => c.customerCode);
      setSelectedCustomers(filteredCustomers);
    } else if (customerCode === 'none') {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(prev => 
        prev.includes(customerCode)
          ? prev.filter(code => code !== customerCode)
          : [...prev, customerCode]
      );
    }
  };

  const handleClearSelection = () => {
    setSelectedCustomers([]);
  };

  // Get unique salespersons
  const salespersons = ['all', ...new Set(
    Object.values(salesData)
      .flatMap(salespeople => Array.from(salespeople))
  )].sort();

  const filteredCustomers = customers.filter(customer => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      customer.customerCode.toLowerCase().includes(searchLower) ||
      customer.companyName.toLowerCase().includes(searchLower) ||
      customer.searchName.toLowerCase().includes(searchLower);
    
    const matchesSalesperson = 
      selectedSalesperson === 'all' || 
      salesData[customer.customerCode]?.has(selectedSalesperson);

    return matchesSearch && matchesSalesperson;
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
    return <CustomerSalesAnalysis 
      sales={sales} 
      selectedCustomers={selectedCustomers} 
      onBack={() => setShowAnalysis(false)} 
    />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Users className="h-6 w-6 text-indigo-600" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900">Select Customers</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleClearSelection}
              disabled={selectedCustomers.length === 0}
              className={`inline-flex items-center px-4 py-2 rounded-lg transition-colors ${
                selectedCustomers.length === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-red-100 text-red-600 hover:bg-red-200'
              }`}
            >
              <X className="h-4 w-4 mr-2" />
              Clear Selection
            </button>
            <button
              onClick={handleCheckData}
              disabled={isCheckingData || selectedCustomers.length === 0}
              className={`inline-flex items-center px-4 py-2 rounded-lg transition-colors ${
                isCheckingData || selectedCustomers.length === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
              }`}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isCheckingData ? 'animate-spin' : ''}`} />
              CHECK DATA
            </button>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="w-full sm:w-96">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by customer code, company name, or search name..."
            />
          </div>
          <select
            value={selectedSalesperson}
            onChange={(e) => {
              setSelectedSalesperson(e.target.value);
              setSelectedCustomers([]); // Clear selection when changing salesperson
            }}
            className="block w-full sm:w-48 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            {salespersons.map(sp => (
              <option key={sp} value={sp}>
                {sp === 'all' ? 'All Salespersons' : sp}
              </option>
            ))}
          </select>
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

      <CustomerTable
        customers={filteredCustomers}
        selectedCustomers={selectedCustomers}
        onToggleCustomer={handleToggleCustomer}
      />
    </div>
  );
}