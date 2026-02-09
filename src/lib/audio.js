/**
 * Audio recording using browser APIs only.
 * - getUserMedia: mic access (must be user-initiated on iOS)
 * - MediaRecorder: records to .webm (Chrome/Android) or .m4a (Safari/iOS)
 * We do NOT convert formats; we upload the raw blob as-is.
 */

const RECORD_DURATION_MS = 4000 // 4 seconds fixed

/**
 * Request microphone and return a MediaStream.
 * Must be called from a user gesture (e.g. button click) on iOS.
 */
export async function getMicrophoneStream() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
  return stream
}

/**
 * Record from stream for a fixed duration, return blob and mime type.
 * @param {MediaStream} stream
 * @param {number} durationMs
 * @param {(remainingMs: number) => void} onTick - called every 100ms with remaining ms
 * @returns {Promise<{ blob: Blob, mimeType: string }>}
 */
export function recordForDuration(stream, durationMs = RECORD_DURATION_MS, onTick) {
  return new Promise((resolve, reject) => {
    const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
      ? 'audio/webm;codecs=opus'
      : 'audio/mp4' // Safari/iOS often uses this
    const options = { mimeType, audioBitsPerSecond: 128000 }
    const recorder = new MediaRecorder(stream, options)

    const chunks = []
    recorder.ondataavailable = (e) => {
      if (e.data.size) chunks.push(e.data)
    }
    recorder.onstop = () => {
      stream.getTracks().forEach((t) => t.stop())
      const blob = new Blob(chunks, { type: mimeType })
      resolve({ blob, mimeType })
    }
    recorder.onerror = (e) => reject(e.error || new Error('MediaRecorder error'))

    recorder.start(100)
    let remaining = durationMs
    const interval = setInterval(() => {
      remaining -= 100
      if (onTick) onTick(Math.max(0, remaining))
      if (remaining <= 0) {
        clearInterval(interval)
        recorder.stop()
      }
    }, 100)
  })
}

/**
 * Get file extension from mime type for storage naming.
 */
export function extensionFromMime(mimeType) {
  if (mimeType.includes('webm')) return 'webm'
  if (mimeType.includes('mp4') || mimeType.includes('m4a')) return 'm4a'
  return 'webm'
}

export { RECORD_DURATION_MS }
