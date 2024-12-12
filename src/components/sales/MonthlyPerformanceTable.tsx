import React from 'react';
import { ChevronDown, ChevronRight, Calendar, DollarSign, Package2, TrendingUp } from 'lucide-react';
import { formatCurrency } from '../../utils/format';
import { formatDate } from '../../utils/format';

interface MonthlyPerformanceTableProps {
  salesData: Record<string, {
    code: string;
    description: string;
    months: Record<string, { quantity: number; revenue: number }>;
    customers: Array<{
      customerName: string;
      date: string;
      quantity: number;
      revenue: number;
      salesPersonCode: string;
    }>;
  }>;
  months: string[];
  expandedItem: string | null;
  onToggleExpand: (itemCode: string | null) => void;
}

function formatMonthHeader(monthKey: string): string {
  const [year, month] = monthKey.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleString('en-US', { month: 'short' }).toUpperCase() + 
         year.slice(2);
}

export function MonthlyPerformanceTable({
  salesData,
  months,
  expandedItem,
  onToggleExpand
}: MonthlyPerformanceTableProps) {
  return (
    <div className="relative overflow-x-auto">
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden">
          <table className="min-w-full table-fixed divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-12 px-2 py-3 sticky left-0 bg-gray-50 z-10"></th>
                <th className="w-48 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-12 bg-gray-50 z-10">
                  Code
                </th>
                <th className="w-64 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-[15rem] bg-gray-50 z-10">
                  Description
                </th>
                {months.map(month => (
                  <React.Fragment key={month}>
                    <th className="w-28 px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {formatMonthHeader(month)} QTY
                    </th>
                    <th className="w-28 px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {formatMonthHeader(month)} REV
                    </th>
                  </React.Fragment>
                ))}
                <th className="w-28 px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total QTY
                </th>
                <th className="w-28 px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total REV
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(salesData).map(([code, data]) => {
                // Calculate totals
                const totalQuantity = Object.values(data.months)
                  .reduce((sum, month) => sum + month.quantity, 0);
                const totalRevenue = Object.values(data.months)
                  .reduce((sum, month) => sum + month.revenue, 0);

                // Get last purchase details
                const lastPurchase = data.customers
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

                return (
                  <React.Fragment key={code}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-2 py-4 whitespace-nowrap sticky left-0 bg-white z-10">
                        <button
                          onClick={() => onToggleExpand(expandedItem === code ? null : code)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          {expandedItem === code ? (
                            <ChevronDown className="h-5 w-5" />
                          ) : (
                            <ChevronRight className="h-5 w-5" />
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 sticky left-12 bg-white z-10">
                        {code}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 sticky left-[15rem] bg-white z-10">
                        {data.description}
                      </td>
                      {months.map(month => (
                        <React.Fragment key={month}>
                          <td className="px-3 py-4 text-right whitespace-nowrap text-sm text-gray-900">
                            {data.months[month]?.quantity.toLocaleString() || '-'}
                          </td>
                          <td className="px-3 py-4 text-right whitespace-nowrap text-sm text-gray-900">
                            {data.months[month] ? formatCurrency(data.months[month].revenue) : '-'}
                          </td>
                        </React.Fragment>
                      ))}
                      <td className="px-6 py-4 text-right whitespace-nowrap text-sm font-medium text-gray-900">
                        {totalQuantity.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(totalRevenue)}
                      </td>
                    </tr>
                    {expandedItem === code && lastPurchase && (
                      <tr className="bg-gray-50">
                        <td className="px-2 py-4"></td>
                        <td colSpan={2 + (months.length * 2) + 2} className="px-6 py-4">
                          <div className="grid grid-cols-4 gap-4">
                            <div className="bg-white p-4 rounded-lg shadow-sm">
                              <div className="flex items-center space-x-2 text-gray-500 mb-1">
                                <Calendar className="h-4 w-4" />
                                <span className="text-xs font-medium">Last Purchase Date</span>
                              </div>
                              <div className="text-sm font-medium text-gray-900">
                                {formatDate(lastPurchase.date)}
                              </div>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-sm">
                              <div className="flex items-center space-x-2 text-gray-500 mb-1">
                                <DollarSign className="h-4 w-4" />
                                <span className="text-xs font-medium">Last Purchase Price</span>
                              </div>
                              <div className="text-sm font-medium text-gray-900">
                                {formatCurrency(lastPurchase.revenue / lastPurchase.quantity)}
                              </div>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-sm">
                              <div className="flex items-center space-x-2 text-gray-500 mb-1">
                                <Package2 className="h-4 w-4" />
                                <span className="text-xs font-medium">Total Quantity</span>
                              </div>
                              <div className="text-sm font-medium text-gray-900">
                                {totalQuantity.toLocaleString()}
                              </div>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-sm">
                              <div className="flex items-center space-x-2 text-gray-500 mb-1">
                                <TrendingUp className="h-4 w-4" />
                                <span className="text-xs font-medium">Total Revenue</span>
                              </div>
                              <div className="text-sm font-medium text-gray-900">
                                {formatCurrency(totalRevenue)}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}