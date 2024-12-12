import React from 'react';
import { Search } from 'lucide-react';
import { cn } from '../utils/cn';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

export function SearchBar({ 
  value, 
  onChange, 
  placeholder = 'Search...', 
  className,
  autoFocus = false
}: SearchBarProps) {
  return (
    <div className={cn("relative", className)}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        placeholder={placeholder}
        autoFocus={autoFocus}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          <span className="text-gray-400 hover:text-gray-500 text-sm">Clear</span>
        </button>
      )}
    </div>
  );
}