import { useRef } from 'react'
import LazyCanvas from '../three/LazyCanvas'
import BlockCluster from '../three/BlockCluster'
import { site, telegramUrl } from '../data/site'
import { Arrow } from './Navbar'
import { ScrollTrigger, revealIn, useGSAP } from '../lib/motion'

export default function About() {
  const root = useRef(null)
  const progress = useRef(0.5)
  const { about } = site

  useGSAP(
    () => {
      revealIn(root.current)
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => (progress.current = self.progress),
      })
    },
    { scope: root },
  )

  return (
    <section id="about" ref={root} className="relative overflow-hidden py-24 md:py-36">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(40%_50%_at_25%_50%,rgba(255,91,36,0.12),transparent_70%)]" />
      <div className="container-x relative grid items-center gap-8 lg:grid-cols-12 lg:gap-10">
        <div className="relative lg:col-span-6">
          <LazyCanvas className="h-[380px] w-full md:h-[560px]" camera={{ position: [0, 0, 9], fov: 45 }}>
            <BlockCluster progress={progress} />
          </LazyCanvas>
          <p className="pointer-events-none absolute bottom-2 left-0 font-mono text-[0.68rem] uppercase tracking-[0.22em] text-white/35">
            27 blocks · 1 product
          </p>
        </div>

        <div className="lg:col-span-6">
          <p data-reveal className="eyebrow">Who we are</p>
          <h2 data-reveal className="display mt-6 text-[clamp(2.6rem,5.4vw,5.2rem)]">
            {about.heading[0]}
            <br />
            <em className="font-serif font-normal italic tracking-[-0.02em] text-accent-soft">{about.heading[1]}</em>
          </h2>
          <div className="mt-8 space-y-5 text-[1.02rem] leading-relaxed text-white/65">
            {about.body.map((p, i) => (
              <p key={i} data-reveal>
                {p}
              </p>
            ))}
          </div>

          <dl className="mt-12 grid grid-cols-2 border-t border-line sm:grid-cols-4">
            {about.pillars.map((s, i) => (
              <div
                key={s.label}
                data-reveal={i * 0.08}
                className={`flex flex-col border-b border-line py-6 pr-4 sm:border-b-0 ${i > 0 ? 'sm:border-l sm:pl-5' : ''} ${i % 2 ? 'border-l pl-5' : ''}`}
              >
                <dt className="order-2 mt-2 text-xs text-mute">{s.label}</dt>
                <dd className="display text-[2.2rem] tracking-[-0.03em]">{s.value}</dd>
              </div>
            ))}
          </dl>

          <a data-reveal href={telegramUrl} target="_blank" rel="noreferrer" className="btn btn-ghost mt-10">
            Talk to the team
            <span className="btn-dot">
              <Arrow />
            </span>
          </a>
        </div>
      </div>
    </section>
  )
}
