import React, { useState } from 'react';
import type { Sale } from '../../types';
import { MonthlySalesCard } from './MonthlySalesCard';
import { SalespersonFilter } from './SalespersonFilter';

interface MonthlySalesGridProps {
  sales: Sale[];
}

export function MonthlySalesGrid({ sales }: MonthlySalesGridProps) {
  const [expandedMonth, setExpandedMonth] = useState<string | null>(null);
  const [selectedSalesperson, setSelectedSalesperson] = useState('all');

  // Get unique salespeople
  const salespeople = Array.from(new Set(sales.map(sale => sale.salesPersonCode))).sort();

  // Filter sales by selected salesperson
  const filteredSales = selectedSalesperson === 'all'
    ? sales
    : sales.filter(sale => sale.salesPersonCode === selectedSalesperson);

  // Get last 12 months
  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    return {
      key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
      label: date.toLocaleString('default', { month: 'long', year: 'numeric' })
    };
  });

  // Group sales by month
  const salesByMonth = months.reduce((acc, { key, label }) => {
    const [year, month] = key.split('-');
    const monthSales = filteredSales.filter(sale => {
      const saleDate = new Date(sale.date);
      return (
        saleDate.getFullYear() === parseInt(year) &&
        saleDate.getMonth() + 1 === parseInt(month)
      );
    });

    acc[key] = {
      label,
      sales: monthSales
    };

    return acc;
  }, {} as Record<string, { label: string; sales: Sale[] }>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Monthly Sales Overview</h2>
        <SalespersonFilter
          selectedSalesperson={selectedSalesperson}
          onSelectionChange={setSelectedSalesperson}
          salespeople={salespeople}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {months.map(({ key, label }) => (
          <MonthlySalesCard
            key={key}
            monthKey={key}
            label={label}
            sales={salesByMonth[key].sales}
            isExpanded={expandedMonth === key}
            onToggle={() => setExpandedMonth(expandedMonth === key ? null : key)}
          />
        ))}
      </div>
    </div>
  );
}