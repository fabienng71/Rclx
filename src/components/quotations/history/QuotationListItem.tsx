import React from 'react';
import { QuotationActions } from './QuotationActions';
import { QuotationStatusBadge } from '../QuotationStatusBadge';
import { formatDate } from '../../../utils/format';
import { cn } from '../../../utils/cn';
import type { SavedQuotation } from '../../../types';

interface QuotationListItemProps {
  quotation: SavedQuotation;
  isArchived?: boolean;
  onSelect: (quotation: SavedQuotation) => void;
  onArchive?: (id: string) => void;
  onRestore?: (id: string) => void;
  onDelete?: (id: string) => void;
  onStatusChange: (id: string, status: SavedQuotation['status']) => void;
}

export function QuotationListItem({
  quotation,
  isArchived = false,
  onSelect,
  onArchive,
  onRestore,
  onDelete,
  onStatusChange,
}: QuotationListItemProps) {
  const getStatusColor = (status: SavedQuotation['status']) => {
    switch (status) {
      case 'draft': return 'bg-gray-50 hover:bg-gray-100';
      case 'sent': return 'bg-blue-50 hover:bg-blue-100';
      case 'accepted': return 'bg-green-50 hover:bg-green-100';
      case 'rejected': return 'bg-red-50 hover:bg-red-100';
      default: return 'hover:bg-gray-50';
    }
  };

  return (
    <tr className={cn(
      "transition-colors",
      isArchived ? 'bg-gray-50' : getStatusColor(quotation.status)
    )}>
      <td className="px-6 py-4">
        <div className="flex flex-col">
          <span className="text-sm font-bold text-gray-900">
            {quotation.customer.searchName}
          </span>
          <span className="text-xs text-gray-500">
            {quotation.customer.companyName}
          </span>
          <span className="text-xs text-gray-500">
            {quotation.customer.customerCode}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatDate(quotation.date)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {quotation.items.length} items
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <QuotationStatusBadge
          status={quotation.status}
          onChange={(status) => onStatusChange(quotation.id, status)}
        />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <QuotationActions
          quotation={quotation}
          isArchived={isArchived}
          onPreview={() => onSelect(quotation)}
          onArchive={onArchive ? () => onArchive(quotation.id) : undefined}
          onRestore={onRestore ? () => onRestore(quotation.id) : undefined}
          onDelete={onDelete ? () => onDelete(quotation.id) : undefined}
        />
      </td>
    </tr>
  );
}