import React, { useEffect, useRef } from 'react'

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 5 + 2;
    this.speedX = Math.random() * 2 - 1;
    this.speedY = -Math.random() * 3 - 1;
    this.life = 100;
    this.initialSize = this.size;
    this.hue = Math.random() * 360;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.life -= 1;
    this.size = Math.max(0, this.initialSize * (this.life / 100));
    this.hue = (this.hue + 0.5) % 360;
  }
}

export default function SmokeBackground() {
  const canvasRef = useRef(null)
  const particlesRef = useRef([])
  const mousePosRef = useRef({ x: 0, y: 0 })
  const animationFrameRef = useRef()

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
            const opacity = (p.life / 100) * 0.7
            ctx.fillStyle = `hsla(${p.hue}, 80%, 65%, ${opacity})`
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

      if (Math.random() < 0.3) {
        particlesRef.current.push(
          new Particle(
            Math.random() * canvas.width,
            canvas.height - 50 + Math.random() * 50
          )
        )
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
