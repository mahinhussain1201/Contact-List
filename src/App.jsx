import React, { useEffect, useMemo, useState } from 'react'
import SearchBar from './components/SearchBar.jsx'
import ContactList from './components/ContactList.jsx'
import SmokeBackground from './components/SmokeBackground.jsx'
import AddContactForm from './components/AddContactForm.jsx'
import Modal from './components/Modal.jsx'
import Toasts from './components/Toasts.jsx'

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
    try {
      const storedAdded = JSON.parse(localStorage.getItem('addedContacts') || '[]')
      const storedDeleted = JSON.parse(localStorage.getItem('deletedContactIds') || '[]')
      if (Array.isArray(storedAdded)) setAddedContacts(storedAdded)
      if (Array.isArray(storedDeleted)) setDeletedIds(storedDeleted)
    } catch {}

    fetchContacts()
    return () => { isMounted = false }
  }, [])

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-x-hidden">
      <SmokeBackground />
      
      <main className="max-w-5xl mx-auto px-4 py-6 sm:px-6 lg:px-8 relative z-10">
        <header className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 tracking-tight mb-2">Contact List</h1>
          <p className="text-sm sm:text-base text-gray-600">Search and browse contacts fetched from Random User.</p>
        </header>

        <div className="mb-6">
          <SearchBar value={query} onChange={setQuery} />
        </div>

        <ContactList contacts={filtered} loading={loading} error={error} query={query} onDelete={handleDelete} />

        <button
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-8 right-8 z-20 inline-flex items-center justify-center h-14 w-14 rounded-full bg-blue-600 text-white shadow-xl hover:bg-blue-700 hover:scale-110 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300"
          aria-label="Add contact"
          title="Add contact"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
        </button>

        <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Contact" withPattern>
          <AddContactForm onAdd={handleAdd} />
        </Modal>

        <footer className="mt-10 mb-6 text-center text-xs text-gray-600">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/70 backdrop-blur-md ring-1 ring-gray-200 shadow-md hover:shadow-lg transition-all duration-300">
            <span className="font-medium text-gray-700">Created by:</span>
            <span className="text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-200">
              Mahin Hussain
            </span>
            <span className="text-gray-400">•</span>
            <span className="text-purple-600 font-medium">IIT Kharagpur</span>
            <span className="text-gray-400">•</span>
            <a
              href="https://www.linkedin.com/in/mahin-hussain" 
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:text-blue-700 transition-colors duration-200"
              title="LinkedIn"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 48 48">
                <path fill="#0288D1" d="M42,37c0,2.762-2.238,5-5,5H11c-2.761,0-5-2.238-5-5V11c0-2.762,2.239-5,5-5h26c2.762,0,5,2.238,5,5V37z"></path><path fill="#FFF" d="M12 19H17V36H12zM14.485 17h-.028C12.965 17 12 15.888 12 14.499 12 13.08 12.995 12 14.514 12c1.521 0 2.458 1.08 2.486 2.499C17 15.887 16.035 17 14.485 17zM36 36h-5v-9.099c0-2.198-1.225-3.698-3.192-3.698-1.501 0-2.313 1.012-2.707 1.99C24.957 25.543 25 26.511 25 27v9h-5V19h5v2.616C25.721 20.5 26.85 19 29.738 19c3.578 0 6.261 2.25 6.261 7.274L36 36 36 36z"></path>
              </svg>
            </a>

            <a
              href="mailto:mahinhussain1201@gmail.com" 
              className="text-red-500 hover:text-red-600 transition-colors duration-200"
              title="Send Email"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path d="M20 4H4C2.89 4 2 4.9 2 6V18C2 19.1 2.89 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" />
              </svg>
            </a>
          </div>
        </footer>

        <Toasts toasts={toasts} onDismiss={(id)=>setToasts(prev=>prev.filter(t=>t.id!==id))} />
      </main>
    </div>
  )
}