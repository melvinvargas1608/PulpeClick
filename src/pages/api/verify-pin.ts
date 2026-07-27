import type { APIRoute } from 'astro'

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json()
    const { pin } = body

    const validPin = import.meta.env.ADMIN_PIN || 'Admin123!'

    if (pin === validPin) {
      return new Response(JSON.stringify({ valid: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ valid: false }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch {
    return new Response(JSON.stringify({ valid: false }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
