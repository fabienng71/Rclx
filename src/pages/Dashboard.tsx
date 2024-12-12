import React, { useEffect, useMemo, useState } from 'react';
import { DollarSign, TrendingUp, ShoppingCart, FileText, BarChart2, Users } from 'lucide-react';
import { useStore } from '../store/useStore';
import { formatCurrency, formatNumber } from '../utils/format';
import { DateRangeFilter } from '../components/DateRangeFilter';
import { SalesWidget } from '../components/dashboard/SalesWidget';
import { SalespersonFilter } from '../components/dashboard/SalespersonFilter';
import { calculateBaseline } from '../utils/baseline';
import { fetchSales } from '../services/googleSheets';
import { ErrorDisplay } from '../components/ErrorDisplay';
import { SalesPerformanceChart } from '../components/dashboard/SalesPerformanceChart';

export function Dashboard() {
  const { sales, setSales } = useStore();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedSalesperson, setSelectedSalesperson] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    }
  }, [sales.length, setSales]);

  // Get unique salespeople
  const salespeople = useMemo(() => {
    return Array.from(new Set(sales.map(sale => sale.salesPersonCode))).sort();
  }, [sales]);

  // Filter sales by date range and salesperson
  const filteredSales = useMemo(() => {
    return sales.filter(sale => {
      const saleDate = new Date(sale.date);
      const isAfterStart = !startDate || saleDate >= new Date(startDate);
      const isBeforeEnd = !endDate || saleDate <= new Date(endDate);
      const matchesSalesperson = selectedSalesperson === 'all' || sale.salesPersonCode === selectedSalesperson;
      return isAfterStart && isBeforeEnd && matchesSalesperson;
    });
  }, [sales, startDate, endDate, selectedSalesperson]);

  // Calculate metrics
  const metrics = useMemo(() => {
    // Get unique counts
    const uniqueInvoices = new Set(filteredSales.map(sale => sale.id));
    const uniqueCustomers = new Set(filteredSales.map(sale => sale.customerCode));
    const uniqueProducts = new Set(
      filteredSales.flatMap(sale => sale.items.map(item => item.itemCode))
    );

    // Calculate totals
    const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
    const totalQuantity = filteredSales.reduce(
      (sum, sale) => sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
      0
    );

    // Calculate averages
    const averageBasketSize = uniqueInvoices.size > 0 
      ? Math.round(totalRevenue / uniqueInvoices.size)
      : 0;

    return {
      totalRevenue: Math.round(totalRevenue),
      totalQuantity: Math.round(totalQuantity),
      uniqueInvoices: uniqueInvoices.size,
      uniqueCustomers: uniqueCustomers.size,
      uniqueProducts: uniqueProducts.size,
      averageBasketSize
    };
  }, [filteredSales]);

  const baseline = useMemo(() => 
    Math.round(calculateBaseline(sales, selectedSalesperson)), 
    [sales, selectedSalesperson]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return <ErrorDisplay message={error} />;
  }

  if (sales.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No sales data available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <h2 className="text-xl font-semibold text-gray-900">Dashboard</h2>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <SalespersonFilter
            selectedSalesperson={selectedSalesperson}
            onSelectionChange={setSelectedSalesperson}
            salespeople={salespeople}
          />
          <DateRangeFilter
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SalesWidget 
          title="Total Revenue"
          amount={metrics.totalRevenue}
          icon={<DollarSign className="h-6 w-6" />}
          variant="success"
        />

        <SalesWidget 
          title="Total Invoices"
          amount={metrics.uniqueInvoices}
          subtitle={`${formatNumber(metrics.totalQuantity)} items sold`}
          icon={<FileText className="h-6 w-6" />}
          variant="info"
        />

        <SalesWidget 
          title="Average Basket"
          amount={metrics.averageBasketSize}
          icon={<ShoppingCart className="h-6 w-6" />}
          variant="warning"
        />

        <SalesWidget 
          title="Monthly Baseline"
          amount={baseline}
          icon={<BarChart2 className="h-6 w-6" />}
          variant="default"
        />

        <SalesWidget 
          title="Active Customers"
          amount={metrics.uniqueCustomers}
          icon={<Users className="h-6 w-6" />}
          variant="info"
        />

        <SalesWidget 
          title="Active Products"
          amount={metrics.uniqueProducts}
          icon={<TrendingUp className="h-6 w-6" />}
          variant="warning"
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Performance Trends</h3>
        <div className="bg-white rounded-lg shadow-sm">
          <SalesPerformanceChart sales={filteredSales} />
        </div>
      </div>
    </div>
  );
}