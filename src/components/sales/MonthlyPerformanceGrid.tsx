import React from 'react';
import { MonthlyPerformanceWidget } from './MonthlyPerformanceWidget';
import { useBudgetStore } from '../../store/budgetStore';
import { useActualStore } from '../../store/actualStore';
import { useStore } from '../../store/useStore';

const MONTHS = [
  'April', 'May', 'June', 'July', 'August', 'September',
  'October', 'November', 'December', 'January', 'February', 'March'
];

export function MonthlyPerformanceGrid() {
  const { budgets } = useBudgetStore();
  const { actuals } = useActualStore();
  const { sales } = useStore();

  // Get current fiscal year
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const fiscalYear = currentMonth < 3 
    ? `${currentYear - 1}-${currentYear}` 
    : `${currentYear}-${currentYear + 1}`;
  const lastFiscalYear = `${parseInt(fiscalYear.split('-')[0]) - 1}-${parseInt(fiscalYear.split('-')[1]) - 1}`;

  // Get current budget and LY actual
  const currentBudget = budgets.find(b => b.fiscalYear === fiscalYear);
  const lastYearActual = actuals.find(a => a.fiscalYear === lastFiscalYear);

  // Calculate current year actuals from sales data
  const currentActuals = MONTHS.reduce((acc, month) => {
    const monthIndex = MONTHS.indexOf(month);
    const year = monthIndex < 9 ? parseInt(fiscalYear.split('-')[0]) : parseInt(fiscalYear.split('-')[1]);
    const startDate = new Date(year, monthIndex < 9 ? monthIndex + 3 : monthIndex - 9, 1);
    const endDate = new Date(year, monthIndex < 9 ? monthIndex + 4 : monthIndex - 8, 0);

    const monthlyTotal = sales
      .filter(sale => {
        const saleDate = new Date(sale.date);
        return saleDate >= startDate && saleDate <= endDate;
      })
      .reduce((sum, sale) => sum + sale.total, 0);

    acc[month] = monthlyTotal;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {MONTHS.map(month => (
        <MonthlyPerformanceWidget
          key={month}
          month={month}
          budget={currentBudget?.monthlyBudget[month] || 0}
          actual={currentActuals[month] || 0}
          lastYearActual={lastYearActual?.monthlyActual[month] || 0}
        />
      ))}
    </div>
  );
}