import { useRef, useState } from 'react'
import ServiceVisual from './ServiceVisual'
import { Arrow } from './Navbar'
import { services } from '../data/services'
import { telegramUrl } from '../data/site'
import { ScrollTrigger, gsap, revealIn, useGSAP } from '../lib/motion'

const pad = (n) => String(n).padStart(2, '0')

export default function Services({ onOpen }) {
  const root = useRef(null)
  const pin = useRef(null)
  const track = useRef(null)
  const fill = useRef(null)
  const [current, setCurrent] = useState(0)

  useGSAP(
    () => {
      revealIn(root.current)
      const mm = gsap.matchMedia()

      // Desktop: pin the section and travel horizontally through the services.
      mm.add('(min-width: 1024px)', () => {
        const distance = () => track.current.scrollWidth - window.innerWidth
        const scroller = gsap.to(track.current, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: pin.current,
            pin: true,
            scrub: 1,
            end: () => `+=${distance()}`,
            invalidateOnRefresh: true,
            onUpdate: (self) => gsap.set(fill.current, { scaleX: self.progress }),
          },
        })

        gsap.utils.toArray('[data-panel]', root.current).forEach((panel, i) => {
          const visual = panel.querySelector('[data-visual]')
          const inner = panel.querySelector('[data-visual-inner]')
          const copy = panel.querySelectorAll('[data-copy] > *')
          const st = { trigger: panel, containerAnimation: scroller, scrub: true }

          gsap
            .timeline({ scrollTrigger: { ...st, start: 'left right', end: 'right left' } })
            .fromTo(visual, { rotateY: -28, scale: 0.8, z: -200 }, { rotateY: 0, scale: 1, z: 0, ease: 'power2.out' })
            .to(visual, { rotateY: 24, scale: 0.84, z: -160, ease: 'power2.in' })
          gsap.fromTo(inner, { xPercent: -5 }, { xPercent: 5, ease: 'none', scrollTrigger: { ...st, start: 'left right', end: 'right left' } })
          gsap.from(copy, { y: 60, autoAlpha: 0, stagger: 0.06, ease: 'power3.out', scrollTrigger: { ...st, start: 'left 75%', end: 'left 25%' } })

          // Counter follows whichever panel is centred.
          ScrollTrigger.create({
            trigger: panel,
            containerAnimation: scroller,
            start: 'left center',
            end: 'right center',
            onToggle: (self) => self.isActive && setCurrent(i),
          })
        })
      })
    },
    { scope: root },
  )

  return (
    <section id="services" ref={root} className="relative">
      {/* mobile / tablet heading */}
      <div className="container-x pt-24 lg:hidden">
        <p data-reveal className="eyebrow">What we build</p>
        <h2 data-reveal className="display mt-5 text-[clamp(3rem,12vw,5rem)]">
          What we <em className="font-serif font-normal italic text-accent-soft">build</em>
        </h2>
        <p data-reveal className="mt-4 text-sm text-white/50">
          {services.length} services · swipe →
        </p>
      </div>

      <div ref={pin} className="relative lg:h-screen lg:overflow-hidden">
        <div
          ref={track}
          className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-6 pt-10 md:px-10 lg:h-full lg:snap-none lg:items-center lg:gap-[7vw] lg:overflow-visible lg:px-[6vw] lg:py-0"
        >
          {/* intro panel (desktop) */}
          <div className="hidden w-[34vw] shrink-0 lg:block">
            <p className="eyebrow">What we build</p>
            <h2 className="display mt-6 text-[clamp(4rem,8.5vw,9rem)] leading-[0.86]">
              What we
              <br />
              <em className="font-serif font-normal italic tracking-[-0.02em] text-accent-soft">build</em>
            </h2>
            <p className="mt-8 max-w-xs leading-relaxed text-white/55">
              {pad(services.length)} services — chains, dApps, wallets, exchanges, NFTs, tokens, messengers and whatever comes next. Keep scrolling.
            </p>
          </div>

          {services.map((s, i) => (
            <article
              key={s.id}
              data-panel
              className="w-[86vw] shrink-0 snap-center sm:w-[70vw] lg:grid lg:w-[80vw] lg:grid-cols-12 lg:items-center lg:gap-12"
              style={{ perspective: '1600px' }}
            >
              <button
                type="button"
                data-visual
                onClick={() => onOpen(i)}
                className="group relative block aspect-[4/3] w-full overflow-hidden rounded-2xl border border-line bg-ink-2 text-left will-change-transform sm:aspect-[16/10] lg:col-span-8"
                aria-label={`Open service: ${s.title}`}
              >
                <div data-visual-inner className="absolute inset-[-5%] transition-transform duration-1000 group-hover:scale-[1.03]">
                  <ServiceVisual service={s} />
                </div>
                <span className="absolute bottom-4 left-4 rounded-full border border-white/10 bg-ink/75 px-3 py-1.5 font-mono text-[0.68rem] tracking-[0.2em] text-white/80 backdrop-blur">
                  SERVICE {pad(i + 1)}
                </span>
                <span className="absolute bottom-5 right-5 grid h-12 w-12 place-items-center rounded-full bg-white text-ink opacity-0 transition-all duration-500 group-hover:opacity-100 lg:scale-75 lg:group-hover:scale-100">
                  <Arrow className="-rotate-45" />
                </span>
              </button>

              <div data-copy className="mt-6 lg:col-span-4 lg:mt-0">
                <p className="font-mono text-xs tracking-[0.2em] text-accent">SERVICE {pad(i + 1)}</p>
                <h3 className="display mt-3 text-[clamp(1.9rem,3.2vw,3.2rem)] leading-[1]">{s.title}</h3>
                <p className="mt-4 font-serif text-xl italic text-accent-soft">{s.tagline}</p>
                <p className="mt-4 max-w-sm leading-relaxed text-white/60">{s.summary}</p>
                <p className="mt-5 flex flex-wrap gap-2">
                  {s.stack.map((c) => (
                    <span key={c} className="rounded-full border border-line px-3 py-1 text-xs text-white/70">
                      {c}
                    </span>
                  ))}
                </p>
                <button type="button" onClick={() => onOpen(i)} className="btn btn-ghost mt-7">
                  Explore service
                  <span className="btn-dot">
                    <Arrow />
                  </span>
                </button>
              </div>
            </article>
          ))}

          {/* outro panel */}
          <div className="flex w-[70vw] shrink-0 snap-center flex-col justify-center sm:w-[50vw] lg:w-[30vw]">
            <p className="display text-[clamp(2.2rem,4vw,4rem)]">
              Something
              <br />
              <em className="font-serif font-normal italic text-accent-soft">not on the list?</em>
            </p>
            <p className="mt-4 max-w-xs text-white/55">If it runs on a blockchain, we can build it.</p>
            <a href={telegramUrl} target="_blank" rel="noreferrer" className="btn btn-light mt-8 self-start">
              Pitch your idea
              <span className="btn-dot">
                <Arrow />
              </span>
            </a>
          </div>
        </div>

        {/* progress (desktop) */}
        <div className="container-x absolute inset-x-0 bottom-8 hidden items-center gap-6 lg:flex">
          <span className="font-mono text-xs text-white/60">
            <span className="text-white">{pad(current + 1)}</span> / {pad(services.length)}
          </span>
          <span className="w-56 truncate font-mono text-xs uppercase tracking-[0.14em] text-white/40">{services[current].short}</span>
          <div className="relative h-px flex-1 bg-white/10">
            <div ref={fill} className="absolute inset-0 origin-left scale-x-0 bg-accent" />
          </div>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-white/40">Scroll</span>
        </div>
      </div>
    </section>
  )
}
