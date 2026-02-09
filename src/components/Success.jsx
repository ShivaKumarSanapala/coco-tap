export default function Success({ onRecordAnother }) {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col safe-top safe-bottom px-6 pt-8 pb-10">
      <div className="flex-1 flex flex-col justify-center items-center text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-600/30 flex items-center justify-center mb-6">
          <span className="text-3xl">✓</span>
        </div>
        <h2 className="text-xl font-semibold mb-2">Saved</h2>
        <p className="text-slate-400 text-sm mb-10">Your recording and label have been submitted.</p>
        <button
          type="button"
          onClick={onRecordAnother}
          className="w-full max-w-xs py-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-lg touch-manipulation"
        >
          Record another
        </button>
      </div>
    </div>
  )
}
