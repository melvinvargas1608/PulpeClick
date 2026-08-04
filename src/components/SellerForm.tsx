import { useState, useEffect, type FormEvent } from 'react'
import { supabaseClient } from '../lib/supabase-client'
import { generateSlug } from '../lib/slug'
import { buildWhatsAppUrl, sanitizePhoneInput } from '../lib/phone'
import { uploadBannerImage, deleteBannerImage } from '../lib/storage'
import { COUNTRY_OPTIONS } from '../lib/countryFlags'
import BannerUploader from './BannerUploader'
import Spinner from './ui/Spinner'
import Alert from './ui/Alert'

export default function SellerForm() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [slug, setSlug] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [editId, setEditId] = useState<string | null>(null)
  const [fetchingSeller, setFetchingSeller] = useState(false)
  const [bannerFile, setBannerFile] = useState<File | null>(null)
  const [bannerPreview, setBannerPreview] = useState<string | null>(null)
  const [bannerUrl, setBannerUrl] = useState<string | null>(null)
  const [country, setCountry] = useState('Honduras')
  const [otherCountry, setOtherCountry] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const id = params.get('id')
    if (id) {
      setEditId(id)
      fetchSeller(id)
    }
  }, [])

  const fetchSeller = async (id: string) => {
    setFetchingSeller(true)
    const { data, error: fetchError } = await supabaseClient
      .from('sellers')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !data) {
      setError('Error al cargar los datos del vendedor')
      setFetchingSeller(false)
      return
    }

    setName(data.name)
    setPhone(data.phone || '')
    setSlug(data.slug)
    setBannerUrl(data.banner_url || null)
    const savedCountry = data.country || 'Honduras'
    setCountry(COUNTRY_OPTIONS.includes(savedCountry as typeof COUNTRY_OPTIONS[number]) ? savedCountry : 'Otro')
    if (!COUNTRY_OPTIONS.includes(savedCountry as typeof COUNTRY_OPTIONS[number])) {
      setOtherCountry(savedCountry)
    }
    setFetchingSeller(false)
  }

  const handleNameChange = (value: string) => {
    setName(value)
    if (!editId) {
      setSlug(generateSlug(value))
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    if (!name.trim()) {
      setError('El nombre es obligatorio')
      return
    }

    if (!slug.trim()) {
      setError('El slug es obligatorio')
      return
    }

    const finalCountry = country === 'Otro' ? otherCountry.trim() : country
    if (!finalCountry) {
      setError('El país es obligatorio')
      return
    }

    setLoading(true)

    // Handle banner: upload new, or delete removed one
    let finalBannerUrl = bannerUrl

    if (bannerFile) {
      // Upload new banner
      const uploadedUrl = await uploadBannerImage(bannerFile, slug.trim().toLowerCase())
      if (uploadedUrl) {
        // Delete old banner if it existed
        if (bannerUrl) {
          await deleteBannerImage(bannerUrl)
        }
        finalBannerUrl = uploadedUrl
      } else {
        setError('Error al subir el banner. Intentá de nuevo.')
        setLoading(false)
        return
      }
    } else if (bannerPreview === null && bannerUrl) {
      // Banner was removed
      await deleteBannerImage(bannerUrl)
      finalBannerUrl = null
    }

    const sellerData = {
      name: name.trim(),
      phone: phone.trim() || null,
      whatsapp_url: buildWhatsAppUrl(phone),
      slug: slug.trim().toLowerCase(),
      banner_url: finalBannerUrl,
      country: finalCountry,
    }

    let result
    if (editId) {
      result = await supabaseClient
        .from('sellers')
        .update(sellerData)
        .eq('id', editId)
    } else {
      result = await supabaseClient
        .from('sellers')
        .insert(sellerData)
    }

    if (result.error) {
      setError(`Error al guardar: ${result.error.message}`)
      setLoading(false)
      return
    }

    window.location.href = '/admin/vendedores'
  }

  if (fetchingSeller) {
    return <Spinner size="md" />
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Nombre completo *
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          className="w-full px-3 py-3 border border-gray-300 rounded-xl text-base focus:ring-2 focus:ring-brand focus:border-brand outline-none"
          placeholder="Ej: María García"
          required
          minLength={3}
        />
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          Teléfono
        </label>
        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(sanitizePhoneInput(e.target.value))}
          className="w-full px-3 py-3 border border-gray-300 rounded-xl text-base focus:ring-2 focus:ring-brand focus:border-brand outline-none"
          placeholder="+504 1234-5678"
        />
        <p className="text-xs text-gray-400 mt-1">
          Incluí el código de país si estás fuera de Honduras (ej: +503, +506)
        </p>
        {phone && (
          <p className="text-xs text-gray-400 mt-1">
            WhatsApp: {buildWhatsAppUrl(phone)}
          </p>
        )}
      </div>

      {/* Slug */}
      <div>
        <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
          Slug (URL) *
        </label>
        <input
          id="slug"
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="w-full px-3 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-brand focus:border-brand outline-none font-mono"
          placeholder="maria-garcia"
          required
        />
        <p className="text-xs text-gray-400 mt-1">
          Se genera automáticamente, pero podés editarlo
        </p>
      </div>

      {/* Country */}
      <div>
        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
          País *
        </label>
        <select
          id="country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="w-full px-3 py-3 border border-gray-300 rounded-xl text-base focus:ring-2 focus:ring-brand focus:border-brand outline-none bg-white"
          required
        >
          {COUNTRY_OPTIONS.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        {country === 'Otro' && (
          <input
            type="text"
            value={otherCountry}
            onChange={(e) => setOtherCountry(e.target.value)}
            className="w-full px-3 py-3 border border-gray-300 rounded-xl text-base focus:ring-2 focus:ring-brand focus:border-brand outline-none mt-2"
            placeholder="Escribí el nombre del país"
            required
          />
        )}
      </div>

      {/* Banner */}
      <BannerUploader
        imagePreview={bannerPreview}
        onImageChange={(file, preview) => {
          setBannerFile(file)
          setBannerPreview(preview)
        }}
        disabled={loading}
        existingUrl={bannerUrl}
      />

      {/* Error */}
      {error && <Alert variant="error">{error}</Alert>}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-brand hover:bg-brand-dark disabled:bg-brand-light text-white font-semibold py-3 px-6 rounded-xl transition-colors min-h-11"
      >
        {loading ? 'Guardando...' : editId ? 'Actualizar Vendedor' : 'Registrar Vendedor'}
      </button>
    </form>
  )
}
