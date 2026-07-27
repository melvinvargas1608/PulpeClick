import { useRef, useState } from 'react'
import { toPng } from 'html-to-image'

interface PostImageGeneratorProps {
  productName: string
  price: number
  imageUrl?: string
  postText: string
  sellerName?: string
  description?: string
}

export default function PostImageGenerator({
  productName,
  price,
  imageUrl,
  postText,
  sellerName,
  description,
}: PostImageGeneratorProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null)

  const handleDownload = async () => {
    if (!cardRef.current) return
    setIsGenerating(true)
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 0.95,
        pixelRatio: 2,
      })
      setGeneratedUrl(dataUrl)

      const link = document.createElement('a')
      link.download = `${productName.replace(/\s+/g, '-').toLowerCase()}-whatsapp.png`
      link.href = dataUrl
      link.click()
    } catch (error) {
      console.error('Error generating image:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Preview card */}
      <div className="flex justify-center">
        <div
          ref={cardRef}
          className="w-[320px] sm:w-[400px] bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200 grid"
          style={{ aspectRatio: '1/1', gridTemplateRows: '55% 45%' }}
        >
          {/* Product image — top 55% */}
          <div className="bg-white overflow-hidden">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={productName}
                className="w-full h-full object-contain p-2"
                crossOrigin="anonymous"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-brand-light to-brand/30 flex items-center justify-center">
                <span className="text-6xl">📦</span>
              </div>
            )}
          </div>

          {/* Product info — bottom 45% */}
          <div className="p-3 sm:p-4 flex flex-col justify-between overflow-hidden">
            <div className="flex-1 overflow-hidden">
              <h3 className="font-bold text-sm sm:text-base text-gray-900 leading-tight mb-1 line-clamp-1">
                {productName}
              </h3>
              <p className="text-[10px] sm:text-xs text-gray-600 leading-snug line-clamp-2 mb-1">
                {description || postText}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <span className="text-base sm:text-lg font-bold text-hot">
                L {price.toFixed(2)}
              </span>
              <span className="text-[9px] sm:text-[10px] text-gray-400">
                WhatsApp 💬
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Download button */}
      <button
        onClick={handleDownload}
        disabled={isGenerating}
        className="w-full py-3 px-6 bg-hot hover:bg-hot-dark disabled:bg-gray-300 text-white font-semibold rounded-full transition-colors flex items-center justify-center gap-2"
      >
        {isGenerating ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Generando...
          </>
        ) : generatedUrl ? (
          '📥 Descargar de nuevo'
        ) : (
          '📥 Descargar imagen para WhatsApp'
        )}
      </button>

      {generatedUrl && (
        <p className="text-xs text-brand text-center">
          ✅ ¡Imagen lista! Ya se descargó. Copiala y pegala en WhatsApp.
        </p>
      )}
    </div>
  )
}
