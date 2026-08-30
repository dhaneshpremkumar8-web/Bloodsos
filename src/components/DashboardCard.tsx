import type { ReactNode } from 'react';
import { classNames } from '@/utils/helpers';
import { TrendingUp, TrendingDown, type LucideIcon } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: { value: string; up: boolean };
  color?: 'primary' | 'success' | 'info' | 'warning' | 'accent';
  subtitle?: string;
}

const colorMap = {
  primary: 'bg-primary-50 text-primary-600',
  success: 'bg-success-50 text-success-600',
  info: 'bg-info-50 text-info-600',
  warning: 'bg-warning-50 text-warning-600',
  accent: 'bg-accent-50 text-accent-600',
};

export default function DashboardCard({
  title,
  value,
  icon: Icon,
  trend,
  color = 'primary',
  subtitle,
}: DashboardCardProps) {
  return (
    <div className="card card-hover p-5 animate-slide-up">
      <div className="flex items-center justify-between">
        <div className={classNames('flex h-11 w-11 items-center justify-center rounded-lg', colorMap[color])}>
          <Icon className="h-5 w-5" />
        </div>
        {trend && (
          <span
            className={classNames(
              'flex items-center gap-1 text-xs font-semibold',
              trend.up ? 'text-success-600' : 'text-accent-600'
            )}
          >
            {trend.up ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
            {trend.value}
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="mt-0.5 text-sm font-medium text-gray-500">{title}</p>
        {subtitle && <p className="mt-0.5 text-xs text-gray-400">{subtitle}</p>}
      </div>
    </div>
  );
}
