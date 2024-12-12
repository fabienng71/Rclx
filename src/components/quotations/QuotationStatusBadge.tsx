import React from 'react';
import { Mail, CheckCircle, XCircle, Clock } from 'lucide-react';
import { cn } from '../../utils/cn';

interface QuotationStatusBadgeProps {
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  onChange?: (newStatus: 'draft' | 'sent' | 'accepted' | 'rejected') => void;
}

export function QuotationStatusBadge({ status, onChange }: QuotationStatusBadgeProps) {
  const statusConfig = {
    draft: {
      icon: Clock,
      bg: 'bg-gray-100',
      text: 'text-gray-700',
      label: 'Draft'
    },
    sent: {
      icon: Mail,
      bg: 'bg-blue-100',
      text: 'text-blue-700',
      label: 'Sent'
    },
    accepted: {
      icon: CheckCircle,
      bg: 'bg-green-100',
      text: 'text-green-700',
      label: 'Accepted'
    },
    rejected: {
      icon: XCircle,
      bg: 'bg-red-100',
      text: 'text-red-700',
      label: 'Rejected'
    }
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  if (onChange) {
    return (
      <select
        value={status}
        onChange={(e) => onChange(e.target.value as typeof status)}
        className={cn(
          "inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium",
          config.bg,
          config.text
        )}
      >
        <option value="draft">Draft</option>
        <option value="sent">Sent</option>
        <option value="accepted">Accepted</option>
        <option value="rejected">Rejected</option>
      </select>
    );
  }

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium",
      config.bg,
      config.text
    )}>
      <Icon className="h-3.5 w-3.5 mr-1" />
      {config.label}
    </span>
  );
}