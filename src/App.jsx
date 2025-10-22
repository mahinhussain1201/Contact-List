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

// ContactList Component
function ContactList({ contacts, loading, error, query }) {
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
          key={idx}
          className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-200"
        >
          <div className="flex items-center gap-3">
            <img
              src={contact?.picture?.thumbnail}
              alt={`${contact?.name?.first} ${contact?.name?.last}`}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h3 className="font-medium text-gray-900">
                {contact?.name?.first} {contact?.name?.last}
              </h3>
              <p className="text-sm text-gray-600">{contact?.phone}</p>
              <p className="text-sm text-gray-600">{contact?.email}</p>
            </div>
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative">
      <SmokeBackground />
      
      <main className="max-w-5xl mx-auto p-6 relative z-10">
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