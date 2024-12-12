import React, { useEffect, useState } from 'react';
import { getLoginJournalEntries } from '../../services/auth';
import { LoginAttempt } from '../../types/auth';
import { CheckCircle, XCircle } from 'lucide-react';

export function LoginJournal() {
  const [attempts, setAttempts] = useState<LoginAttempt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadJournal = async () => {
      try {
        const entries = await getLoginJournalEntries();
        setAttempts(entries);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to load login journal');
      } finally {
        setIsLoading(false);
      }
    };

    loadJournal();
  }, []);

  if (isLoading) {
    return <div className="text-center py-4">Loading journal entries...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Login Journal</h3>
        <p className="mt-1 text-sm text-gray-500">
          Recent login attempts and their status
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Timestamp
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                IP Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Browser
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {attempts.map((attempt) => (
              <tr key={attempt.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  {attempt.success ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {attempt.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(attempt.timestamp).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {attempt.ipAddress}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {attempt.userAgent}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}