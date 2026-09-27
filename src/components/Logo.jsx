import { site } from '../data/site'

/** Rocyweb mark: a hexagonal block with a geometric "R" whose leg ends in a network node. */
export function LogoMark({ size = 28, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className}>
      <path d="M16 2.5 27.7 9.25v13.5L16 29.5 4.3 22.75V9.25L16 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path
        d="M12 22.5V9.8h5.2a3.7 3.7 0 0 1 0 7.4H12m4.6 0 3.7 4.1"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="21.2" cy="22.3" r="2.6" fill="#ff5b24" />
    </svg>
  )
}

export default function Logo({ className = '' }) {
  const [a, b] = site.brandParts
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`} aria-label={site.brand}>
      <LogoMark />
      <span className="text-[1.05rem] font-extrabold tracking-[0.12em]" aria-hidden="true">
        {a}
        <span className="text-accent">{b}</span>
      </span>
    </span>
  )
}
