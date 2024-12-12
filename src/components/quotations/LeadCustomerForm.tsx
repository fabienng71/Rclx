import React, { useState } from 'react';
import { Building2 } from 'lucide-react';
import type { Customer } from '../../types';

interface LeadCustomerFormProps {
  onSubmit: (lead: Customer) => void;
  onCancel: () => void;
}

export function LeadCustomerForm({ onSubmit, onCancel }: LeadCustomerFormProps) {
  const [companyName, setCompanyName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) return;

    const lead: Customer = {
      customerCode: `LEAD-${Date.now()}`,
      companyName: companyName.trim(),
      searchName: companyName.trim(),
      isLead: true
    };

    onSubmit(lead);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
      <div className="flex items-center space-x-2">
        <Building2 className="h-5 w-5 text-gray-400" />
        <h3 className="text-lg font-medium text-gray-900">Add Lead Customer</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="company-name" className="block text-sm font-medium text-gray-700">
            Company Name
          </label>
          <input
            type="text"
            id="company-name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter company name"
            required
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Add Lead
          </button>
        </div>
      </form>
    </div>
  );
}