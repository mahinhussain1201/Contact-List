import React, { useState } from 'react'

export default function AddContactForm({ onAdd }) {
  const [first, setFirst] = useState('')
  const [last, setLast] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const id = (globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`)
    const pic = avatarPreview || 'https://via.placeholder.com/96'
    const newContact = {
      login: { uuid: id },
      name: { first: first.trim(), last: last.trim() },
      email: email.trim(),
      phone: phone.trim(),
      picture: { thumbnail: pic, large: pic },
      __source: 'user'
    }
    onAdd(newContact)
    setFirst(''); setLast(''); setEmail(''); setPhone(''); setAvatarFile(null); setAvatarPreview('')
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
    <form onSubmit={handleSubmit} className="mb-0 bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-gray-200">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input value={first} onChange={(e)=>setFirst(e.target.value)} placeholder="First name" required className="px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <input value={last} onChange={(e)=>setLast(e.target.value)} placeholder="Last name" required className="px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" placeholder="Email" required className="px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <input value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder="Phone" required className="px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Avatar image (optional)</label>
          <input type="file" accept="image/*" onChange={handleFileChange} className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
          {avatarPreview && (
            <div className="mt-3 flex items-center gap-3">
              <img src={avatarPreview} alt="Avatar preview" className="w-12 h-12 rounded-full object-cover ring-1 ring-gray-200" />
              <span className="text-xs text-gray-500">Preview</span>
            </div>
          )}
        </div>
      </div>
      <div className="mt-3 flex justify-end">
        <button type="submit" className="inline-flex items-center px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition shadow-sm">Add Contact</button>
      </div>
    </form>
  )
}
