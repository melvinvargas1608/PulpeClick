import { useState, useEffect } from 'react'
import { supabaseClient } from '../lib/supabase-client'
import Spinner from './ui/Spinner'
import Alert from './ui/Alert'
import EmptyState from './ui/EmptyState'
import Switch from './ui/Switch'
import EditIcon from './icons/EditIcon'

interface Seller {
  id: string
  name: string
  phone: string | null
  slug: string
  whatsapp_url: string | null
  is_active: boolean
  created_at: string
}

export default function SellerList() {
  const [sellers, setSellers] = useState<Seller[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [togglingIds, setTogglingIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchSellers()
  }, [])

  const fetchSellers = async () => {
    setLoading(true)
    setError('')

    const { data, error: fetchError } = await supabaseClient
      .from('sellers')
      .select('*')
      .order('created_at', { ascending: false })

    if (fetchError) {
      setError('Error al cargar los vendedores')
      setLoading(false)
      return
    }

    setSellers(data || [])
    setLoading(false)
  }

  const toggleSellerActive = async (id: string, current: boolean) => {
    setTogglingIds(prev => new Set(prev).add(id))

    // Optimistic update
    setSellers(prev =>
      prev.map(s => s.id === id ? { ...s, is_active: !current } : s)
    )

    const { error: updateError } = await supabaseClient
      .from('sellers')
      .update({ is_active: !current })
      .eq('id', id)

    if (updateError) {
      // Revert on error
      setSellers(prev =>
        prev.map(s => s.id === id ? { ...s, is_active: current } : s)
      )
      setError('Error al actualizar el estado del catálogo')
    }

    setTogglingIds(prev => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }

  if (loading) {
    return <Spinner />
  }

  if (error) {
    return (
      <Alert variant="error">
        <p>{error}</p>
        <button
          type="button"
          onClick={fetchSellers}
          className="mt-2 text-brand underline text-sm"
        >
          Reintentar
        </button>
      </Alert>
    )
  }

  if (sellers.length === 0) {
    return (
      <EmptyState
        message="No hay vendedores registrados aún"
        actionLabel="Registrar primer vendedor"
        actionHref="/admin/nuevo-vendedor"
      />
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {sellers.map((seller) => (
        <div
          key={seller.id}
          className={`bg-white border rounded-xl p-4 transition-shadow ${seller.is_active ? 'border-gray-200 hover:shadow-md' : 'border-gray-100 bg-gray-50/50'}`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className={`font-semibold truncate ${seller.is_active ? 'text-gray-900' : 'text-gray-400'}`}>
                {seller.name}
              </h3>
              {seller.phone && (
                <p className={`text-sm mt-0.5 ${seller.is_active ? 'text-gray-500' : 'text-gray-400'}`}>{seller.phone}</p>
              )}
              <p className="text-xs text-gray-400 mt-1 font-mono">
                /catalogo/{seller.slug}
              </p>
            </div>
            <div className="shrink-0 pt-0.5">
              <Switch
                checked={seller.is_active}
                onChange={() => toggleSellerActive(seller.id, seller.is_active)}
                disabled={togglingIds.has(seller.id)}
                label=""
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5 mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <a
                href={`/catalogo/${seller.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center text-sm font-medium text-brand hover:text-brand-dark py-2 min-h-[2.75rem] flex items-center justify-center rounded-lg hover:bg-brand-light transition-colors"
              >
                Ver catálogo
              </a>
              <a
                href={`/admin/nuevo-producto?client=${seller.slug}`}
                className="flex-1 text-center text-sm font-medium bg-brand text-white py-2 px-3 rounded-lg hover:bg-brand-dark transition-colors min-h-[2.75rem] flex items-center justify-center"
              >
                + Producto
              </a>
              <a
                href={`/admin/nuevo-vendedor?id=${seller.id}`}
                className="text-sm text-gray-400 hover:text-gray-600 py-2 px-2 min-h-[2.75rem] flex items-center justify-center rounded-lg hover:bg-gray-50 transition-colors"
                title="Editar"
              >
                <EditIcon size={14} />
              </a>
            </div>
            <a
              href={`/admin/productos?seller=${seller.slug}`}
              className="w-full text-center text-sm font-medium text-gray-600 hover:text-gray-800 py-2 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
            >
              Ver productos
            </a>
          </div>
        </div>
      ))}
    </div>
  )
}
