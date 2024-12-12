import React, { useState, useMemo } from 'react';
import { ArrowLeft, Users } from 'lucide-react';
import { Sale } from '../types';
import { formatCurrency } from '../utils/format';
import { MonthlyPerformanceTable } from '../components/sales/MonthlyPerformanceTable';
import { CustomerDetailsTable } from '../components/sales/CustomerDetailsTable';
import { DateRangeFilter } from '../components/DateRangeFilter';
import { getDateRangeFromFilter } from '../utils/dateFilters';

interface CustomerSalesAnalysisProps {
  sales: Sale[];
  selectedCustomers: string[];
  onBack: () => void;
  groupBy?: 'itemCode' | 'custType' | 'postingGroup';
}

export function CustomerSalesAnalysis({ 
  sales, 
  selectedCustomers, 
  onBack,
  groupBy = 'itemCode'
}: CustomerSalesAnalysisProps) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [selectedRange, setSelectedRange] = useState('this-month');
  const [selectedSalesperson, setSelectedSalesperson] = useState<string>('all');

  // Get unique salespersons
  const salespersons = useMemo(() => 
    ['all', ...new Set(sales.map(sale => sale.salesPersonCode))].sort(),
    [sales]
  );

  // Filter sales by date range, salesperson, and selected customers
  const filteredSales = useMemo(() => {
    return sales.filter(sale => {
      const saleDate = new Date(sale.date);
      const { startDate, endDate } = getDateRangeFromFilter(selectedRange);
      const isInDateRange = saleDate >= startDate && saleDate <= endDate;
      const matchesSalesperson = selectedSalesperson === 'all' || sale.salesPersonCode === selectedSalesperson;
      const isSelectedCustomer = selectedCustomers.includes(sale.customerCode);
      return isInDateRange && matchesSalesperson && isSelectedCustomer;
    });
  }, [sales, selectedRange, selectedSalesperson, selectedCustomers]);

  // Get unique months from filtered sales
  const months = useMemo(() => {
    const uniqueMonths = new Set(
      filteredSales.map(sale => {
        const date = new Date(sale.date);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      })
    );
    return Array.from(uniqueMonths).sort();
  }, [filteredSales]);

  // Group sales by selected grouping field and month
  const salesByGroup = useMemo(() => {
    return filteredSales.reduce((acc, sale) => {
      // Get the grouping key based on groupBy parameter
      const groupKey = groupBy === 'itemCode' 
        ? sale.items.map(item => item.itemCode)
        : [groupBy === 'custType' ? sale.custType : sale.postingGroup];

      // Process each group key
      groupKey.forEach(key => {
        if (!key) return;

        if (!acc[key]) {
          acc[key] = {
            code: key,
            description: groupBy === 'itemCode' 
              ? sale.items.find(item => item.itemCode === key)?.description || key
              : key,
            months: {},
            customers: []
          };
        }

        // Get month key
        const date = new Date(sale.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

        // Initialize month data if needed
        if (!acc[key].months[monthKey]) {
          acc[key].months[monthKey] = { quantity: 0, revenue: 0 };
        }

        // Update quantities and revenue
        if (groupBy === 'itemCode') {
          const item = sale.items.find(item => item.itemCode === key);
          if (item) {
            acc[key].months[monthKey].quantity += item.quantity;
            acc[key].months[monthKey].revenue += item.quantity * item.price;
          }
        } else {
          acc[key].months[monthKey].quantity += sale.items.reduce((sum, item) => sum + item.quantity, 0);
          acc[key].months[monthKey].revenue += sale.total;
        }

        // Add customer details
        acc[key].customers.push({
          customerName: sale.companyName,
          date: sale.date,
          quantity: groupBy === 'itemCode'
            ? sale.items.find(item => item.itemCode === key)?.quantity || 0
            : sale.items.reduce((sum, item) => sum + item.quantity, 0),
          revenue: groupBy === 'itemCode'
            ? (sale.items.find(item => item.itemCode === key)?.quantity || 0) * 
              (sale.items.find(item => item.itemCode === key)?.price || 0)
            : sale.total,
          salesPersonCode: sale.salesPersonCode
        });
      });

      return acc;
    }, {} as Record<string, {
      code: string;
      description: string;
      months: Record<string, { quantity: number; revenue: number }>;
      customers: Array<{
        customerName: string;
        date: string;
        quantity: number;
        revenue: number;
        salesPersonCode: string;
      }>;
    }>);
  }, [filteredSales, groupBy]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">Customer Sales Analysis</h1>
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
            type="select"
            selectedRange={selectedRange}
            onRangeChange={setSelectedRange}
          />
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <MonthlyPerformanceTable
          salesData={salesByGroup}
          months={months}
          expandedItem={expandedItem}
          onToggleExpand={setExpandedItem}
        />
      </div>

      {expandedItem && salesByGroup[expandedItem] && (
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Customer Details for {salesByGroup[expandedItem].description}
          </h2>
          <CustomerDetailsTable 
            customers={salesByGroup[expandedItem].customers}
            selectedSalesperson={selectedSalesperson}
          />
        </div>
      )}
    </div>
  );
}