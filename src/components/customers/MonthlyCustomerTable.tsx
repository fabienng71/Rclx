import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { formatCurrency } from '../../utils/format';

interface MonthlyCustomerTableProps {
  salesData: Record<string, {
    customerCode: string;
    companyName: string;
    months: Record<string, { quantity: number; revenue: number }>;
  }>;
  months: string[];
  expandedCustomer: string | null;
  onToggleExpand: (customerCode: string | null) => void;
}

function formatMonthHeader(monthKey: string): string {
  const [year, month] = monthKey.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleString('en-US', { month: 'short' }).toUpperCase() + 
         year.slice(2);
}

export function MonthlyCustomerTable({
  salesData,
  months,
  expandedCustomer,
  onToggleExpand
}: MonthlyCustomerTableProps) {
  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr className="divide-x divide-gray-200">
          <th className="w-8 px-2 py-2" rowSpan={3}></th>
          <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" rowSpan={3}>
            Customer Code
          </th>
          <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" rowSpan={3}>
            Company Name
          </th>
          {months.map(month => (
            <th key={month} className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-2" colSpan={2}>
              {formatMonthHeader(month)}
            </th>
          ))}
        </tr>
        <tr className="divide-x divide-gray-200">
          {months.map(month => (
            <React.Fragment key={month}>
              <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                QTY
              </th>
              <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                REVENUE
              </th>
            </React.Fragment>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {Object.entries(salesData).map(([customerCode, data]) => (
          <tr key={customerCode} className="hover:bg-gray-50">
            <td className="px-2 py-4">
              <button
                onClick={() => onToggleExpand(expandedCustomer === customerCode ? null : customerCode)}
                className="text-gray-500 hover:text-gray-700"
              >
                {expandedCustomer === customerCode ? (
                  <ChevronDown className="h-5 w-5" />
                ) : (
                  <ChevronRight className="h-5 w-5" />
                )}
              </button>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {customerCode}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {data.companyName}
            </td>
            {months.map(month => (
              <React.Fragment key={month}>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                  {data.months[month]?.quantity.toLocaleString() || '-'}
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                  {data.months[month] ? formatCurrency(data.months[month].revenue) : '-'}
                </td>
              </React.Fragment>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}