import React from 'react';
import { DollarSign } from 'lucide-react';
import { formatCurrency } from '../../utils/format';
import { cn } from '../../utils/cn';

interface MonthlySalesWidgetProps {
  month: string;
  revenue: number;
  baseline: number;
  count: number;
}

export function MonthlySalesWidget({ month, revenue, baseline, count }: MonthlySalesWidgetProps) {
  const isAbove = revenue > baseline;
  const difference = Math.abs(revenue - baseline);
  
  return (
    <div className={cn(
      "bg-white overflow-hidden shadow rounded-lg transition-colors",
      isAbove ? "bg-green-50" : "bg-red-50"
    )}>
      <div className="p-5">
        <div className="flex items-center">
          <div className={cn(
            "flex-shrink-0 rounded-md p-3",
            isAbove ? "bg-green-100" : "bg-red-100"
          )}>
            <DollarSign className={cn(
              "h-6 w-6",
              isAbove ? "text-green-600" : "text-red-600"
            )} />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {month}
              </dt>
              <dd className={cn(
                "text-lg font-semibold",
                isAbove ? "text-green-900" : "text-red-900"
              )}>
                {formatCurrency(revenue)}
              </dd>
              <dd className="text-xs text-gray-500">
                {count} sales
              </dd>
              <dd className="text-xs text-gray-500">
                {isAbove ? 'Above' : 'Below'} baseline by {' '}
                {formatCurrency(difference)}
              </dd>
              <dd className="text-xs text-gray-400 mt-1">
                Baseline: {formatCurrency(baseline)}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}