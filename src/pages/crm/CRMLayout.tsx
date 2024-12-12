import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Briefcase, FileText, CalendarDays, Package2, BarChart3, Users } from 'lucide-react';
import { cn } from '../../utils/cn';

const navItems = [
  {
    to: '/crm',
    icon: BarChart3,
    label: 'Dashboard'
  },
  {
    to: '/crm/contacts',
    icon: Users,
    label: 'Contacts'
  },
  {
    to: '/crm/toolkit',
    icon: FileText,
    label: 'Toolkit'
  },
  {
    to: '/crm/activities',
    icon: CalendarDays,
    label: 'Activities'
  },
  {
    to: '/crm/samples',
    icon: Package2,
    label: 'Samples'
  }
];

export function CRMLayout() {
  const location = useLocation();

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <div className="p-2 bg-indigo-100 rounded-lg">
          <Briefcase className="h-6 w-6 text-indigo-600" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-900">CRM</h1>
      </div>

      <nav className="bg-white shadow-sm rounded-lg">
        <div className="flex divide-x divide-gray-200">
          {navItems.map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              className={cn(
                'flex-1 px-4 py-3 flex items-center justify-center space-x-2 text-sm font-medium transition-colors',
                location.pathname === to
                  ? 'text-indigo-600 bg-indigo-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </Link>
          ))}
        </div>
      </nav>

      <Outlet />
    </div>
  );
}