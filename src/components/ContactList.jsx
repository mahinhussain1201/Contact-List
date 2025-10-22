import React, { useMemo, useRef, useState } from 'react'

function Spinner() {
  return (
    <div className="flex justify-center py-16">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500"></div>
    </div>
  )
}

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
      <div className="space-y-8">
        {Array.from(groups.keys()).sort().map((letter) => (
          <section key={letter} ref={(el) => { sectionRefs.current[letter] = el }} id={`section-${letter}`}>
            <div className="sticky top-0 z-0 -mx-2 px-2">
              <div className="inline-flex items-center rounded-full bg-gray-100/80 backdrop-blur px-3 py-1 text-xs font-semibold text-gray-600 ring-1 ring-gray-200">{letter}</div>
            </div>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groups.get(letter).map((contact, idx) => (
                <div
                  key={contact?.login?.uuid || `${letter}-${idx}`}
                  className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-200"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={contact?.picture?.thumbnail}
                      alt={`${contact?.name?.first} ${contact?.name?.last}`}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-gray-900 truncate">
                        {contact?.name?.first} {contact?.name?.last}
                      </h3>
                      <p className="text-sm text-gray-600 truncate">{contact?.phone}</p>
                      <p className="text-sm text-gray-600 truncate">{contact?.email}</p>
                    </div>
                    <button
                      onClick={() => onDelete?.(contact)}
                      className="ml-2 text-sm px-2 py-1 rounded-md border border-red-200 text-red-700 hover:bg-red-50"
                      aria-label="Delete contact"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Right-side alphabet index */}
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
            className={`w-6 h-6 flex items-center justify-center rounded text-[10px] font-semibold transition 
              ${groups.has(ltr) ? 'text-gray-700 hover:bg-gray-200/70' : 'text-gray-300 cursor-default'}`}
            aria-label={`Jump to ${ltr}`}
            title={`Jump to ${ltr}`}
          >
            {ltr}
          </button>
        ))}
      </div>

      {/* Hover overlay showing current letter */}
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
