import React from 'react';
import { useStore } from '../../store/useStore';
import { formatCurrency } from '../../utils/format';

export function CustomerPerformance() {
  const { sales } = useStore();

  const customerPerformance = sales.reduce((acc, sale) => {
    if (!acc[sale.customerCode]) {
      acc[sale.customerCode] = {
        customerCode: sale.customerCode,
        companyName: sale.companyName,
        orderCount: 0,
        totalRevenue: 0,
      };
    }
    acc[sale.customerCode].orderCount++;
    acc[sale.customerCode].totalRevenue += sale.total;
    return acc;
  }, {} as Record<string, { customerCode: string; companyName: string; orderCount: number; totalRevenue: number; }>);

  const sortedCustomers = Object.values(customerPerformance).sort((a, b) => b.totalRevenue - a.totalRevenue);

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company Name
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Orders
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Revenue
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedCustomers.map((customer) => (
              <tr key={customer.customerCode} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {customer.customerCode}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {customer.companyName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {customer.orderCount.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {formatCurrency(customer.totalRevenue)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}