import React, { useState } from 'react'
import { motion } from 'framer-motion'

function FallingPattern({ color = '#3b82f6', className = '' }) {
  const generateBackgroundImage = () => {
    const patterns = [
      `radial-gradient(4px 100px at 0px 235px, ${color}, transparent)`,
      `radial-gradient(4px 100px at 300px 235px, ${color}, transparent)`,
      `radial-gradient(1.5px 1.5px at 150px 117.5px, ${color} 100%, transparent 150%)`,
      `radial-gradient(4px 100px at 0px 252px, ${color}, transparent)`,
      `radial-gradient(4px 100px at 300px 252px, ${color}, transparent)`,
      `radial-gradient(1.5px 1.5px at 150px 126px, ${color} 100%, transparent 150%)`,
      `radial-gradient(4px 100px at 0px 150px, ${color}, transparent)`,
      `radial-gradient(4px 100px at 300px 150px, ${color}, transparent)`,
      `radial-gradient(1.5px 1.5px at 150px 75px, ${color} 100%, transparent 150%)`,
      `radial-gradient(4px 100px at 0px 253px, ${color}, transparent)`,
      `radial-gradient(4px 100px at 300px 253px, ${color}, transparent)`,
      `radial-gradient(1.5px 1.5px at 150px 126.5px, ${color} 100%, transparent 150%)`,
    ]
    return patterns.join(', ')
  }

  const backgroundSizes = '300px 235px, 300px 235px, 300px 235px, 300px 252px, 300px 252px, 300px 252px, 300px 150px, 300px 150px, 300px 150px, 300px 253px, 300px 253px, 300px 253px'
  const startPositions = '0px 220px, 3px 220px, 151.5px 337.5px, 25px 24px, 28px 24px, 176.5px 150px, 50px 16px, 53px 16px, 201.5px 91px, 75px 224px, 78px 224px, 226.5px 230.5px'
  const endPositions = '0px 6800px, 3px 6800px, 151.5px 6917.5px, 25px 13632px, 28px 13632px, 176.5px 13758px, 50px 5416px, 53px 5416px, 201.5px 5491px, 75px 17175px, 78px 17175px, 226.5px 17301.5px'

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <motion.div
        className="w-full h-full"
        style={{
          backgroundImage: generateBackgroundImage(),
          backgroundSize: backgroundSizes,
        }}
        variants={{
          initial: { backgroundPosition: startPositions },
          animate: {
            backgroundPosition: [startPositions, endPositions],
            transition: { duration: 150, ease: 'linear', repeat: Infinity },
          },
        }}
        initial="initial"
        animate="animate"
      />
      <div className="absolute inset-0" style={{ backdropFilter: 'blur(0.5em)' }} />
    </div>
  )
}

export default function AddContactForm({ onAdd }) {
  const [first, setFirst] = useState('')
  const [last, setLast] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState('')

  const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4']
  const [currentColor] = useState(colors[Math.floor(Math.random() * colors.length)])

  const handleSubmit = (e) => {
    e.preventDefault()
    const id = (globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`)
    const newContact = {
      login: { uuid: id },
      name: { first: first.trim(), last: last.trim() },
      email: email.trim(),
      phone: phone.trim(),
      __source: 'user'
    }
    if (avatarPreview) {
      newContact.picture = { thumbnail: avatarPreview, large: avatarPreview }
    }
    if (typeof onAdd === 'function') onAdd(newContact)
    setFirst('')
    setLast('')
    setEmail('')
    setPhone('')
    setAvatarFile(null)
    setAvatarPreview('')
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) { setAvatarFile(null); setAvatarPreview(''); return }
    if (!file.type.startsWith('image/')) { setAvatarFile(null); setAvatarPreview(''); return }
    if (file.size > 2 * 1024 * 1024) { setAvatarFile(null); setAvatarPreview(''); return }
    setAvatarFile(file)
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') setAvatarPreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  return (
    <form onSubmit={handleSubmit} className="relative overflow-hidden bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-gray-200">
      <FallingPattern color={currentColor} className="opacity-20" />
      <div className="relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input 
            value={first} 
            onChange={(e)=>setFirst(e.target.value)} 
            placeholder="First name" 
            required
            className="px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80" 
          />
          <input 
            value={last} 
            onChange={(e)=>setLast(e.target.value)} 
            placeholder="Last name" 
            required
            className="px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80" 
          />
          <input 
            value={email} 
            onChange={(e)=>setEmail(e.target.value)} 
            type="email" 
            placeholder="Email" 
            required
            className="px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80" 
          />
          <input 
            value={phone} 
            onChange={(e)=>setPhone(e.target.value)} 
            placeholder="Phone" 
            required
            className="px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80" 
          />
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Avatar image (optional)</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 bg-white/80 rounded-md border border-gray-300 p-2" 
            />
            {avatarPreview && (
              <div className="mt-3 flex items-center gap-3">
                <img src={avatarPreview} alt="Avatar preview" className="w-16 h-16 rounded-full object-cover ring-2 ring-gray-300" />
                <span className="text-sm text-gray-600">Preview</span>
              </div>
            )}
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button 
            type="submit"
            disabled={!first || !last || !email || !phone}
            className="inline-flex items-center px-6 py-3 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Contact
          </button>
        </div>
      </div>
    </form>
  )
}