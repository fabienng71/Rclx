import React, { useState } from 'react';
import { Settings, Plus } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { BudgetForm } from '../../components/sales/BudgetForm';
import { LYActualForm } from '../../components/sales/LYActualForm';
import { BudgetDisplay } from '../../components/sales/BudgetDisplay';
import { ActualDisplay } from '../../components/sales/ActualDisplay';
import { BudgetSummaryWidget } from '../../components/sales/BudgetSummaryWidget';
import { ActualSummaryWidget } from '../../components/sales/ActualSummaryWidget';
import { calculateWorkingDays, calculateMonthlyBaseline } from '../../utils/budgetCalculations';
import { useBudgetStore } from '../../store/budgetStore';
import { useActualStore } from '../../store/actualStore';

export function SalesAdmin() {
  const { user } = useAuthStore();
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [showLYActualForm, setShowLYActualForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState<ReturnType<typeof useBudgetStore.getState>['budgets'][0] | null>(null);
  const [editingActual, setEditingActual] = useState<ReturnType<typeof useActualStore.getState>['actuals'][0] | null>(null);

  const { budgets } = useBudgetStore();
  const { actuals } = useActualStore();

  // Calculate working days for the current fiscal year
  const workingDays = React.useMemo(() => {
    const startDate = new Date(2024, 3, 1); // April 1, 2024
    const endDate = new Date(2025, 2, 31); // March 31, 2025
    return calculateWorkingDays(startDate, endDate);
  }, []);

  if (user?.role !== 'admin') {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Access Denied</h3>
            <p className="mt-2 text-sm text-red-700">
              You need administrator privileges to access this section.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const currentBudget = budgets[0];
  const currentActual = actuals[0];

  const handleEditBudget = (budget: typeof currentBudget) => {
    setEditingBudget(budget);
    setShowBudgetForm(true);
  };

  const handleEditActual = (actual: typeof currentActual) => {
    setEditingActual(actual);
    setShowLYActualForm(true);
  };

  const handleBudgetSuccess = () => {
    setShowBudgetForm(false);
    setEditingBudget(null);
  };

  const handleActualSuccess = () => {
    setShowLYActualForm(false);
    setEditingActual(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <div className="p-2 bg-indigo-100 rounded-lg">
          <Settings className="h-6 w-6 text-indigo-600" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-900">Sales Administration</h1>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Budget Management */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-medium text-gray-900">Budget Management</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Create and manage sales budgets for upcoming fiscal years
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingBudget(null);
                  setShowBudgetForm(true);
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Budget
              </button>
            </div>
            {currentBudget && (
              <BudgetSummaryWidget
                total={currentBudget.total}
                monthlyBaseline={calculateMonthlyBaseline(currentBudget.total)}
                workingDays={workingDays}
              />
            )}
          </div>
          <div className="px-6 py-4">
            <BudgetDisplay 
              budgets={budgets} 
              onEdit={handleEditBudget}
            />
          </div>
        </div>

        {/* LY Actual Management */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-medium text-gray-900">Last Year Actuals</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Record and manage last year's actual sales data
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingActual(null);
                  setShowLYActualForm(true);
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Enter LY Actual
              </button>
            </div>
            {currentActual && (
              <ActualSummaryWidget
                total={currentActual.total}
                monthlyBaseline={calculateMonthlyBaseline(currentActual.total)}
                workingDays={workingDays}
              />
            )}
          </div>
          <div className="px-6 py-4">
            <ActualDisplay 
              actuals={actuals}
              onEdit={handleEditActual}
            />
          </div>
        </div>
      </div>

      {showBudgetForm && (
        <BudgetForm 
          onClose={() => {
            setShowBudgetForm(false);
            setEditingBudget(null);
          }}
          initialData={editingBudget || undefined}
          mode={editingBudget ? 'edit' : 'create'}
          onSuccess={handleBudgetSuccess}
        />
      )}

      {showLYActualForm && (
        <LYActualForm 
          onClose={() => {
            setShowLYActualForm(false);
            setEditingActual(null);
          }}
          initialData={editingActual || undefined}
          mode={editingActual ? 'edit' : 'create'}
          onSuccess={handleActualSuccess}
        />
      )}
    </div>
  );
}