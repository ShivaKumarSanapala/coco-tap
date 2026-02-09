import { useState, useCallback } from 'react'
import { getMicrophoneStream, recordForDuration, RECORD_DURATION_MS } from '../lib/audio'

export default function Recording({ onComplete, onBack }) {
  const [status, setStatus] = useState('idle') // idle | requesting | recording | error
  const [error, setError] = useState(null)
  const [remainingMs, setRemainingMs] = useState(RECORD_DURATION_MS)

  const startRecording = useCallback(async () => {
    setError(null)
    setStatus('requesting')
    try {
      const stream = await getMicrophoneStream()
      setStatus('recording')
      setRemainingMs(RECORD_DURATION_MS)
      const { blob, mimeType } = await recordForDuration(
        stream,
        RECORD_DURATION_MS,
        (ms) => setRemainingMs(ms)
      )
      onComplete({ blob, mimeType })
    } catch (err) {
      setStatus('error')
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('Microphone access was denied. Please allow mic in browser settings and try again.')
      } else {
        setError(err.message || 'Recording failed. Please try again.')
      }
    }
  }, [onComplete])

  const secondsLeft = Math.ceil(remainingMs / 1000)

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col safe-top safe-bottom px-6 pt-8 pb-10">
      <button
        type="button"
        onClick={onBack}
        className="self-start text-slate-400 hover:text-slate-200 text-sm mb-6"
      >
        ← Back
      </button>

      <div className="flex-1 flex flex-col justify-center items-center">
        {status === 'idle' && (
          <>
            <p className="text-slate-300 text-center mb-8">
              Tap <strong>Start</strong> to begin. Recording will run for 4 seconds.
            </p>
            <button
              type="button"
              onClick={startRecording}
              className="w-full max-w-xs py-5 rounded-2xl bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-semibold text-lg touch-manipulation transition-colors"
            >
              Start
            </button>
          </>
        )}

        {status === 'requesting' && (
          <p className="text-slate-400">Requesting microphone…</p>
        )}

        {status === 'recording' && (
          <>
            <div className="w-20 h-20 rounded-full bg-red-500/30 flex items-center justify-center mb-6 animate-pulse">
              <span className="text-3xl font-bold text-red-400">{secondsLeft}</span>
            </div>
            <p className="text-red-400 font-medium">Recording…</p>
            <p className="text-slate-400 text-sm mt-2">Tap the coconut 3–5 times</p>
          </>
        )}

        {status === 'error' && (
          <>
            <p className="text-red-400 text-center mb-6">{error}</p>
            <button
              type="button"
              onClick={() => { setStatus('idle'); setError(null) }}
              className="w-full max-w-xs py-5 rounded-2xl bg-slate-600 hover:bg-slate-500 text-white font-semibold touch-manipulation"
            >
              Try again
            </button>
          </>
        )}
      </div>
    </div>
  )
}
