import React from 'react';
import { cn } from '../../../utils/cn';

interface QuotationTabsProps {
  activeTab: 'active' | 'archived';
  onTabChange: (tab: 'active' | 'archived') => void;
  archivedCount: number;
}

export function QuotationTabs({ activeTab, onTabChange, archivedCount }: QuotationTabsProps) {
  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8" aria-label="Tabs">
        <button
          onClick={() => onTabChange('active')}
          className={cn(
            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
            activeTab === 'active'
              ? 'border-indigo-500 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          )}
        >
          Active Quotations
        </button>
        <button
          onClick={() => onTabChange('archived')}
          className={cn(
            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
            activeTab === 'archived'
              ? 'border-indigo-500 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          )}
        >
          Archived
          {archivedCount > 0 && (
            <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
              {archivedCount}
            </span>
          )}
        </button>
      </nav>
    </div>
  );
}