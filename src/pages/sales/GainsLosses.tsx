import React, { useState, useMemo } from 'react';
import { Building2, ArrowUpDown, ChevronDown, ChevronRight, Users } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { formatCurrency } from '../../utils/format';
import { GainLossDetails } from '../../components/sales/GainLossDetails';
import { GainLossSummary } from '../../components/sales/GainLossSummary';
import { getPeriodLabel, getQuarterlyPeriods } from '../../utils/periodCalculations';
import { cn } from '../../utils/cn';

type SortField = 'customer' | 'revenue' | 'items';
type SortDirection = 'asc' | 'desc';
type FilterType = 'all' | 'gains' | 'losses';

const STATUS_COLORS = {
  gain: 'hover:bg-green-50 bg-green-25',
  loss: 'hover:bg-red-50 bg-red-25'
} as const;

export function GainsLosses() {
  const { sales } = useStore();
  const [expandedCustomers, setExpandedCustomers] = useState<Set<string>>(new Set());
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [sortField, setSortField] = useState<SortField>('revenue');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectedSalesperson, setSelectedSalesperson] = useState<string>('all');

  // Get unique salespersons
  const salespersons = useMemo(() => {
    const uniqueSalespeople = new Set(sales.map(sale => sale.salesPersonCode));
    return ['all', ...Array.from(uniqueSalespeople)].sort();
  }, [sales]);

  const periods = useMemo(() => getQuarterlyPeriods(sales), [sales]);

  const gainLossAnalysis = useMemo(() => {
    // Filter sales by salesperson if one is selected
    const filteredSales = selectedSalesperson === 'all'
      ? sales
      : sales.filter(sale => sale.salesPersonCode === selectedSalesperson);

    const analysis = new Map<string, {
      customerCode: string;
      searchName: string;
      companyName: string;
      period: string;
      revenueChange: number;
      itemChanges: Map<string, {
        itemCode: string;
        description: string;
        quantityChange: number;
        revenueChange: number;
      }>;
      type: 'gain' | 'loss';
    }[]>();

    // Calculate customer activity for each period using filtered sales
    periods.forEach((period, periodIndex) => {
      if (periodIndex === 0) return;

      const prevPeriod = periods[periodIndex - 1];
      const currentCustomers = new Set(
        filteredSales
          .filter(s => new Date(s.date) >= period.startDate && new Date(s.date) <= period.endDate)
          .map(s => s.customerCode)
      );
      const prevCustomers = new Set(
        filteredSales
          .filter(s => new Date(s.date) >= prevPeriod.startDate && new Date(s.date) <= prevPeriod.endDate)
          .map(s => s.customerCode)
      );

      // Find gains (new customers)
      currentCustomers.forEach(customerCode => {
        if (!prevCustomers.has(customerCode)) {
          const customerSales = filteredSales.filter(s => 
            s.customerCode === customerCode &&
            new Date(s.date) >= period.startDate &&
            new Date(s.date) <= period.endDate
          );
          if (customerSales.length === 0) return;

          const customer = customerSales[0];
          const itemChanges = new Map();
          let totalRevenue = 0;

          customerSales.forEach(sale => {
            sale.items.forEach(item => {
              const key = `${item.itemCode}-${item.description}`;
              if (!itemChanges.has(key)) {
                itemChanges.set(key, {
                  itemCode: item.itemCode,
                  description: item.description,
                  quantityChange: 0,
                  revenueChange: 0
                });
              }
              const change = itemChanges.get(key)!;
              change.quantityChange += item.quantity;
              change.revenueChange += item.quantity * item.price;
              totalRevenue += item.quantity * item.price;
            });
          });

          if (!analysis.has(period.key)) {
            analysis.set(period.key, []);
          }
          analysis.get(period.key)!.push({
            customerCode,
            searchName: customer.searchName,
            companyName: customer.companyName,
            period: period.key,
            revenueChange: totalRevenue,
            itemChanges,
            type: 'gain'
          });
        }
      });

      // Find losses (lost customers)
      prevCustomers.forEach(customerCode => {
        if (!currentCustomers.has(customerCode)) {
          const customerSales = filteredSales.filter(s => 
            s.customerCode === customerCode &&
            new Date(s.date) >= prevPeriod.startDate &&
            new Date(s.date) <= prevPeriod.endDate
          );
          if (customerSales.length === 0) return;

          const customer = customerSales[0];
          const itemChanges = new Map();
          let totalRevenue = 0;

          customerSales.forEach(sale => {
            sale.items.forEach(item => {
              const key = `${item.itemCode}-${item.description}`;
              if (!itemChanges.has(key)) {
                itemChanges.set(key, {
                  itemCode: item.itemCode,
                  description: item.description,
                  quantityChange: 0,
                  revenueChange: 0
                });
              }
              const change = itemChanges.get(key)!;
              change.quantityChange -= item.quantity;
              change.revenueChange -= item.quantity * item.price;
              totalRevenue -= item.quantity * item.price;
            });
          });

          if (!analysis.has(period.key)) {
            analysis.set(period.key, []);
          }
          analysis.get(period.key)!.push({
            customerCode,
            searchName: customer.searchName,
            companyName: customer.companyName,
            period: period.key,
            revenueChange: totalRevenue,
            itemChanges,
            type: 'loss'
          });
        }
      });
    });

    return analysis;
  }, [sales, periods, selectedSalesperson]);

  const filteredAnalysis = useMemo(() => {
    const periodData = selectedPeriod === 'all' 
      ? Array.from(gainLossAnalysis.values()).flat()
      : gainLossAnalysis.get(selectedPeriod) || [];

    return periodData.filter(item => 
      filterType === 'all' || 
      (filterType === 'gains' && item.type === 'gain') ||
      (filterType === 'losses' && item.type === 'loss')
    ).sort((a, b) => {
      const multiplier = sortDirection === 'asc' ? 1 : -1;
      switch (sortField) {
        case 'customer':
          return a.searchName.localeCompare(b.searchName) * multiplier;
        case 'revenue':
          return (Math.abs(b.revenueChange) - Math.abs(a.revenueChange)) * multiplier;
        case 'items':
          return (b.itemChanges.size - a.itemChanges.size) * multiplier;
        default:
          return 0;
      }
    });
  }, [gainLossAnalysis, selectedPeriod, filterType, sortField, sortDirection]);

  // Calculate summary totals
  const summaryTotals = useMemo(() => {
    const totals = filteredAnalysis.reduce((acc, item) => {
      if (item.type === 'gain') {
        acc.gains += item.revenueChange;
        acc.gainCount++;
      } else {
        acc.losses += item.revenueChange;
        acc.lossCount++;
      }
      return acc;
    }, { gains: 0, losses: 0, gainCount: 0, lossCount: 0 });

    return totals;
  }, [filteredAnalysis]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Building2 className="h-6 w-6 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">Gains & Losses Analysis</h1>
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
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="block w-48 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="all">All Periods</option>
            {Array.from(gainLossAnalysis.keys()).map(period => (
              <option key={period} value={period}>
                {getPeriodLabel(period)}
              </option>
            ))}
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as FilterType)}
            className="block w-36 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="all">All Changes</option>
            <option value="gains">Gains Only</option>
            <option value="losses">Losses Only</option>
          </select>
        </div>
      </div>

      <GainLossSummary {...summaryTotals} />

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-12 px-6 py-3"></th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('customer')}
              >
                <div className="flex items-center space-x-2">
                  <span>Customer</span>
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Period
              </th>
              <th 
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('revenue')}
              >
                <div className="flex items-center justify-end space-x-2">
                  <span>Revenue Change</span>
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('items')}
              >
                <div className="flex items-center justify-end space-x-2">
                  <span>Items Changed</span>
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAnalysis.map((analysis) => (
              <React.Fragment key={`${analysis.customerCode}-${analysis.period}`}>
                <tr className={cn(
                  "transition-colors",
                  STATUS_COLORS[analysis.type]
                )}>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleCustomer(analysis.customerCode)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {expandedCustomers.has(analysis.customerCode) ? (
                        <ChevronDown className="h-5 w-5" />
                      ) : (
                        <ChevronRight className="h-5 w-5" />
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-gray-900">
                      {analysis.searchName}
                    </div>
                    <div className="text-sm italic text-gray-500">
                      {analysis.companyName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getPeriodLabel(analysis.period)}
                  </td>
                  <td className={`px-6 py-4 text-right whitespace-nowrap text-sm ${
                    analysis.revenueChange > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatCurrency(Math.abs(analysis.revenueChange))}
                    {analysis.type === 'gain' ? ' gained' : ' lost'}
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap text-sm text-gray-900">
                    {analysis.itemChanges.size} items
                  </td>
                </tr>
                {expandedCustomers.has(analysis.customerCode) && (
                  <tr>
                    <td colSpan={5} className="px-6 py-0">
                      <GainLossDetails 
                        itemChanges={Array.from(analysis.itemChanges.values())}
                        type={analysis.type}
                      />
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