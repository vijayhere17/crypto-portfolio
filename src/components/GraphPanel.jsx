import { useEffect, useRef, useState } from 'react'
import { gsap } from '../lib/motion'

/** Keeps a graph's selection cycling on its own until the visitor takes over. */
export function useAutoCycle(count, delay = 3800) {
  const [active, setActive] = useState(0)
  const touched = useRef(false)

  useEffect(() => {
    const id = setInterval(() => {
      if (!touched.current) setActive((a) => (a + 1) % count)
    }, delay)
    return () => clearInterval(id)
  }, [count, delay])

  const select = (i) => {
    touched.current = true
    setActive(((i % count) + count) % count)
  }
  return [active, select]
}

/** Detail card for the selected node, with an animated swap between items. */
export default function GraphPanel({ items, active, onSelect, className = '' }) {
  const body = useRef(null)
  const item = items[active]

  useEffect(() => {
    if (!body.current) return
    gsap.fromTo(body.current.children, { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, ease: 'power3.out', stagger: 0.05 })
  }, [active])

  return (
    <div className={`rounded-2xl border border-line bg-ink-2/80 p-6 backdrop-blur-md md:p-7 ${className}`}>
      <div className="flex items-center justify-between font-mono text-xs text-mute">
        <span>
          <span className="text-accent">{String(active + 1).padStart(2, '0')}</span> / {String(items.length).padStart(2, '0')}
        </span>
        <div className="flex gap-2">
          {[-1, 1].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => onSelect(active + d)}
              aria-label={d < 0 ? 'Previous' : 'Next'}
              className="grid h-10 w-10 place-items-center rounded-full border border-line text-white/70 transition-colors hover:border-accent hover:text-accent"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={d < 0 ? 'rotate-180' : ''} aria-hidden="true">
                <path d="M1 6h10M7 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          ))}
        </div>
      </div>
      <div ref={body} className="mt-6 min-h-[7.5rem]" aria-live="polite">
        <h3 className="text-2xl font-semibold tracking-tight md:text-[1.7rem]">{item.title}</h3>
        <p className="mt-3 leading-relaxed text-white/60">{item.text}</p>
      </div>
    </div>
  )
}
