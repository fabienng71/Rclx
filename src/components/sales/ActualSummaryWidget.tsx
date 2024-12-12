import React from 'react';
import { DollarSign, TrendingUp, Calendar } from 'lucide-react';
import { formatCurrency } from '../../utils/format';
import { calculateDailyAverage } from '../../utils/budgetCalculations';

interface ActualSummaryWidgetProps {
  total: number;
  monthlyBaseline: number;
  workingDays: number;
}

export function ActualSummaryWidget({ total, monthlyBaseline, workingDays }: ActualSummaryWidgetProps) {
  const dailyAverage = calculateDailyAverage(total, workingDays);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Total Actual */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
            <DollarSign className="h-6 w-6 text-indigo-600" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                Total Actual
              </dt>
              <dd className="text-lg font-semibold text-gray-900">
                {formatCurrency(total)}
              </dd>
              <dd className="text-xs text-gray-500">
                For the fiscal year
              </dd>
            </dl>
          </div>
        </div>
      </div>

      {/* Monthly Baseline */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
            <TrendingUp className="h-6 w-6 text-green-600" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                Monthly Baseline
              </dt>
              <dd className="text-lg font-semibold text-gray-900">
                {formatCurrency(monthlyBaseline)}
              </dd>
              <dd className="text-xs text-gray-500">
                Average per month
              </dd>
            </dl>
          </div>
        </div>
      </div>

      {/* Daily Average */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-amber-100 rounded-md p-3">
            <Calendar className="h-6 w-6 text-amber-600" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                Daily Average
              </dt>
              <dd className="text-lg font-semibold text-gray-900">
                {formatCurrency(dailyAverage)}
              </dd>
              <dd className="text-xs text-gray-500">
                Based on {workingDays} working days
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}