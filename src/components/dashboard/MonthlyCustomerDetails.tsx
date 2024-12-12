import React from 'react';
import { formatCurrency } from '../../utils/format';
import type { Sale } from '../../types';

interface CustomerSummary {
  customerName: string;
  totalSales: number;
  invoiceCount: number;
}

interface MonthlyCustomerDetailsProps {
  sales: Sale[];
}

export function MonthlyCustomerDetails({ sales }: MonthlyCustomerDetailsProps) {
  // Aggregate sales by customer
  const customerSummaries = sales.reduce((acc, sale) => {
    if (!acc[sale.companyName]) {
      acc[sale.companyName] = {
        customerName: sale.companyName,
        totalSales: 0,
        invoices: new Set<string>(),
      };
    }
    
    acc[sale.companyName].totalSales += sale.total;
    acc[sale.companyName].invoices.add(sale.id);
    
    return acc;
  }, {} as Record<string, {
    customerName: string;
    totalSales: number;
    invoices: Set<string>;
  }>);

  const summaries: CustomerSummary[] = Object.values(customerSummaries)
    .map(({ customerName, totalSales, invoices }) => ({
      customerName,
      totalSales,
      invoiceCount: invoices.size,
    }))
    .sort((a, b) => b.totalSales - a.totalSales);

  return (
    <div className="divide-y divide-gray-200">
      <div className="px-4 py-3 bg-gray-50">
        <div className="grid grid-cols-3 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
          <div>Customer Name</div>
          <div className="text-right">Total Sales</div>
          <div className="text-right">Total Invoices</div>
        </div>
      </div>
      <div className="divide-y divide-gray-200">
        {summaries.map((summary) => (
          <div
            key={summary.customerName}
            className="px-4 py-3 hover:bg-gray-50"
          >
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="font-medium text-gray-900">
                {summary.customerName}
              </div>
              <div className="text-right text-gray-900">
                {formatCurrency(summary.totalSales)}
              </div>
              <div className="text-right text-gray-500">
                {summary.invoiceCount}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}