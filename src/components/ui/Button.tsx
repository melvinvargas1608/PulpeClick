import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'cta' | 'secondary' | 'ghost' | 'whatsapp';
type ButtonSize = 'sm' | 'md' | 'lg';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-brand text-white hover:bg-brand-dark active:bg-brand-dark shadow-sm',
  cta: 'bg-hot text-white hover:bg-hot-dark active:bg-hot-dark shadow-sm font-semibold',
  secondary:
    'bg-brand-light text-brand hover:bg-brand hover:text-white border border-brand/20',
  ghost: 'text-gray-600 hover:text-brand hover:bg-brand-light',
  whatsapp: 'bg-hot text-white hover:bg-hot-dark active:bg-hot-dark shadow-sm font-semibold',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-5 py-2.5 text-sm gap-2',
  lg: 'px-6 py-3 text-base gap-2.5',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: Props) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center rounded-btn font-medium
        transition-all duration-200 focus:outline-none focus-visible:ring-2
        focus-visible:ring-brand/40 focus-visible:ring-offset-2
        disabled:opacity-50 disabled:pointer-events-none
        ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
