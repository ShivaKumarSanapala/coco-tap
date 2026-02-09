export default function Landing({ onStart }) {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col safe-top safe-bottom px-6 pt-8 pb-10">
      <h1 className="text-2xl font-bold text-center mb-2">Coco Tap</h1>
      <p className="text-slate-400 text-center text-sm mb-8">Collect coconut tap sounds for ML</p>

      <div className="flex-1 flex flex-col justify-center space-y-6">
        <div className="bg-slate-800/60 rounded-2xl p-6 space-y-4">
          <p className="text-slate-200 font-medium">Before you record:</p>
          <ul className="space-y-3 text-slate-300 text-sm">
            <li>• Place your phone <strong className="text-slate-100">~10–15 cm</strong> from the coconut</li>
            <li>• Tap the coconut <strong className="text-slate-100">3–5 times</strong></li>
            <li>• Record in a <strong className="text-slate-100">quiet environment</strong></li>
          </ul>
        </div>

        <button
          type="button"
          onClick={onStart}
          className="w-full py-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold text-lg touch-manipulation transition-colors"
        >
          Start Recording
        </button>
      </div>
    </div>
  )
}
