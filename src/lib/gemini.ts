const GEMINI_API_KEY = import.meta.env.GEMINI_API_KEY
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta'

interface GenerateOptions {
  prompt: string
  model?: string
  maxTokens?: number
}

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
    finishReason?: string;
  }>;
}

function isGeminiResponse(data: unknown): data is GeminiResponse {
  if (typeof data !== 'object' || data === null) return false;
  const d = data as Record<string, unknown>;
  if (!Array.isArray(d.candidates)) return false;
  // At least one candidate with content and parts
  for (const c of d.candidates) {
    if (typeof c !== 'object' || c === null) continue;
    const candidate = c as Record<string, unknown>;
    if (typeof candidate.content === 'object' && candidate.content !== null) {
      const content = candidate.content as Record<string, unknown>;
      if (Array.isArray(content.parts)) return true;
    }
  }
  return false;
}

function parseGeminiResponse(data: unknown): string {
  if (!isGeminiResponse(data)) {
    throw new Error('Gemini API returned invalid response');
  }
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

export async function generateContent({ prompt, model = 'gemini-3.5-flash-lite', maxTokens = 500 }: GenerateOptions): Promise<string> {
  const url = `${GEMINI_BASE_URL}/models/${model}:generateContent?key=${GEMINI_API_KEY}`
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: maxTokens, temperature: 0.85 }
    })
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Gemini API error: ${error}`)
  }

  const data = await response.json()
  return parseGeminiResponse(data)
}

export function productDescriptionPrompt(productName: string, category: string, price?: number, details?: string): string {
  return `Actúa como un redactor de contenido experto en comercio electrónico, especializado en optimización de fichas de producto al estilo Amazon. Vas a escribir la descripción de un producto vendido por un emprendedor en Honduras.

Generá entre 3 y 5 viñetas breves, una por línea, sin párrafo introductorio ni texto adicional. Máximo 50 palabras en total.

Pautas:
- Cada viñeta destaca un beneficio o característica clave del producto.
- Usá frases cortas y directas, con tono profesional, claro y vendedor.
- NO uses emojis.
- NO uses guiones, asteriscos ni ningún símbolo de viñeta (•, -, *). Solo el texto de cada punto en una línea nueva.
- NO menciones el precio bajo ninguna circunstancia.
${details ? '- SÍ usá las notas del vendedor como datos reales del producto: material, tamaño, color, usos específicos.' : '- Describí características concretas: material, tamaño, usos prácticos.'}

Producto: ${productName}
Categoría: ${category}${details ? `\nNotas del vendedor: ${details}` : ''}

Descripción (viñetas, una por línea):`
}

export function suggestPricePrompt(productName: string, category: string, description: string): string {
  return `Eres un asesor de precios para productos en Honduras. Basado en la descripción y categoría, sugiere un precio de venta justo en Lempiras (L). Solo responde con el número (ej: 350). No escribas nada más.\n\nProducto: ${productName}\nCategoría: ${category}\nDescripción: ${description}\n\nPrecio sugerido (solo número):`
}
