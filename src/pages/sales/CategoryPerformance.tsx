import React, { useState, useEffect } from 'react';
import { PieChart, ArrowUpDown, ChevronDown, ChevronRight } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { fetchSales } from '../../services/googleSheets';
import { formatCurrency } from '../../utils/format';
import { getCategoryLabel } from '../../utils/categoryMapping';
import { DateRangeFilter } from '../../components/DateRangeFilter';

type SortField = 'quantity' | 'revenue';
type SortDirection = 'asc' | 'desc';

interface CategoryData {
  code: string;
  label: string;
  totalQuantity: number;
  totalRevenue: number;
  customers: Map<string, {
    customerCode: string;
    searchName: string;
    quantity: number;
    revenue: number;
    products: Map<string, {
      itemCode: string;
      description: string;
      quantity: number;
      revenue: number;
    }>;
  }>;
}

export function CategoryPerformance() {
  const { sales, setSales } = useStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [expandedCustomers, setExpandedCustomers] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<SortField>('revenue');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const loadSales = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchSales();
        setSales(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to load sales data');
      } finally {
        setIsLoading(false);
      }
    };

    if (sales.length === 0) {
      loadSales();
    } else {
      setIsLoading(false);
    }
  }, [sales.length, setSales]);

  // Filter sales by date range
  const filteredSales = React.useMemo(() => {
    return sales.filter(sale => {
      const saleDate = new Date(sale.date);
      const isAfterStart = !startDate || saleDate >= new Date(startDate);
      const isBeforeEnd = !endDate || saleDate <= new Date(endDate);
      return isAfterStart && isBeforeEnd;
    });
  }, [sales, startDate, endDate]);

  const categories = React.useMemo(() => {
    const categoryMap = new Map<string, CategoryData>();

    filteredSales.forEach(sale => {
      const postingGroup = sale.postingGroup;
      if (!postingGroup) return;

      if (!categoryMap.has(postingGroup)) {
        categoryMap.set(postingGroup, {
          code: postingGroup,
          label: getCategoryLabel(postingGroup),
          totalQuantity: 0,
          totalRevenue: 0,
          customers: new Map()
        });
      }

      const category = categoryMap.get(postingGroup)!;
      const customerKey = sale.customerCode;

      if (!category.customers.has(customerKey)) {
        category.customers.set(customerKey, {
          customerCode: sale.customerCode,
          searchName: sale.searchName,
          quantity: 0,
          revenue: 0,
          products: new Map()
        });
      }

      const customer = category.customers.get(customerKey)!;

      sale.items.forEach(item => {
        category.totalQuantity += item.quantity;
        category.totalRevenue += item.quantity * item.price;
        customer.quantity += item.quantity;
        customer.revenue += item.quantity * item.price;

        if (!customer.products.has(item.itemCode)) {
          customer.products.set(item.itemCode, {
            itemCode: item.itemCode,
            description: item.description,
            quantity: 0,
            revenue: 0
          });
        }

        const product = customer.products.get(item.itemCode)!;
        product.quantity += item.quantity;
        product.revenue += item.quantity * item.price;
      });
    });

    return Array.from(categoryMap.values());
  }, [filteredSales]);

  const sortedCategories = React.useMemo(() => {
    return [...categories].sort((a, b) => {
      const multiplier = sortDirection === 'asc' ? 1 : -1;
      return (
        sortField === 'quantity'
          ? (a.totalQuantity - b.totalQuantity) * multiplier
          : (a.totalRevenue - b.totalRevenue) * multiplier
      );
    });
  }, [categories, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const toggleCategory = (categoryCode: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(categoryCode)) {
        next.delete(categoryCode);
      } else {
        next.add(categoryCode);
      }
      return next;
    });
  };

  const toggleCustomer = (customerCode: string) => {
    setExpandedCustomers(prev => {
      const next = new Set(prev);
      if (next.has(customerCode)) {
        next.delete(customerCode);
      } else {
        next.add(customerCode);
      }
      return next;
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <PieChart className="h-6 w-6 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">Category Performance</h1>
        </div>
        <DateRangeFilter
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-12 px-6 py-3"></th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th 
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('quantity')}
              >
                <div className="flex items-center justify-end space-x-2">
                  <span>Total Quantity</span>
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('revenue')}
              >
                <div className="flex items-center justify-end space-x-2">
                  <span>Total Revenue</span>
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedCategories.map((category) => (
              <React.Fragment key={category.code}>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleCategory(category.code)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {expandedCategories.has(category.code) ? (
                        <ChevronDown className="h-5 w-5" />
                      ) : (
                        <ChevronRight className="h-5 w-5" />
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {category.label}
                    </div>
                    <div className="text-sm text-gray-500">
                      {category.code}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap text-sm text-gray-900">
                    {category.totalQuantity.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(category.totalRevenue)}
                  </td>
                </tr>

                {expandedCategories.has(category.code) && (
                  <tr>
                    <td colSpan={4} className="px-6 py-0">
                      <div className="border-l-2 border-gray-200 ml-3">
                        <table className="min-w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="w-12 px-6 py-2"></th>
                              <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Customer
                              </th>
                              <th className="px-6 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Quantity
                              </th>
                              <th className="px-6 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Revenue
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {Array.from(category.customers.values())
                              .sort((a, b) => b.revenue - a.revenue)
                              .map((customer) => (
                                <React.Fragment key={customer.customerCode}>
                                  <tr className="hover:bg-gray-50">
                                    <td className="px-6 py-3">
                                      <button
                                        onClick={() => toggleCustomer(customer.customerCode)}
                                        className="text-gray-400 hover:text-gray-600 ml-4"
                                      >
                                        {expandedCustomers.has(customer.customerCode) ? (
                                          <ChevronDown className="h-4 w-4" />
                                        ) : (
                                          <ChevronRight className="h-4 w-4" />
                                        )}
                                      </button>
                                    </td>
                                    <td className="px-6 py-3">
                                      <div className="text-sm font-medium text-gray-900">
                                        {customer.searchName}
                                      </div>
                                      <div className="text-sm text-gray-500">
                                        {customer.customerCode}
                                      </div>
                                    </td>
                                    <td className="px-6 py-3 text-right whitespace-nowrap text-sm text-gray-900">
                                      {customer.quantity.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-3 text-right whitespace-nowrap text-sm text-gray-900">
                                      {formatCurrency(customer.revenue)}
                                    </td>
                                  </tr>

                                  {expandedCustomers.has(customer.customerCode) && (
                                    <tr>
                                      <td colSpan={4} className="px-6 py-0">
                                        <div className="border-l-2 border-gray-200 ml-12 mb-4">
                                          <table className="min-w-full">
                                            <thead className="bg-gray-50">
                                              <tr>
                                                <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                  Product Code
                                                </th>
                                                <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                  Description
                                                </th>
                                                <th className="px-6 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                  Quantity
                                                </th>
                                                <th className="px-6 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                  Revenue
                                                </th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {Array.from(customer.products.values())
                                                .sort((a, b) => b.revenue - a.revenue)
                                                .map((product) => (
                                                  <tr key={product.itemCode} className="hover:bg-gray-50">
                                                    <td className="px-6 py-2 text-sm text-gray-500">
                                                      {product.itemCode}
                                                    </td>
                                                    <td className="px-6 py-2 text-sm text-gray-900">
                                                      {product.description}
                                                    </td>
                                                    <td className="px-6 py-2 text-right whitespace-nowrap text-sm text-gray-900">
                                                      {product.quantity.toLocaleString()}
                                                    </td>
                                                    <td className="px-6 py-2 text-right whitespace-nowrap text-sm text-gray-900">
                                                      {formatCurrency(product.revenue)}
                                                    </td>
                                                  </tr>
                                                ))}
                                            </tbody>
                                          </table>
                                        </div>
                                      </td>
                                    </tr>
                                  )}
                                </React.Fragment>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}