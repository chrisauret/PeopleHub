import { type LabelHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {}

export function Label({ className, ...props }: LabelProps) {
  return (
    <label
      className={cn(
        'text-sm font-medium text-slate-700 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        className
      )}
      {...props}
    />
  );
}
