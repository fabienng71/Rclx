import React from 'react';
import { formatCurrency } from '../../utils/format';
import { cn } from '../../utils/cn';
import type { Product } from '../../types';

interface QuotationPreviewTableProps {
  products: Product[];
}

export function QuotationPreviewTable({ products }: QuotationPreviewTableProps) {
  return (
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
              List Price
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Quote Price
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Discount
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map((product) => {
            const listPrice = product.unitPrice || 0;
            const quotePrice = product.modifiedPrice || listPrice;
            const hasDiscount = listPrice > 0 && quotePrice !== listPrice;
            const discountPercent = hasDiscount ? ((listPrice - quotePrice) / listPrice) * 100 : 0;

            return (
              <tr key={product.itemCode}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {product.itemCode}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {product.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                  {listPrice > 0 ? formatCurrency(listPrice) : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                  {quotePrice > 0 ? formatCurrency(quotePrice) : '-'}
                </td>
                <td className={cn(
                  "px-6 py-4 whitespace-nowrap text-sm text-right",
                  !hasDiscount ? "text-gray-500" :
                  discountPercent > 0 ? "text-green-600" :
                  "text-red-600"
                )}>
                  {hasDiscount ? `${Math.abs(discountPercent).toFixed(1)}%${discountPercent > 0 ? ' discount' : ' markup'}` : '-'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}