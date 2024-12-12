import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import { cn } from '../../utils/cn';
import type { Sample } from '../../types/crm';

interface EditableSampleRowProps {
  sample: Sample;
  onSave: (id: string, updates: Partial<Sample>) => void;
  onCancel: () => void;
}

const FEEDBACK_OPTIONS = [
  { value: 'like', label: 'Like' },
  { value: 'dont_like', label: 'Don\'t Like' },
  { value: 'too_expensive', label: 'Too Expensive' }
] as const;

export function EditableSampleRow({ sample, onSave, onCancel }: EditableSampleRowProps) {
  const [status, setStatus] = useState(sample.status);
  const [feedback, setFeedback] = useState(sample.feedback || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      await onSave(sample.id, {
        status,
        feedback: feedback || undefined
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center space-x-4 px-4 py-2">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as Sample['status'])}
        className="block w-32 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      >
        <option value="pending">Pending</option>
        <option value="won">Won</option>
        <option value="lost">Lost</option>
      </select>

      <select
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        className="block w-40 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      >
        <option value="">Select Feedback</option>
        {FEEDBACK_OPTIONS.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <div className="flex items-center space-x-2">
        <button
          onClick={handleSave}
          disabled={isSubmitting}
          className={cn(
            "p-1 rounded-full transition-colors",
            isSubmitting
              ? "bg-gray-100 text-gray-400"
              : "bg-green-100 text-green-600 hover:bg-green-200"
          )}
          title="Save changes"
        >
          <Check className="h-4 w-4" />
        </button>
        <button
          onClick={onCancel}
          disabled={isSubmitting}
          className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
          title="Cancel"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}