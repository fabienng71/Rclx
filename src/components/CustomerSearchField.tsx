import React from 'react';
import { useCustomerStore } from '../store/customerStore';
import { SearchBar } from './SearchBar';
import type { Customer } from '../types';

interface CustomerSearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (customer: Customer) => void;
  selectedCustomer: Customer | null;
  onClear: () => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export function CustomerSearchField({
  value,
  onChange,
  onSelect,
  selectedCustomer,
  onClear,
  placeholder = 'Search customers...',
  autoFocus = false
}: CustomerSearchFieldProps) {
  const { searchCustomers } = useCustomerStore();
  const filteredCustomers = searchCustomers(value);

  return (
    <div className="relative">
      <SearchBar
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoFocus={autoFocus}
      />
      
      {value && !selectedCustomer && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md overflow-auto border border-gray-200">
          {filteredCustomers.length > 0 ? (
            filteredCustomers.map((customer) => (
              <div
                key={customer.customerCode}
                className="cursor-pointer select-none px-4 py-3 hover:bg-indigo-50 transition-colors"
                onClick={() => {
                  onSelect(customer);
                  onChange('');
                }}
              >
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900">
                    {customer.searchName}
                  </span>
                  <span className="text-sm text-gray-500">
                    {customer.customerCode} - {customer.companyName}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="px-4 py-3 text-sm text-gray-500">
              No customers found
            </div>
          )}
        </div>
      )}

      {selectedCustomer && (
        <div className="mt-2 flex items-center space-x-2">
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
            {selectedCustomer.searchName}
          </span>
          <button
            type="button"
            onClick={onClear}
            className="text-sm text-red-600 hover:text-red-500"
          >
            Remove
          </button>
        </div>
      )}
    </div>
  );
}