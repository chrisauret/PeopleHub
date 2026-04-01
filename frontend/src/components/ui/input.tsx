import { type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        'flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm',
        'placeholder:text-slate-400',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  );
}
