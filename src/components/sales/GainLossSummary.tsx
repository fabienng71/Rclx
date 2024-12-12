import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency } from '../../utils/format';
import { cn } from '../../utils/cn';

interface GainLossSummaryProps {
  gains: number;
  losses: number;
  gainCount: number;
  lossCount: number;
}

export function GainLossSummary({ gains, losses, gainCount, lossCount }: GainLossSummaryProps) {
  const netChange = gains + losses; // losses are already negative

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Gains */}
      <div className="bg-green-50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-green-600">Total Gains</p>
            <p className="mt-1 text-2xl font-semibold text-green-700">
              {formatCurrency(gains)}
            </p>
            <p className="mt-1 text-sm text-green-600">
              {gainCount} customers gained
            </p>
          </div>
          <div className="bg-green-100 rounded-full p-3">
            <TrendingUp className="h-6 w-6 text-green-600" />
          </div>
        </div>
      </div>

      {/* Losses */}
      <div className="bg-red-50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-red-600">Total Losses</p>
            <p className="mt-1 text-2xl font-semibold text-red-700">
              {formatCurrency(Math.abs(losses))}
            </p>
            <p className="mt-1 text-sm text-red-600">
              {lossCount} customers lost
            </p>
          </div>
          <div className="bg-red-100 rounded-full p-3">
            <TrendingDown className="h-6 w-6 text-red-600" />
          </div>
        </div>
      </div>

      {/* Net Change */}
      <div className={cn(
        "rounded-lg p-4",
        netChange >= 0 ? "bg-green-50" : "bg-red-50"
      )}>
        <div className="flex items-center justify-between">
          <div>
            <p className={cn(
              "text-sm font-medium",
              netChange >= 0 ? "text-green-600" : "text-red-600"
            )}>Net Change</p>
            <p className={cn(
              "mt-1 text-2xl font-semibold",
              netChange >= 0 ? "text-green-700" : "text-red-700"
            )}>
              {formatCurrency(Math.abs(netChange))}
            </p>
            <p className={cn(
              "mt-1 text-sm",
              netChange >= 0 ? "text-green-600" : "text-red-600"
            )}>
              {netChange >= 0 ? 'Net positive' : 'Net negative'}
            </p>
          </div>
          <div className={cn(
            "rounded-full p-3",
            netChange >= 0 ? "bg-green-100" : "bg-red-100"
          )}>
            {netChange >= 0 ? (
              <TrendingUp className={cn(
                "h-6 w-6",
                netChange >= 0 ? "text-green-600" : "text-red-600"
              )} />
            ) : (
              <TrendingDown className={cn(
                "h-6 w-6",
                netChange >= 0 ? "text-green-600" : "text-red-600"
              )} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}