import React from 'react';
import { Calendar } from 'lucide-react';

interface DateRangeFilterProps {
  startDate?: string;
  endDate?: string;
  onStartDateChange?: (date: string) => void;
  onEndDateChange?: (date: string) => void;
  selectedRange?: string;
  onRangeChange?: (range: string) => void;
  type?: 'range' | 'select';
}

export function DateRangeFilter({ 
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  selectedRange = 'this-month',
  onRangeChange,
  type = 'range'
}: DateRangeFilterProps) {
  if (type === 'select') {
    return (
      <div className="flex items-center space-x-2 bg-white rounded-lg shadow-sm px-3 py-2">
        <Calendar className="h-5 w-5 text-gray-400" />
        <select
          value={selectedRange}
          onChange={(e) => onRangeChange?.(e.target.value)}
          className="block w-48 border-none text-sm focus:ring-0 focus:outline-none"
        >
          <option value="this-month">This Month</option>
          <option value="last-month">Last Month</option>
          <option value="last-3-months">Last 3 Months</option>
          <option value="last-6-months">Last 6 Months</option>
          <option value="all">All Time</option>
        </select>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2 bg-white rounded-lg shadow-sm px-3 py-2">
      <div>
        <label htmlFor="start-date" className="block text-xs font-medium text-gray-700">
          From
        </label>
        <input
          type="date"
          id="start-date"
          value={startDate}
          onChange={(e) => onStartDateChange?.(e.target.value)}
          className="block w-full border-none text-sm focus:ring-0 focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="end-date" className="block text-xs font-medium text-gray-700">
          To
        </label>
        <input
          type="date"
          id="end-date"
          value={endDate}
          onChange={(e) => onEndDateChange?.(e.target.value)}
          className="block w-full border-none text-sm focus:ring-0 focus:outline-none"
        />
      </div>
    </div>
  );
}