import React from 'react';
import { Package2 } from 'lucide-react';

interface SamplesWidgetProps {
  count: number;
}

export function SamplesWidget({ count }: SamplesWidgetProps) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
            <Package2 className="h-6 w-6 text-indigo-600" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                Total Samples
              </dt>
              <dd className="text-2xl font-semibold text-gray-900">
                {count.toLocaleString()}
              </dd>
              <dd className="text-xs text-gray-500">
                Total samples logged in the system
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}