import React from 'react';
import { formatCurrency } from '../utils/format';
import type { Product } from '../types';
import { cn } from '../utils/cn';

interface ItemsTableProps {
  items: Product[];
  selectedItems: string[];
  onToggleItem: (itemCode: string) => void;
}

export function ItemsTable({ items, selectedItems, onToggleItem }: ItemsTableProps) {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-12 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  checked={items.length > 0 && selectedItems.length === items.length}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onToggleItem('all');
                    } else {
                      onToggleItem('none');
                    }
                  }}
                />
              </th>
              <th className="w-32 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Item Code
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="w-28 px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Inventory
              </th>
              <th className="w-28 px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Unit Price
              </th>
              <th className="w-40 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vendor
              </th>
              <th className="w-24 px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item) => (
              <tr key={item.itemCode} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    checked={selectedItems.includes(item.itemCode)}
                    onChange={() => onToggleItem(item.itemCode)}
                  />
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-600">
                  {item.itemCode}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 line-clamp-2">
                  {item.description}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                  <span className={cn(
                    "font-medium",
                    item.inventory <= 0 ? 'text-red-600' : 'text-green-600'
                  )}>
                    {item.inventory.toLocaleString()} {item.baseUnitOfMeasure}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-medium">
                  {formatCurrency(item.unitPrice)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 truncate max-w-[160px]">
                  {item.vendor}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                  <span className={cn(
                    "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                    item.blocked
                      ? "bg-red-100 text-red-800"
                      : "bg-green-100 text-green-800"
                  )}>
                    {item.blocked ? 'Blocked' : 'Available'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}