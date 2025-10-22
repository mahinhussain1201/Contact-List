import React from 'react'

export default function ContactCard({ contact }) {
  const first = contact?.name?.first ?? ''
  const last = contact?.name?.last ?? ''
  const fullName = `${first} ${last}`.trim()
  const email = contact?.email ?? ''
  const phone = contact?.phone ?? ''
  const avatar = contact?.picture?.large ?? ''

  return (
    <div className="group rounded-xl bg-white shadow-sm ring-1 ring-gray-100 hover:shadow-md transition transform hover:-translate-y-0.5 hover:scale-[1.01]">
      <div className="p-4 flex items-center gap-4">
        <img
          src={avatar}
          alt={fullName}
          className="h-14 w-14 rounded-full object-cover ring-2 ring-white shadow"
          loading="lazy"
        />
        <div className="min-w-0">
          <div className="truncate font-semibold text-gray-800">{fullName}</div>
          <div className="truncate text-sm text-gray-600">{email}</div>
          <div className="truncate text-sm text-gray-600">{phone}</div>
        </div>
      </div>
    </div>
  )
}
