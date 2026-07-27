import type { ReactNode } from 'react';

interface Props {
  message: string;
  actionLabel?: string;
  actionHref?: string;
  children?: ReactNode;
}

export default function EmptyState({ message, actionLabel, actionHref, children }: Props) {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
      <p className="text-yellow-800 text-sm mb-3">{message}</p>
      {actionLabel && actionHref && (
        <a
          href={actionHref}
          className="inline-block bg-brand text-white text-sm font-semibold py-2 px-4 rounded-xl hover:bg-brand-dark transition-colors"
        >
          {actionLabel}
        </a>
      )}
      {children}
    </div>
  );
}
