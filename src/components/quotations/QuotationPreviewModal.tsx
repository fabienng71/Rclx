import React from 'react';
import { X } from 'lucide-react';
import { formatCurrency } from '../../utils/format';
import type { SavedQuotation } from '../../types';
import { QuotationStatusBadge } from './QuotationStatusBadge';
import { formatDate } from '../../utils/format';

interface QuotationPreviewModalProps {
  quotation: SavedQuotation;
  onClose: () => void;
}

export function QuotationPreviewModal({ quotation, onClose }: QuotationPreviewModalProps) {
  const totalAmount = quotation.items.reduce((sum, item) => 
    sum + (item.quotePrice * 1), // Assuming quantity of 1 for each item
    0
  );

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Quotation Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Customer Information */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h3>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Search Name</dt>
                  <dd className="text-sm text-gray-900">{quotation.customer.searchName}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Company Name</dt>
                  <dd className="text-sm text-gray-900">{quotation.customer.companyName}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Customer Code</dt>
                  <dd className="text-sm text-gray-900">{quotation.customer.customerCode}</dd>
                </div>
              </dl>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quotation Details</h3>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Date</dt>
                  <dd className="text-sm text-gray-900">{formatDate(quotation.date)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="text-sm text-gray-900">
                    <QuotationStatusBadge status={quotation.status} />
                  </dd>
                </div>
                {quotation.sender && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Contact Person</dt>
                    <dd className="text-sm text-gray-900">
                      {quotation.sender.name} ({quotation.sender.email})
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>

          {/* Items Table */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Items</h3>
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
                  {quotation.items.map((item) => {
                    const discountPercent = ((item.listPrice - item.quotePrice) / item.listPrice) * 100;
                    
                    return (
                      <tr key={item.itemCode}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.itemCode}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {item.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                          {formatCurrency(item.listPrice)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                          {formatCurrency(item.quotePrice)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                          {discountPercent === 0 ? '-' : `${Math.abs(discountPercent).toFixed(1)}%`}
                          {discountPercent !== 0 && (discountPercent > 0 ? ' discount' : ' markup')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-sm font-medium text-gray-900">
                      Total Amount
                    </td>
                    <td colSpan={2} className="px-6 py-4 text-sm font-medium text-right text-gray-900">
                      {formatCurrency(totalAmount)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}