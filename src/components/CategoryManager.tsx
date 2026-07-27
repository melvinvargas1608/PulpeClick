import { useState, useEffect, type FormEvent } from 'react'
import { supabaseClient } from '../lib/supabase-client'
import Spinner from './ui/Spinner'
import ConfirmDialog from './ui/ConfirmDialog'
import EditIcon from './icons/EditIcon'
import TrashIcon from './icons/TrashIcon'

interface Category {
  id: string
  name: string
}

export default function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [newName, setNewName] = useState('')
  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    setLoading(true)
    setError('')

    const { data, error: fetchError } = await supabaseClient
      .from('categories')
      .select('*')
      .order('name')

    if (fetchError) {
      setError('Error al cargar las categorías')
      setLoading(false)
      return
    }

    setCategories(data || [])
    setLoading(false)
  }

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault()
    const name = newName.trim()
    if (!name) return

    setAdding(true)
    const { error: addError } = await supabaseClient
      .from('categories')
      .insert({ name })

    if (addError) {
      if (addError.code === '23505') {
        setError('Esa categoría ya existe')
      } else {
        setError('Error al crear la categoría')
      }
      setAdding(false)
      return
    }

    setNewName('')
    setError('')
    setAdding(false)
    fetchCategories()
  }

  const handleEdit = (cat: Category) => {
    setEditingId(cat.id)
    setEditName(cat.name)
  }

  const handleSaveEdit = async (id: string) => {
    const name = editName.trim()
    if (!name) return

    setSaving(true)
    const { error: saveError } = await supabaseClient
      .from('categories')
      .update({ name })
      .eq('id', id)

    if (saveError) {
      if (saveError.code === '23505') {
        setError('Ya existe una categoría con ese nombre')
      } else {
        setError('Error al actualizar')
      }
      setSaving(false)
      return
    }

    setEditingId(null)
    setEditName('')
    setError('')
    setSaving(false)
    fetchCategories()
  }

  const handleDeleteClick = (cat: Category) => {
    setDeleteTarget({ id: cat.id, name: cat.name })
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    const id = deleteTarget.id
    setDeleteTarget(null)
    setDeletingId(id)
    const { error: delError } = await supabaseClient
      .from('categories')
      .delete()
      .eq('id', id)

    if (delError) {
      setError('Error al eliminar la categoría')
      setDeletingId(null)
      return
    }

    setDeletingId(null)
    fetchCategories()
  }

  if (loading) {
    return <Spinner />
  }

  return (
    <div className="space-y-6">
      {/* Add form */}
      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="flex-1 px-3 py-3 border border-gray-300 rounded-xl text-base focus:ring-2 focus:ring-brand focus:border-brand outline-none"
          placeholder="Nueva categoría..."
          required
        />
        <button
          type="submit"
          disabled={adding || !newName.trim()}
          className="bg-brand hover:bg-brand-dark disabled:bg-brand-light text-white font-semibold py-3 px-4 rounded-xl transition-colors shrink-0"
        >
          {adding ? '...' : 'Agregar'}
        </button>
      </form>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Category list */}
      {categories.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
          <p className="text-yellow-800 text-sm">No hay categorías creadas aún</p>
        </div>
      ) : (
        <div className="space-y-2">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between gap-3"
            >
              {editingId === cat.id ? (
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand focus:border-brand outline-none"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => handleSaveEdit(cat.id)}
                    disabled={saving || !editName.trim()}
                    className="text-sm font-medium text-brand hover:text-brand-dark disabled:text-gray-300 px-2"
                  >
                    Guardar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null)
                      setEditName('')
                    }}
                    className="text-sm text-gray-400 hover:text-gray-600 px-2"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <>
                  <span className="text-sm font-medium text-gray-900">{cat.name}</span>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleEdit(cat)}
                      className="text-gray-400 hover:text-brand p-1 transition-colors"
                      title="Editar"
                    >
                      <EditIcon size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteClick(cat)}
                      disabled={deletingId === cat.id}
                      className="text-gray-400 hover:text-red-600 p-1 disabled:text-gray-200 transition-colors"
                      title="Eliminar"
                    >
                      <TrashIcon size={14} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Eliminar categoría"
        message={`¿Estás seguro de eliminar la categoría "${deleteTarget?.name}"?`}
        loading={deletingId === deleteTarget?.id}
      />
    </div>
  )
}
