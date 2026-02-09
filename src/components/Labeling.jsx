import { useState } from 'react'

const LABELS = [
  { id: 'tender', label: 'Tender' },
  { id: 'medium', label: 'Medium' },
  { id: 'mature', label: 'Mature' },
]

const ENVIRONMENTS = [
  { id: 'indoor', label: 'Indoor' },
  { id: 'outdoor', label: 'Outdoor' },
]

const TAP_COUNTS = [3, 4, 5]

export default function Labeling({ onSubmit, onBack, isSubmitting, uploadProgress, submitError }) {
  const [selectedLabel, setSelectedLabel] = useState(null)
  const [environment, setEnvironment] = useState(null)
  const [numTaps, setNumTaps] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!selectedLabel) return
    onSubmit({
      label: selectedLabel,
      environment: environment || undefined,
      numTaps: numTaps ?? undefined,
    })
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col safe-top safe-bottom px-6 pt-8 pb-10">
      <button
        type="button"
        onClick={onBack}
        className="self-start text-slate-400 hover:text-slate-200 text-sm mb-6"
      >
        ← Back
      </button>

      <h2 className="text-xl font-semibold mb-2">Label the coconut</h2>
      <p className="text-slate-400 text-sm mb-6">Select the maturity that best matches your tap sound.</p>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
        <div className="mb-6">
          <p className="text-slate-300 text-sm font-medium mb-3">Maturity *</p>
          <div className="flex flex-wrap gap-3">
            {LABELS.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setSelectedLabel(id)}
                className={`px-5 py-3 rounded-xl font-medium touch-manipulation transition-colors ${
                  selectedLabel === id
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <p className="text-slate-400 text-sm font-medium mb-3">Environment (optional)</p>
          <div className="flex flex-wrap gap-3">
            {ENVIRONMENTS.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setEnvironment(environment === id ? null : id)}
                className={`px-5 py-3 rounded-xl font-medium touch-manipulation transition-colors ${
                  environment === id
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <p className="text-slate-400 text-sm font-medium mb-3">Number of taps (optional)</p>
          <div className="flex flex-wrap gap-3">
            {TAP_COUNTS.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setNumTaps(numTaps === n ? null : n)}
                className={`px-5 py-3 rounded-xl font-medium touch-manipulation transition-colors ${
                  numTaps === n
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {submitError && (
          <p className="text-red-400 text-sm mb-4">{submitError}</p>
        )}
        {isSubmitting && (
          <div className="mb-4">
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-slate-400 text-sm mt-2">Uploading… {uploadProgress}%</p>
          </div>
        )}

        <button
          type="submit"
          disabled={!selectedLabel || isSubmitting}
          className="mt-auto w-full py-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:pointer-events-none text-white font-semibold text-lg touch-manipulation"
        >
          {isSubmitting ? 'Submitting…' : 'Submit'}
        </button>
      </form>
    </div>
  )
}
