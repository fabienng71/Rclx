import React, { useState } from 'react';
import { CalendarDays, Plus, Users } from 'lucide-react';
import { useCRMStore } from '../../store/crmStore';
import { ActivityForm } from '../../components/crm/ActivityForm';
import { ActivityList } from '../../components/crm/ActivityList';
import { WeekFilterSelect } from '../../components/crm/WeekFilterSelect';
import { filterActivitiesByWeek } from '../../utils/dateFilters';

export function Activities() {
  const { activities } = useCRMStore();
  const [showForm, setShowForm] = useState(false);
  const [weekFilter, setWeekFilter] = useState('all');
  const [selectedCreator, setSelectedCreator] = useState('all');

  // Get unique creators
  const creators = ['all', ...new Set(activities.map(activity => activity.createdBy))].sort();

  // Filter activities
  const filteredActivities = activities
    .filter(activity => 
      selectedCreator === 'all' || activity.createdBy === selectedCreator
    )
    .filter(activity => filterActivitiesByWeek([activity], weekFilter).length > 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <CalendarDays className="h-6 w-6 text-indigo-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Customer Activities</h2>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Log Activity
        </button>
      </div>

      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center space-x-2">
          <Users className="h-5 w-5 text-gray-400" />
          <select
            value={selectedCreator}
            onChange={(e) => setSelectedCreator(e.target.value)}
            className="block w-48 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="all">All Users</option>
            {creators.filter(c => c !== 'all').map(creator => (
              <option key={creator} value={creator}>{creator}</option>
            ))}
          </select>
        </div>
        <WeekFilterSelect
          value={weekFilter}
          onChange={setWeekFilter}
        />
      </div>

      {activities.length === 0 ? (
        <div className="text-center py-12">
          <CalendarDays className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No activities</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by logging a new activity.
          </p>
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg">
          <ActivityList activities={filteredActivities} />
        </div>
      )}

      {showForm && <ActivityForm onClose={() => setShowForm(false)} />}
    </div>
  );
}