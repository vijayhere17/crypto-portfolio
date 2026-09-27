import { useEffect, useRef } from 'react'
import ServiceVisual from './ServiceVisual'
import { Arrow } from './Navbar'
import { services } from '../data/services'
import { steps } from '../data/content'
import { telegramUrl } from '../data/site'
import { gsap, useLenis } from '../lib/motion'

const pad = (n) => String(n).padStart(2, '0')

export default function ServiceDetail({ index, onClose, onNavigate }) {
  const lenis = useLenis()
  const panel = useRef(null)
  const closeBtn = useRef(null)
  const service = services[index]
  const next = (index + 1) % services.length

  // Enter animation + scroll lock
  useEffect(() => {
    lenis?.stop()
    document.documentElement.style.overflow = 'hidden'
    closeBtn.current?.focus()
    gsap.fromTo(panel.current, { yPercent: 100 }, { yPercent: 0, duration: 0.9, ease: 'expo.out' })
    const onKey = (e) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = ''
      lenis?.start()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Content swap when moving between services
  useEffect(() => {
    const el = panel.current
    el.scrollTop = 0
    gsap.fromTo(el.querySelectorAll('[data-cs]'), { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9, ease: 'power3.out', stagger: 0.05, delay: 0.15 })
  }, [index])

  function close() {
    gsap.to(panel.current, { yPercent: 100, duration: 0.7, ease: 'expo.in', onComplete: onClose })
  }

  return (
    <div
      ref={panel}
      data-lenis-prevent
      role="dialog"
      aria-modal="true"
      aria-label={service.title}
      className="fixed inset-0 z-[80] overflow-y-auto overscroll-contain bg-ink"
    >
      <div className="sticky top-0 z-10 border-b border-line bg-ink/80 backdrop-blur-xl">
        <div className="container-x flex h-16 items-center justify-between">
          <span className="font-mono text-xs tracking-[0.2em] text-white/60">
            SERVICE <span className="text-accent">{pad(index + 1)}</span> / {pad(services.length)}
          </span>
          <button ref={closeBtn} type="button" onClick={close} className="btn btn-ghost !min-h-0 !py-1.5">
            Close
            <span className="btn-dot !h-7 !w-7 text-sm">✕</span>
          </button>
        </div>
      </div>

      <div className="container-x pb-10 pt-12 md:pt-20">
        <div data-cs className="flex flex-wrap gap-2">
          {service.stack.map((c) => (
            <span key={c} className="rounded-full border border-line px-3 py-1 text-xs text-white/70">
              {c}
            </span>
          ))}
        </div>
        <h2 data-cs className="display mt-6 max-w-5xl text-[clamp(2.6rem,7vw,7rem)]">{service.title}</h2>
        <p data-cs className="mt-5 font-serif text-[clamp(1.5rem,2.6vw,2.2rem)] italic text-accent-soft">{service.tagline}</p>

        <div data-cs className="mt-12 aspect-[4/3] overflow-hidden rounded-2xl border border-line sm:aspect-[16/9]">
          <ServiceVisual service={service} />
        </div>

        <div data-cs className="mt-20 grid gap-6 md:mt-28 md:grid-cols-12">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent md:col-span-3">01 — Overview</p>
          <p className="text-[clamp(1.4rem,2.6vw,2.3rem)] font-medium leading-[1.25] tracking-tight text-white/90 md:col-span-9">
            {service.summary}
          </p>
        </div>

        <div className="mt-20 grid gap-6 md:mt-28 md:grid-cols-12">
          <p data-cs className="font-mono text-xs uppercase tracking-[0.2em] text-accent md:col-span-3">02 — What’s included</p>
          <ul className="grid border-t border-line sm:grid-cols-2 md:col-span-9">
            {service.features.map((f, i) => (
              <li key={f} data-cs className={`flex gap-4 border-b border-line py-6 ${i % 2 ? 'sm:border-l sm:pl-6' : 'sm:pr-6'}`}>
                <span className="font-mono text-xs text-accent">{pad(i + 1)}</span>
                <span className="text-lg font-medium">{f}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-20 grid gap-6 md:mt-28 md:grid-cols-12">
          <p data-cs className="font-mono text-xs uppercase tracking-[0.2em] text-accent md:col-span-3">03 — How we deliver</p>
          <ol data-cs className="flex flex-wrap items-center gap-x-3 gap-y-3 md:col-span-9">
            {steps.map((s, i) => (
              <li key={s.title} className="flex items-center gap-3">
                <span className="rounded-full border border-line px-4 py-2 text-sm font-medium">
                  <span className="mr-2 font-mono text-xs text-accent">{pad(i + 1)}</span>
                  {s.title}
                </span>
                {i < steps.length - 1 && <span className="h-px w-5 bg-white/20" />}
              </li>
            ))}
          </ol>
        </div>

        <div data-cs className="mt-20 flex flex-col items-start justify-between gap-6 rounded-2xl border border-line bg-ink-2 p-8 md:mt-28 md:flex-row md:items-center md:p-10">
          <div>
            <p className="display text-[clamp(1.8rem,3vw,2.6rem)]">Planning a {service.short} project?</p>
            <p className="mt-2 text-white/55">Tell us the idea — we’ll reply on Telegram with scope and next steps.</p>
          </div>
          <a href={telegramUrl} target="_blank" rel="noreferrer" className="btn btn-light shrink-0">
            Discuss on Telegram
            <span className="btn-dot">
              <Arrow />
            </span>
          </a>
        </div>
      </div>

      <button type="button" onClick={() => onNavigate(next)} className="group mt-16 block w-full border-t border-line py-16 text-left md:py-24">
        <div className="container-x">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-mute">Next service</p>
          <p className="display mt-4 flex items-center gap-6 text-[clamp(2.2rem,6vw,5.5rem)] transition-colors group-hover:text-accent-soft">
            {services[next].title}
            <Arrow className="h-[0.5em] w-[0.5em] shrink-0 transition-transform duration-500 group-hover:translate-x-3" />
          </p>
        </div>
      </button>
    </div>
  )
}
