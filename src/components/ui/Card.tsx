import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export default function Card({
  children,
  className = '',
  hover = true,
  onClick,
}: Props) {
  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={`bg-white border border-gray-200 rounded-card shadow-card
        ${hover ? 'transition-shadow duration-200 hover:shadow-card-hover' : ''}
        ${onClick ? 'cursor-pointer text-left w-full' : ''}
        ${className}`}
    >
      {children}
    </Component>
  );
}
