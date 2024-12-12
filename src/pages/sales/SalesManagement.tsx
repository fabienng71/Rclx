import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { DollarSign } from 'lucide-react';
import { SalesManagementNav } from '../../components/sales/SalesManagementNav';
import { useStore } from '../../store/useStore';
import { fetchSales } from '../../services/googleSheets';

export function SalesManagement() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setSales } = useStore();

  useEffect(() => {
    const loadSales = async () => {
      try {
        const data = await fetchSales();
        setSales(data);
      } catch (error) {
        console.error('Failed to load sales data:', error);
      }
    };

    loadSales();
  }, [setSales]);

  // Redirect to dashboard if at root sales path
  useEffect(() => {
    if (location.pathname === '/sales') {
      navigate('/sales/dashboard');
    }
  }, [location.pathname, navigate]);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <div className="p-2 bg-indigo-100 rounded-lg">
          <DollarSign className="h-6 w-6 text-indigo-600" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-900">Sales Management</h1>
      </div>

      <SalesManagementNav />
      
      <Outlet />
    </div>
  );
}