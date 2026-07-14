import { useRef, useEffect } from 'react'
import { useTheme } from '../contexts/ThemeContext'

const MAX_CONNECTIONS = 4
const CLUSTER_THRESHOLD = 0.3
const BURST_FORCE = 1.2
const CLUSTER_CHECK_INTERVAL = 40

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  r: number
}

interface Edge {
  a: number
  b: number
  dist: number
}

// Derive parameters from screen width
function getParams(w: number, _h: number) {
  // Phone:   < 768px  → fewer particles, shorter connections
  // Tablet:  768-1024 → moderate
  // Desktop: > 1024   → full
  const isPhone = w < 768
  const isTablet = w >= 768 && w < 1024

  const count = isPhone ? 30 : isTablet ? 40 : 50
  const connDist = isPhone ? 130 : isTablet ? 160 : 180
  const mouseRadius = isPhone ? 160 : isTablet ? 200 : 220
  const mouseForce = isPhone ? 0.05 : 0.04
  const dotRMin = isPhone ? 1.2 : 1.5
  const dotRMax = isPhone ? 3 : 3.5
  const lineW = isPhone ? 0.8 : 1

  return { count, connDist, mouseRadius, mouseForce, dotRMin, dotRMax, lineW }
}

function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const pointerRef = useRef({ x: -1000, y: -1000 })
  const rafRef = useRef(0)
  const frameRef = useRef(0)
  const paramsRef = useRef(getParams(window.innerWidth, window.innerHeight))
  const { theme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    let w = 0
    let h = 0

    const resize = () => {
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
      // Recompute parameters on significant size change
      const oldParams = paramsRef.current
      const newParams = getParams(w, h)
      if (newParams.count !== oldParams.count || newParams.connDist !== oldParams.connDist) {
        paramsRef.current = newParams
        initParticles(newParams)
      }
    }

    const initParticles = (p = paramsRef.current) => {
      const arr: Particle[] = []
      for (let i = 0; i < p.count; i++) {
        arr.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          r: Math.random() * (p.dotRMax - p.dotRMin) + p.dotRMin,
        })
      }
      particlesRef.current = arr
      frameRef.current = 0
    }

    // Mouse or touch
    const updatePointer = (x: number, y: number) => {
      pointerRef.current = { x, y }
    }

    const handleMouse = (e: MouseEvent) => updatePointer(e.clientX, e.clientY)
    const handleTouch = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        updatePointer(e.touches[0].clientX, e.touches[0].clientY)
      }
    }
    const handleTouchEnd = () => {
      pointerRef.current = { x: -1000, y: -1000 }
    }

    // DFS to find connected components
    const findClusters = (neighbors: number[][]): number[][] => {
      const n = neighbors.length
      const visited = new Array(n).fill(false)
      const clusters: number[][] = []

      for (let i = 0; i < n; i++) {
        if (visited[i]) continue
        const stack = [i]
        const component: number[] = []
        visited[i] = true

        while (stack.length > 0) {
          const node = stack.pop()!
          component.push(node)
          for (const nb of neighbors[node]) {
            if (!visited[nb]) {
              visited[nb] = true
              stack.push(nb)
            }
          }
        }
        clusters.push(component)
      }
      return clusters
    }

    const animate = () => {
      ctx.clearRect(0, 0, w, h)

      const p = paramsRef.current
      const isDark = theme === 'dark'
      const dotColor = isDark ? 'rgba(168, 85, 247, 0.7)' : 'rgba(147, 51, 234, 0.55)'
      const lineColor = (opacity: number) =>
        isDark
          ? `rgba(168, 85, 247, ${opacity})`
          : `rgba(147, 51, 234, ${opacity})`

      const particles = particlesRef.current
      const { x: mx, y: my } = pointerRef.current

      // Build all candidate edges within connection distance
      const allEdges: Edge[] = []
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < p.connDist) {
            allEdges.push({ a: i, b: j, dist })
          }
        }
      }

      // Limit each node to MAX_CONNECTIONS closest neighbors
      const nodeEdges: Edge[][] = Array.from({ length: particles.length }, () => [])
      for (const e of allEdges) {
        nodeEdges[e.a].push(e)
        nodeEdges[e.b].push({ a: e.b, b: e.a, dist: e.dist })
      }

      const neighbors: number[][] = Array.from({ length: particles.length }, () => [])
      for (let i = 0; i < particles.length; i++) {
        nodeEdges[i].sort((a, b) => a.dist - b.dist)
        for (let k = 0; k < Math.min(MAX_CONNECTIONS, nodeEdges[i].length); k++) {
          neighbors[i].push(nodeEdges[i][k].b)
        }
      }

      // Periodic cluster detection and burst
      const f = frameRef.current
      if (f % CLUSTER_CHECK_INTERVAL === 0 && particles.length > 0) {
        const clusters = findClusters(neighbors)
        const threshold = CLUSTER_THRESHOLD * particles.length
        for (const cluster of clusters) {
          if (cluster.length >= threshold) {
            let cx = 0, cy = 0
            for (const idx of cluster) {
              cx += particles[idx].x
              cy += particles[idx].y
            }
            cx /= cluster.length
            cy /= cluster.length

            for (const idx of cluster) {
              const pt = particles[idx]
              const dx = pt.x - cx
              const dy = pt.y - cy
              const dist = Math.sqrt(dx * dx + dy * dy) || 1
              pt.vx += (dx / dist) * BURST_FORCE
              pt.vy += (dy / dist) * BURST_FORCE
            }
          }
        }
      }
      frameRef.current = f + 1

      // Update & draw particles
      for (let i = 0; i < particles.length; i++) {
        const pt = particles[i]

        // Pointer attraction (mouse or touch)
        const dmx = mx - pt.x
        const dmy = my - pt.y
        const mdist = Math.sqrt(dmx * dmx + dmy * dmy)
        if (mdist < p.mouseRadius && mdist > 0) {
          const force = ((p.mouseRadius - mdist) / p.mouseRadius) * p.mouseForce
          pt.vx += (dmx / mdist) * force
          pt.vy += (dmy / mdist) * force
        }

        // Move
        pt.x += pt.vx
        pt.y += pt.vy

        // Damping
        pt.vx *= 0.99
        pt.vy *= 0.99

        // Wrap edges
        if (pt.x < -10) pt.x = w + 10
        if (pt.x > w + 10) pt.x = -10
        if (pt.y < -10) pt.y = h + 10
        if (pt.y > h + 10) pt.y = -10

        // Draw dot
        ctx.beginPath()
        ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2)
        ctx.fillStyle = dotColor
        ctx.fill()
      }

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (const j of neighbors[i]) {
          if (j < i) continue
          const a = particles[i]
          const b = particles[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          const opacity = (1 - dist / p.connDist) * 0.3
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.strokeStyle = lineColor(opacity)
          ctx.lineWidth = p.lineW
          ctx.stroke()
        }
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    resize()
    initParticles()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', handleMouse, { passive: true })
    window.addEventListener('touchmove', handleTouch, { passive: true })
    window.addEventListener('touchend', handleTouchEnd)
    window.addEventListener('touchcancel', handleTouchEnd)
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouse)
      window.removeEventListener('touchmove', handleTouch)
      window.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('touchcancel', handleTouchEnd)
    }
  }, [theme])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      aria-hidden="true"
    />
  )
}

export default ParticleBackground
