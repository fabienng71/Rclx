import React from 'react';
import { DollarSign } from 'lucide-react';
import { formatCurrency } from '../../utils/format';
import { cn } from '../../utils/cn';

interface SalesWidgetProps {
  amount: number;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'success' | 'info' | 'warning';
}

export function SalesWidget({ 
  amount, 
  title, 
  subtitle,
  icon,
  variant = 'default'
}: SalesWidgetProps) {
  const variants = {
    default: {
      wrapper: 'bg-white hover:bg-gray-50',
      iconWrapper: 'bg-indigo-100',
      icon: 'text-indigo-600',
    },
    success: {
      wrapper: 'bg-green-50 hover:bg-green-100',
      iconWrapper: 'bg-green-100',
      icon: 'text-green-600',
    },
    info: {
      wrapper: 'bg-blue-50 hover:bg-blue-100',
      iconWrapper: 'bg-blue-100',
      icon: 'text-blue-600',
    },
    warning: {
      wrapper: 'bg-amber-50 hover:bg-amber-100',
      iconWrapper: 'bg-amber-100',
      icon: 'text-amber-600',
    },
  };

  const styles = variants[variant];

  return (
    <div className={cn(
      "overflow-hidden shadow rounded-lg transition-colors duration-200",
      styles.wrapper
    )}>
      <div className="p-5">
        <div className="flex items-center">
          <div className={cn(
            "flex-shrink-0 rounded-md p-3",
            styles.iconWrapper
          )}>
            {icon || <DollarSign className={cn("h-6 w-6", styles.icon)} />}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd className="text-lg font-semibold text-gray-900">
                {formatCurrency(Math.round(amount))}
              </dd>
              {subtitle && (
                <dd className="text-sm text-gray-500 mt-1">
                  {subtitle}
                </dd>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}