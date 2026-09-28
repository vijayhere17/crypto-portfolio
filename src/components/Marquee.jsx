import { services } from '../data/services'

function Band({ items, className, reverse = false }) {
  // Content is rendered twice so the -50% loop is seamless.
  const row = (hidden) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((t) => (
        <span key={t} className="flex items-center">
          <span className="px-6 md:px-9">{t}</span>
          <svg width="18" height="18" viewBox="0 0 18 18" className="shrink-0" aria-hidden="true">
            <path d="M9 0l2.2 6.8L18 9l-6.8 2.2L9 18l-2.2-6.8L0 9l6.8-2.2z" fill="currentColor" />
          </svg>
        </span>
      ))}
    </div>
  )
  return (
    <div className={`flex w-max py-4 text-[clamp(1.4rem,3.2vw,2.6rem)] font-extrabold uppercase tracking-[-0.02em] md:py-5 ${className}`}>
      <div className={`flex ${reverse ? 'animate-marquee-rev' : 'animate-marquee'}`}>
        {row(false)}
        {row(true)}
      </div>
    </div>
  )
}

/** Two crossing bands in the brand's orange + white — a bright break between dark sections. */
export default function Marquee() {
  const names = services.map((s) => s.short)
  return (
    <section className="relative flex h-[240px] items-center overflow-hidden md:h-[280px]" aria-label="Services">
      <div className="absolute left-[-5%] w-[110%] -translate-y-9 -rotate-[4deg] bg-white md:translate-y-0 text-accent shadow-[0_20px_60px_rgba(0,0,0,.5)]">
        <Band items={names} reverse />
      </div>
      <div className="absolute left-[-5%] w-[110%] translate-y-9 rotate-[3deg] md:translate-y-0 bg-gradient-to-r from-accent to-[#ff7a3d] text-white shadow-[0_20px_60px_rgba(0,0,0,.5)]">
        <Band items={['Build', 'Launch', 'Scale', 'On-chain', 'Secure', 'Decentralised']} />
      </div>
    </section>
  )
}
