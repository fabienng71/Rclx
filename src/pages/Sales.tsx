import React, { useState } from 'react';
import { DollarSign } from 'lucide-react';
import { SalesNav } from '../components/sales/SalesNav';
import { ItemsPerformance } from '../components/sales/ItemsPerformance';
import { CustomerPerformance } from '../components/sales/CustomerPerformance';

type SalesView = 'items' | 'customers';

export function Sales() {
  const [activeView, setActiveView] = useState<SalesView>('items');

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <div className="p-2 bg-indigo-100 rounded-lg">
          <DollarSign className="h-6 w-6 text-indigo-600" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-900">Sales Performance</h1>
      </div>

      <SalesNav activeView={activeView} onViewChange={setActiveView} />

      {activeView === 'items' ? <ItemsPerformance /> : <CustomerPerformance />}
    </div>
  );
}