import React from 'react';
import { useStore } from '../../store/useStore';
import { formatCurrency } from '../../utils/format';

export function ItemsPerformance() {
  const { sales } = useStore();

  const itemPerformance = sales.reduce((acc, sale) => {
    sale.items.forEach(item => {
      if (!acc[item.itemCode]) {
        acc[item.itemCode] = {
          itemCode: item.itemCode,
          description: item.description,
          quantity: 0,
          revenue: 0,
        };
      }
      acc[item.itemCode].quantity += item.quantity;
      acc[item.itemCode].revenue += item.quantity * item.price;
    });
    return acc;
  }, {} as Record<string, { itemCode: string; description: string; quantity: number; revenue: number; }>);

  const sortedItems = Object.values(itemPerformance).sort((a, b) => b.revenue - a.revenue);

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Item Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity Sold
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Revenue
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedItems.map((item) => (
              <tr key={item.itemCode} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.itemCode}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {item.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {item.quantity.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {formatCurrency(item.revenue)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}