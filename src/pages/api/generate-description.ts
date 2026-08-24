import type { APIRoute } from 'astro'
import { generateContent, productDescriptionSystemPrompt, productDescriptionUserPrompt, sanitizeDescriptionOutput } from '../../lib/gemini'

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json()
    const { productName, category, price, details, imageBase64, mimeType } = body

    if (!productName || !category) {
      return new Response(JSON.stringify({ error: 'Faltan productName o category' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const hasImage = Boolean(imageBase64 && mimeType)

    const rawDescription = await generateContent({
      prompt: productDescriptionUserPrompt(productName, category, price, details, undefined, hasImage),
      systemPrompt: productDescriptionSystemPrompt(),
      maxTokens: 300,
      ...(hasImage ? { imageBase64, mimeType } : {})
    })

    // Limpia la salida: quita bloques de sistema, etiquetas HTML y texto inyectado
    const description = sanitizeDescriptionOutput(rawDescription)

    if (!description) {
      return new Response(JSON.stringify({ error: 'La IA no generó una descripción válida' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({ description }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error generating description:', error)
    return new Response(JSON.stringify({ error: 'Error al generar descripción' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
