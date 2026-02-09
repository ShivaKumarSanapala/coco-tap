import { geolocation, ipAddress } from '@vercel/functions'

/**
 * Vercel serverless: returns client IP and geo from request headers.
 * Only populated when deployed on Vercel; locally returns nulls.
 */
export function GET(request) {
  const ip = ipAddress(request)
  const geo = geolocation(request)

  return new Response(
    JSON.stringify({
      ip: ip || null,
      country: geo.country || null,
      city: geo.city || null,
      region: geo.countryRegion || null,
    }),
    { headers: { 'Content-Type': 'application/json' } }
  )
}
