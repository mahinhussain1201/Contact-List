import React from 'react'

export default function SearchBar({ value, onChange }) {
  return (
    <div className="mb-6">
      <label htmlFor="search" className="sr-only">Search contacts</label>
      <input
        id="search"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by name..."
        className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-800 placeholder:text-gray-400 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
      />
    </div>
  )
}
