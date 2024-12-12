import React from 'react';
import { Calendar } from 'lucide-react';

interface DateFilterSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function DateFilterSelect({ value, onChange }: DateFilterSelectProps) {
  return (
    <div className="flex items-center space-x-2">
      <Calendar className="h-5 w-5 text-gray-400" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-40 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      >
        <option value="all">All Time</option>
        <option value="this-week">This Week</option>
        <option value="last-week">Last Week</option>
        <option value="last-month">Last Month</option>
        <option value="past">Past Dates</option>
      </select>
    </div>
  );
}