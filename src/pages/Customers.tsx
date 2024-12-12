import React, { useEffect, useState, useMemo } from 'react';
import { Loader, Users, TrendingUp, TrendingDown } from 'lucide-react';
import { useCustomerStore } from '../store/customerStore';
import { useStore } from '../store/useStore';
import { fetchCustomers, fetchSales } from '../services/googleSheets';
import { ErrorDisplay } from '../components/ErrorDisplay';
import { SearchBar } from '../components/SearchBar';
import { cn } from '../utils/cn';

type CustomerStatus = 'gain' | 'loss' | 'neutral';

interface CustomerWithStatus {
  customerCode: string;
  companyName: string;
  searchName: string;
  status: CustomerStatus;
  revenueChange: number;
}

export function Customers() {
  const {
    customers,
    isLoading,
    error,
    setCustomers,
    setLoading,
    setError,
  } = useCustomerStore();

  const { sales, setSales } = useStore();
  const [searchQuery, setSearchQuery] = useState('');

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
          setSales(salesData);
        }
      } catch (error) {
        if (mounted) {
          setError(
            error instanceof Error
              ? error.message
              : 'Failed to load data. Please try again.'
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, [setCustomers, setSales, setError, setLoading]);

  // Calculate customer status based on sales data
  const customersWithStatus = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Get current and previous period sales
    const currentPeriodSales = sales.filter(sale => {
      const saleDate = new Date(sale.date);
      return saleDate.getMonth() === currentMonth && 
             saleDate.getFullYear() === currentYear;
    });

    const previousPeriodSales = sales.filter(sale => {
      const saleDate = new Date(sale.date);
      return saleDate.getMonth() === (currentMonth - 1 + 12) % 12 && 
             saleDate.getFullYear() === (currentMonth === 0 ? currentYear - 1 : currentYear);
    });

    // Calculate revenue by customer for both periods
    const calculateRevenue = (sales: typeof currentPeriodSales) => {
      return sales.reduce((acc, sale) => {
        acc[sale.customerCode] = (acc[sale.customerCode] || 0) + sale.total;
        return acc;
      }, {} as Record<string, number>);
    };

    const currentRevenue = calculateRevenue(currentPeriodSales);
    const previousRevenue = calculateRevenue(previousPeriodSales);

    // Determine status for each customer
    return customers.map(customer => {
      const current = currentRevenue[customer.customerCode] || 0;
      const previous = previousRevenue[customer.customerCode] || 0;
      const revenueChange = current - previous;

      let status: CustomerStatus = 'neutral';
      if (current > 0 && previous === 0) {
        status = 'gain';
      } else if (current === 0 && previous > 0) {
        status = 'loss';
      } else if (revenueChange > 0) {
        status = 'gain';
      } else if (revenueChange < 0) {
        status = 'loss';
      }

      return {
        ...customer,
        status,
        revenueChange
      };
    });
  }, [customers, sales]);

  const filteredCustomers = customersWithStatus.filter(customer => {
    const searchLower = searchQuery.toLowerCase();
    return (
      customer.customerCode.toLowerCase().includes(searchLower) ||
      customer.companyName.toLowerCase().includes(searchLower) ||
      customer.searchName.toLowerCase().includes(searchLower)
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
    return (
      <ErrorDisplay 
        message={error}
        onRetry={() => {
          setError(null);
          setLoading(true);
          window.location.reload();
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Users className="h-6 w-6 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">Customers</h1>
        </div>
        <div className="text-sm text-gray-500">
          Total Customers: {filteredCustomers.length}
        </div>
      </div>

      <div className="w-full max-w-md">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by customer code, company name, or search name..."
        />
      </div>

      {filteredCustomers.length === 0 ? (
        <div className="text-center py-12">
          {searchQuery ? (
            <p className="text-gray-500">No customers found matching your search.</p>
          ) : (
            <p className="text-gray-500">No customers available.</p>
          )}
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Search Name
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr 
                  key={customer.customerCode} 
                  className={cn(
                    "transition-colors",
                    customer.status === 'gain' && "hover:bg-green-50 bg-green-25",
                    customer.status === 'loss' && "hover:bg-red-50 bg-red-25",
                    customer.status === 'neutral' && "hover:bg-gray-50"
                  )}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {customer.customerCode}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {customer.companyName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {customer.searchName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                    {customer.status !== 'neutral' && (
                      <div className="flex items-center justify-end space-x-2">
                        <span className={cn(
                          "text-sm font-medium",
                          customer.status === 'gain' && "text-green-600",
                          customer.status === 'loss' && "text-red-600"
                        )}>
                          {customer.status === 'gain' ? (
                            <TrendingUp className="h-5 w-5" />
                          ) : (
                            <TrendingDown className="h-5 w-5" />
                          )}
                        </span>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}