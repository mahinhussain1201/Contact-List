import React, { useEffect, useMemo, useState } from 'react'
import SearchBar from './components/SearchBar.jsx'
import ContactList from './components/ContactList.jsx'
import SmokeBackground from './components/SmokeBackground.jsx'
import AddContactForm from './components/AddContactForm.jsx'
import Modal from './components/Modal.jsx'
import Toasts from './components/Toasts.jsx'

// Main App Component
export default function App() {
  const [contacts, setContacts] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [addedContacts, setAddedContacts] = useState([])
  const [deletedIds, setDeletedIds] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [toasts, setToasts] = useState([])

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
    // Load persisted user data
    try {
      const storedAdded = JSON.parse(localStorage.getItem('addedContacts') || '[]')
      const storedDeleted = JSON.parse(localStorage.getItem('deletedContactIds') || '[]')
      if (Array.isArray(storedAdded)) setAddedContacts(storedAdded)
      if (Array.isArray(storedDeleted)) setDeletedIds(storedDeleted)
    } catch {}

    fetchContacts()
    return () => { isMounted = false }
  }, [])

  // Persist changes
  useEffect(() => {
    try { localStorage.setItem('addedContacts', JSON.stringify(addedContacts)) } catch {}
  }, [addedContacts])
  useEffect(() => {
    try { localStorage.setItem('deletedContactIds', JSON.stringify(deletedIds)) } catch {}
  }, [deletedIds])

  const combined = useMemo(() => {
    const deletedSet = new Set(deletedIds)
    const base = contacts.filter(c => !deletedSet.has(c?.login?.uuid))
    return [...addedContacts, ...base]
  }, [contacts, addedContacts, deletedIds])

  const filtered = useMemo(() => {
    if (!query) return combined
    const q = query.toLowerCase()
    return combined.filter(c => {
      const first = c?.name?.first || ''
      const last = c?.name?.last || ''
      return first.toLowerCase().includes(q) || last.toLowerCase().includes(q)
    })
  }, [combined, query])

  const handleAdd = (contact) => {
    setAddedContacts(prev => [contact, ...prev])
    setIsModalOpen(false)
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`
    setToasts(prev => [...prev, { id, type: 'success', message: 'Contact added successfully.' }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000)
  }

  const handleDelete = (contact) => {
    const id = contact?.login?.uuid
    const isUser = contact?.__source === 'user'
    if (!id) return
    if (isUser) {
      setAddedContacts(prev => prev.filter(c => c?.login?.uuid !== id))
    } else {
      setDeletedIds(prev => Array.from(new Set([...prev, id])))
    }
    const tid = `${Date.now()}-${Math.random().toString(16).slice(2)}`
    setToasts(prev => [...prev, { id: tid, type: 'success', message: 'Contact deleted.' }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== tid)), 3000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative">
      <SmokeBackground />
      
      <main className="max-w-5xl mx-auto p-6 relative z-10">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800 tracking-tight">Contact List</h1>
          <p className="text-sm text-gray-600 mt-1">Search and browse contacts fetched from Random User.</p>
        </header>

        <SearchBar value={query} onChange={setQuery} />

        <ContactList contacts={filtered} loading={loading} error={error} query={query} onDelete={handleDelete} />

        <button
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-6 right-6 z-20 inline-flex items-center justify-center h-12 w-12 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
          aria-label="Add contact"
          title="Add contact"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
        </button>

        <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Contact">
          <AddContactForm onAdd={handleAdd} />
        </Modal>

        <Toasts toasts={toasts} onDismiss={(id)=>setToasts(prev=>prev.filter(t=>t.id!==id))} />
      </main>
    </div>
  )
}