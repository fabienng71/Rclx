import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight, Loader2, Trash2, Calendar, Package2, Mail, Phone, Users, Box } from 'lucide-react';
import { formatDate } from '../../utils/format';
import { useCRMStore } from '../../store/crmStore';
import { saveActivity } from '../../services/activities';
import { cn } from '../../utils/cn';
import type { Activity, Sample } from '../../types/crm';

const ACTIVITY_COLORS = {
  visit: 'hover:bg-blue-100 bg-blue-50',
  call: 'hover:bg-green-100 bg-green-50',
  email: 'hover:bg-yellow-100 bg-yellow-50',
  sample: 'hover:bg-purple-100 bg-purple-50'
} as const;

const ACTIVITY_ICONS = {
  visit: Users,
  call: Phone,
  email: Mail,
  sample: Box
} as const;

interface ActivityListProps {
  activities: Activity[];
}

export function ActivityList({ activities }: ActivityListProps) {
  const { updateActivity, removeActivity, samples, updateSample } = useCRMStore();
  const [expandedActivities, setExpandedActivities] = useState<Set<string>>(new Set());
  const [selectedWeek, setSelectedWeek] = useState<string>('all');
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Get samples for each activity
  const activitySamples = useMemo(() => {
    return activities.reduce((acc, activity) => {
      acc[activity.id] = samples.filter(sample => 
        sample.notes.includes(activity.id)
      );
      return acc;
    }, {} as Record<string, Sample[]>);
  }, [activities, samples]);

  const handleActivityTypeChange = async (activity: Activity, newType: Activity['type']) => {
    try {
      const updatedActivity = { ...activity, type: newType };
      await saveActivity(updatedActivity);
      updateActivity(activity.id, { type: newType });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update activity type');
    }
  };

  const handleActivityStatusChange = async (activity: Activity, newStatus: Activity['status']) => {
    setUpdatingStatus(activity.id);
    setError(null);

    try {
      const updatedActivity = { ...activity, status: newStatus };
      await saveActivity(updatedActivity);
      updateActivity(activity.id, { status: newStatus });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleSampleStatusChange = async (sample: Sample, newStatus: Sample['status']) => {
    try {
      await updateSample(sample.id, { status: newStatus });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update sample status');
    }
  };

  const handleDelete = async (activity: Activity) => {
    if (!confirm('Are you sure you want to delete this activity?')) return;

    try {
      removeActivity(activity.id);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete activity');
    }
  };

  const toggleActivity = (activityId: string) => {
    setExpandedActivities(prev => {
      const next = new Set(prev);
      if (next.has(activityId)) {
        next.delete(activityId);
      } else {
        next.add(activityId);
      }
      return next;
    });
  };

  const formatCallbackDate = (date: string | undefined) => {
    if (!date) return null;
    const callbackDate = new Date(date);
    const isPast = callbackDate < new Date();
    const formattedDate = callbackDate.toLocaleDateString('en-US', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit'
    });
    return (
      <span className={cn(
        "inline-flex items-center space-x-1",
        isPast ? "text-red-600" : "text-gray-600"
      )}>
        <Calendar className="h-4 w-4" />
        <span>{formattedDate}</span>
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-12 px-6 py-3"></th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created By
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Callback
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {activities.map((activity) => {
              const ActivityIcon = ACTIVITY_ICONS[activity.type];
              return (
                <React.Fragment key={activity.id}>
                  <tr 
                    className={cn(
                      "transition-colors",
                      ACTIVITY_COLORS[activity.type]
                    )}
                  >
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleActivity(activity.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {expandedActivities.has(activity.id) ? (
                          <ChevronDown className="h-5 w-5" />
                        ) : (
                          <ChevronRight className="h-5 w-5" />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-base font-medium text-gray-900">
                        {activity.searchName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {activity.customerCode}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <ActivityIcon className={cn(
                          "h-5 w-5",
                          activity.type === 'visit' && "text-blue-600",
                          activity.type === 'call' && "text-green-600",
                          activity.type === 'email' && "text-yellow-600",
                          activity.type === 'sample' && "text-purple-600"
                        )} />
                        <select
                          value={activity.type}
                          onChange={(e) => handleActivityTypeChange(activity, e.target.value as Activity['type'])}
                          className={cn(
                            "block w-32 rounded-md border-none shadow-sm focus:ring-1 sm:text-sm font-medium",
                            activity.type === 'visit' && "text-blue-600",
                            activity.type === 'call' && "text-green-600",
                            activity.type === 'email' && "text-yellow-600",
                            activity.type === 'sample' && "text-purple-600"
                          )}
                        >
                          <option value="visit">Meeting</option>
                          <option value="call">Call</option>
                          <option value="email">Email</option>
                          <option value="sample">Sample</option>
                        </select>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {updatingStatus === activity.id ? (
                        <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
                      ) : (
                        <select
                          value={activity.status}
                          onChange={(e) => handleActivityStatusChange(activity, e.target.value as Activity['status'])}
                          className={cn(
                            "block w-28 rounded-md shadow-sm focus:ring-1 sm:text-sm font-medium",
                            activity.status === 'won' && "border-green-300 text-green-800 focus:border-green-500 focus:ring-green-500",
                            activity.status === 'lost' && "border-red-300 text-red-800 focus:border-red-500 focus:ring-red-500",
                            activity.status === 'pending' && "border-yellow-300 text-yellow-800 focus:border-yellow-500 focus:ring-yellow-500"
                          )}
                        >
                          <option value="pending">Pending</option>
                          <option value="won">Won</option>
                          <option value="lost">Lost</option>
                        </select>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {activity.createdBy}
                    </td>
                    <td className="px-6 py-4">
                      {formatCallbackDate(activity.callbackDate)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(activity)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>

                  {/* Sample Details */}
                  {expandedActivities.has(activity.id) && activitySamples[activity.id]?.map(sample => (
                    <tr key={sample.id} className="bg-gray-50">
                      <td></td>
                      <td colSpan={6} className="px-6 py-4">
                        <div className="flex items-center space-x-4 ml-8">
                          <Package2 className="h-4 w-4 text-gray-400" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {sample.description}
                            </div>
                            <div className="text-sm text-gray-500">
                              Quantity: {sample.quantity}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500 font-medium">Sample:</span>
                            <select
                              value={sample.status}
                              onChange={(e) => handleSampleStatusChange(sample, e.target.value as Sample['status'])}
                              className={cn(
                                "text-sm font-medium rounded-full px-2 py-1",
                                sample.status === 'won' && "bg-green-100 text-green-800",
                                sample.status === 'lost' && "bg-red-100 text-red-800",
                                sample.status === 'pending' && "bg-yellow-100 text-yellow-800"
                              )}
                            >
                              <option value="pending">Pending</option>
                              <option value="won">Won</option>
                              <option value="lost">Lost</option>
                            </select>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {/* Activity Notes */}
                  {expandedActivities.has(activity.id) && (
                    <tr>
                      <td></td>
                      <td colSpan={6} className="px-6 py-4">
                        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 ml-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">
                            Meeting Notes
                          </h4>
                          <p className="text-sm text-gray-600 whitespace-pre-wrap">
                            {activity.notes || 'No notes provided.'}
                          </p>
                          <div className="mt-4 text-xs text-gray-500">
                            Created on {new Date(activity.createdAt).toLocaleString()}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}