/**
 * Vercel serverless: returns client IP and geo from request headers.
 * Only populated when deployed on Vercel; locally returns nulls.
 */
export function GET(request) {
  const headers = request.headers
  const ip = headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || headers.get('x-real-ip')
    || null
  const country = headers.get('x-vercel-ip-country') || null
  const region = headers.get('x-vercel-ip-country-region') || null
  const city = headers.get('x-vercel-ip-city') || null

  return new Response(
    JSON.stringify({ ip, country, city, region }),
    { headers: { 'Content-Type': 'application/json' } }
  )
}
