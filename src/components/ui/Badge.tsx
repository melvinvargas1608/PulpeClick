import type { ReactNode } from 'react';

type BadgeVariant =
  | 'category'   // categorías de producto — brand-light
  | 'premium'    // badges premium — deep
  | 'promo'      // promociones / descuentos — hot
  | 'info'       // informativo — gray
  | 'success'    // éxito — green
  | 'warning';   // advertencia — amber

interface Props {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  category: 'bg-brand-light text-brand',
  premium: 'bg-deep-light text-deep font-semibold',
  promo: 'bg-hot-light text-hot font-semibold',
  info: 'bg-gray-100 text-gray-600',
  success: 'bg-emerald-50 text-emerald-700',
  warning: 'bg-amber-50 text-amber-700',
};

export default function Badge({
  children,
  variant = 'category',
  className = '',
}: Props) {
  return (
    <span
      className={`inline-flex items-center text-xs px-2 py-0.5 rounded-full
        font-medium ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
