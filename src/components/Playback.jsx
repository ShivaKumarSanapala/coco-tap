import { useRef, useState, useEffect } from 'react'

export default function Playback({ blob, mimeType, onContinue, onReRecord }) {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [url, setUrl] = useState(null)

  useEffect(() => {
    if (!blob) { setUrl(null); return }
    const u = URL.createObjectURL(blob)
    setUrl(u)
    return () => URL.revokeObjectURL(u)
  }, [blob])

  const togglePlay = () => {
    const el = audioRef.current
    if (!el) return
    if (el.paused) {
      el.play().then(() => setPlaying(true)).catch(() => {})
    } else {
      el.pause()
      el.currentTime = 0
      setPlaying(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col safe-top safe-bottom px-6 pt-8 pb-10">
      <h2 className="text-xl font-semibold mb-6">Listen & confirm</h2>

      <div className="flex-1 flex flex-col justify-center space-y-6">
        {url && (
          <>
            <audio
              ref={audioRef}
              src={url}
              onEnded={() => setPlaying(false)}
              preload="metadata"
            />
            <button
              type="button"
              onClick={togglePlay}
              className="w-full py-5 rounded-2xl bg-slate-700 hover:bg-slate-600 text-white font-semibold touch-manipulation"
            >
              {playing ? 'Pause' : 'Play recording'}
            </button>
          </>
        )}

        <button
          type="button"
          onClick={onReRecord}
          className="w-full py-4 rounded-2xl border border-slate-600 text-slate-300 hover:bg-slate-800 touch-manipulation"
        >
          Re-record
        </button>

        <button
          type="button"
          onClick={onContinue}
          className="w-full py-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-lg touch-manipulation"
        >
          Continue
        </button>
      </div>
    </div>
  )
}
