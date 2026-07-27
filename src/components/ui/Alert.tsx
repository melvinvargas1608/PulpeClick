import type { ReactNode } from 'react';

interface Props {
  variant?: 'error' | 'warning' | 'success';
  children: ReactNode;
}

const variantStyles = {
  error: 'bg-red-50 border-red-200 text-red-700',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  success: 'bg-green-50 border-green-200 text-green-800',
};

export default function Alert({ variant = 'error', children }: Props) {
  return (
    <div className={`border rounded-xl px-4 py-3 text-sm ${variantStyles[variant]}`}>
      {children}
    </div>
  );
}
