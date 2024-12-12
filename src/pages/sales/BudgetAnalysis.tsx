import React, { useMemo } from 'react';
import { BarChart2 } from 'lucide-react';
import { MonthlyPerformanceGrid } from '../../components/sales/MonthlyPerformanceGrid';
import { YTDAnalysisWidget } from '../../components/sales/YTDAnalysisWidget';
import { useBudgetStore } from '../../store/budgetStore';
import { useActualStore } from '../../store/actualStore';
import { useStore } from '../../store/useStore';
import { 
  calculatePartialMonthBudget,
  getYTDDateRange,
  filterSalesInDateRange
} from '../../utils/budgetCalculations';

const MONTHS = [
  'April', 'May', 'June', 'July', 'August', 'September',
  'October', 'November', 'December', 'January', 'February', 'March'
];

export function BudgetAnalysis() {
  const { budgets } = useBudgetStore();
  const { actuals } = useActualStore();
  const { sales } = useStore();

  // Calculate YTD metrics
  const ytdMetrics = useMemo(() => {
    const { startDate, endDate } = getYTDDateRange();
    const now = endDate;
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const currentDay = now.getDate();

    const fiscalYear = currentMonth < 3 
      ? `${currentYear - 1}-${currentYear}` 
      : `${currentYear}-${currentYear + 1}`;
    const lastFiscalYear = `${parseInt(fiscalYear.split('-')[0]) - 1}-${parseInt(fiscalYear.split('-')[1]) - 1}`;

    // Get current budget and LY actual
    const currentBudget = budgets.find(b => b.fiscalYear === fiscalYear);
    const lastYearActual = actuals.find(a => a.fiscalYear === lastFiscalYear);

    // Calculate YTD months
    const fiscalMonthIndex = currentMonth < 3 ? currentMonth + 9 : currentMonth - 3;
    const completeMonths = MONTHS.slice(0, fiscalMonthIndex);
    const currentMonthName = MONTHS[fiscalMonthIndex];

    // Calculate YTD budget
    const completeBudget = completeMonths.reduce((sum, month) => 
      sum + (currentBudget?.monthlyBudget[month] || 0), 0);

    // Calculate partial budget for current month
    const currentMonthBudget = currentBudget?.monthlyBudget[currentMonthName] || 0;
    const partialBudget = calculatePartialMonthBudget(
      currentMonthBudget,
      currentYear,
      currentMonth,
      currentDay
    );

    const ytdBudget = completeBudget + partialBudget;

    // Calculate YTD actual from filtered sales
    const ytdActual = filterSalesInDateRange(sales, startDate, endDate)
      .reduce((sum, sale) => sum + sale.total, 0);

    // Calculate YTD last year
    const completeLYActual = completeMonths.reduce((sum, month) => 
      sum + (lastYearActual?.monthlyActual[month] || 0), 0);

    const currentMonthLYActual = lastYearActual?.monthlyActual[currentMonthName] || 0;
    const partialLYActual = calculatePartialMonthBudget(
      currentMonthLYActual,
      currentYear - 1,
      currentMonth,
      currentDay
    );

    const ytdLastYear = completeLYActual + partialLYActual;

    return {
      ytdBudget,
      ytdActual,
      ytdLastYear,
      dateRange: { startDate, endDate }
    };
  }, [budgets, actuals, sales]);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <div className="p-2 bg-indigo-100 rounded-lg">
          <BarChart2 className="h-6 w-6 text-indigo-600" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-900">Budget Analysis</h1>
      </div>

      <YTDAnalysisWidget {...ytdMetrics} />

      <div className="space-y-4">
        <h2 className="text-lg font-medium text-gray-900">Monthly Performance</h2>
        <MonthlyPerformanceGrid />
      </div>
    </div>
  );
}