import { useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'

/**
 * Mounts a WebGL canvas only once it approaches the viewport and pauses
 * its render loop whenever it scrolls out of view.
 */
export default function LazyCanvas({ children, className = '', camera, eager = false, ...props }) {
  const ref = useRef(null)
  const [mounted, setMounted] = useState(eager)
  const [visible, setVisible] = useState(eager)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting)
        if (entry.isIntersecting) setMounted(true)
      },
      { rootMargin: '300px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} className={className}>
      {mounted && (
        <Canvas
          dpr={[1, 1.75]}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          camera={camera}
          frameloop={visible ? 'always' : 'never'}
          {...props}
        >
          {children}
        </Canvas>
      )}
    </div>
  )
}
