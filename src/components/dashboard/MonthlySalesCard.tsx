import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { formatCurrency } from '../../utils/format';
import { MonthlyCustomerDetails } from './MonthlyCustomerDetails';
import type { Sale } from '../../types';

interface MonthlySalesCardProps {
  monthKey: string;
  label: string;
  sales: Sale[];
  isExpanded: boolean;
  onToggle: () => void;
}

export function MonthlySalesCard({
  monthKey,
  label,
  sales,
  isExpanded,
  onToggle,
}: MonthlySalesCardProps) {
  const total = sales.reduce((sum, sale) => sum + sale.total, 0);

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div 
        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-900">{label}</h3>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          )}
        </div>
        <p className="mt-2 text-2xl font-semibold text-indigo-600">
          {formatCurrency(total)}
        </p>
        <p className="mt-1 text-sm text-gray-500">
          {sales.length} sales
        </p>
      </div>

      {isExpanded && sales.length > 0 && (
        <div className="border-t border-gray-200">
          <MonthlyCustomerDetails sales={sales} />
        </div>
      )}
    </div>
  );
}