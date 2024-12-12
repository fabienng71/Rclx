import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Package2, Users, Calendar } from 'lucide-react';
import { formatDate } from '../../utils/format';
import { cn } from '../../utils/cn';
import type { Sample } from '../../types/crm';

interface SamplesListProps {
  samples: Sample[];
  onStatusChange: (id: string, status: Sample['status']) => void;
  onFeedbackChange: (id: string, feedback: Sample['feedback']) => void;
}

const STATUS_COLORS = {
  won: 'hover:bg-green-50 bg-green-25',
  lost: 'hover:bg-red-50 bg-red-25',
  pending: 'hover:bg-yellow-50 bg-yellow-25'
} as const;

export function SamplesList({ samples, onStatusChange, onFeedbackChange }: SamplesListProps) {
  const [expandedSamples, setExpandedSamples] = useState<Set<string>>(new Set());

  const toggleSample = (id: string) => {
    setExpandedSamples(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="w-10 px-2 py-3"></th>
            <th className="w-[15%] px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Customer
            </th>
            <th className="w-[25%] px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Item
            </th>
            <th className="w-10 px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Qty
            </th>
            <th className="w-32 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="w-[25%] px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="w-[30%] px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Feedback
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {samples.map((sample) => (
            <React.Fragment key={sample.id}>
              <tr className={cn(
                "transition-colors",
                STATUS_COLORS[sample.status]
              )}>
                <td className="px-2 py-3">
                  <button
                    onClick={() => toggleSample(sample.id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {expandedSamples.has(sample.id) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 text-gray-400 mr-1 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {sample.searchName}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {sample.customerCode}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center">
                    <Package2 className="h-4 w-4 text-gray-400 mr-1 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-sm text-gray-900 truncate">
                        {sample.description}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {sample.itemCode}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3 text-right whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-900">
                    {sample.quantity}
                  </span>
                </td>
                <td className="px-3 py-3 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1 flex-shrink-0" />
                    {formatDate(sample.date)}
                  </div>
                </td>
                <td className="px-3 py-3">
                  <select
                    value={sample.status}
                    onChange={(e) => onStatusChange(sample.id, e.target.value as Sample['status'])}
                    className={cn(
                      "block w-full rounded-md text-sm font-medium px-2 py-1 border-none focus:ring-1",
                      sample.status === 'won' && "bg-green-100 text-green-800 focus:ring-green-500",
                      sample.status === 'lost' && "bg-red-100 text-red-800 focus:ring-red-500",
                      sample.status === 'pending' && "bg-yellow-100 text-yellow-800 focus:ring-yellow-500"
                    )}
                  >
                    <option value="pending">Pending</option>
                    <option value="won">Won</option>
                    <option value="lost">Lost</option>
                  </select>
                </td>
                <td className="px-3 py-3">
                  <select
                    value={sample.feedback || ''}
                    onChange={(e) => onFeedbackChange(sample.id, e.target.value as Sample['feedback'])}
                    className="block w-full rounded-md text-sm border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="">Select feedback...</option>
                    <option value="like">Like</option>
                    <option value="dont_like">Don't Like</option>
                    <option value="too_expensive">Too Expensive</option>
                  </select>
                </td>
              </tr>

              {expandedSamples.has(sample.id) && (
                <tr className={cn(
                  "transition-colors",
                  STATUS_COLORS[sample.status]
                )}>
                  <td></td>
                  <td colSpan={6} className="px-3 py-3">
                    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">
                        Sample Details
                      </h4>
                      <dl className="grid grid-cols-2 gap-4">
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Created By</dt>
                          <dd className="mt-1 text-sm text-gray-900">{sample.createdBy}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Created At</dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {new Date(sample.createdAt).toLocaleString()}
                          </dd>
                        </div>
                        <div className="col-span-2">
                          <dt className="text-sm font-medium text-gray-500">Notes</dt>
                          <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                            {sample.notes}
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}