import React, { useState } from 'react';
import { ArrowLeft, Users } from 'lucide-react';
import { Sale } from '../types';
import { formatCurrency } from '../utils/format';
import { MonthlyPerformanceTable } from '../components/sales/MonthlyPerformanceTable';
import { CustomerDetailsTable } from '../components/sales/CustomerDetailsTable';
import { DateRangeFilter } from '../components/DateRangeFilter';

interface SalesAnalysisProps {
  sales: Sale[];
  selectedItems: string[];
  onBack: () => void;
  groupBy?: 'itemCode' | 'custType' | 'postingGroup';
}

export function SalesAnalysis({ 
  sales, 
  selectedItems, 
  onBack,
  groupBy = 'itemCode'
}: SalesAnalysisProps) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedSalesperson, setSelectedSalesperson] = useState<string>('all');

  // Get unique salespersons
  const salespersons = ['all', ...new Set(sales.map(sale => sale.salesPersonCode))].sort();

  // Filter sales by date range and salesperson
  const filteredSales = sales.filter(sale => {
    const saleDate = new Date(sale.date);
    const isAfterStart = !startDate || saleDate >= new Date(startDate);
    const isBeforeEnd = !endDate || saleDate <= new Date(endDate);
    const matchesSalesperson = selectedSalesperson === 'all' || sale.salesPersonCode === selectedSalesperson;
    return isAfterStart && isBeforeEnd && matchesSalesperson;
  });

  // Group sales by selected grouping field and month
  const salesByGroup = filteredSales.reduce((acc, sale) => {
    // For each item in the sale that matches our selected items
    sale.items.forEach(saleItem => {
      const groupValue = groupBy === 'itemCode' 
        ? saleItem.itemCode 
        : groupBy === 'custType'
        ? sale.custType
        : sale.postingGroup;

      if (!selectedItems.includes(groupValue)) return;

      const date = new Date(sale.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!acc[groupValue]) {
        acc[groupValue] = {
          code: groupValue,
          description: groupBy === 'itemCode' 
            ? saleItem.description 
            : groupValue,
          months: {},
          customers: []
        };
      }

      // Aggregate monthly data
      if (!acc[groupValue].months[monthKey]) {
        acc[groupValue].months[monthKey] = {
          quantity: 0,
          revenue: 0
        };
      }

      const monthlyData = acc[groupValue].months[monthKey];
      if (groupBy === 'itemCode') {
        monthlyData.quantity += saleItem.quantity;
        monthlyData.revenue += saleItem.quantity * saleItem.price;
      } else {
        monthlyData.quantity += sale.items.reduce((sum, item) => sum + item.quantity, 0);
        monthlyData.revenue += sale.total;
      }

      // Store customer details
      acc[groupValue].customers.push({
        customerName: sale.companyName,
        date: sale.date,
        quantity: groupBy === 'itemCode' 
          ? saleItem.quantity
          : sale.items.reduce((sum, item) => sum + item.quantity, 0),
        revenue: groupBy === 'itemCode'
          ? saleItem.quantity * saleItem.price
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

  // Get unique months from filtered sales, sorted chronologically
  const allMonths = Array.from(new Set(
    filteredSales.map(sale => {
      const date = new Date(sale.date);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    })
  )).sort();

  const title = groupBy === 'itemCode' 
    ? 'Item Sales Analysis'
    : groupBy === 'custType'
    ? 'Channel Sales Analysis'
    : 'Category Sales Analysis';

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
          <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
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

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <MonthlyPerformanceTable
            salesData={salesByGroup}
            months={allMonths}
            expandedItem={expandedItem}
            onToggleExpand={setExpandedItem}
          />
        </div>
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