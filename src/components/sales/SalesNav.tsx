import React from 'react';
import { Package2, Users } from 'lucide-react';
import { cn } from '../../utils/cn';

interface SalesNavProps {
  activeView: 'items' | 'customers';
  onViewChange: (view: 'items' | 'customers') => void;
}

export function SalesNav({ activeView, onViewChange }: SalesNavProps) {
  return (
    <nav className="bg-white shadow-sm rounded-lg">
      <div className="flex divide-x divide-gray-200">
        <button
          onClick={() => onViewChange('items')}
          className={cn(
            'flex-1 px-4 py-3 flex items-center justify-center space-x-2 text-sm font-medium transition-colors',
            activeView === 'items'
              ? 'text-indigo-600 bg-indigo-50'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          )}
        >
          <Package2 className="h-4 w-4" />
          <span>Items Performance</span>
        </button>
        <button
          onClick={() => onViewChange('customers')}
          className={cn(
            'flex-1 px-4 py-3 flex items-center justify-center space-x-2 text-sm font-medium transition-colors',
            activeView === 'customers'
              ? 'text-indigo-600 bg-indigo-50'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          )}
        >
          <Users className="h-4 w-4" />
          <span>Customer Performance</span>
        </button>
      </div>
    </nav>
  );
}