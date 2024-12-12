import React from 'react';
import { Calendar } from 'lucide-react';
import { cn } from '../../utils/cn';

export type ValidityPeriod = '1-week' | '2-weeks' | '1-month';

interface ValidityPeriodSelectProps {
  value: ValidityPeriod;
  onChange: (value: ValidityPeriod) => void;
}

export function ValidityPeriodSelect({ value, onChange }: ValidityPeriodSelectProps) {
  return (
    <div className="bg-indigo-50 p-4 rounded-lg shadow-sm">
      <div className="flex items-center space-x-2 mb-2">
        <Calendar className="h-5 w-5 text-indigo-600" />
        <label htmlFor="validity-period" className="block text-sm font-medium text-indigo-700">
          Validity Period
        </label>
      </div>
      <select
        id="validity-period"
        value={value}
        onChange={(e) => onChange(e.target.value as ValidityPeriod)}
        className={cn(
          "block w-full rounded-md border-indigo-300 bg-white shadow-sm",
          "focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
          "text-indigo-700"
        )}
      >
        <option value="1-week">1 Week</option>
        <option value="2-weeks">2 Weeks</option>
        <option value="1-month">1 Month</option>
      </select>
    </div>
  );
}