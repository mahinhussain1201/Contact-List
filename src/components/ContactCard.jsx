import React from 'react'

export default function ContactCard({ contact, onDelete }) {
  const initialsBg = (first = '', last = '') => {
    const str = `${first}${last}`
    let hash = 0
    for (let i = 0; i < str.length; i++) hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0
    const hue = Math.abs(hash) % 360
    const hue2 = (hue + 30) % 360
    return `linear-gradient(135deg, hsl(${hue}, 80%, 80%), hsl(${hue2}, 80%, 75%))`
  }

  const first = contact?.name?.first ?? ''
  const last = contact?.name?.last ?? ''
  const email = contact?.email ?? ''
  const phone = contact?.phone ?? ''
  const thumbnail = contact?.picture?.thumbnail ?? ''

  return (
    <div className="relative">
      <style>{`
        @keyframes rotBGimg {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      
      <div className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.015]">
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100"
          style={{
            backgroundImage: 'conic-gradient(from 0deg, #93c5fd, #c4b5fd, #fbcfe8, #93c5fd)',
            animation: 'rotBGimg 3s linear infinite',
            transition: 'opacity 0.2s linear',
            willChange: 'transform'
          }}
        />
        <div className="absolute inset-[5px] rounded-[15px] bg-white/80 backdrop-blur-md ring-1 ring-white/30" />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative z-10 p-5">
          <div className="flex items-start gap-4">
            <div className="relative">
              {thumbnail && !/placeholder\.com/.test(thumbnail) ? (
                <img
                  src={thumbnail}
                  alt={`${first} ${last}`}
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-white shadow-md group-hover:ring-4 group-hover:shadow-lg transition-all duration-300"
                />
              ) : (
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-white font-semibold text-lg ring-2 ring-white shadow-md"
                  style={{ backgroundImage: initialsBg(first, last) }}
                >
                  {(first[0] || '').toUpperCase()}{(last[0] || '').toUpperCase()}
                </div>
              )}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-300" />
            </div>
            
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-900 truncate group-hover:text-purple-700 transition-colors duration-200">
                {first} {last}
              </h3>
              <div className="mt-1 flex items-center gap-2 text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-200 truncate">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                <span className="truncate">{email}</span>
              </div>
              <div className="mt-1 flex items-center gap-2 text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-200 truncate">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h1.28a2 2 0 011.94 1.515l.57 2.28a2 2 0 01-.45 1.86l-1.1 1.1a16 16 0 006.36 6.36l1.1-1.1a2 2 0 011.86-.45l2.28.57A2 2 0 0121 17.72V19a2 2 0 01-2 2h-1C9.82 21 3 14.18 3 6V5z"/>
                </svg>
                <span className="truncate">{phone}</span>
              </div>
            </div>
            
            {onDelete && (
              <button
                onClick={() => onDelete(contact)}
                className="ml-2 text-xs px-2 py-1 rounded-md border border-red-200 text-red-700 hover:bg-red-50 self-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/60 transition-colors duration-200"
                aria-label="Delete contact"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}