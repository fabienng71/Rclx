import React, { useMemo, useState } from 'react';
import { BarChart3, TrendingUp, Users, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useCRMStore } from '../../store/crmStore';
import { formatDate } from '../../utils/format';
import { DateFilterSelect } from '../../components/crm/DateFilterSelect';
import { WeekFilterSelect } from '../../components/crm/WeekFilterSelect';
import { SamplesWidget } from '../../components/crm/SamplesWidget';
import { filterActivitiesByDateRange, filterActivitiesByWeek } from '../../utils/dateFilters';

interface ActivityStats {
  totalActivities: number;
  pendingActivities: number;
  wonActivities: number;
  lostActivities: number;
}

interface SalespersonStats {
  name: string;
  totalActivities: number;
  pendingActivities: number;
  wonActivities: number;
  lostActivities: number;
  successRate: number;
}

export function Dashboard() {
  const { activities, samples } = useCRMStore();
  const [dateFilter, setDateFilter] = useState('all');
  const [weekFilter, setWeekFilter] = useState('all');
  const [selectedSalesperson, setSelectedSalesperson] = useState('all');

  // Get unique salespeople from activities
  const salespeople = useMemo(() => {
    const uniqueSalespeople = new Set(activities.map(activity => activity.createdBy));
    return ['all', ...Array.from(uniqueSalespeople)].sort();
  }, [activities]);

  // Filter activities by selected filters
  const filteredActivities = useMemo(() => {
    let filtered = filterActivitiesByDateRange(activities, dateFilter);
    filtered = filterActivitiesByWeek(filtered, weekFilter);
    
    // Filter by salesperson if one is selected
    if (selectedSalesperson !== 'all') {
      filtered = filtered.filter(activity => activity.createdBy === selectedSalesperson);
    }
    
    return filtered;
  }, [activities, dateFilter, weekFilter, selectedSalesperson]);

  // Filter samples by salesperson
  const filteredSamples = useMemo(() => {
    if (selectedSalesperson === 'all') {
      return samples;
    }
    return samples.filter(sample => sample.createdBy === selectedSalesperson);
  }, [samples, selectedSalesperson]);

  const salespersonStats = useMemo(() => {
    const stats = new Map<string, SalespersonStats>();

    filteredActivities.forEach(activity => {
      if (!stats.has(activity.createdBy)) {
        stats.set(activity.createdBy, {
          name: activity.createdBy,
          totalActivities: 0,
          pendingActivities: 0,
          wonActivities: 0,
          lostActivities: 0,
          successRate: 0
        });
      }

      const personStats = stats.get(activity.createdBy)!;
      personStats.totalActivities++;

      switch (activity.status) {
        case 'pending':
          personStats.pendingActivities++;
          break;
        case 'won':
          personStats.wonActivities++;
          break;
        case 'lost':
          personStats.lostActivities++;
          break;
      }

      // Calculate success rate (won activities / total completed activities)
      const completedActivities = personStats.wonActivities + personStats.lostActivities;
      personStats.successRate = completedActivities > 0
        ? (personStats.wonActivities / completedActivities) * 100
        : 0;
    });

    return Array.from(stats.values()).sort((a, b) => b.totalActivities - a.totalActivities);
  }, [filteredActivities]);

  const overallStats: ActivityStats = useMemo(() => {
    return filteredActivities.reduce(
      (stats, activity) => {
        stats.totalActivities++;
        switch (activity.status) {
          case 'pending':
            stats.pendingActivities++;
            break;
          case 'won':
            stats.wonActivities++;
            break;
          case 'lost':
            stats.lostActivities++;
            break;
        }
        return stats;
      },
      { totalActivities: 0, pendingActivities: 0, wonActivities: 0, lostActivities: 0 }
    );
  }, [filteredActivities]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <BarChart3 className="h-6 w-6 text-indigo-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">CRM Dashboard</h2>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-gray-400" />
            <select
              value={selectedSalesperson}
              onChange={(e) => setSelectedSalesperson(e.target.value)}
              className="block w-48 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="all">All Salespersons</option>
              {salespeople.filter(sp => sp !== 'all').map(sp => (
                <option key={sp} value={sp}>{sp}</option>
              ))}
            </select>
          </div>
          <DateFilterSelect value={dateFilter} onChange={setDateFilter} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <Calendar className="h-10 w-10 text-indigo-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Activities</p>
              <p className="text-2xl font-semibold text-gray-900">{overallStats.totalActivities}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <Clock className="h-10 w-10 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pending</p>
              <p className="text-2xl font-semibold text-gray-900">{overallStats.pendingActivities}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <CheckCircle className="h-10 w-10 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Won</p>
              <p className="text-2xl font-semibold text-gray-900">{overallStats.wonActivities}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <XCircle className="h-10 w-10 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Lost</p>
              <p className="text-2xl font-semibold text-gray-900">{overallStats.lostActivities}</p>
            </div>
          </div>
        </div>

        <SamplesWidget count={filteredSamples.length} />
      </div>

      {/* Salesperson Stats */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Activity by Salesperson</h3>
          <WeekFilterSelect value={weekFilter} onChange={setWeekFilter} />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Salesperson
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Activities
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pending
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Won
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lost
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Success Rate
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {salespersonStats.map((person) => (
                <tr key={person.name} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {person.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                    {person.totalActivities}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-yellow-600">
                    {person.pendingActivities}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-green-600">
                    {person.wonActivities}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-red-600">
                    {person.lostActivities}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      person.successRate >= 70 ? 'bg-green-100 text-green-800' :
                      person.successRate >= 40 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {person.successRate.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}