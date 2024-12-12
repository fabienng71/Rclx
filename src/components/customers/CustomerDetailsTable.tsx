import React from 'react';
import { formatCurrency } from '../../utils/format';

interface CustomerDetailsTableProps {
  items: Array<{
    itemCode: string;
    description: string;
    date: string;
    quantity: number;
    price: number;
    salesPersonCode: string;
  }>;
  selectedSalesperson: string;
}

export function CustomerDetailsTable({ items, selectedSalesperson }: CustomerDetailsTableProps) {
  // Filter by selected salesperson if not 'all'
  const filteredItems = selectedSalesperson === 'all'
    ? items
    : items.filter(item => item.salesPersonCode === selectedSalesperson);

  // Aggregate by item code
  const aggregatedItems = filteredItems.reduce((acc, curr) => {
    if (!acc[curr.itemCode]) {
      acc[curr.itemCode] = {
        itemCode: curr.itemCode,
        description: curr.description,
        lastPurchaseDate: curr.date,
        lastPurchasePrice: curr.price,
        totalQuantity: 0,
        totalRevenue: 0,
        purchases: []
      };
    }

    const item = acc[curr.itemCode];
    item.totalQuantity += curr.quantity;
    item.totalRevenue += curr.quantity * curr.price;

    // Update last purchase date and price if current purchase is more recent
    if (new Date(curr.date) > new Date(item.lastPurchaseDate)) {
      item.lastPurchaseDate = curr.date;
      item.lastPurchasePrice = curr.price;
    }

    item.purchases.push({
      date: curr.date,
      quantity: curr.quantity,
      price: curr.price
    });

    return acc;
  }, {} as Record<string, {
    itemCode: string;
    description: string;
    lastPurchaseDate: string;
    lastPurchasePrice: number;
    totalQuantity: number;
    totalRevenue: number;
    purchases: Array<{ date: string; quantity: number; price: number; }>;
  }>);

  const sortedItems = Object.values(aggregatedItems).sort((a, b) => 
    b.totalRevenue - a.totalRevenue
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Showing {sortedItems.length} items
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Item Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Purchase
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Price
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Quantity
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Revenue
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Average Price
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedItems.map((item) => {
              const averagePrice = item.totalQuantity > 0 
                ? item.totalRevenue / item.totalQuantity 
                : 0;

              return (
                <tr key={item.itemCode} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.itemCode}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {item.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(item.lastPurchaseDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                    {formatCurrency(Math.round(item.lastPurchasePrice))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                    {item.totalQuantity.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                    {formatCurrency(Math.round(item.totalRevenue))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                    {formatCurrency(Math.round(averagePrice))}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="bg-gray-50">
            <tr>
              <td colSpan={4} className="px-6 py-4 text-sm font-medium text-gray-900">
                Total
              </td>
              <td className="px-6 py-4 text-sm font-medium text-right text-gray-900">
                {sortedItems.reduce((sum, item) => sum + item.totalQuantity, 0).toLocaleString()}
              </td>
              <td className="px-6 py-4 text-sm font-medium text-right text-gray-900">
                {formatCurrency(Math.round(
                  sortedItems.reduce((sum, item) => sum + item.totalRevenue, 0)
                ))}
              </td>
              <td className="px-6 py-4 text-sm font-medium text-right text-gray-900">
                {formatCurrency(Math.round(
                  sortedItems.reduce((sum, item) => sum + item.totalRevenue, 0) /
                  sortedItems.reduce((sum, item) => sum + item.totalQuantity, 0)
                ))}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}