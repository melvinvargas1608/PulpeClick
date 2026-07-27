import type { ReactNode } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'default';
  loading?: boolean;
  children?: ReactNode;
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Eliminar',
  cancelLabel = 'Cancelar',
  variant = 'danger',
  loading = false,
  children,
}: Props) {
  if (!isOpen) return null;

  const confirmStyles = variant === 'danger'
    ? 'bg-red-600 hover:bg-red-700 disabled:bg-red-300'
    : 'bg-brand hover:bg-brand-dark disabled:bg-brand-light';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={loading ? undefined : onClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {title && (
          <div className="px-6 pt-6 pb-0">
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          </div>
        )}

        {/* Body */}
        <div className="px-6 py-4">
          <p className="text-sm text-gray-600 leading-relaxed">{message}</p>
          {children && <div className="mt-3">{children}</div>}
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 rounded-xl transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2.5 text-sm font-semibold text-white rounded-xl transition-colors ${confirmStyles} inline-flex items-center gap-2`}
          >
            {loading && (
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            )}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
