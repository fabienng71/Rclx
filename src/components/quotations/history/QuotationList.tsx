import React from 'react';
import { useAuthStore } from '../../../store/authStore';
import { QuotationListItem } from './QuotationListItem';
import type { SavedQuotation } from '../../../types';

interface QuotationListProps {
  quotations: SavedQuotation[];
  isArchived?: boolean;
  onSelect: (quotation: SavedQuotation) => void;
  onArchive?: (id: string) => void;
  onRestore?: (id: string) => void;
  onDelete?: (id: string) => void;
  onStatusChange: (id: string, status: SavedQuotation['status']) => void;
}

export function QuotationList({
  quotations,
  isArchived = false,
  onSelect,
  onArchive,
  onRestore,
  onDelete,
  onStatusChange,
}: QuotationListProps) {
  const { user } = useAuthStore();

  if (quotations.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-sm">
        <p className="text-gray-500">
          {isArchived 
            ? 'No archived quotations found.' 
            : 'No active quotations found.'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Items
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {quotations.map((quotation) => (
              <QuotationListItem
                key={quotation.id}
                quotation={quotation}
                isArchived={isArchived}
                onSelect={onSelect}
                onArchive={user?.role === 'admin' ? onArchive : undefined}
                onRestore={user?.role === 'admin' ? onRestore : undefined}
                onDelete={user?.role === 'admin' ? onDelete : undefined}
                onStatusChange={onStatusChange}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}