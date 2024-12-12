import React, { useState, useMemo } from 'react';
import { Package2, ChevronDown, ChevronRight, Pencil } from 'lucide-react';
import { useCRMStore } from '../../store/crmStore';
import { formatDate } from '../../utils/format';
import { cn } from '../../utils/cn';
import { EditableSampleRow } from '../../components/crm/EditableSampleRow';
import type { Sample } from '../../types/crm';

type SortField = 'customerName' | 'date' | 'status';
type SortDirection = 'asc' | 'desc';

const STATUS_COLORS = {
  won: 'hover:bg-green-50 bg-green-25',
  lost: 'hover:bg-red-50 bg-red-25',
  pending: 'hover:bg-yellow-50 bg-yellow-25'
} as const;

export function Samples() {
  const { samples, activities, updateSample } = useCRMStore();
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [expandedActivities, setExpandedActivities] = useState<Set<string>>(new Set());
  const [editingSample, setEditingSample] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | Sample['status']>('all');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Get activity details for each sample
  const samplesWithActivities = useMemo(() => {
    return samples.map(sample => {
      const activityId = sample.notes.match(/activity: ([a-zA-Z0-9-]+)/)?.[1];
      const activity = activities.find(a => a.id === activityId);
      return {
        ...sample,
        activity,
        status: activity?.status || sample.status || 'pending'
      };
    });
  }, [samples, activities]);

  // Filter samples by status
  const filteredSamples = useMemo(() => {
    return samplesWithActivities.filter(sample => 
      statusFilter === 'all' || sample.status === statusFilter
    );
  }, [samplesWithActivities, statusFilter]);

  // Sort samples
  const sortedSamples = useMemo(() => {
    return [...filteredSamples].sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'date':
          comparison = new Date(b.date).getTime() - new Date(a.date).getTime();
          break;
        case 'customerName':
          comparison = a.searchName.localeCompare(b.searchName);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredSamples, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const toggleRow = (id: string) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSaveSample = async (id: string, updates: Partial<Sample>) => {
    await updateSample(id, updates);
    setEditingSample(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Package2 className="h-6 w-6 text-indigo-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Sample Management</h2>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          className="block w-40 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="won">Won</option>
          <option value="lost">Lost</option>
        </select>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-12 px-6 py-3"></th>
                <th className="w-1/4 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="w-1/3 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item
                </th>
                <th className="w-20 px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="w-24 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="w-32 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="w-8 px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedSamples.map((sample) => (
                <React.Fragment key={sample.id}>
                  <tr className={cn(
                    "transition-colors",
                    STATUS_COLORS[sample.status]
                  )}>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleRow(sample.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {expandedRows.has(sample.id) ? (
                          <ChevronDown className="h-5 w-5" />
                        ) : (
                          <ChevronRight className="h-5 w-5" />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900 truncate" title={sample.searchName}>
                          {sample.searchName}
                        </span>
                        <span className="text-xs text-gray-500 truncate" title={sample.companyName}>
                          {sample.companyName}
                        </span>
                        <span className="text-xs text-gray-500">
                          {sample.customerCode}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-900 truncate" title={sample.description}>
                          {sample.description}
                        </span>
                        <span className="text-xs text-gray-500">
                          {sample.itemCode}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-gray-900">
                      {sample.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(sample.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingSample === sample.id ? (
                        <EditableSampleRow
                          sample={sample}
                          onSave={handleSaveSample}
                          onCancel={() => setEditingSample(null)}
                        />
                      ) : (
                        <span className={cn(
                          "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                          sample.status === 'won' && "bg-green-100 text-green-800",
                          sample.status === 'lost' && "bg-red-100 text-red-800",
                          sample.status === 'pending' && "bg-yellow-100 text-yellow-800"
                        )}>
                          {sample.status.charAt(0).toUpperCase() + sample.status.slice(1)}
                          {sample.feedback && (
                            <span className="ml-1 text-gray-500">
                              ({sample.feedback.replace('_', ' ')})
                            </span>
                          )}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {editingSample !== sample.id && (
                        <button
                          onClick={() => setEditingSample(sample.id)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  </tr>

                  {expandedRows.has(sample.id) && sample.activity && (
                    <tr className={cn(
                      "transition-colors",
                      STATUS_COLORS[sample.status]
                    )}>
                      <td></td>
                      <td colSpan={6} className="px-6 py-4">
                        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">
                            Activity Details
                          </h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">Activity Type</p>
                              <p className="text-sm font-medium text-gray-900">
                                {sample.activity.type}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Created By</p>
                              <p className="text-sm font-medium text-gray-900">
                                {sample.activity.createdBy}
                              </p>
                            </div>
                          </div>
                          {sample.activity.notes && (
                            <div className="mt-4">
                              <p className="text-sm text-gray-500">Meeting Notes</p>
                              <p className="text-sm text-gray-900 whitespace-pre-wrap mt-1">
                                {sample.activity.notes}
                              </p>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}