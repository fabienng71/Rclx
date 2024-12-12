import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { formatCurrency } from '../../utils/format';
import type { Sale } from '../../types';

interface SalesPerformanceChartProps {
  sales: Sale[];
}

export function SalesPerformanceChart({ sales }: SalesPerformanceChartProps) {
  const chartData = useMemo(() => {
    const monthlyData = new Map<string, {
      month: string;
      total: number;
      salesByPerson: Record<string, number>;
    }>();

    sales.forEach(sale => {
      const date = new Date(sale.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthLabel = date.toLocaleString('default', { month: 'short' });

      if (!monthlyData.has(monthKey)) {
        monthlyData.set(monthKey, {
          month: `${monthLabel} ${date.getFullYear()}`,
          total: 0,
          salesByPerson: {}
        });
      }

      const monthData = monthlyData.get(monthKey)!;
      monthData.total += sale.total;

      if (!monthData.salesByPerson[sale.salesPersonCode]) {
        monthData.salesByPerson[sale.salesPersonCode] = 0;
      }
      monthData.salesByPerson[sale.salesPersonCode] += sale.total;
    });

    return Array.from(monthlyData.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([_, data]) => ({
        ...data,
        id: crypto.randomUUID() // Add unique ID for React keys
      }));
  }, [sales]);

  const salespeople = useMemo(() => {
    const uniqueSalespeople = new Set<string>();
    sales.forEach(sale => uniqueSalespeople.add(sale.salesPersonCode));
    return Array.from(uniqueSalespeople).sort();
  }, [sales]);

  // Calculate baseline (average monthly sales for the year)
  const baseline = useMemo(() => {
    if (chartData.length === 0) return 0;
    const totalSales = chartData.reduce((sum, data) => sum + data.total, 0);
    return totalSales / chartData.length;
  }, [chartData]);

  const colors = [
    '#4f46e5', // indigo-600
    '#059669', // emerald-600
    '#dc2626', // red-600
    '#d97706', // amber-600
    '#7c3aed', // violet-600
    '#2563eb', // blue-600
    '#db2777', // pink-600
  ];

  const chartStyle = {
    fontSize: '10px'
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    const total = payload[0].value;
    const isAboveBaseline = total > baseline;

    return (
      <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-lg">
        <p className="font-medium text-gray-900">{label}</p>
        <p className={`text-sm ${isAboveBaseline ? 'text-green-600' : 'text-red-600'}`}>
          {formatCurrency(total)}
        </p>
        <p className="text-xs text-gray-500">
          {isAboveBaseline ? 'Above' : 'Below'} baseline by {formatCurrency(Math.abs(total - baseline))}
        </p>
        {payload.slice(1).map((entry: any) => (
          <p key={entry.dataKey} className="text-xs" style={{ color: entry.color }}>
            {entry.name}: {formatCurrency(entry.value)}
          </p>
        ))}
      </div>
    );
  };

  const CustomDot = ({ cx, cy, value }: any) => {
    if (!cx || !cy) return null;
    return (
      <circle
        cx={cx}
        cy={cy}
        r={4}
        fill={value > baseline ? '#10B981' : '#EF4444'}
        stroke={value > baseline ? '#059669' : '#DC2626'}
      />
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Sales Performance</h3>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="month" 
              style={chartStyle}
            />
            <YAxis 
              tickFormatter={(value) => formatCurrency(value)}
              width={80}
              style={chartStyle}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <ReferenceLine 
              y={baseline} 
              stroke="#9CA3AF" 
              strokeDasharray="3 3"
              label={{ 
                value: 'Baseline', 
                position: 'right',
                style: { fontSize: '10px' }
              }} 
            />
            <Line
              type="monotone"
              dataKey="total"
              name="Total Sales"
              stroke="#4f46e5"
              strokeWidth={2}
              dot={<CustomDot />}
            />
            {salespeople.map((person, index) => (
              <Line
                key={person}
                type="monotone"
                dataKey={`salesByPerson.${person}`}
                name={person}
                stroke={colors[index % colors.length]}
                strokeWidth={1}
                strokeDasharray="5 5"
                dot={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 text-sm text-gray-500">
        Baseline: {formatCurrency(baseline)} (Average monthly sales)
      </div>
    </div>
  );
}