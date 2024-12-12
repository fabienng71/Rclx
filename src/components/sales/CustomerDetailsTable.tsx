import React from 'react';
import { formatCurrency } from '../../utils/format';

interface CustomerDetailsTableProps {
  customers: Array<{
    customerName: string;
    date: string;
    quantity: number;
    revenue: number;
    salesPersonCode: string;
  }>;
  selectedSalesperson: string;
}

export function CustomerDetailsTable({ customers, selectedSalesperson }: CustomerDetailsTableProps) {
  const filteredCustomers = selectedSalesperson === 'all'
    ? customers
    : customers.filter(c => c.salesPersonCode === selectedSalesperson);

  const aggregatedCustomers = filteredCustomers.reduce((acc, curr) => {
    if (!acc[curr.customerName]) {
      acc[curr.customerName] = {
        customerName: curr.customerName,
        lastPurchaseDate: curr.date,
        lastPurchasePrice: curr.revenue / curr.quantity,
        totalQuantity: 0,
        totalRevenue: 0,
        purchases: []
      };
    }

    const customer = acc[curr.customerName];
    customer.totalQuantity += curr.quantity;
    customer.totalRevenue += curr.revenue;

    if (new Date(curr.date) > new Date(customer.lastPurchaseDate)) {
      customer.lastPurchaseDate = curr.date;
      customer.lastPurchasePrice = curr.revenue / curr.quantity;
    }

    customer.purchases.push({
      date: curr.date,
      quantity: curr.quantity,
      revenue: curr.revenue
    });

    return acc;
  }, {} as Record<string, {
    customerName: string;
    lastPurchaseDate: string;
    lastPurchasePrice: number;
    totalQuantity: number;
    totalRevenue: number;
    purchases: Array<{ date: string; quantity: number; revenue: number; }>;
  }>);

  const sortedCustomers = Object.values(aggregatedCustomers).sort((a, b) => 
    b.totalRevenue - a.totalRevenue
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Showing {sortedCustomers.length} customers
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer Name
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
            {sortedCustomers.map((customer) => {
              const averagePrice = customer.totalQuantity > 0 
                ? customer.totalRevenue / customer.totalQuantity 
                : 0;

              return (
                <tr key={customer.customerName} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {customer.customerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(customer.lastPurchaseDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                    {formatCurrency(Math.round(customer.lastPurchasePrice))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                    {Math.round(customer.totalQuantity).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                    {formatCurrency(Math.round(customer.totalRevenue))}
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
              <td colSpan={3} className="px-6 py-4 text-sm font-medium text-gray-900">
                Total
              </td>
              <td className="px-6 py-4 text-sm font-medium text-right text-gray-900">
                {Math.round(sortedCustomers.reduce((sum, c) => sum + c.totalQuantity, 0)).toLocaleString()}
              </td>
              <td className="px-6 py-4 text-sm font-medium text-right text-gray-900">
                {formatCurrency(Math.round(
                  sortedCustomers.reduce((sum, c) => sum + c.totalRevenue, 0)
                ))}
              </td>
              <td className="px-6 py-4 text-sm font-medium text-right text-gray-900">
                {formatCurrency(Math.round(
                  sortedCustomers.reduce((sum, c) => sum + c.totalRevenue, 0) /
                  sortedCustomers.reduce((sum, c) => sum + c.totalQuantity, 0)
                ))}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}