import { useState, useEffect } from 'react'
import { supabaseClient } from '../lib/supabase-client'
import Spinner from './ui/Spinner'
import Alert from './ui/Alert'
import EmptyState from './ui/EmptyState'

interface Seller {
  id: string
  name: string
  slug: string
  phone: string | null
}

export default function SelectSeller() {
  const [sellers, setSellers] = useState<Seller[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadSellers()
  }, [])

  const loadSellers = async () => {
    try {
      const { data, error } = await supabaseClient
        .from('sellers')
        .select('id, name, slug, phone')
        .order('name', { ascending: true })

      if (error) {
        setError('Error al cargar vendedores')
        setLoading(false)
        return
      }

      setSellers(data || [])
      setLoading(false)
    } catch (err) {
      console.error('Error al cargar vendedores:', err)
      setError('Error al cargar vendedores. Verificá tu conexión.')
      setLoading(false)
    }
  }

  if (loading) {
    return <Spinner size="md" />
  }

  if (error) {
    return <Alert variant="error">{error}</Alert>
  }

  if (sellers.length === 0) {
    return (
      <EmptyState
        message="No hay vendedores registrados aún."
        actionLabel="Registrar primer vendedor"
        actionHref="/admin/nuevo-vendedor"
      />
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {sellers.map((seller) => (
        <a
          key={seller.id}
          href={`/admin/nuevo-producto?client=${seller.slug}`}
          className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-brand/40 transition-all"
        >
          <div className="w-10 h-10 bg-brand-light rounded-full flex items-center justify-center text-brand font-bold text-sm flex-shrink-0">
            {seller.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{seller.name}</h3>
            {seller.phone && (
              <p className="text-xs text-gray-500">{seller.phone}</p>
            )}
          </div>
          <span className="text-brand/60 text-lg flex-shrink-0">→</span>
        </a>
      ))}
    </div>
  )
}
