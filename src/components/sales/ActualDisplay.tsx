import React from 'react';
import { Pencil } from 'lucide-react';
import { formatCurrency } from '../../utils/format';
import type { ActualData } from '../../store/actualStore';
import { formatDate } from '../../utils/format';

interface ActualDisplayProps {
  actuals: ActualData[];
  onEdit: (actual: ActualData) => void;
}

const MONTHS = [
  'April', 'May', 'June', 'July', 'August', 'September',
  'October', 'November', 'December', 'January', 'February', 'March'
];

export function ActualDisplay({ actuals, onEdit }: ActualDisplayProps) {
  if (actuals.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No actual data has been entered yet.
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
          {actuals.map((actual) => (
            <tr key={actual.fiscalYear} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {actual.fiscalYear}
              </td>
              {MONTHS.map(month => (
                <td key={month} className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                  {formatCurrency(actual.monthlyActual[month] || 0)}
                </td>
              ))}
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right text-gray-900">
                {formatCurrency(actual.total)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                {formatDate(actual.lastModified)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onEdit(actual)}
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