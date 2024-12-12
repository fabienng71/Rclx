import React from 'react';
import type { Customer } from '../../types';

interface CustomerTableProps {
  customers: Customer[];
  selectedCustomers: string[];
  onToggleCustomer: (customerCode: string) => void;
}

export function CustomerTable({ customers, selectedCustomers, onToggleCustomer }: CustomerTableProps) {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-8 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  checked={customers.length > 0 && selectedCustomers.length === customers.length}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onToggleCustomer('all');
                    } else {
                      onToggleCustomer('none');
                    }
                  }}
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Search Name
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {customers.map((customer) => (
              <tr key={customer.customerCode} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    checked={selectedCustomers.includes(customer.customerCode)}
                    onChange={() => onToggleCustomer(customer.customerCode)}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {customer.customerCode}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {customer.companyName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {customer.searchName}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}