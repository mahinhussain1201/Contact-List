import React, { useEffect, useMemo, useState } from 'react'
import SearchBar from './components/SearchBar.jsx'
import ContactList from './components/ContactList.jsx'

export default function App() {
  const [contacts, setContacts] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true
    async function fetchContacts() {
      setLoading(true)
      setError('')
      try {
        const res = await fetch('https://randomuser.me/api/?results=100&nat=in')
        if (!res.ok) throw new Error(`Request failed: ${res.status}`)
        const data = await res.json()
        if (isMounted) setContacts(data.results || [])
      } catch (err) {
        if (isMounted) setError('Failed to load contacts. Please try again.')
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    fetchContacts()
    return () => { isMounted = false }
  }, [])

  const filtered = useMemo(() => {
    if (!query) return contacts
    const q = query.toLowerCase()
    return contacts.filter(c => {
      const first = c?.name?.first || ''
      const last = c?.name?.last || ''
      return first.toLowerCase().includes(q) || last.toLowerCase().includes(q)
    })
  }, [contacts, query])

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-5xl mx-auto p-6">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800 tracking-tight">Contact List</h1>
          <p className="text-sm text-gray-600 mt-1">Search and browse contacts fetched from Random User.</p>
        </header>

        <SearchBar value={query} onChange={setQuery} />

        <ContactList contacts={filtered} loading={loading} error={error} query={query} />
      </main>
    </div>
  )
}
