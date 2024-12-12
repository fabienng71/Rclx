import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Building2, Users, FileText, DollarSign, History, Package2, LogOut, Settings, Briefcase, Boxes } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const navItems = [
  { to: '/', icon: Building2, label: 'Dashboard' },
  { to: '/customers', icon: Users, label: 'Customers' },
  { to: '/quotations', icon: FileText, label: 'Quotations' },
  { to: '/quotations/history', icon: History, label: 'History' },
  { to: '/inventory', icon: Boxes, label: 'Inventory' },
  { 
    to: '/sales/items', 
    icon: Package2, 
    label: 'Sales Management',
    group: 'Sales'
  },
  {
    to: '/crm',
    icon: Briefcase,
    label: 'CRM',
    group: 'Sales'
  }
];

const adminItems = [
  {
    to: '/admin/users',
    icon: Settings,
    label: 'User Management',
    group: 'Admin'
  }
];

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const allNavItems = user?.role === 'admin' 
    ? [...navItems, ...adminItems]
    : navItems;

  const groupedNavItems = allNavItems.reduce((acc, item) => {
    const group = item.group || 'Main';
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(item);
    return acc;
  }, {} as Record<string, typeof navItems>);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Building2 className="h-8 w-8 text-indigo-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">
                  RCLx
                </span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {Object.entries(groupedNavItems).map(([group, items]) => (
                  <div key={group} className="flex items-center space-x-8">
                    {group !== 'Main' && (
                      <div className="h-4 w-px bg-gray-200" />
                    )}
                    {items.map(({ to, icon: Icon, label }) => (
                      <Link
                        key={to}
                        to={to}
                        className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                          location.pathname === to
                            ? 'text-indigo-600 border-b-2 border-indigo-600'
                            : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        {label}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 hover:text-gray-700 focus:outline-none transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}