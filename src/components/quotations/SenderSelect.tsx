import React from 'react';
import { User } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuthStore } from '../../store/authStore';
import type { QuotationSender } from '../../types';

interface SenderSelectProps {
  value: QuotationSender | null;
  onChange: (sender: QuotationSender | null) => void;
}

export function SenderSelect({ value, onChange }: SenderSelectProps) {
  const { user: currentUser } = useAuthStore();
  const users = useAuthStore(state => state.getAllUsers?.() || []);

  const senders: QuotationSender[] = users
    .filter(user => user.telephone) // Only include users with contact info
    .map(user => ({
      name: user.name,
      email: user.email,
      phone: user.telephone || ''
    }));

  return (
    <div className="relative">
      <select
        value={value?.email || ''}
        onChange={(e) => {
          const sender = senders.find(s => s.email === e.target.value);
          onChange(sender || null);
        }}
        className={cn(
          "block w-60 rounded-md pr-10 py-2 text-sm focus:ring-2 focus:ring-offset-2",
          !value 
            ? "border-red-300 focus:border-red-500 focus:ring-red-500" 
            : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
        )}
      >
        <option value="">Select sender...</option>
        {senders.map(sender => (
          <option key={sender.email} value={sender.email}>
            {sender.name} ({sender.phone})
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
        <User className={cn(
          "h-4 w-4",
          !value ? "text-red-400" : "text-gray-400"
        )} />
      </div>
    </div>
  );
}