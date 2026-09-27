import { useRef } from 'react'
import LazyCanvas from '../three/LazyCanvas'
import CryptoScene from '../three/CryptoScene'
import { site } from '../data/site'
import { Arrow } from './Navbar'
import { gsap, ScrollTrigger, scrollToTarget, useGSAP, useIsMobile, useLenis } from '../lib/motion'

export default function Hero() {
  const root = useRef(null)
  const progress = useRef(0)
  const isMobile = useIsMobile()
  const lenis = useLenis()

  useGSAP(
    () => {
      gsap.from('[data-line] > span', { yPercent: 115, duration: 1.4, ease: 'expo.out', stagger: 0.09, delay: 0.25 })
      gsap.from('[data-fade]', { autoAlpha: 0, y: 24, duration: 1.1, ease: 'power3.out', stagger: 0.08, delay: 0.85 })
      gsap.from('[data-canvas]', { autoAlpha: 0, scale: 1.08, duration: 2.2, ease: 'power2.out' })

      ScrollTrigger.create({
        trigger: root.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => (progress.current = self.progress),
      })
      gsap.to('[data-content]', {
        yPercent: -18,
        autoAlpha: 0,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: '75% top', scrub: true },
      })
      gsap.to('[data-canvas-scroll]', {
        autoAlpha: 0.2,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: '30% top', end: 'bottom top', scrub: true },
      })
    },
    { scope: root },
  )

  const { lead, joiner, accent, tail } = site.statement

  return (
    <section id="top" ref={root} className="relative h-[100svh] min-h-[640px] overflow-hidden">
      {/* outer wrapper fades on scroll, inner one plays the intro — kept separate so they don't fight */}
      <div data-canvas-scroll className="absolute inset-0">
        <div data-canvas className="absolute inset-0">
          <LazyCanvas eager className="h-full w-full" camera={{ position: [0, 0, 9], fov: 45 }}>
            <CryptoScene progress={progress} compact={isMobile} />
          </LazyCanvas>
        </div>
      </div>

      {/* atmosphere */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_55%_at_12%_100%,rgba(255,91,36,0.2),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,transparent_40%,#08080a_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />

      <div data-content className="container-x pointer-events-none relative flex h-full flex-col justify-end pb-8 pt-28 md:pb-10">
        <p data-fade className="mb-5 font-mono text-[0.72rem] uppercase tracking-[0.22em] text-accent md:mb-7">
          {site.disciplines.join('  •  ')}
        </p>

        <h1 className="display max-w-[16ch] text-[clamp(2.6rem,6.6vw,7rem)]">
          <span data-line className="block overflow-hidden pb-[0.08em]">
            <span className="block">{lead}</span>
          </span>
          <span data-line className="block overflow-hidden pb-[0.08em]">
            <span className="block">
              {joiner && `${joiner} `}<em className="font-serif font-normal italic tracking-[-0.02em] text-accent-soft">{accent}</em>{' '}
              {tail.split(' ').flatMap((w, i) => [
                i > 0 ? ' ' : null,
                <span key={i} className="whitespace-nowrap">
                  {w}
                </span>,
              ])}
            </span>
          </span>
        </h1>

        <div className="mt-8 flex flex-col gap-7 md:mt-10 md:flex-row md:items-end md:justify-between">
          <p data-fade className="max-w-[26rem] flex-1 text-[0.98rem] leading-relaxed text-white/65">
            {site.intro}
          </p>
          <a
            data-fade
            href="#services"
            onClick={(e) => {
              e.preventDefault()
              scrollToTarget(lenis, '#services')
            }}
            className="btn btn-light pointer-events-auto self-start md:self-auto"
          >
            Explore our services
            <span className="btn-dot">
              <Arrow className="rotate-90" />
            </span>
          </a>
        </div>

        <ul data-fade className="mt-10 grid grid-cols-2 gap-y-3 border-t border-line pt-5 md:mt-14 md:grid-cols-4">
          {['Blockchain & dApps', 'DEX & CEX Exchanges', 'NFT & Marketplaces', 'Tokens & Wallets'].map((s, i) => (
            <li key={s} className="flex items-baseline gap-2.5 text-[0.85rem] font-medium text-white/85">
              <span className="font-mono text-xs text-accent">#0{i + 1}</span>
              {s}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
