import { useRef, useState } from 'react'
import { MARK_SRC } from './Logo'
import { site } from '../data/site'
import { gsap, markReady, useGSAP } from '../lib/motion'

const HEX = 'M50 3 91 26.5v47L50 97 9 73.5v-47Z'

/**
 * Branded loader: the logo sits inside a hexagon that draws itself as the
 * page loads, then the screen lifts away (with an orange layer trailing it)
 * to reveal the site. Waits for the window load event, fonts and a short
 * minimum time so it never flashes.
 */
export default function Preloader() {
  const root = useRef(null)
  const [done, setDone] = useState(false)

  useGSAP(
    () => {
      const html = document.documentElement
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      html.style.overflow = 'hidden'
      window.scrollTo(0, 0)

      const num = root.current.querySelector('[data-num]')
      const bar = root.current.querySelector('[data-bar]')
      const hex = root.current.querySelector('[data-hex]')
      const counter = { v: 0 }
      const render = () => {
        num.textContent = String(Math.round(counter.v)).padStart(3, '0')
        bar.style.transform = `scaleX(${counter.v / 100})`
        hex.style.strokeDashoffset = String(1 - counter.v / 100)
      }

      gsap
        .timeline()
        .from('[data-mark]', { scale: 0.55, autoAlpha: 0, rotate: -30, duration: 1.1, ease: 'expo.out' })
        .from('[data-ui]', { autoAlpha: 0, y: 12, duration: 0.7, ease: 'power3.out', stagger: 0.08 }, 0.25)

      // Crawl towards 85% while real loading finishes.
      const crawl = gsap.to(counter, { v: 85, duration: reduced ? 0.2 : 2.4, ease: 'power2.out', onUpdate: render })

      const loaded = new Promise((res) => (document.readyState === 'complete' ? res() : window.addEventListener('load', res, { once: true })))
      const fonts = document.fonts?.ready ?? Promise.resolve()
      const minTime = new Promise((res) => setTimeout(res, reduced ? 0 : 1500))
      let cancelled = false

      Promise.all([loaded, fonts, minTime]).then(() => {
        if (cancelled) return
        crawl.kill()
        gsap
          .timeline({
            onComplete: () => {
              html.style.overflow = ''
              setDone(true)
            },
          })
          .to(counter, { v: 100, duration: 0.5, ease: 'power2.inOut', onUpdate: render })
          .to('[data-mark]', { scale: 1.12, duration: 0.3, ease: 'power2.out' })
          .to('[data-ui]', { autoAlpha: 0, y: -10, duration: 0.3, stagger: 0.04 }, '<')
          .to('[data-mark]', { scale: 0.4, autoAlpha: 0, duration: 0.4, ease: 'power3.in' })
          .add(markReady, '+=0.05')
          .to('[data-panel]', { yPercent: -100, duration: 0.95, ease: 'expo.inOut' }, '<')
          .to('[data-trail]', { yPercent: -100, duration: 0.95, ease: 'expo.inOut' }, '<0.12')
      })

      return () => {
        cancelled = true
        html.style.overflow = ''
      }
    },
    { scope: root },
  )

  if (done) return null

  return (
    <div ref={root} className="fixed inset-0 z-[95]" role="status" aria-live="polite" aria-label="Loading">
      <div data-trail className="absolute inset-0 bg-gradient-to-b from-[#ff7a3d] to-accent" />
      <div data-panel className="absolute inset-0 flex flex-col bg-ink">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(40%_40%_at_50%_45%,rgba(255,91,36,0.16),transparent_70%)]" />

        <div className="relative flex flex-1 items-center justify-center">
          <div data-mark className="relative grid h-44 w-44 place-items-center md:h-52 md:w-52">
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
              <path d={HEX} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="1" />
              <path
                data-hex
                d={HEX}
                fill="none"
                stroke="#ff5b24"
                strokeWidth="1.6"
                strokeLinejoin="round"
                pathLength="1"
                strokeDasharray="1"
                strokeDashoffset="1"
                style={{ filter: 'drop-shadow(0 0 6px rgba(255,91,36,.7))' }}
              />
            </svg>
            <img src={MARK_SRC} alt="" className="h-24 w-24 md:h-28 md:w-28" draggable="false" />
          </div>
        </div>

        <div className="container-x relative flex items-end justify-between pb-8 md:pb-10">
          <p data-ui className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-white/45">
            {site.brandSuffix}
          </p>
          <p data-ui className="font-mono text-4xl font-medium tabular-nums tracking-tight text-white md:text-5xl">
            <span data-num>000</span>
            <span className="text-accent">%</span>
          </p>
        </div>
        <div data-ui className="relative h-[2px] w-full bg-white/5">
          <div data-bar className="absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-white via-[#ff8a5c] to-accent" />
        </div>
      </div>
    </div>
  )
}
