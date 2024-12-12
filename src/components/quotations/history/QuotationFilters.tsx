import React from 'react';
import { SearchBar } from '../../SearchBar';
import type { SavedQuotation } from '../../../types';

interface QuotationFiltersProps {
  statusFilter: 'all' | SavedQuotation['status'];
  searchQuery: string;
  onStatusChange: (status: 'all' | SavedQuotation['status']) => void;
  onSearchChange: (query: string) => void;
}

export function QuotationFilters({
  statusFilter,
  searchQuery,
  onStatusChange,
  onSearchChange
}: QuotationFiltersProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value as typeof statusFilter)}
            className="block w-full sm:w-48 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div className="w-full sm:w-64">
          <SearchBar
            value={searchQuery}
            onChange={onSearchChange}
            placeholder="Search by customer..."
          />
        </div>
      </div>
    </div>
  );
}