import React, { useState, useRef, useEffect, useMemo } from 'react'
import { Search, CircleDot } from 'lucide-react'

const GooeyFilter = () => (
  <svg style={{ position: "absolute", width: 0, height: 0 }} aria-hidden="true">
    <defs>
      <filter id="gooey-effect">
        <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur" />
        <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -8" result="goo" />
        <feComposite in="SourceGraphic" in2="goo" operator="atop" />
      </filter>
    </defs>
  </svg>
)

export default function SearchBar({ value, onChange }) {
  const inputRef = useRef(null)
  const [isFocused, setIsFocused] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isClicked, setIsClicked] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const isUnsupportedBrowser = useMemo(() => {
    if (typeof window === "undefined") return false
    const ua = navigator.userAgent.toLowerCase()
    const isSafari = ua.includes("safari") && !ua.includes("chrome") && !ua.includes("chromium")
    const isChromeOniOS = ua.includes("crios")
    return isSafari || isChromeOniOS
  }, [])

  const handleSearch = (e) => {
    onChange(e.target.value)
  }

  const handleMouseMove = (e) => {
    if (isFocused) {
      const rect = e.currentTarget.getBoundingClientRect()
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }
  }

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
    setIsClicked(true)
    setTimeout(() => setIsClicked(false), 800)
  }

  useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isFocused])

  const particles = Array.from({ length: isFocused ? 18 : 0 }, (_, i) => (
    <div
      key={i}
      className="absolute w-3 h-3 rounded-full bg-gradient-to-r from-purple-400 to-pink-400"
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        filter: "blur(2px)",
        animation: `particle-float ${Math.random() * 1.5 + 1.5}s ease-in-out infinite alternate`,
        transform: `translate(${(Math.random() - 0.5) * 40}px, ${(Math.random() - 0.5) * 40}px) scale(${Math.random() * 0.8 + 0.4})`,
        opacity: 0.8,
      }}
    />
  ))

  const clickParticles = isClicked
    ? Array.from({ length: 14 }, (_, i) => (
        <div
          key={`click-${i}`}
          className="absolute w-3 h-3 rounded-full"
          style={{
            left: mousePosition.x,
            top: mousePosition.y,
            background: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 200) + 55}, ${Math.floor(Math.random() * 255)}, 0.8)`,
            boxShadow: "0 0 8px rgba(255, 255, 255, 0.8)",
            animation: `click-particle ${Math.random() * 0.8 + 0.5}s ease-out forwards`,
            transform: `translate(${(Math.random() - 0.5) * 160}px, ${(Math.random() - 0.5) * 160}px) scale(${Math.random() * 0.8 + 0.2})`,
          }}
        />
      ))
    : null

  return (
    <div className="mb-6 relative w-full flex justify-center">
      <GooeyFilter />
      <style>{`
        @keyframes particle-float {
          0%, 100% { opacity: 0; }
          50% { opacity: 0.8; }
        }
        @keyframes click-particle {
          to { opacity: 0; }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 40px rgba(139, 92, 246, 0.3); }
          50% { box-shadow: 0 0 60px rgba(236, 72, 153, 0.5); }
        }
        @keyframes gradient-shift {
          0% { background: linear-gradient(90deg, #f6d365 0%, #fda085 100%); }
          33% { background: linear-gradient(90deg, #a1c4fd 0%, #c2e9fb 100%); }
          66% { background: linear-gradient(90deg, #d4fc79 0%, #96e6a1 100%); }
          100% { background: linear-gradient(90deg, #f6d365 0%, #fda085 100%); }
        }
        .search-container {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .search-container.focused {
          width: 340px;
          transform: scale(1.05);
        }
        .search-container:not(.focused) {
          width: 240px;
        }
        .search-icon {
          transition: all 0.3s ease;
        }
        .search-icon.animating {
          animation: search-shake 0.6s ease-in-out;
        }
        @keyframes search-shake {
          0%, 100% { transform: rotate(0) scale(1); }
          25% { transform: rotate(-15deg) scale(1.3); }
          50% { transform: rotate(15deg) scale(1.3); }
          75% { transform: rotate(-10deg) scale(1.3); }
        }
      `}</style>
      <div
        className={`search-container ${isFocused ? 'focused' : ''}`}
        onMouseMove={handleMouseMove}
      >
        <div
          className={`flex items-center w-full rounded-full border relative overflow-hidden backdrop-blur-md transition-all duration-300 ${
            isFocused 
              ? 'border-transparent shadow-xl' 
              : 'border-gray-200 bg-white/30'
          }`}
          style={{
            boxShadow: isClicked
              ? "0 0 40px rgba(139, 92, 246, 0.5), 0 0 15px rgba(236, 72, 153, 0.7) inset"
              : isFocused
              ? "0 15px 35px rgba(0, 0, 0, 0.2)"
              : "0 0 0 rgba(0, 0, 0, 0)",
          }}
          onClick={handleClick}
        >
          {isFocused && (
            <div
              className="absolute inset-0 -z-10 opacity-15"
              style={{
                animation: "gradient-shift 15s linear infinite"
              }}
            />
          )}

          <div
            className="absolute inset-0 overflow-hidden rounded-full -z-5"
            style={{ filter: isUnsupportedBrowser ? "none" : "url(#gooey-effect)" }}
          >
            {particles}
          </div>

          {isClicked && (
            <>
              <div
                className="absolute inset-0 -z-5 rounded-full bg-purple-400/10"
                style={{
                  animation: "pulse-glow 0.8s ease-out"
                }}
              />
              <div
                className="absolute inset-0 -z-5 rounded-full bg-white"
                style={{
                  opacity: 0.5,
                  animation: "click-particle 0.3s ease-out forwards"
                }}
              />
            </>
          )}

          {clickParticles}

          <div className="pl-4 py-3">
            <Search
              size={20}
              strokeWidth={isFocused ? 2.5 : 2}
              className={`search-icon transition-all duration-300 ${
                isAnimating ? 'animating text-purple-500' : isFocused ? 'text-purple-600' : 'text-gray-500'
              }`}
            />
          </div>

          <input
            ref={inputRef}
            type="text"
            placeholder="Search by name..."
            value={value}
            onChange={handleSearch}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            className={`w-full py-3 bg-transparent outline-none placeholder:text-gray-400 font-medium text-base relative z-10 transition-all duration-300 ${
              isFocused ? 'text-gray-800 tracking-wide' : 'text-gray-600'
            }`}
          />

          {isFocused && (
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background: "radial-gradient(circle at 50% 0%, rgba(255,255,255,0.8) 0%, transparent 70%)",
                animation: "particle-float 2s ease-in-out infinite"
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}