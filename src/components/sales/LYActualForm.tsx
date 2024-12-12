import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../../utils/format';
import { useActualStore, type ActualData } from '../../store/actualStore';
import { cn } from '../../utils/cn';

interface LYActualFormProps {
  onClose: () => void;
  initialData?: ActualData;
  mode?: 'create' | 'edit';
  onSuccess?: () => void;
}

const MONTHS = [
  'April', 'May', 'June', 'July', 'August', 'September',
  'October', 'November', 'December', 'January', 'February', 'March'
];

export function LYActualForm({ onClose, initialData, mode = 'create', onSuccess }: LYActualFormProps) {
  const currentYear = new Date().getFullYear();
  const [fiscalYear, setFiscalYear] = useState(initialData?.fiscalYear || `${currentYear - 1}-${currentYear}`);
  const [monthlyActual, setMonthlyActual] = useState<Record<string, number>>(
    initialData?.monthlyActual || MONTHS.reduce((acc, month) => ({ ...acc, [month]: 0 }), {})
  );
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modifiedFields, setModifiedFields] = useState<Set<string>>(new Set());

  const { addActual, updateActual } = useActualStore();

  const handleMonthlyActualChange = (month: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setMonthlyActual(prev => ({
      ...prev,
      [month]: numValue
    }));
    setModifiedFields(prev => new Set(prev).add(month));
    setError(null);
  };

  const totalActual = Object.values(monthlyActual).reduce((sum, value) => sum + value, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      const actualData: ActualData = {
        fiscalYear,
        monthlyActual,
        total: totalActual,
        lastModified: new Date().toISOString()
      };

      if (mode === 'edit') {
        updateActual(fiscalYear, {
          monthlyActual,
          total: totalActual
        });
        setSuccess('Actual data updated successfully');
      } else {
        addActual(actualData);
        setSuccess('Actual data created successfully');
      }

      if (onSuccess) {
        onSuccess();
      }

      // Clear modified fields after successful save
      setModifiedFields(new Set());
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to save actual data');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (initialData && mode === 'edit') {
      setMonthlyActual(initialData.monthlyActual);
      setModifiedFields(new Set());
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === 'create' ? 'Enter Last Year Actual' : 'Edit Last Year Actual'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Fiscal Year Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Fiscal Year
              </label>
              <select
                value={fiscalYear}
                onChange={(e) => setFiscalYear(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                disabled={mode === 'edit'}
              >
                <option value={`${currentYear - 1}-${currentYear}`}>
                  {currentYear - 1}-{currentYear}
                </option>
                <option value={`${currentYear - 2}-${currentYear - 1}`}>
                  {currentYear - 2}-{currentYear - 1}
                </option>
              </select>
            </div>

            {/* Monthly Actual Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {MONTHS.map(month => (
                <div key={month}>
                  <label className="block text-sm font-medium text-gray-700">
                    {month}
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">THB</span>
                    </div>
                    <input
                      type="number"
                      value={monthlyActual[month] || ''}
                      onChange={(e) => handleMonthlyActualChange(month, e.target.value)}
                      className={cn(
                        "block w-full pl-12 pr-12 sm:text-sm border rounded-md focus:ring-indigo-500 focus:border-indigo-500",
                        modifiedFields.has(month) ? "border-yellow-300 bg-yellow-50" : "border-gray-300"
                      )}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-lg font-medium">
                <span>Total Actual:</span>
                <span>{formatCurrency(totalActual)}</span>
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">{error}</h3>
                  </div>
                </div>
              </div>
            )}

            {success && (
              <div className="rounded-md bg-green-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">{success}</h3>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
            >
              {isSubmitting ? 'Saving...' : mode === 'create' ? 'Save Actual' : 'Update Actual'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}