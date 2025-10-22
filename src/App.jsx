import React, { useEffect, useMemo, useState, useRef } from 'react'

// Colorful Particle Class
class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 5 + 2;
    this.speedX = Math.random() * 2 - 1;
    this.speedY = -Math.random() * 3 - 1;
    this.life = 100;
    this.initialSize = this.size;
    // Random vibrant color for each particle
    this.hue = Math.random() * 360;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.life -= 1;
    this.size = Math.max(0, this.initialSize * (this.life / 100));
    // Slowly shift hue for dynamic color variation
    this.hue = (this.hue + 0.5) % 360;
  }
}

// Colorful Smoke Background Component
function SmokeBackground() {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const mousePosRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particlesRef.current = particlesRef.current
        .filter(particle => particle.life > 0 && particle.size > 0)
        .map(particle => {
          particle.update();
          
          if (particle.size > 0) {
            const opacity = particle.life / 100 * 0.7;
            // Use HSL for vibrant, colorful particles
            ctx.fillStyle = `hsla(${particle.hue}, 80%, 65%, ${opacity})`;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
          }
          
          return particle;
        });

      // Generate particles from mouse position
      if (mousePosRef.current.x !== 0 && mousePosRef.current.y !== 0) {
        for (let i = 0; i < 3; i++) {
          particlesRef.current.push(
            new Particle(
              mousePosRef.current.x + (Math.random() * 20 - 10),
              mousePosRef.current.y + (Math.random() * 20 - 10)
            )
          );
        }
      }
      
      // Auto-generate particles at random positions from bottom
      if (Math.random() < 0.3) {
        particlesRef.current.push(
          new Particle(
            Math.random() * canvas.width,
            canvas.height - 50 + Math.random() * 50
          )
        );
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    animate();

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const handleMouseMove = (e) => {
    mousePosRef.current = {
      x: e.clientX,
      y: e.clientY
    };
  };

  const handleMouseLeave = () => {
    mousePosRef.current = { x: 0, y: 0 };
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="fixed top-0 left-0 w-full h-full"
      style={{ zIndex: 1 }}
    />
  );
}

// SearchBar Component
function SearchBar({ value, onChange }) {
  return (
    <div className="mb-6">
      <input
        type="text"
        placeholder="Search by name..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/90 backdrop-blur-sm"
      />
    </div>
  )
}

// Add Contact Form Component
function AddContactForm({ onAdd }) {
  const [first, setFirst] = useState('')
  const [last, setLast] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [avatar, setAvatar] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const id = (globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`)
    const pic = avatar || 'https://via.placeholder.com/96'
    const newContact = {
      login: { uuid: id },
      name: { first: first.trim(), last: last.trim() },
      email: email.trim(),
      phone: phone.trim(),
      picture: { thumbnail: pic, large: pic },
      __source: 'user'
    }
    onAdd(newContact)
    setFirst(''); setLast(''); setEmail(''); setPhone(''); setAvatar('')
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6 bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-gray-200">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input value={first} onChange={(e)=>setFirst(e.target.value)} placeholder="First name" required className="px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <input value={last} onChange={(e)=>setLast(e.target.value)} placeholder="Last name" required className="px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" placeholder="Email" required className="px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <input value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder="Phone" required className="px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <input value={avatar} onChange={(e)=>setAvatar(e.target.value)} placeholder="Avatar URL (optional)" className="px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:col-span-2" />
      </div>
      <div className="mt-3 flex justify-end">
        <button type="submit" className="inline-flex items-center px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition shadow-sm">Add Contact</button>
      </div>
    </form>
  )
}

function Modal({ open, onClose, children, title }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative z-30 w-full max-w-lg mx-auto">
        <div className="bg-white rounded-xl shadow-lg ring-1 ring-black/5">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            <button onClick={onClose} className="p-2 rounded-md hover:bg-gray-100" aria-label="Close">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-gray-600"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
          <div className="p-5">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

function Toasts({ toasts, onDismiss }) {
  return (
    <div className="fixed top-4 right-4 z-30 space-y-2">
      {toasts.map(t => (
        <div key={t.id} className={`flex items-start gap-3 rounded-lg shadow-sm ring-1 ring-black/5 px-4 py-3 ${t.type === 'error' ? 'bg-red-50 text-red-800' : 'bg-emerald-50 text-emerald-800'}`}>
          <div className="mt-0.5">
            {t.type === 'error' ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
            )}
          </div>
          <div className="text-sm font-medium">{t.message}</div>
          <button onClick={() => onDismiss(t.id)} className="ml-2 text-sm text-gray-500 hover:text-gray-700" aria-label="Dismiss">Dismiss</button>
        </div>
      ))}
    </div>
  )
}

// ContactList Component
function ContactList({ contacts, loading, error, query, onDelete }) {
  if (loading) {
    return (
      <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-lg">
        <p className="text-gray-600">Loading contacts...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-lg">
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  if (contacts.length === 0) {
    return (
      <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-lg">
        <p className="text-gray-600">
          {query ? 'No contacts found matching your search.' : 'No contacts available.'}
        </p>
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
              onClick={() => onDelete(contact)}
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