import type { APIRoute } from 'astro'
import { generateContent, suggestPricePrompt } from '../../lib/gemini'

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json()
    const { productName, category, description } = body

    if (!productName || !category || !description) {
      return new Response(JSON.stringify({ error: 'Faltan datos requeridos' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const prompt = suggestPricePrompt(productName, category, description)
    const priceText = await generateContent({ prompt, maxTokens: 10 })

    const price = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0

    return new Response(JSON.stringify({ price }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error suggesting price:', error)
    return new Response(JSON.stringify({ error: 'Error al sugerir precio' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
