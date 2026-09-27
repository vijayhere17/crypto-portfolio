import { useEffect, useRef, useState } from 'react'
import Logo from './Logo'
import { telegramUrl } from '../data/site'
import { gsap, scrollToTarget, useLenis } from '../lib/motion'

const links = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Expertise', href: '#expertise' },
  { label: 'Process', href: '#process' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const lenis = useLenis()
  const [compact, setCompact] = useState(false)
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 60)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const menu = menuRef.current
    if (!menu) return
    if (open) {
      lenis?.stop()
      gsap.set(menu, { display: 'flex' })
      gsap.fromTo(menu, { clipPath: 'circle(0% at 100% 0%)' }, { clipPath: 'circle(150% at 100% 0%)', duration: 0.8, ease: 'expo.inOut' })
      gsap.fromTo(menu.querySelectorAll('[data-menu-item]'), { yPercent: 120 }, { yPercent: 0, duration: 0.9, ease: 'expo.out', stagger: 0.06, delay: 0.3 })
    } else {
      lenis?.start()
      gsap.to(menu, {
        clipPath: 'circle(0% at 100% 0%)',
        duration: 0.6,
        ease: 'expo.inOut',
        onComplete: () => gsap.set(menu, { display: 'none' }),
      })
    }
  }, [open, lenis])

  const go = (e, href) => {
    e.preventDefault()
    setOpen(false)
    scrollToTarget(lenis, href)
  }

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        <div className={`container-x transition-all duration-500 ${compact ? 'pt-3' : 'pt-6'}`}>
          <nav
            className={`flex items-center justify-between rounded-full border transition-all duration-500 ${
              compact
                ? 'border-line bg-ink/70 py-2 pl-5 pr-2 backdrop-blur-xl'
                : 'border-transparent py-2 pl-0 pr-0'
            }`}
            aria-label="Main"
          >
            <a href="#top" onClick={(e) => go(e, '#top')} aria-label="Rocyweb — back to top" className="-my-1 py-2">
              <Logo />
            </a>

            <ul className="hidden items-center gap-9 lg:flex">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={(e) => go(e, l.href)}
                    className="group relative text-[0.78rem] font-medium uppercase tracking-[0.14em] text-white/75 transition-colors hover:text-white"
                  >
                    {l.label}
                    <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-accent transition-transform duration-500 group-hover:origin-left group-hover:scale-x-100" />
                  </a>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-2">
              <a href={telegramUrl} target="_blank" rel="noreferrer" className="btn btn-light hidden !min-h-0 sm:inline-flex">
                Start a project
                <span className="btn-dot !h-8 !w-8">
                  <Arrow />
                </span>
              </a>
              <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="relative z-[70] grid h-11 w-11 place-items-center rounded-full border border-line bg-ink/60 backdrop-blur lg:hidden"
                aria-expanded={open}
                aria-label={open ? 'Close menu' : 'Open menu'}
              >
                <span className={`absolute h-px w-4 bg-white transition-transform duration-500 ${open ? 'rotate-45' : '-translate-y-[4px]'}`} />
                <span className={`absolute h-px w-4 bg-white transition-transform duration-500 ${open ? '-rotate-45' : 'translate-y-[4px]'}`} />
              </button>
            </div>
          </nav>
        </div>
      </header>

      <div
        ref={menuRef}
        className="fixed inset-0 z-[45] hidden flex-col justify-between bg-ink-2 px-5 pb-10 pt-28 lg:hidden"
        style={{ clipPath: 'circle(0% at 100% 0%)' }}
      >
        <ul className="space-y-2">
          {links.map((l, i) => (
            <li key={l.href} className="overflow-hidden">
              <a
                data-menu-item
                href={l.href}
                onClick={(e) => go(e, l.href)}
                className="flex items-baseline gap-4 py-1 text-[2.6rem] font-semibold tracking-tight"
              >
                <span className="font-mono text-xs text-accent">0{i + 1}</span>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="overflow-hidden">
          <a data-menu-item href={telegramUrl} target="_blank" rel="noreferrer" className="btn btn-light w-full justify-between">
            Start a project on Telegram
            <span className="btn-dot">
              <Arrow />
            </span>
          </a>
        </div>
      </div>
    </>
  )
}

export function Arrow({ className = '' }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
