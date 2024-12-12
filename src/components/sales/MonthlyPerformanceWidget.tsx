import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency } from '../../utils/format';
import { cn } from '../../utils/cn';

interface MonthlyPerformanceWidgetProps {
  month: string;
  budget: number;
  actual: number;
  lastYearActual: number;
}

export function MonthlyPerformanceWidget({
  month,
  budget,
  actual,
  lastYearActual
}: MonthlyPerformanceWidgetProps) {
  // Calculate variances
  const budgetVariance = actual - budget;
  const budgetVariancePercent = budget > 0 ? (budgetVariance / budget) * 100 : 0;
  
  const lyVariance = actual - lastYearActual;
  const lyVariancePercent = lastYearActual > 0 ? (lyVariance / lastYearActual) * 100 : 0;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="space-y-4">
        {/* Month Header */}
        <div className="border-b pb-2">
          <h3 className="text-lg font-semibold text-gray-900">{month}</h3>
        </div>

        {/* Budget vs Actual */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-500">Budget</span>
            <span className="text-sm font-medium">{formatCurrency(budget)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-500">Actual</span>
            <span className="text-sm font-medium">{formatCurrency(actual)}</span>
          </div>
          <div className={cn(
            "flex justify-between items-center px-2 py-1 rounded",
            budgetVariance >= 0 ? "bg-green-50" : "bg-red-50"
          )}>
            <span className="text-xs font-medium text-gray-500">Variance</span>
            <div className="flex items-center space-x-1">
              {budgetVariance >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
              <span className={cn(
                "text-xs font-medium",
                budgetVariance >= 0 ? "text-green-600" : "text-red-600"
              )}>
                {formatCurrency(Math.abs(budgetVariance))} ({Math.abs(budgetVariancePercent).toFixed(1)}%)
              </span>
            </div>
          </div>
        </div>

        {/* LY Actual Comparison */}
        <div className="space-y-2 pt-2 border-t">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-500">LY Actual</span>
            <span className="text-sm font-medium">{formatCurrency(lastYearActual)}</span>
          </div>
          <div className={cn(
            "flex justify-between items-center px-2 py-1 rounded",
            lyVariance >= 0 ? "bg-green-50" : "bg-red-50"
          )}>
            <span className="text-xs font-medium text-gray-500">vs LY</span>
            <div className="flex items-center space-x-1">
              {lyVariance >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
              <span className={cn(
                "text-xs font-medium",
                lyVariance >= 0 ? "text-green-600" : "text-red-600"
              )}>
                {formatCurrency(Math.abs(lyVariance))} ({Math.abs(lyVariancePercent).toFixed(1)}%)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}