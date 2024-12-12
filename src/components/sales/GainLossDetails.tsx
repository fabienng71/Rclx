import React from 'react';
import { formatCurrency } from '../../utils/format';

interface GainLossDetailsProps {
  itemChanges: Array<{
    itemCode: string;
    description: string;
    quantityChange: number;
    revenueChange: number;
  }>;
  type: 'gain' | 'loss';
}

export function GainLossDetails({ itemChanges, type }: GainLossDetailsProps) {
  return (
    <div className="border-l-2 border-gray-200 ml-3 mb-4">
      <table className="min-w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Product Code
            </th>
            <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th className="px-6 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Quantity
            </th>
            <th className="px-6 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Revenue
            </th>
          </tr>
        </thead>
        <tbody>
          {itemChanges.map((item) => (
            <tr key={item.itemCode} className="hover:bg-gray-50">
              <td className="px-6 py-2 text-sm text-gray-500">
                {item.itemCode}
              </td>
              <td className="px-6 py-2 text-sm text-gray-900">
                {item.description}
              </td>
              <td className="px-6 py-2 text-right whitespace-nowrap text-sm text-gray-900">
                {Math.abs(item.quantityChange).toLocaleString()}
                {type === 'gain' ? ' gained' : ' lost'}
              </td>
              <td className={`px-6 py-2 text-right whitespace-nowrap text-sm ${
                type === 'gain' ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatCurrency(Math.abs(item.revenueChange))}
                {type === 'gain' ? ' gained' : ' lost'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}