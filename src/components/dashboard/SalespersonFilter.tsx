import React from 'react';
import { Users } from 'lucide-react';

interface SalespersonFilterProps {
  selectedSalesperson: string;
  onSelectionChange: (salesperson: string) => void;
  salespeople: string[];
}

export function SalespersonFilter({
  selectedSalesperson,
  onSelectionChange,
  salespeople,
}: SalespersonFilterProps) {
  return (
    <div className="flex items-center bg-white rounded-lg shadow-sm px-3 py-2">
      <select
        value={selectedSalesperson}
        onChange={(e) => onSelectionChange(e.target.value)}
        className="block w-48 text-sm border-none focus:ring-0 focus:outline-none pr-8"
      >
        <option value="all">All Salespeople</option>
        {salespeople.filter(sp => sp !== 'all').map(sp => (
          <option key={sp} value={sp}>{sp}</option>
        ))}
      </select>
      <Users className="h-4 w-4 text-gray-400 flex-shrink-0" />
    </div>
  );
}