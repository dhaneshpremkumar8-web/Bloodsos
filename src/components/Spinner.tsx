import { Loader2 } from 'lucide-react';
import { classNames } from '@/utils/helpers';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

export default function Spinner({ size = 'md', className, label }: SpinnerProps) {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-10 w-10',
  };

  return (
    <div className={classNames('flex flex-col items-center justify-center gap-3', className)}>
      <Loader2 className={classNames(sizes[size], 'animate-spin text-primary-600')} />
      {label && <p className="text-sm text-gray-500">{label}</p>}
    </div>
  );
}

export function FullPageSpinner({ label }: { label?: string }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Spinner size="lg" label={label} />
    </div>
  );
}
