import React from 'react';
import { CreditCard } from 'lucide-react';
import { cn } from '../../utils/cn';
import { PaymentTerms } from '../../types';

interface PaymentTermsSelectProps {
  value: PaymentTerms;
  onChange: (value: PaymentTerms) => void;
}

export function PaymentTermsSelect({ value, onChange }: PaymentTermsSelectProps) {
  return (
    <div className="bg-green-50 p-4 rounded-lg shadow-sm">
      <div className="flex items-center space-x-2 mb-2">
        <CreditCard className="h-5 w-5 text-green-600" />
        <label htmlFor="payment-terms" className="block text-sm font-medium text-green-700">
          Payment Terms
        </label>
      </div>
      <select
        id="payment-terms"
        value={value}
        onChange={(e) => onChange(e.target.value as PaymentTerms)}
        className={cn(
          "block w-full rounded-md border-green-300 bg-white shadow-sm",
          "focus:border-green-500 focus:ring-green-500 sm:text-sm",
          "text-green-700"
        )}
      >
        <option value="prepayment">Prepayment</option>
        <option value="cod">Cash on Delivery (COD)</option>
        <option value="7-days">7 Days</option>
        <option value="15-days">15 Days</option>
        <option value="30-days">30 Days</option>
      </select>
    </div>
  );
}