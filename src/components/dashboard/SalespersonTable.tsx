import React, { useState } from 'react';
import { ArrowUpDown } from 'lucide-react';
import { formatCurrency } from '../../utils/format';
import { Sale } from '../../types';
import { SearchBar } from '../SearchBar';

interface SalespersonTableProps {
  sales: Sale[];
}

interface SalespersonStats {
  salesPersonCode: string;
  totalSales: number;
  totalInvoices: number;
  customerCount: number;
}

export function SalespersonTable({ sales }: SalespersonTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<keyof SalespersonStats>('totalSales');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Calculate statistics for each salesperson
  const salesStats = sales.reduce((acc, sale) => {
    const { salesPersonCode } = sale;
    
    if (!acc[salesPersonCode]) {
      acc[salesPersonCode] = {
        salesPersonCode,
        totalSales: 0,
        invoices: new Set<string>(),
        customerCount: new Set<string>(),
      };
    }

    acc[salesPersonCode].totalSales += sale.total;
    acc[salesPersonCode].invoices.add(sale.id); // Using DocId (sale.id) as unique invoice identifier
    acc[salesPersonCode].customerCount.add(sale.customerCode);

    return acc;
  }, {} as Record<string, {
    salesPersonCode: string;
    totalSales: number;
    invoices: Set<string>;
    customerCount: Set<string>;
  }>);

  // Convert to array and calculate final stats
  const salespersonData = Object.values(salesStats).map(({ invoices, customerCount, ...stats }) => ({
    ...stats,
    totalInvoices: invoices.size,
    customerCount: customerCount.size,
  }));

  // Filter by search query
  const filteredData = salespersonData.filter(person =>
    person.salesPersonCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    const multiplier = sortDirection === 'asc' ? 1 : -1;
    return (a[sortField] - b[sortField]) * multiplier;
  });

  const handleSort = (field: keyof SalespersonStats) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Sales by Salesperson</h2>
        <div className="w-64">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search salesperson..."
          />
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Salesperson
                </th>
                <th 
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('totalSales')}
                >
                  <div className="flex items-center justify-end space-x-2">
                    <span>Total Sales</span>
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('totalInvoices')}
                >
                  <div className="flex items-center justify-end space-x-2">
                    <span>Total Invoices</span>
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('customerCount')}
                >
                  <div className="flex items-center justify-end space-x-2">
                    <span>Unique Customers</span>
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedData.map((person) => (
                <tr key={person.salesPersonCode} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {person.salesPersonCode}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                    {formatCurrency(person.totalSales)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                    {person.totalInvoices.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                    {person.customerCount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}