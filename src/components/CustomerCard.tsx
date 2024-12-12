import React from 'react';
import { Building2 } from 'lucide-react';

interface CustomerCardProps {
  customer: {
    customerCode: string;
    companyName: string;
    searchName: string;
    isLead?: boolean;
  };
  selected: boolean;
  onSelect: () => void;
}

export function CustomerCard({ customer, selected, onSelect }: CustomerCardProps) {
  return (
    <div
      className={`bg-white rounded-lg shadow p-6 cursor-pointer transition-all ${
        selected ? 'ring-2 ring-indigo-600' : 'hover:shadow-lg'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start space-x-4">
        <div className={`p-3 rounded-lg ${selected ? 'bg-indigo-100' : 'bg-gray-100'}`}>
          <Building2 className={`h-6 w-6 ${selected ? 'text-indigo-600' : 'text-gray-600'}`} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{customer.companyName}</h3>
          {customer.isLead ? (
            <p className="text-sm text-gray-500 mt-1">Lead Company</p>
          ) : (
            <>
              <p className="text-sm text-gray-500 mt-1">Code: {customer.customerCode}</p>
              <p className="text-sm text-gray-500">{customer.searchName}</p>
            </>
          )}
        </div>
        <div className="flex items-center justify-center">
          <input
            type="radio"
            checked={selected}
            onChange={onSelect}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
          />
        </div>
      </div>
    </div>
  );
}