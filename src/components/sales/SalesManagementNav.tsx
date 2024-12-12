import React from 'react';
import { LayoutDashboard, PieChart, TrendingUp, Settings, BarChart2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { useAuthStore } from '../../store/authStore';

const navItems = [
  {
    to: '/sales/dashboard',
    icon: LayoutDashboard,
    label: 'Dashboard'
  },
  {
    to: '/sales/reports',
    icon: PieChart,
    label: 'Performance Reports'
  },
  {
    to: '/sales/budget-analysis',
    icon: BarChart2,
    label: 'Budget Analysis'
  },
  {
    to: '/sales/gains-losses',
    icon: TrendingUp,
    label: 'Gains & Losses'
  }
];

const adminItems = [
  {
    to: '/sales/admin',
    icon: Settings,
    label: 'Sales Admin',
    requireAdmin: true
  }
];

export function SalesManagementNav() {
  const location = useLocation();
  const { user } = useAuthStore();

  const allNavItems = user?.role === 'admin' 
    ? [...navItems, ...adminItems]
    : navItems;

  return (
    <nav className="bg-white shadow-sm rounded-lg">
      <div className="flex divide-x divide-gray-200">
        {allNavItems.map(({ to, icon: Icon, label }) => (
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
  );
}