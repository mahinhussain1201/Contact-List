import React from 'react'

export default function ContactCard({ contact }) {
  const first = contact?.name?.first ?? ''
  const last = contact?.name?.last ?? ''
  const fullName = `${first} ${last}`.trim()
  const email = contact?.email ?? ''
  const phone = contact?.phone ?? ''
  const avatar = contact?.picture?.large ?? ''

  return (
    <div className="group relative rounded-2xl bg-white/80 backdrop-blur-md shadow-lg ring-1 ring-white/20 hover:shadow-xl hover:ring-white/30 transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] overflow-hidden">
      {/* Subtle gradient overlay that responds to hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative p-5 flex items-center gap-4">
        <div className="relative">
          <img
            src={avatar}
            alt={fullName}
            className="h-16 w-16 rounded-full object-cover ring-2 ring-white shadow-md group-hover:ring-4 group-hover:shadow-lg transition-all duration-300"
            loading="lazy"
          />
          {/* Colorful glow effect on hover */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-300" />
        </div>
        
        <div className="min-w-0 flex-1">
          <div className="truncate font-semibold text-gray-900 group-hover:text-purple-700 transition-colors duration-200">
            {fullName}
          </div>
          <div className="truncate text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-200">
            {email}
          </div>
          <div className="truncate text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-200">
            {phone}
          </div>
        </div>
      </div>
    </div>
  )
}