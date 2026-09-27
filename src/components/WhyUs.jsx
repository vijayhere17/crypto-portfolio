import { useRef } from 'react'
import { strengths } from '../data/content'
import { gsap, revealIn, useGSAP } from '../lib/motion'

const lines = [
  [{ w: 'Ideas' }, { w: 'are' }, { w: 'cheap.' }],
  [{ w: 'Execution' }, { w: 'is' }, { w: 'the' }, { w: 'difference.', accent: true }],
]

export default function WhyUs() {
  const root = useRef(null)

  useGSAP(
    () => {
      revealIn(root.current)
      gsap.fromTo(
        '[data-word]',
        { opacity: 0.1 },
        {
          opacity: 1,
          stagger: 0.12,
          ease: 'none',
          scrollTrigger: { trigger: '[data-statement]', start: 'top 80%', end: 'bottom 45%', scrub: true },
        },
      )
    },
    { scope: root },
  )

  return (
    <section ref={root} className="relative py-28 md:py-44">
      <div className="container-x">
        <p data-reveal className="eyebrow">Why work with us</p>
        <h2 data-statement className="display mt-8 text-[clamp(2.8rem,8.4vw,9rem)] uppercase leading-[0.92]">
          {lines.map((line, li) => (
            <span key={li} className="block">
              {line.map(({ w, accent }) => (
                <span
                  key={w}
                  data-word
                  className={`mr-[0.22em] inline-block ${accent ? 'font-serif font-normal normal-case italic tracking-[-0.02em] text-accent-soft' : ''}`}
                >
                  {w}
                </span>
              ))}
            </span>
          ))}
        </h2>

        <ul className="mt-20 border-t border-line md:mt-28">
          {strengths.map((s, i) => (
            <li
              key={s.title}
              data-reveal
              className="group relative grid gap-2 border-b border-line py-7 md:grid-cols-12 md:items-baseline md:gap-8 md:py-9"
            >
              <span className="absolute inset-x-0 bottom-[-1px] h-px origin-left scale-x-0 bg-accent transition-transform duration-700 group-hover:scale-x-100" />
              <span className="font-mono text-xs text-accent md:col-span-1">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="text-2xl font-semibold tracking-tight transition-transform duration-500 group-hover:translate-x-2 md:col-span-5 md:text-[2rem]">
                {s.title}
              </h3>
              <p className="leading-relaxed text-white/55 md:col-span-6">{s.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
