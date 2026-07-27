import type { APIRoute } from 'astro'
import { generateContent, productDescriptionPrompt } from '../../lib/gemini'

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json()
    const { productName, category, price, details } = body

    if (!productName || !category) {
      return new Response(JSON.stringify({ error: 'Faltan productName o category' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const prompt = productDescriptionPrompt(productName, category, price, details)
    const description = await generateContent({ prompt, maxTokens: 300 })

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
