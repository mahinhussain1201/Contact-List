import React from 'react'

export default function Toasts({ toasts, onDismiss }) {
  return (
    <div className="fixed top-4 right-4 z-30 space-y-2">
      {toasts.map(t => (
        <div key={t.id} className={`flex items-start gap-3 rounded-lg bg-white/80 backdrop-blur-md shadow-sm ring-1 ring-white/30 px-4 py-3 text-gray-800`}>
          <div className="mt-0.5">
            {t.type === 'error' ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-rose-600"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-emerald-600"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
            )}
          </div>
          <div className="text-sm font-medium">{t.message}</div>
          <button onClick={() => onDismiss(t.id)} className="ml-2 text-sm text-gray-500 hover:text-gray-700" aria-label="Dismiss">Dismiss</button>
        </div>
      ))}
    </div>
  )
}
