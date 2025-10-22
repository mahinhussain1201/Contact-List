import React from 'react'

export default function Modal({ open, onClose, children, title, withPattern = false }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative z-30 w-full max-w-lg mx-auto">
        <div className="relative overflow-hidden bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200">
          {withPattern && (
            <>
              <style>{`
                @keyframes modal-fall-pattern {
                  from { background-position: 0 0, 200px 0, 100px 0; }
                  to   { background-position: 0 1200px, 200px 1200px, 100px 1200px; }
                }
              `}</style>
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-70"
                style={{
                  backgroundImage: `
                    radial-gradient(4px 100px at 0 0, #60a5fa, transparent),
                    radial-gradient(4px 100px at 150px 0, #a78bfa, transparent),
                    radial-gradient(3px 80px at 300px 0, #f472b6, transparent),
                    radial-gradient(2px 60px at 75px 0, #38bdf8, transparent)
                  `,
                  backgroundRepeat: 'repeat',
                  animation: 'modal-fall-pattern 15s linear infinite', 
                  backgroundSize: '300px 1200px'
                }}
              />
            </>
          )}
          <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            <button onClick={onClose} className="p-2 rounded-md hover:bg-red-200 " aria-label="Close">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-gray-600"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
          <div className="p-5">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
