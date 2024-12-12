import React, { useState, useEffect } from 'react';
import { BarChart3, ArrowUpDown, ChevronDown, ChevronRight, Users } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { fetchSales } from '../../services/googleSheets';
import { formatCurrency } from '../../utils/format';
import { getChannelLabel, getChannelColors } from '../../utils/channelMapping';
import { DateRangeFilter } from '../../components/DateRangeFilter';
import { cn } from '../../utils/cn';

type SortField = 'quantity' | 'revenue';
type SortDirection = 'asc' | 'desc';

interface ChannelData {
  code: string;
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
      monthlyData: Record<string, { quantity: number; revenue: number }>;
    }>;
  }>;
  monthlyData: Record<string, { quantity: number; revenue: number }>;
}

function formatMonthHeader(monthKey: string): string {
  const [year, month] = monthKey.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleString('en-US', { month: 'short' }).toUpperCase() + 
         year.slice(2);
}

export function ChannelPerformance() {
  const { sales, setSales } = useStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedChannels, setExpandedChannels] = useState<Set<string>>(new Set());
  const [expandedCustomers, setExpandedCustomers] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<SortField>('revenue');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedSalesperson, setSelectedSalesperson] = useState<string>('all');

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

  // Get unique salespersons
  const salespersons = React.useMemo(() => {
    return ['all', ...new Set(sales.map(sale => sale.salesPersonCode))].sort();
  }, [sales]);

  // Filter sales by date range and salesperson
  const filteredSales = React.useMemo(() => {
    return sales.filter(sale => {
      const saleDate = new Date(sale.date);
      const isAfterStart = !startDate || saleDate >= new Date(startDate);
      const isBeforeEnd = !endDate || saleDate <= new Date(endDate);
      const matchesSalesperson = selectedSalesperson === 'all' || sale.salesPersonCode === selectedSalesperson;
      return isAfterStart && isBeforeEnd && matchesSalesperson;
    });
  }, [sales, startDate, endDate, selectedSalesperson]);

  // Get unique months from filtered sales, sorted chronologically
  const months = React.useMemo(() => {
    return Array.from(new Set(
      filteredSales.map(sale => {
        const date = new Date(sale.date);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      })
    )).sort();
  }, [filteredSales]);

  const channels = React.useMemo(() => {
    const channelMap = new Map<string, ChannelData>();

    filteredSales.forEach(sale => {
      const channelCode = sale.custType;
      if (!channelCode) return;

      if (!channelMap.has(channelCode)) {
        channelMap.set(channelCode, {
          code: channelCode,
          totalQuantity: 0,
          totalRevenue: 0,
          customers: new Map(),
          monthlyData: {}
        });
      }

      const channelData = channelMap.get(channelCode)!;
      const customerKey = sale.customerCode;
      const date = new Date(sale.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      // Update monthly data for channel
      if (!channelData.monthlyData[monthKey]) {
        channelData.monthlyData[monthKey] = { quantity: 0, revenue: 0 };
      }
      const monthlyChannelData = channelData.monthlyData[monthKey];

      if (!channelData.customers.has(customerKey)) {
        channelData.customers.set(customerKey, {
          customerCode: sale.customerCode,
          searchName: sale.searchName,
          quantity: 0,
          revenue: 0,
          products: new Map()
        });
      }

      const customer = channelData.customers.get(customerKey)!;

      sale.items.forEach(item => {
        channelData.totalQuantity += item.quantity;
        channelData.totalRevenue += item.quantity * item.price;
        customer.quantity += item.quantity;
        customer.revenue += item.quantity * item.price;
        monthlyChannelData.quantity += item.quantity;
        monthlyChannelData.revenue += item.quantity * item.price;

        if (!customer.products.has(item.itemCode)) {
          customer.products.set(item.itemCode, {
            itemCode: item.itemCode,
            description: item.description,
            quantity: 0,
            revenue: 0,
            monthlyData: {}
          });
        }

        const product = customer.products.get(item.itemCode)!;
        product.quantity += item.quantity;
        product.revenue += item.quantity * item.price;

        // Update monthly data for product
        if (!product.monthlyData[monthKey]) {
          product.monthlyData[monthKey] = { quantity: 0, revenue: 0 };
        }
        const monthlyProductData = product.monthlyData[monthKey];
        monthlyProductData.quantity += item.quantity;
        monthlyProductData.revenue += item.quantity * item.price;
      });
    });

    return Array.from(channelMap.values());
  }, [filteredSales]);

  const sortedChannels = React.useMemo(() => {
    return [...channels].sort((a, b) => {
      const multiplier = sortDirection === 'asc' ? 1 : -1;
      return (
        sortField === 'quantity'
          ? (a.totalQuantity - b.totalQuantity) * multiplier
          : (a.totalRevenue - b.totalRevenue) * multiplier
      );
    });
  }, [channels, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const toggleChannel = (channelCode: string) => {
    setExpandedChannels(prev => {
      const next = new Set(prev);
      if (next.has(channelCode)) {
        next.delete(channelCode);
      } else {
        next.add(channelCode);
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
            <BarChart3 className="h-6 w-6 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">Channel Performance</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-gray-400" />
            <select
              value={selectedSalesperson}
              onChange={(e) => setSelectedSalesperson(e.target.value)}
              className="block w-48 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="all">All Salespersons</option>
              {salespersons.filter(sp => sp !== 'all').map(sp => (
                <option key={sp} value={sp}>{sp}</option>
              ))}
            </select>
          </div>
          <DateRangeFilter
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
          />
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-12 px-6 py-3"></th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Channel
                </th>
                {months.map(month => (
                  <React.Fragment key={month}>
                    <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {formatMonthHeader(month)} Qty
                    </th>
                    <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {formatMonthHeader(month)} Rev
                    </th>
                  </React.Fragment>
                ))}
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Qty
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Rev
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedChannels.map((channel) => {
                const colors = getChannelColors(channel.code);
                return (
                  <React.Fragment key={channel.code}>
                    <tr className={cn("transition-colors", colors.bg)}>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleChannel(channel.code)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          {expandedChannels.has(channel.code) ? (
                            <ChevronDown className="h-5 w-5" />
                          ) : (
                            <ChevronRight className="h-5 w-5" />
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className={cn("text-sm font-medium", colors.text)}>
                          {getChannelLabel(channel.code)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {channel.code}
                        </div>
                      </td>
                      {months.map(month => (
                        <React.Fragment key={month}>
                          <td className="px-3 py-4 text-right whitespace-nowrap text-sm text-gray-900">
                            {channel.monthlyData[month]?.quantity.toLocaleString() || '-'}
                          </td>
                          <td className="px-3 py-4 text-right whitespace-nowrap text-sm text-gray-900">
                            {channel.monthlyData[month]
                              ? formatCurrency(channel.monthlyData[month].revenue)
                              : '-'}
                          </td>
                        </React.Fragment>
                      ))}
                      <td className="px-6 py-4 text-right whitespace-nowrap text-sm text-gray-900">
                        {channel.totalQuantity.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(channel.totalRevenue)}
                      </td>
                    </tr>

                    {expandedChannels.has(channel.code) && (
                      Array.from(channel.customers.values())
                        .sort((a, b) => b.revenue - a.revenue)
                        .map((customer) => (
                          <React.Fragment key={customer.customerCode}>
                            <tr className="bg-gray-50/50">
                              <td className="px-6 py-2">
                                <button
                                  onClick={() => toggleCustomer(customer.customerCode)}
                                  className="text-gray-400 hover:text-gray-600 ml-4"
                                >
                                  {expandedCustomers.has(customer.customerCode) ? (
                                    <ChevronDown className="h-3 w-3" />
                                  ) : (
                                    <ChevronRight className="h-3 w-3" />
                                  )}
                                </button>
                              </td>
                              <td className="px-6 py-2">
                                <div className="text-xs font-medium text-gray-900">
                                  {customer.searchName}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {customer.customerCode}
                                </div>
                              </td>
                              {months.map(month => {
                                const monthlyTotal = Array.from(customer.products.values()).reduce(
                                  (sum, product) => {
                                    const monthData = product.monthlyData[month];
                                    return {
                                      quantity: sum.quantity + (monthData?.quantity || 0),
                                      revenue: sum.revenue + (monthData?.revenue || 0)
                                    };
                                  },
                                  { quantity: 0, revenue: 0 }
                                );
                                return (
                                  <React.Fragment key={month}>
                                    <td className="px-3 py-2 text-right whitespace-nowrap text-xs text-gray-900">
                                      {monthlyTotal.quantity > 0 ? monthlyTotal.quantity.toLocaleString() : '-'}
                                    </td>
                                    <td className="px-3 py-2 text-right whitespace-nowrap text-xs text-gray-900">
                                      {monthlyTotal.revenue > 0 ? formatCurrency(monthlyTotal.revenue) : '-'}
                                    </td>
                                  </React.Fragment>
                                );
                              })}
                              <td className="px-6 py-2 text-right whitespace-nowrap text-xs text-gray-900">
                                {customer.quantity.toLocaleString()}
                              </td>
                              <td className="px-6 py-2 text-right whitespace-nowrap text-xs text-gray-900">
                                {formatCurrency(customer.revenue)}
                              </td>
                            </tr>

                            {expandedCustomers.has(customer.customerCode) && (
                              <tr>
                                <td colSpan={months.length * 2 + 4} className="px-6 py-0">
                                  <div className="border-l-2 border-gray-200 ml-12 mb-2">
                                    <div className="overflow-x-auto">
                                      <table className="min-w-full">
                                        <thead>
                                          <tr className="bg-gray-50/75">
                                            <th className="sticky left-0 bg-gray-50/75 px-6 py-0.5 text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider">
                                              Description
                                            </th>
                                            {months.map(month => (
                                              <React.Fragment key={month}>
                                                <th className="px-2 py-0.5 text-right text-[11px] font-medium text-gray-500 uppercase tracking-wider">
                                                  {formatMonthHeader(month)} Qty
                                                </th>
                                                <th className="px-2 py-0.5 text-right text-[11px] font-medium text-gray-500 uppercase tracking-wider">
                                                  {formatMonthHeader(month)} Rev
                                                </th>
                                              </React.Fragment>
                                            ))}
                                            <th className="px-4 py-0.5 text-right text-[11px] font-medium text-gray-500 uppercase tracking-wider">
                                              Total Qty
                                            </th>
                                            <th className="px-4 py-0.5 text-right text-[11px] font-medium text-gray-500 uppercase tracking-wider">
                                              Total Rev
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {Array.from(customer.products.values())
                                            .sort((a, b) => b.revenue - a.revenue)
                                            .map((product) => (
                                              <tr key={product.itemCode} className="hover:bg-gray-50">
                                                <td className="sticky left-0 bg-white px-6 py-0.5 text-[11px] text-gray-900">
                                                  {product.description}
                                                </td>
                                                {months.map(month => (
                                                  <React.Fragment key={month}>
                                                    <td className="px-2 py-0.5 text-right whitespace-nowrap text-[11px] text-gray-900">
                                                      {product.monthlyData[month]?.quantity.toLocaleString() || '-'}
                                                    </td>
                                                    <td className="px-2 py-0.5 text-right whitespace-nowrap text-[11px] text-gray-900">
                                                      {product.monthlyData[month]
                                                        ? formatCurrency(product.monthlyData[month].revenue)
                                                        : '-'}
                                                    </td>
                                                  </React.Fragment>
                                                ))}
                                                <td className="px-4 py-0.5 text-right whitespace-nowrap text-[11px] text-gray-900">
                                                  {product.quantity.toLocaleString()}
                                                </td>
                                                <td className="px-4 py-0.5 text-right whitespace-nowrap text-[11px] text-gray-900">
                                                  {formatCurrency(product.revenue)}
                                                </td>
                                              </tr>
                                            ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        ))
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}