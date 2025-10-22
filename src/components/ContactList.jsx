import React from 'react'
import ContactCard from './ContactCard.jsx'

function Spinner() {
  return (
    <div className="flex justify-center py-16">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500"></div>
    </div>
  )
}

export default function ContactList({ contacts, loading, error, query }) {
  if (loading) return <Spinner />
  if (error) return (
    <div className="text-center py-16">
      <p className="text-red-600 font-medium">{error}</p>
    </div>
  )

  if (!contacts.length) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-600">No contacts found{query ? ` for "${query}"` : ''}.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {contacts.map((c) => (
        <ContactCard key={c.login?.uuid} contact={c} />
      ))}
    </div>
  )
}
