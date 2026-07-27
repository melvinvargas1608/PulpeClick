import { formatPrice } from '../../lib/format';

interface Props {
  amount: number | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses: Record<string, string> = {
  sm: 'text-base',
  md: 'text-lg',
  lg: 'text-xl',
  xl: 'text-2xl',
};

export default function Price({ amount, size = 'lg', className = '' }: Props) {
  if (amount === null || amount === undefined) {
    return <span className="text-gray-400 italic">Sin precio</span>;
  }

  return (
    <span
      className={`font-bold text-hot ${sizeClasses[size]} ${className}`}
      aria-label={`Precio: ${formatPrice(amount)}`}
    >
      {formatPrice(amount)}
    </span>
  );
}
