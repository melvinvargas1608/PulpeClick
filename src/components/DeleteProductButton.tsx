import { useState } from 'react';
import ConfirmDialog from './ui/ConfirmDialog';
import Alert from './ui/Alert';
import TrashIcon from './icons/TrashIcon';

interface Props {
  productId: string;
  productName: string;
  onDeleted?: () => void;
}

export default function DeleteProductButton({ productId, productName, onDeleted }: Props) {
  const handleReload = onDeleted || (() => window.location.reload());
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    setShowDialog(false);
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/delete-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || 'Error al eliminar el producto');
        setLoading(false);
        return;
      }

      handleReload();
    } catch {
      setError('Error de conexión al intentar eliminar');
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setShowDialog(true)}
        className="text-gray-400 hover:text-red-600 p-1.5 transition-colors"
        title="Eliminar"
      >
        <TrashIcon size={14} />
      </button>

      {error && <Alert variant="error">{error}</Alert>}

      <ConfirmDialog
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        onConfirm={handleDelete}
        title="Eliminar producto"
        message={`¿Estás seguro de eliminar "${productName}"? Esta acción no se puede deshacer.`}
        loading={loading}
      />
    </>
  );
}
