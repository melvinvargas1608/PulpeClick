import type { APIRoute } from 'astro'
import { generateContent, productDescriptionPrompt, productDescriptionPromptWithImage } from '../../lib/gemini'

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
    const prompt = hasImage
      ? productDescriptionPromptWithImage(productName, category, price, details)
      : productDescriptionPrompt(productName, category, price, details)

    const description = await generateContent({
      prompt,
      maxTokens: 300,
      ...(hasImage ? { imageBase64, mimeType } : {})
    })

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
