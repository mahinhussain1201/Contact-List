import React from 'react'
import ContactCard from './ContactCard.jsx'

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {contacts.map((contact, idx) => (
        <div
          key={contact?.login?.uuid || idx}
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
  )
}
