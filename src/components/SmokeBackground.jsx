import React, { useEffect, useRef } from 'react'

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 4 + 1.5;
    this.speedX = (Math.random() * 1.4 - 0.7);
    this.speedY = -(Math.random() * 2.2 + 0.6);
    this.life = 100;
    this.initialSize = this.size;
    // Pastel-ish hues (blue/purple/pink band)
    const pastelBand = [210, 260, 320];
    const base = pastelBand[Math.floor(Math.random() * pastelBand.length)];
    this.hue = (base + Math.random() * 20 - 10 + 360) % 360;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.life -= 1;
    this.size = Math.max(0, this.initialSize * (this.life / 100));
    this.hue = (this.hue + 0.3) % 360;
  }
}

export default function SmokeBackground() {
  const canvasRef = useRef(null)
  const particlesRef = useRef([])
  const mousePosRef = useRef({ x: 0, y: 0 })
  const animationFrameRef = useRef()
  const lastAutoGenRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particlesRef.current = particlesRef.current
        .filter(p => p.life > 0 && p.size > 0)
        .map(p => {
          p.update()
          if (p.size > 0) {
            const opacity = (p.life / 100) * 0.45
            ctx.fillStyle = `hsla(${p.hue}, 70%, 72%, ${opacity})`
            ctx.beginPath()
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
            ctx.fill()
          }
          return p
        })

      if (mousePosRef.current.x !== 0 && mousePosRef.current.y !== 0) {
        for (let i = 0; i < 3; i++) {
          particlesRef.current.push(
            new Particle(
              mousePosRef.current.x + (Math.random() * 20 - 10),
              mousePosRef.current.y + (Math.random() * 20 - 10)
            )
          )
        }
      }

      const now = performance.now()
      if (now - lastAutoGenRef.current > 120) {
        if (Math.random() < 0.4) {
          particlesRef.current.push(
            new Particle(
              Math.random() * canvas.width,
              canvas.height - 50 + Math.random() * 50
            )
          )
        }
        lastAutoGenRef.current = now
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    updateCanvasSize()
    window.addEventListener('resize', updateCanvasSize)
    animate()

    return () => {
      window.removeEventListener('resize', updateCanvasSize)
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
    }
  }, [])

  const handleMouseMove = (e) => {
    mousePosRef.current = { x: e.clientX, y: e.clientY }
  }
  const handleMouseLeave = () => { mousePosRef.current = { x: 0, y: 0 } }

  return (
    <canvas
      ref={canvasRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="fixed top-0 left-0 w-full h-full"
      style={{ zIndex: 1 }}
    />
  )
}
