import { useRef, useState } from 'react'
import { steps } from '../data/content'
import { gsap, revealIn, useGSAP } from '../lib/motion'

const pad = (n) => String(n).padStart(2, '0')

export default function Process() {
  const root = useRef(null)
  const pin = useRef(null)
  const fill = useRef(null)
  const vfill = useRef(null)
  const [active, setActive] = useState(0)

  useGSAP(
    () => {
      revealIn(root.current)
      const mm = gsap.matchMedia()

      // Desktop: one pinned stage — scroll drives the journey from step to step.
      mm.add('(min-width: 1024px)', () => {
        gsap.to(fill.current, {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: pin.current,
            pin: true,
            scrub: 0.6,
            start: 'top top',
            end: `+=${steps.length * 55}%`,
            onUpdate: (self) => {
              const i = Math.min(steps.length - 1, Math.floor(self.progress * steps.length))
              setActive((a) => (a === i ? a : i))
            },
          },
        })
      })

      // Mobile: a vertical line fills as you read down the steps.
      mm.add('(max-width: 1023px)', () => {
        gsap.to(vfill.current, {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: { trigger: '[data-vlist]', start: 'top 70%', end: 'bottom 60%', scrub: true },
        })
      })
    },
    { scope: root },
  )

  const state = (i) => (i === active ? 'opacity-100 translate-y-0' : i < active ? 'opacity-0 -translate-y-10' : 'opacity-0 translate-y-10')

  return (
    <section id="process" ref={root} className="relative">
      {/* Desktop stage */}
      <div ref={pin} className="relative hidden h-screen overflow-hidden lg:block">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(45%_60%_at_20%_60%,rgba(255,91,36,0.1),transparent_70%)]" />
        <div className="container-x relative flex h-full flex-col justify-center">
          <p className="eyebrow">Process</p>
          <h2 className="display mt-6 max-w-3xl text-[clamp(2.4rem,4.2vw,4.2rem)]">
            From first call to <em className="font-serif font-normal italic tracking-[-0.02em] text-accent-soft">long after</em> launch.
          </h2>

          <div className="mt-14 grid grid-cols-12 items-center gap-10">
            <div className="relative col-span-5 h-[16rem]">
              {steps.map((s, i) => (
                <span
                  key={s.title}
                  className={`absolute inset-0 text-[16rem] font-extrabold leading-none tracking-[-0.06em] text-transparent transition-all duration-700 ${state(i)}`}
                  style={{ WebkitTextStroke: '1.5px rgba(255,255,255,0.22)' }}
                  aria-hidden="true"
                >
                  {pad(i + 1)}
                </span>
              ))}
            </div>
            <div className="relative col-span-6 col-start-7 h-[12rem]">
              {steps.map((s, i) => (
                <div key={s.title} className={`absolute inset-0 transition-all duration-700 ${state(i)}`} aria-hidden={i !== active}>
                  <p className="font-mono text-xs tracking-[0.2em] text-accent">STEP {pad(i + 1)}</p>
                  <h3 className="display mt-3 text-[3.4rem] uppercase">{s.title}</h3>
                  <p className="mt-4 max-w-md text-lg leading-relaxed text-white/60">{s.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* journey track */}
          <div className="relative mt-16">
            <div className="absolute left-0 right-0 top-[7px] h-px bg-white/10">
              <div ref={fill} className="absolute inset-0 origin-left scale-x-0 bg-accent shadow-[0_0_12px_#ff5b24]" />
            </div>
            <ol className="relative grid grid-cols-6">
              {steps.map((s, i) => (
                <li key={s.title} className="flex flex-col gap-4">
                  <span
                    className={`h-[15px] w-[15px] rounded-full border transition-all duration-500 ${
                      i <= active ? 'border-accent bg-accent shadow-[0_0_14px_#ff5b24]' : 'border-white/25 bg-ink'
                    }`}
                  />
                  <span className={`text-sm font-medium uppercase tracking-[0.14em] transition-colors duration-500 ${i === active ? 'text-white' : 'text-white/35'}`}>
                    {pad(i + 1)} {s.title}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      {/* Mobile / tablet journey */}
      <div className="container-x py-24 lg:hidden">
        <p data-reveal className="eyebrow">Process</p>
        <h2 data-reveal className="display mt-5 text-[clamp(2.4rem,9vw,3.6rem)]">
          From first call to <em className="font-serif font-normal italic text-accent-soft">long after</em> launch.
        </h2>
        <ol data-vlist className="relative mt-14 space-y-12 pl-10">
          <span className="absolute bottom-2 left-[7px] top-2 w-px bg-white/10">
            <span ref={vfill} className="absolute inset-0 origin-top scale-y-0 bg-accent" />
          </span>
          {steps.map((s, i) => (
            <li key={s.title} data-reveal className="relative">
              <span className="absolute -left-10 top-1.5 h-[15px] w-[15px] rounded-full border border-accent bg-ink" />
              <p className="font-mono text-xs tracking-[0.2em] text-accent">STEP {pad(i + 1)}</p>
              <h3 className="mt-2 text-3xl font-bold uppercase tracking-tight">{s.title}</h3>
              <p className="mt-3 leading-relaxed text-white/60">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
