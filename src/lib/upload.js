import { supabase, BUCKET_NAME } from './supabase'
import { extensionFromMime } from './audio'

/**
 * Upload audio blob to Supabase Storage and insert metadata row.
 * Returns { success, error?, sampleId? }.
 * onProgress(0-100) optional for UI.
 */
export async function uploadSample(
  { blob, mimeType },
  { label, environment, numTaps },
  metadata,
  onProgress
) {
  if (!supabase) {
    return { success: false, error: 'Supabase not configured' }
  }

  const ext = extensionFromMime(mimeType)
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const uuid = crypto.randomUUID().slice(0, 8)
  const fileName = `${timestamp}_${uuid}.${ext}`

  try {
    if (onProgress) onProgress(10)

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, blob, {
        contentType: mimeType,
        upsert: false,
      })

    if (uploadError) {
      const msg = uploadError.message?.toLowerCase().includes('bucket')
        ? `Storage bucket "${BUCKET_NAME}" not found. Create it in Supabase Dashboard → Storage → New bucket (name: ${BUCKET_NAME}), then add an "Allow anon insert" policy.`
        : uploadError.message
      return { success: false, error: msg }
    }
    if (onProgress) onProgress(70)

    const { error: insertError } = await supabase.from('samples').insert({
      audio_path: fileName,
      label,
      environment: environment || null,
      num_taps: numTaps || null,
      recording_duration_sec: metadata.recordingDurationSec,
      recorded_at: new Date().toISOString(),
      device_type: metadata.deviceType,
      browser: metadata.browser,
      os: metadata.os,
      ip: metadata.ip ?? null,
      country: metadata.country ?? null,
      city: metadata.city ?? null,
      region: metadata.region ?? null,
      session_id: metadata.sessionId ?? null,
      visitor_id: metadata.visitorId ?? null,
    })

    if (insertError) return { success: false, error: insertError.message }
    if (onProgress) onProgress(100)

    return { success: true, sampleId: fileName }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

/**
 * Gather device/browser metadata from user agent (basic, no PII).
 */
export function getDeviceMetadata() {
  const ua = navigator.userAgent
  let browser = 'unknown'
  let os = 'unknown'
  if (ua.includes('Chrome') && !ua.includes('Edg')) browser = 'Chrome'
  else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari'
  else if (ua.includes('Firefox')) browser = 'Firefox'
  if (ua.includes('Android')) os = 'Android'
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS'
  else if (ua.includes('Mac')) os = 'macOS'
  else if (ua.includes('Win')) os = 'Windows'
  return {
    deviceType: /Mobile|Android|iPhone|iPad/i.test(ua) ? 'mobile' : 'desktop',
    browser,
    os,
  }
}
