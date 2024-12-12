import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Target, History, Calendar } from 'lucide-react';
import { formatCurrency } from '../../utils/format';
import { cn } from '../../utils/cn';

interface YTDAnalysisWidgetProps {
  ytdBudget: number;
  ytdActual: number;
  ytdLastYear: number;
  dateRange: {
    startDate: Date;
    endDate: Date;
  };
}

export function YTDAnalysisWidget({ 
  ytdBudget, 
  ytdActual, 
  ytdLastYear,
  dateRange 
}: YTDAnalysisWidgetProps) {
  // Calculate variances
  const budgetVariance = ytdActual - ytdBudget;
  const budgetVariancePercent = ytdBudget > 0 ? (budgetVariance / ytdBudget) * 100 : 0;
  
  const lyVariance = ytdActual - ytdLastYear;
  const lyVariancePercent = ytdLastYear > 0 ? (lyVariance / ytdLastYear) * 100 : 0;

  // Format date range for display
  const dateRangeText = `${dateRange.startDate.toLocaleDateString()} - ${dateRange.endDate.toLocaleDateString()}`;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">Year-to-Date Analysis</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Calendar className="h-4 w-4" />
          <span>{dateRangeText}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* YTD Actual */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
              <DollarSign className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  YTD Actual
                </dt>
                <dd className="text-lg font-semibold text-gray-900">
                  {formatCurrency(ytdActual)}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        {/* Budget Comparison */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className={cn(
              "flex-shrink-0 rounded-md p-3",
              budgetVariance >= 0 ? "bg-green-100" : "bg-red-100"
            )}>
              <Target className={cn(
                "h-6 w-6",
                budgetVariance >= 0 ? "text-green-600" : "text-red-600"
              )} />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  vs YTD Budget
                </dt>
                <dd className={cn(
                  "text-lg font-semibold",
                  budgetVariance >= 0 ? "text-green-600" : "text-red-600"
                )}>
                  {budgetVariance >= 0 ? "+" : "-"}{formatCurrency(Math.abs(budgetVariance))}
                </dd>
                <dd className="text-xs text-gray-500">
                  {budgetVariance >= 0 ? "Above" : "Below"} budget by {Math.abs(budgetVariancePercent).toFixed(1)}%
                </dd>
                <dd className="text-xs text-gray-400 mt-1">
                  Budget: {formatCurrency(ytdBudget)}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        {/* Last Year Comparison */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className={cn(
              "flex-shrink-0 rounded-md p-3",
              lyVariance >= 0 ? "bg-green-100" : "bg-red-100"
            )}>
              <History className={cn(
                "h-6 w-6",
                lyVariance >= 0 ? "text-green-600" : "text-red-600"
              )} />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  vs YTD Last Year
                </dt>
                <dd className={cn(
                  "text-lg font-semibold",
                  lyVariance >= 0 ? "text-green-600" : "text-red-600"
                )}>
                  {lyVariance >= 0 ? "+" : "-"}{formatCurrency(Math.abs(lyVariance))}
                </dd>
                <dd className="text-xs text-gray-500">
                  {lyVariance >= 0 ? "Growth" : "Decline"} of {Math.abs(lyVariancePercent).toFixed(1)}%
                </dd>
                <dd className="text-xs text-gray-400 mt-1">
                  Last Year: {formatCurrency(ytdLastYear)}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}