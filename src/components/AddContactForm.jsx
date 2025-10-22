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
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="first" className="block text-sm font-medium text-gray-700 mb-1.5">
            First name <span className="text-red-500">*</span>
          </label>
          <input 
            id="first"
            value={first} 
            onChange={(e)=>setFirst(e.target.value)} 
            placeholder="Enter first name" 
            required
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white" 
          />
        </div>
        
        <div>
          <label htmlFor="last" className="block text-sm font-medium text-gray-700 mb-1.5">
            Last name <span className="text-red-500">*</span>
          </label>
          <input 
            id="last"
            value={last} 
            onChange={(e)=>setLast(e.target.value)} 
            placeholder="Enter last name" 
            required
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white" 
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
            Email <span className="text-red-500">*</span>
          </label>
          <input 
            id="email"
            value={email} 
            onChange={(e)=>setEmail(e.target.value)} 
            type="email" 
            placeholder="example@email.com" 
            required
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white" 
          />
        </div>
        
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">
            Phone <span className="text-red-500">*</span>
          </label>
          <input 
            id="phone"
            value={phone} 
            onChange={(e)=>setPhone(e.target.value)} 
            placeholder="+91 00000-00000" 
            required
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white" 
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 mb-1.5">
          Avatar image <span className="text-gray-500 text-xs">(optional, max 2MB)</span>
        </label>
        <input 
          id="avatar"
          type="file" 
          accept="image/*" 
          onChange={handleFileChange} 
          className="block w-full text-sm text-gray-700 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:transition-colors bg-white rounded-lg border border-gray-300 p-2 cursor-pointer" 
        />
        {avatarPreview && (
          <div className="mt-3 flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <img src={avatarPreview} alt="Avatar preview" className="w-14 h-14 rounded-full object-cover ring-2 ring-gray-300 shadow-sm" />
            <div>
              <p className="text-sm font-medium text-gray-700">Preview</p>
              <button
                type="button"
                onClick={() => { setAvatarFile(null); setAvatarPreview('') }}
                className="text-xs text-red-600 hover:text-red-700 font-medium"
              >
                Remove
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex justify-end gap-3 pt-2">
        <button 
          type="button"
          onClick={handleSubmit}
          disabled={!first || !last || !email || !phone}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 active:bg-blue-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 disabled:hover:shadow-md"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
          </svg>
          Add Contact
        </button>
      </div>
    </div>
  )
}