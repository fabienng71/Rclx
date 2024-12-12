import React, { useState, useMemo } from 'react';
import { DollarSign, TrendingUp, ShoppingCart } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { formatCurrency } from '../../utils/format';
import { DateRangeFilter } from '../../components/DateRangeFilter';
import { SalesPerformanceChart } from '../../components/dashboard/SalesPerformanceChart';
import { MonthlyPerformanceGrid } from '../../components/sales/MonthlyPerformanceGrid';

export function Dashboard() {
  const { sales } = useStore();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Filter sales by date range
  const filteredSales = useMemo(() => {
    return sales.filter(sale => {
      const saleDate = new Date(sale.date);
      const isAfterStart = !startDate || saleDate >= new Date(startDate);
      const isBeforeEnd = !endDate || saleDate <= new Date(endDate);
      return isAfterStart && isBeforeEnd;
    });
  }, [sales, startDate, endDate]);

  // Calculate metrics
  const metrics = useMemo(() => {
    // Get unique invoice count using id field
    const uniqueInvoices = new Set(filteredSales.map(sale => sale.id));
    const totalInvoices = uniqueInvoices.size;

    // Calculate total revenue
    const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.total, 0);

    // Calculate average basket size
    const averageBasketSize = totalInvoices > 0 ? totalRevenue / totalInvoices : 0;

    return {
      totalRevenue,
      totalInvoices,
      averageBasketSize
    };
  }, [filteredSales]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Dashboard</h2>
        <DateRangeFilter
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                <DollarSign className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Revenue
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {formatCurrency(metrics.totalRevenue)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-amber-100 rounded-md p-3">
                <TrendingUp className="h-6 w-6 text-amber-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Unique Invoices
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {metrics.totalInvoices.toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                <ShoppingCart className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Average Basket Size
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {formatCurrency(metrics.averageBasketSize)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Performance Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Monthly Performance</h3>
        <MonthlyPerformanceGrid />
      </div>

      {/* Sales Performance Chart */}
      <SalesPerformanceChart sales={filteredSales} />
    </div>
  );
}