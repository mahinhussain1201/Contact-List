import React, { useEffect, useMemo, useRef, useState } from 'react'

export default function ContactList({ contacts, loading, error, query, onDelete }) {
  if (loading) return (
    <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-lg">
      <p className="text-gray-600">Loading contacts...</p>
    </div>
  )
  if (error) return (
    <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-lg">
      <p className="text-red-600">{error}</p>
    </div>
  )

  if (!contacts.length) {
    return (
      <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-lg">
        <p className="text-gray-600">{query ? 'No contacts found matching your search.' : 'No contacts available.'}</p>
      </div>
    )
  }

  // Sort lexicographically (case-insensitive) by full name and group by first letter
  const groups = useMemo(() => {
    const sorted = [...contacts].sort((a, b) => {
      const an = `${a?.name?.first || ''} ${a?.name?.last || ''}`.trim().toLowerCase()
      const bn = `${b?.name?.first || ''} ${b?.name?.last || ''}`.trim().toLowerCase()
      return an.localeCompare(bn)
    })
    const map = new Map()
    for (const c of sorted) {
      const firstChar = (c?.name?.first?.[0] || c?.name?.last?.[0] || '#').toUpperCase()
      const key = /[A-Z]/.test(firstChar) ? firstChar : '#'
      if (!map.has(key)) map.set(key, [])
      map.get(key).push(c)
    }
    return map
  }, [contacts])

  const letters = useMemo(() => {
    const base = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i))
    const present = new Set(groups.keys())
    return base.concat(present.has('#') ? ['#'] : [])
  }, [groups])

  const sectionRefs = useRef({})
  const [hoverLetter, setHoverLetter] = useState('')
  const [activeLetter, setActiveLetter] = useState('')

  const initialsBg = (first = '', last = '') => {
    const str = `${first}${last}`
    let hash = 0
    for (let i = 0; i < str.length; i++) hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0
    const hue = Math.abs(hash) % 360
    const hue2 = (hue + 30) % 360
    return `linear-gradient(135deg, hsl(${hue}, 80%, 80%), hsl(${hue2}, 80%, 75%))`
  }

  useEffect(() => {
    const keys = Array.from(groups.keys())
    if (!keys.length) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const letter = entry.target.getAttribute('data-letter') || ''
            setActiveLetter(letter)
          }
        })
      },
      { root: null, rootMargin: '-45% 0px -50% 0px', threshold: 0.0 }
    )
    keys.forEach((ltr) => {
      const el = sectionRefs.current[ltr]
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [groups])

  const scrollToLetter = (letter) => {
    const el = sectionRefs.current[letter]
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setHoverLetter(letter)
      setTimeout(() => setHoverLetter(''), 800)
    }
  }

  return (
    <div className="relative">
      <style>{`
        @keyframes rotBGimg {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      <div className="space-y-8">
        {Array.from(groups.keys()).sort().map((letter) => (
          <section key={letter} ref={(el) => { sectionRefs.current[letter] = el }} id={`section-${letter}`} data-letter={letter}>
            <div className="sticky top-0 z-0 -mx-2 px-2">
              <div className="inline-flex items-center rounded-full bg-gray-100/80 backdrop-blur px-3 py-1 text-xs font-semibold text-gray-600 ring-1 ring-gray-200">{letter}</div>
            </div>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
              {groups.get(letter).map((contact, idx) => (
                <div key={contact?.login?.uuid || `${letter}-${idx}`} className="relative">
                  <div className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.015]">
                    {/* Rotating gradient border (full perimeter) */}
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
                            {contact?.picture?.thumbnail && !/placeholder\.com/.test(contact?.picture?.thumbnail) ? (
                              <img
                                src={contact?.picture?.thumbnail}
                                alt={`${contact?.name?.first} ${contact?.name?.last}`}
                                className="w-14 h-14 rounded-full object-cover ring-2 ring-white shadow-md group-hover:ring-4 group-hover:shadow-lg transition-all duration-300"
                              />
                            ) : (
                              <div
                                className="w-14 h-14 rounded-full flex items-center justify-center text-white font-semibold text-lg ring-2 ring-white shadow-md"
                                style={{ backgroundImage: initialsBg(contact?.name?.first, contact?.name?.last) }}
                              >
                                {(contact?.name?.first?.[0] || '').toUpperCase()}{(contact?.name?.last?.[0] || '').toUpperCase()}
                              </div>
                            )}
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-300" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-gray-900 truncate group-hover:text-purple-700 transition-colors duration-200">
                              {contact?.name?.first} {contact?.name?.last}
                            </h3>
                            <div className="mt-1 flex items-center gap-2 text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-200 truncate">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                              <span className="truncate">{contact?.email}</span>
                            </div>
                            <div className="mt-1 flex items-center gap-2 text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-200 truncate">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h1.28a2 2 0 011.94 1.515l.57 2.28a2 2 0 01-.45 1.86l-1.1 1.1a16 16 0 006.36 6.36l1.1-1.1a2 2 0 011.86-.45l2.28.57A2 2 0 0121 17.72V19a2 2 0 01-2 2h-1C9.82 21 3 14.18 3 6V5z"/></svg>
                              <span className="truncate">{contact?.phone}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => onDelete?.(contact)}
                            className="ml-2 text-xs px-2 py-1 rounded-md border border-red-200 text-red-700 hover:bg-red-50 self-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/60"
                            aria-label="Delete contact"
                          >
                            Delete
                          </button>
                        </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div
        className="hidden sm:flex flex-col items-center gap-1 fixed right-3 top-1/2 -translate-y-1/2 z-20 select-none"
        onMouseLeave={() => setHoverLetter('')}
      >
        {letters.map((ltr) => (
          <button
            key={ltr}
            onMouseEnter={() => setHoverLetter(ltr)}
            onMouseDown={(e) => { e.preventDefault(); scrollToLetter(ltr) }}
            onClick={(e) => { e.preventDefault(); scrollToLetter(ltr) }}
            className={`w-6 h-6 flex items-center justify-center rounded text-[10px] font-semibold transition outline-none
              ${groups.has(ltr) ? 'text-gray-700 hover:bg-white/60' : 'text-gray-300 cursor-default'}
              ${activeLetter === ltr ? 'bg-white/70 text-purple-700 ring-1 ring-white/80' : ''}`}
            aria-label={`Jump to ${ltr}`}
            title={`Jump to ${ltr}`}
          >
            {ltr}
          </button>
        ))}
      </div>

      {hoverLetter && (
        <div className="pointer-events-none fixed inset-0 z-30 flex items-center justify-center">
          <div className="rounded-2xl bg-black/40 text-white text-6xl font-extrabold px-8 py-6 shadow-2xl">
            {hoverLetter}
          </div>
        </div>
      )}
    </div>
  )
}
