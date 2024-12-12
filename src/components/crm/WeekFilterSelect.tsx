import React, { useMemo } from 'react';
import { Calendar } from 'lucide-react';

interface WeekFilterSelectProps {
  value: string;
  onChange: (value: string) => void;
}

function getWeekOptions() {
  const options = [];
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  
  // Get current week number
  const startDate = new Date(currentYear, 0, 1);
  const days = Math.floor((currentDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));
  const currentWeek = Math.ceil(days / 7);

  // Add options for the last 52 weeks
  for (let i = 0; i < 52; i++) {
    const weekNum = currentWeek - i;
    const year = currentYear - (weekNum <= 0 ? 1 : 0);
    const adjustedWeek = weekNum <= 0 ? weekNum + 52 : weekNum;
    
    options.push({
      value: `${year}-${adjustedWeek}`,
      label: `Week ${adjustedWeek}, ${year}`
    });
  }

  return options;
}

export function WeekFilterSelect({ value, onChange }: WeekFilterSelectProps) {
  const weekOptions = useMemo(() => getWeekOptions(), []);

  return (
    <div className="flex items-center space-x-2">
      <Calendar className="h-5 w-5 text-gray-400" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-48 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      >
        <option value="all">All Weeks</option>
        {weekOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}