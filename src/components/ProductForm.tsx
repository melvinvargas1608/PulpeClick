import ProductCreateForm from './ProductCreateForm';
import ProductEditForm from './ProductEditForm';

interface Props {
  editId?: string;
}

export default function ProductForm({ editId }: Props) {
  if (editId) {
    return <ProductEditForm editId={editId} />;
  }

  return <ProductCreateForm />;
}
