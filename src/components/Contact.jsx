import { useRef } from 'react'
import Logo from './Logo'
import { Arrow } from './Navbar'
import { site, telegramUrl } from '../data/site'
import { gsap, scrollToTarget, useGSAP, useLenis } from '../lib/motion'

function contactLinks(c) {
  return [
    c.telegram && { label: 'Telegram', value: `@${c.telegram}`, href: telegramUrl },
    c.email && { label: 'Email', value: c.email, href: `mailto:${c.email}` },
    c.phone && { label: 'Phone', value: c.phone, href: `tel:${c.phone.replace(/\s/g, '')}` },
    c.linkedin && { label: 'LinkedIn', value: 'LinkedIn', href: c.linkedin },
    c.twitter && { label: 'X / Twitter', value: 'X / Twitter', href: c.twitter },
    c.website && { label: 'Website', value: c.website.replace(/^https?:\/\//, ''), href: c.website },
  ].filter(Boolean)
}

export default function Contact() {
  const root = useRef(null)
  const lenis = useLenis()
  const links = contactLinks(site.contact)

  useGSAP(
    () => {
      const st = { trigger: root.current, start: 'top 65%', once: true }
      gsap.from('[data-line] > span', { yPercent: 115, duration: 1.3, ease: 'expo.out', stagger: 0.1, scrollTrigger: st })
      gsap.from('[data-fade]', { autoAlpha: 0, y: 30, duration: 1, ease: 'power3.out', stagger: 0.08, delay: 0.4, scrollTrigger: st })
      gsap.fromTo('[data-ring]', { scale: 0.6, autoAlpha: 0 }, {
        scale: 1,
        autoAlpha: 1,
        stagger: 0.12,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'center center', scrub: true },
      })
    },
    { scope: root },
  )

  return (
    <section id="contact" ref={root} className="relative flex min-h-[100svh] flex-col overflow-hidden">
      {/* portal rings */}
      <div className="pointer-events-none absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2" aria-hidden="true">
        {[1100, 820, 560].map((s, i) => (
          <div
            key={s}
            data-ring
            className="absolute left-1/2 top-1/2 rounded-full border"
            style={{
              width: s,
              height: s,
              marginLeft: -s / 2,
              marginTop: -s / 2,
              borderColor: i === 2 ? 'rgba(255,91,36,.35)' : 'rgba(255,255,255,.06)',
              boxShadow: i === 2 ? '0 0 120px rgba(255,91,36,.18), inset 0 0 120px rgba(255,91,36,.12)' : 'none',
            }}
          />
        ))}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(40%_40%_at_50%_42%,rgba(255,91,36,0.16),transparent_70%)]" />

      <div className="container-x relative flex flex-1 flex-col items-center justify-center py-28 text-center">
        <p data-fade className="eyebrow">Contact</p>
        <h2 className="display mt-8 text-[clamp(2.8rem,9vw,9.5rem)] uppercase leading-[0.9]">
          <span data-line className="block overflow-hidden pb-[0.06em]">
            <span className="block">Have a project</span>
          </span>
          <span data-line className="block overflow-hidden pb-[0.06em]">
            <span className="block">in mind?</span>
          </span>
        </h2>
        <p data-fade className="mt-6 font-serif text-[clamp(1.6rem,3vw,2.6rem)] italic text-accent-soft">
          Let’s build the next one.
        </p>

        <div data-fade className="mt-12 flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:items-center">
          <a href={telegramUrl} target="_blank" rel="noreferrer" className="btn btn-light justify-between">
            Start a conversation
            <span className="btn-dot">
              <Arrow />
            </span>
          </a>
          <a
            href="#services"
            onClick={(e) => {
              e.preventDefault()
              scrollToTarget(lenis, '#services')
            }}
            className="btn btn-ghost justify-between"
          >
            View services
            <span className="btn-dot">
              <Arrow className="-rotate-90" />
            </span>
          </a>
        </div>

        {links.length > 0 && (
          <ul data-fade className="mt-14 flex flex-wrap justify-center gap-x-10 gap-y-4">
            {links.map((l) => (
              <li key={l.label}>
                <a href={l.href} target="_blank" rel="noreferrer" className="group block text-left">
                  <span className="block font-mono text-[0.65rem] uppercase tracking-[0.2em] text-mute">{l.label}</span>
                  <span className="mt-1 block text-lg font-medium transition-colors group-hover:text-accent-soft">{l.value}</span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      <footer className="relative border-t border-line">
        <div className="container-x flex flex-col items-center justify-between gap-4 py-7 text-sm text-mute sm:flex-row">
          <Logo className="text-white" />
          <p>
            © {new Date().getFullYear()} {site.brand} — {site.brandSuffix}
          </p>
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault()
              scrollToTarget(lenis, '#top')
            }}
            className="inline-block py-3 transition-colors hover:text-white"
          >
            Back to top ↑
          </a>
        </div>
      </footer>
    </section>
  )
}
