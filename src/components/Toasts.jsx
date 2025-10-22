import React from 'react'

export default function Toasts({ toasts, onDismiss }) {
  return (
    <div className="fixed top-4 right-4 z-30 space-y-2 max-w-sm">
      {toasts.map(t => (
        <div 
          key={t.id} 
          className={`flex items-start gap-3 rounded-xl shadow-lg ring-1 backdrop-blur-md px-4 py-3 transition-all duration-300 animate-slide-in ${
            t.type === 'error' 
              ? 'bg-rose-50/95 ring-rose-200/50 text-rose-900' 
              : 'bg-emerald-50/95 ring-emerald-200/50 text-emerald-900'
          }`}
        >
          <style>{`
            @keyframes slide-in {
              from {
                transform: translateX(100%);
                opacity: 0;
              }
              to {
                transform: translateX(0);
                opacity: 1;
              }
            }
            .animate-slide-in {
              animation: slide-in 0.3s ease-out;
            }
          `}</style>
          
          <div className="mt-0.5 flex-shrink-0">
            {t.type === 'error' ? (
              <div className="w-5 h-5 rounded-full bg-rose-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-3.5 h-3.5 text-rose-600">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </div>
            ) : (
              <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-3.5 h-3.5 text-emerald-600">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold">{t.message}</div>
          </div>
          
          <button 
            onClick={() => onDismiss(t.id)} 
            className={`flex-shrink-0 text-sm font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-offset-1 rounded transition-colors ${
              t.type === 'error'
                ? 'text-rose-700 hover:text-rose-800 focus:ring-rose-400'
                : 'text-emerald-700 hover:text-emerald-800 focus:ring-emerald-400'
            }`}
            aria-label="Dismiss notification"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
}