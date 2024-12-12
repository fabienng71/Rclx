import React from 'react';
import { Pencil } from 'lucide-react';
import { formatCurrency } from '../../utils/format';
import type { BudgetData } from '../../store/budgetStore';
import { formatDate } from '../../utils/format';

interface BudgetDisplayProps {
  budgets: BudgetData[];
  onEdit: (budget: BudgetData) => void;
}

const MONTHS = [
  'April', 'May', 'June', 'July', 'August', 'September',
  'October', 'November', 'December', 'January', 'February', 'March'
];

export function BudgetDisplay({ budgets, onEdit }: BudgetDisplayProps) {
  if (budgets.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No budgets have been created yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fiscal Year
            </th>
            {MONTHS.map(month => (
              <th key={month} className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                {month}
              </th>
            ))}
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Last Modified
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {budgets.map((budget) => (
            <tr key={budget.fiscalYear} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {budget.fiscalYear}
              </td>
              {MONTHS.map(month => (
                <td key={month} className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                  {formatCurrency(budget.monthlyBudget[month] || 0)}
                </td>
              ))}
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right text-gray-900">
                {formatCurrency(budget.total)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                {formatDate(budget.lastModified)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onEdit(budget)}
                  className="inline-flex items-center px-2 py-1 text-indigo-600 hover:text-indigo-900 transition-colors"
                >
                  <Pencil className="h-4 w-4 mr-1" />
                  <span>Edit</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}